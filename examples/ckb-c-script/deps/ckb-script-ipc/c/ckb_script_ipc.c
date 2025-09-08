#include <stdio.h>
#include <string.h>
#include "ckb_syscall_apis.h"
#include "ckb_consts.h"
#include "ckb_script_ipc.h"

#define MAX_VLQ_LEN 10

#define CHECK2(cond, code)                                                                                     \
    do {                                                                                                       \
        if (!(cond)) {                                                                                         \
            err = code;                                                                                        \
            if (err != 1 && err != 2) printf("checking failed on %s:%d, code = %d", __FILE__, __LINE__, code); \
            goto exit;                                                                                         \
        }                                                                                                      \
    } while (0)

#define CHECK(_code)                                                                                           \
    do {                                                                                                       \
        int code = (_code);                                                                                    \
        if (code != 0) {                                                                                       \
            err = code;                                                                                        \
            if (err != 1 && err != 2) printf("checking failed on %s:%d, code = %d", __FILE__, __LINE__, code); \
            goto exit;                                                                                         \
        }                                                                                                      \
    } while (0)

#define PANIC(e) g_csi_context.panic(e)
int csi_vlq_encode(void* buf, size_t len, uint64_t value, size_t* out_len);
int csi_vlq_decode(const void* buf, size_t len, uint64_t* value, size_t* out_len);
int csi_read_vlq(CSIReader* reader, uint64_t* value);
int csi_write_vlq(CSIWriter* writer, uint64_t value);

typedef struct CSIContext {
    void* malloc_ctx;
    CSIMalloc payload_malloc;
    CSIFree payload_free;
    CSIMalloc iobuf_malloc;
    CSIFree iobuf_free;
    CSIPanic panic;
} CSIContext;

static CSIContext g_csi_context = {.panic = csi_default_panic};

typedef struct FixedAllocator {
    // support up to 64 blocks
    uint64_t used_flags;
    size_t block_count;
    size_t len;
    void* buf;
} FixedAllocator;

static FixedAllocator g_payload_allocator = {0};
static FixedAllocator g_iobuf_allocator = {0};

static void fixed_allocator_init(FixedAllocator* allocator, void* buf, size_t len, size_t block_count) {
    if (block_count > sizeof(allocator->used_flags) * 8) {
        PANIC(CSI_ERROR_FA_TOO_MANY_BLOCK);
    }
    if (len % block_count != 0) {
        PANIC(CSI_ERROR_FA_NOT_ALIGNED);
    }
    allocator->used_flags = 0;
    allocator->block_count = block_count;
    allocator->len = len;
    allocator->buf = buf;
}

static void* fixed_allocator_malloc(FixedAllocator* allocator, size_t size) {
    // find first zero bit(LSB)
    uint64_t revert_flags = ~allocator->used_flags;
    if (revert_flags == 0) {
        return NULL;
    }
    size_t index = __builtin_ctzll(revert_flags);

    if (index >= allocator->block_count) {
        return NULL;
    }
    allocator->used_flags |= (1 << index);
    size_t block_size = allocator->len / allocator->block_count;
    if (size > block_size) {
        return NULL;
    }
    return allocator->buf + block_size * index;
}

static void fixed_allocator_free(FixedAllocator* allocator, void* ptr) {
    if (ptr == NULL) {
        return;
    }
    if (ptr < allocator->buf || ptr >= (allocator->buf + allocator->len)) {
        PANIC(CSI_ERROR_INTERNAL);
    }
    size_t block_size = allocator->len / allocator->block_count;
    size_t offset = ptr - allocator->buf;
    if ((offset % block_size) != 0) {
        PANIC(CSI_ERROR_INTERNAL);
    }
    size_t index = offset / block_size;
    allocator->used_flags &= ~(1 << index);
}

static void* payload_malloc(size_t len) { return fixed_allocator_malloc(&g_payload_allocator, len); }

static void payload_free(void* ptr) { return fixed_allocator_free(&g_payload_allocator, ptr); }

