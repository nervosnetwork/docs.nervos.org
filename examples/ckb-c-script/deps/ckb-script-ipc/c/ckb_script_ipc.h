// CSI: Ckb Script Ipc

#ifndef __CKB_SCRIPT_IPC_H__
#define __CKB_SCRIPT_IPC_H__
#include <stdint.h>
#include <stdbool.h>
#include <stddef.h>

/**
 * Error Code.
 * The functions in this library return this error code to indicate success or failure.
 */
typedef enum CSIErrorCode {
    CSI_SUCCESS = 0,
    CSI_ERROR_INTERNAL = 50,
    CSI_ERROR_INVALID_REQUEST,
    CSI_ERROR_VLQ,
    CSI_ERROR_MALLOC,
    CSI_ERROR_MALLOC_TOO_LARGE,
    CSI_ERROR_INVALID_FD,
    CSI_ERROR_READ_VLQ,
    CSI_ERROR_SEND_REQUEST,
    CSI_ERROR_SEND_RESPONSE,
    CSI_ERROR_SEND_VLQ,
    CSI_ERROR_INHERITED_FDS,
    CSI_ERROR_PAYLOAD_TOO_SMALL,
    CSI_ERROR_IOBUF_TOO_SMALL,
    CSI_ERROR_FA_TOO_MANY_BLOCK,
    CSI_ERROR_FA_NOT_ALIGNED,
} CSIErrorCode;

typedef void* (*CSIMalloc)(size_t len);
typedef void (*CSIFree)(void* ptr);
typedef void (*CSIPanic)(int exit_code);

/**
 * Initialize a fixed-size memory allocator.
 * This allocator uses a pre-allocated buffer for all memory operations.
 *
 * @param buf Pointer to the pre-allocated memory buffer
 * @param len Size of the pre-allocated buffer in bytes
 * @param block_count Number of memory blocks that can be allocated simultaneously
 * @note This function is mutually exclusive with csi_init_malloc().
 *       Only one memory allocation strategy can be active at a time.
 */
void csi_init_payload(void* buf, size_t len, size_t block_count);

/**
 * Initialize an I/O buffer to optimize read and write operations.
 * This is an optional optimization that can reduce the number of system calls
 * when performing frequent I/O operations.
 *
 * @param buf Pointer to the pre-allocated memory buffer for I/O operations
 * @param len Size of the pre-allocated buffer in bytes
 * @param block_count Number of memory blocks that can be allocated simultaneously
 * @note The buffer must be at least 1024 bytes in size.
 * @note The buffer must be 2-byte aligned
 */
void csi_init_iobuf(void* buf, size_t len, size_t block_count);

/**
 * Initialize a custom memory allocator.
 * This allows using external memory management functions.
 *
 * @param malloc Function pointer to custom memory allocation function
 * @param free Function pointer to custom memory deallocation function
 *
 * @note This function is mutually exclusive with csi_init_payload() and csi_init_iobuf().
 *       Only one memory allocation strategy can be active at a time.
 */
void csi_init_malloc(CSIMalloc malloc, CSIFree free);

/**
 * Initialize a custom panic handler function.
 * This allows the user to define custom behavior when a panic occurs.
 *
 * @param panic Function pointer to the custom panic handler
 *
 * @note The exit code passed to the panic handler indicates the reason
 *       for the panic.
 */
void csi_init_panic(CSIPanic panic);

void csi_default_panic(int exit_code);

/**
 * Read data interface
 * @param ctx: Implementation-specific context (similar to 'this' in C++)
 * @param buf: Destination buffer to store read data
 * @param len: length of `buf`
 * @param read_len: Number of bytes actually read (output parameter)
 * @return 0 for success, non-zero for failure
 */
typedef int (*CSIRead)(void* ctx, void* buf, size_t len, size_t* read_len);

typedef struct CSIReader {
    void* ctx;
    CSIRead read;
} CSIReader;

/**
 * Write data interface
 * @param ctx: Implementation-specific context (similar to 'this' in C++)
 * @param buf: Source buffer containing data to write
 * @param len: length of `buf`
 * @param write_len: Number of bytes actually written (output parameter)
 * @return 0 for success, non-zero for failure
 */