void csi_init_payload(void* buf, size_t len, size_t block_count) {
    if (len < 1024) {
        PANIC(CSI_ERROR_PAYLOAD_TOO_SMALL);
    }
    fixed_allocator_init(&g_payload_allocator, buf, len, block_count);

    g_csi_context.payload_malloc = payload_malloc;
    g_csi_context.payload_free = payload_free;
}

void csi_init_malloc(CSIMalloc malloc, CSIFree free) {
    g_csi_context.payload_malloc = malloc;
    g_csi_context.payload_free = free;
    g_csi_context.iobuf_malloc = malloc;
    g_csi_context.iobuf_free = free;
}

void csi_init_panic(CSIPanic panic) { g_csi_context.panic = panic; }

void csi_default_panic(int exit_code) {
    printf("panic in IPC, error code: %d", exit_code);
    ckb_exit(exit_code);
}

static void* iobuf_malloc(size_t len) { return fixed_allocator_malloc(&g_iobuf_allocator, len); }

static void iobuf_free(void* ptr) { return fixed_allocator_free(&g_iobuf_allocator, ptr); }

void csi_init_iobuf(void* buf, size_t len, size_t block_count) {
    if (len < 1024) {
        PANIC(CSI_ERROR_IOBUF_TOO_SMALL);
    }
    fixed_allocator_init(&g_iobuf_allocator, buf, len, block_count);
    g_csi_context.iobuf_malloc = iobuf_malloc;
    g_csi_context.iobuf_free = iobuf_free;
}

static int csi_read_pipe(void* ctx, void* buf, size_t len, size_t* read_len) {
    *read_len = len;
    return ckb_read((uint64_t)ctx, buf, read_len);
}

static int csi_write_pipe(void* ctx, const void* buf, size_t len, size_t* written_len) {
    if (len == 0) {
        *written_len = 0;
        return 0;
    }
    *written_len = len;
    return ckb_write((uint64_t)ctx, buf, written_len);
}

static int csi_flush_pipe(void* ctx) { return 0; }

static int new_pipe_reader(uint64_t fd, CSIReader* reader) {
    if (fd % 2 != 0) {
        return CSI_ERROR_INVALID_FD;
    }
    reader->ctx = (void*)fd;
    reader->read = csi_read_pipe;
    return 0;
}

static int new_pipe_writer(uint64_t fd, CSIWriter* writer) {
    if (fd % 2 != 1) {
        return CSI_ERROR_INVALID_FD;
    }
    writer->ctx = (void*)fd;
    writer->write = csi_write_pipe;
    writer->flush = csi_flush_pipe;
    return 0;
}

// This is a variable length structure.
typedef struct CSIBuffer {
    // underlying reader/writer without buffer
    union {
        CSIReader reader;
        CSIWriter writer;
    } rw;
    // The current seek offset into `buf`, must always be <= `filled_len`.
    size_t pos;
    // The number of bytes currently stored in `buf`.
    size_t filled_len;
    // The maximum number of bytes that can be stored in `buf`.
    size_t max_len;
    // The buffer data.
    uint8_t buf[];
} CSIBuffer;

static void new_buffer(CSIBuffer** buf) {
    size_t buf_len = g_iobuf_allocator.len / g_iobuf_allocator.block_count;
    void* ptr = g_csi_context.iobuf_malloc(buf_len);
    if (ptr == NULL) {
        PANIC(CSI_ERROR_MALLOC);
    } else {
        *buf = (CSIBuffer*)ptr;
        (*buf)->pos = 0;
        (*buf)->filled_len = 0;
        (*buf)->max_len = buf_len - sizeof(CSIBuffer);
    }
}

static int buf_read(void* ctx, void* buf, size_t len, size_t* read_len) {
    int err = 0;
    CSIBuffer* buffer = (CSIBuffer*)ctx;
    // fill buffer
    if (buffer->pos == buffer->filled_len) {
        CSIReader reader = buffer->rw.reader;
        err = reader.read(reader.ctx, buffer->buf, buffer->max_len, &buffer->filled_len);
        CHECK(err);
        buffer->pos = 0;
    }
    if (buffer->pos >= buffer->filled_len || buffer->filled_len > buffer->max_len) {
        PANIC(CSI_ERROR_INTERNAL);
    }
    size_t reaming_len = buffer->filled_len - buffer->pos;
    *read_len = len > reaming_len ? reaming_len : len;
    memcpy(buf, buffer->buf + buffer->pos, *read_len);
    buffer->pos += *read_len;

exit:
    return err;
}

static int buf_flush(void* ctx) {
    int err = 0;
    CSIBuffer* buffer = (CSIBuffer*)ctx;
    size_t written_len = 0;
    const CSIWriter writer = buffer->rw.writer;
    err = writer.write(writer.ctx, buffer->buf, buffer->filled_len, &written_len);
    CHECK(err);
    CHECK2(written_len == buffer->filled_len, CSI_ERROR_INTERNAL);
    buffer->pos = 0;
    buffer->filled_len = 0;

exit:
    return err;
}

static int buf_write(void* ctx, const void* buf, size_t len, size_t* written_len) {
    int err = 0;
    CSIBuffer* buffer = (CSIBuffer*)ctx;
    if (buffer->filled_len + len > buffer->max_len) {
        err = buf_flush(ctx);
        CHECK(err);
    }
    // if the written buffer is too large, directly write it.
    if (len > buffer->max_len) {
        CSIWriter writer = buffer->rw.writer;
        err = writer.write(writer.ctx, buf, len, written_len);
        CHECK(err);
        *written_len = len;
        return 0;
    } else {
        memcpy(&buffer->buf[buffer->filled_len], buf, len);
        buffer->filled_len += len;
        *written_len = len;
    }
exit:
    return err;
}

static void new_buf_reader(CSIReader reader, CSIReader* buf_reader) {
    CSIBuffer* buf = NULL;
    new_buffer(&buf);
    buf->rw.reader = reader;

    buf_reader->ctx = buf;
    buf_reader->read = buf_read;
}

static void new_buf_writer(const CSIWriter writer, CSIWriter* buf_writer) {
    CSIBuffer* buf = NULL;
    new_buffer(&buf);
    buf->rw.writer = writer;

    buf_writer->ctx = buf;
    buf_writer->write = buf_write;
    buf_writer->flush = buf_flush;
}

int csi_read_exact(CSIReader* reader, void* buf, size_t len) {
    int remaining_len = len;
    while (remaining_len > 0) {
        size_t read_len = 0;
        int err = reader->read(reader->ctx, buf, remaining_len, &read_len);
        if (err) {
            return err;
        }
        remaining_len -= read_len;
        buf += read_len;
    }
    return 0;
}

int csi_send_request(CSIChannel* channel, const CSIRequestPacket* request) {
    int err = 0;

    err = csi_write_vlq(&channel->writer, request->version);
    CHECK(err);

    err = csi_write_vlq(&channel->writer, request->method_id);
    CHECK(err);
    err = csi_write_vlq(&channel->writer, request->payload_len);
    CHECK(err);

    if (request->payload_len > 0) {
        size_t written_len = 0;
        err = channel->writer.write(channel->writer.ctx, request->payload, request->payload_len, &written_len);
        CHECK(err);
        CHECK2(written_len == request->payload_len, CSI_ERROR_SEND_REQUEST);
    }
    err = channel->writer.flush(channel->writer.ctx);
    CHECK(err);
exit:
    return err;
}

int csi_send_response(CSIChannel* channel, const CSIResponsePacket* response) {
    int err = 0;
    err = csi_write_vlq(&channel->writer, response->version);
    CHECK(err);
    err = csi_write_vlq(&channel->writer, response->error_code);
    CHECK(err);
    err = csi_write_vlq(&channel->writer, response->payload_len);
    CHECK(err);

    if (response->payload_len > 0) {
        size_t written_len = 0;
        err = channel->writer.write(channel->writer.ctx, response->payload, response->payload_len, &written_len);
        CHECK(err);
        CHECK2(written_len == response->payload_len, CSI_ERROR_SEND_RESPONSE);
    }
    err = channel->writer.flush(channel->writer.ctx);
    CHECK(err);

exit:
    return err;
}