typedef int (*CSIWrite)(void* ctx, const void* buf, size_t len, size_t* written_len);
typedef int (*CSIFlush)(void* ctx);

typedef struct CSIWriter {
    void* ctx;
    CSIWrite write;
    CSIFlush flush;
} CSIWriter;

typedef struct CSIRequestPacket {
    uint64_t version;
    uint64_t method_id;
    uint64_t payload_len;
    void* payload;
} CSIRequestPacket;

typedef struct CSIResponsePacket {
    uint64_t version;
    uint64_t error_code;
    uint64_t payload_len;
    void* payload;
} CSIResponsePacket;

typedef struct CSIChannel {
    CSIReader reader;
    CSIWriter writer;
} CSIChannel;

/**
 * Sends a request and waits for a response on the given channel.
 *
 * @param channel: The channel to send/receive on
 * @param request: The request packet to send
 * @param response: Pointer to store the received response packet
 * @return 0 for success, non-zero for failure
 *
 * Note: The caller is responsible for:
 * - Freeing the response's payload using csi_free_response() when it's no longer needed
 * - Allocating and freeing memory for the request payload
 * - Ensuring the channel, request, and response pointers are valid
 * - Checking the response's error_code for operation success/failure
 */
int csi_call(CSIChannel* channel, const CSIRequestPacket* request, CSIResponsePacket* response);

/**
 * Frees the payload memory allocated for a CSIResponsePacket, on client side only.
 *
 * This function must be called after using csi_call() to prevent memory leaks.
 * The payload is allocated by csi_call() during response reception and must be
 * freed by the caller when no longer needed.
 *
 * @param response: Pointer to the response packet whose payload will be freed.
 *
 */
void csi_client_free_response_payload(CSIResponsePacket* response);

/**
 * This is a low level version of csi_spawn_cell_server. It can control on more details of the spawned process.
 */
int csi_spawn_server(uint64_t index, uint64_t source, size_t offset, size_t length, const char* argv[], int argc,
                     CSIChannel* client_channel);
int csi_spawn_cell_server(void* code_hash, uint64_t hash_type, const char* argv[], int argc,
                          CSIChannel* client_channel);

/**
 * Frees the resources associated with a CSIChannel.
 *
 * This function releases the internal buffers and resources used by the channel.
 *
 * @param ch: Pointer to the channel to be freed. Must not be NULL.
 *
 * @note This function is optional and typically not needed since channels
 *       are usually maintained for the lifetime of the application.
 *       However, it can be useful in scenarios where channels are created
 *       and destroyed dynamically.
 */
void csi_free_channel(CSIChannel* ch);

/**
 * Callback function type for handling IPC requests in the server.
 *
 * @param request: The incoming request packet containing the client's request data
 * @param response: The response packet to be filled with the server's response. The callback function is responsible
 * for:
 *                 - Allocating memory for the response payload if needed
 *                 - Populating the response data
 *                 - Freeing any allocated memory for next loop.
 *                 The response packet structure is managed by the server and persists throughout the request handling
 * cycle. It remains valid until the next request processing iteration begins.
 * @return 0 for success, non-zero for failure
 *
 * This callback is called by csi_run_server for each incoming request.
 * The implementation should process the request and populate the response packet.
 */
typedef int (*CSIServe)(const CSIRequestPacket* request, CSIResponsePacket* response);

/**
 * Allocates memory for the response payload in a CSIResponsePacket, on server side only.
 *
 * This function must be called within the `CSIServe` callback function to allocate
 * memory for the response payload before populating it with data.
 *
 * If payload_len is 0, the payload will be set to NULL after allocation.
 *
 * @param response: Pointer to the response packet whose payload will be allocated, according to the payload_len.
 *
 * @note The allocated payload is freed automatically by the server.
 */
void csi_server_malloc_response_payload(CSIResponsePacket* response);

/**
 * Runs the IPC server loop, processing incoming requests using the provided callback.
 *
 * @param serve: The callback function that will handle each incoming request
 * @return 0 for success, non-zero for failure
 *
 * This function enters an infinite loop that:
 * 1. Receives requests from clients
 * 2. Calls the provided serve callback to process each request
 * 3. Sends responses back to clients
 *
 * The server will continue running until an error occurs or the process is terminated.
 */
int csi_run_server(CSIServe serve);

#endif