int csi_receive_request(CSIChannel* channel, CSIRequestPacket* request) {
    int err = 0;
    err = csi_read_vlq(&channel->reader, &request->version);
    CHECK(err);
    err = csi_read_vlq(&channel->reader, &request->method_id);
    CHECK(err);
    err = csi_read_vlq(&channel->reader, &request->payload_len);
    CHECK(err);

    if (request->payload_len > 0) {
        request->payload = g_csi_context.payload_malloc(request->payload_len);
        if (request->payload == NULL) {
            PANIC(CSI_ERROR_MALLOC);
        }
        err = csi_read_exact(&channel->reader, request->payload, request->payload_len);
        CHECK(err);
    }
exit:
    return err;
}

int csi_receive_response(CSIChannel* channel, CSIResponsePacket* response) {
    int err = 0;
    err = csi_read_vlq(&channel->reader, &response->version);
    CHECK(err);
    err = csi_read_vlq(&channel->reader, &response->error_code);
    CHECK(err);
    err = csi_read_vlq(&channel->reader, &response->payload_len);
    CHECK(err);

    if (response->payload_len > 0) {
        response->payload = g_csi_context.payload_malloc(response->payload_len);
        if (response->payload == NULL) {
            PANIC(CSI_ERROR_MALLOC);
        }
        err = csi_read_exact(&channel->reader, response->payload, response->payload_len);
        CHECK(err);
    }
exit:
    return err;
}

int csi_write_vlq(CSIWriter* writer, uint64_t value) {
    int err = 0;
    uint8_t buf[MAX_VLQ_LEN];
    size_t len = MAX_VLQ_LEN;
    size_t written_len = 0;
    err = csi_vlq_encode(buf, len, value, &len);
    CHECK(err);
    err = writer->write(writer->ctx, buf, len, &written_len);
    CHECK(err);
    CHECK2(written_len == len, CSI_ERROR_SEND_VLQ);
exit:
    return err;
}

int csi_read_vlq(CSIReader* reader, uint64_t* value) {
    int err = 0;
    uint8_t peek = 0;
    uint8_t buf[MAX_VLQ_LEN];
    size_t buf_len = 0;

    while (1) {
        size_t read_len = 0;
        int err = reader->read(reader->ctx, &peek, 1, &read_len);
        CHECK(err);
        if (buf_len >= sizeof(buf)) {
            return CSI_ERROR_READ_VLQ;
        }
        buf[buf_len++] = peek;

        if ((peek & 0x80) == 0) {
            break;
        }
    }
    size_t read_len = 0;
    err = csi_vlq_decode(buf, buf_len, value, &read_len);
    CHECK(err);
    if (read_len != buf_len) {
        return CSI_ERROR_READ_VLQ;
    }
exit:
    return err;
}

int csi_vlq_encode(void* buf, size_t len, uint64_t value, size_t* out_len) {
    uint8_t* buffer = buf;
    size_t written = 0;

    do {
        if (written >= len) {
            return CSI_ERROR_VLQ;
        }

        uint8_t byte = value & 0x7F;
        value >>= 7;

        if (value != 0) {
            byte |= 0x80;
        }

        buffer[written++] = byte;
    } while (value != 0);

    *out_len = written;
    return 0;
}

int csi_vlq_decode(const void* buf, size_t len, uint64_t* value, size_t* out_len) {
    const uint8_t* bytes = (const uint8_t*)buf;
    uint64_t result = 0;
    size_t shift = 0;
    size_t read = 0;

    while (read < len) {
        uint8_t byte = bytes[read++];
        result |= ((uint64_t)(byte & 0x7F) << shift);

        if ((byte & 0x80) == 0) {
            *value = result;
            *out_len = read;
            return 0;
        }

        shift += 7;
        if (shift >= 64) {
            return CSI_ERROR_VLQ;
        }
    }

    return CSI_ERROR_VLQ;
}

int csi_call(CSIChannel* channel, const CSIRequestPacket* request, CSIResponsePacket* response) {
    int err = 0;
    err = csi_send_request(channel, request);
    CHECK(err);
    err = csi_receive_response(channel, response);
    CHECK(err);
    err = response->error_code;
exit:
    return err;
}

void csi_client_free_response_payload(CSIResponsePacket* response) {
    if (response->payload == NULL) {
        return;
    }
    g_csi_context.payload_free(response->payload);
}

void csi_server_malloc_response_payload(CSIResponsePacket* response) {
    if (response->payload_len == 0) {
        response->payload = NULL;
        return;
    }
    response->payload = g_csi_context.payload_malloc(response->payload_len);
    if (response->payload == NULL) {
        PANIC(CSI_ERROR_MALLOC);
    }
}

int csi_spawn_server(uint64_t index, uint64_t source, size_t offset, size_t length, const char* argv[], int argc,
                     CSIChannel* client_channel) {
    int err = 0;
    uint64_t fds[2];
    uint64_t fds2[2];
    err = ckb_pipe(fds);
    CHECK(err);
    err = ckb_pipe(fds2);
    CHECK(err);

    uint64_t pid = 0;
    uint64_t inherited_fds[3] = {fds2[0], fds[1], 0};
    spawn_args_t spawn_args = {
        .argc = argc,
        .argv = argv,
        .inherited_fds = inherited_fds,
        .process_id = &pid,
    };
    size_t bounds = ((size_t)offset << 32) | length;
    err = ckb_spawn(index, source, 0, bounds, &spawn_args);
    CHECK(err);

    // init client side channel
    CSIReader reader = {0};
    err = new_pipe_reader(fds[0], &reader);
    CHECK(err);
    new_buf_reader(reader, &client_channel->reader);

    CSIWriter writer = {0};
    err = new_pipe_writer(fds2[1], &writer);
    CHECK(err);
    new_buf_writer(writer, &client_channel->writer);

exit:
    return err;
}

int csi_spawn_cell_server(void* code_hash, uint64_t hash_type, const char* argv[], int argc,
                          CSIChannel* client_channel) {
    int err = 0;
    size_t index = SIZE_MAX;
    err = ckb_look_for_dep_with_hash2(code_hash, hash_type, &index);
    CHECK(err);
    err = csi_spawn_server(index, CKB_SOURCE_CELL_DEP, 0, 0, argv, argc, client_channel);
    CHECK(err);

exit:
    return err;
}

int csi_run_server(CSIServe serve) {
    int err = 0;
    uint64_t inherited_fds[2];
    size_t len = 2;
    err = ckb_inherited_fds(inherited_fds, &len);
    CHECK(err);
    CHECK2(len == 2, CSI_ERROR_INHERITED_FDS);

    CSIChannel server_channel = {0};
    CSIReader reader = {0};
    err = new_pipe_reader(inherited_fds[0], &reader);
    CHECK(err);
    new_buf_reader(reader, &server_channel.reader);

    CSIWriter writer = {0};
    err = new_pipe_writer(inherited_fds[1], &writer);
    CHECK(err);
    new_buf_writer(writer, &server_channel.writer);

    while (true) {
        CSIRequestPacket request = {0};
        CSIResponsePacket response = {0};
        err = csi_receive_request(&server_channel, &request);
        CHECK(err);
        err = serve(&request, &response);
        CHECK(err);
        g_csi_context.payload_free(request.payload);
        err = csi_send_response(&server_channel, &response);
        CHECK(err);
        csi_client_free_response_payload(&response);
    }
exit:
    return err;
}

void csi_free_channel(CSIChannel* ch) {
    iobuf_free(ch->reader.ctx);
    iobuf_free(ch->writer.ctx);
}
