#define CKB_C_STDLIB_PRINTF
#include "blockchain.h"
#include "ckb_syscalls.h"
#include "ckb_consts.h"
#include "ckb_script_ipc.h"

#include "my_str.h"

#define SCRIPT_SIZE 32768
#define TEMP_SIZE 32768
#define MAX_WITNESS_SIZE 32768

static uint8_t g_payload_buf[4096];
static uint8_t g_io_buf[1024];

int get_code_hash(uint8_t* code_hash) {
    int ret;
    uint64_t len = 0;

    unsigned char script[SCRIPT_SIZE];
    len = SCRIPT_SIZE;
    ret = ckb_load_script(script, &len, 0);
    if (ret != CKB_SUCCESS) {
        return CKB_INVALID_DATA;
    }
    if (len > SCRIPT_SIZE) {
        return CKB_INVALID_DATA;
    }
    mol_seg_t script_seg;
    script_seg.ptr = (uint8_t*)script;
    script_seg.size = len;

    if (MolReader_Script_verify(&script_seg, false) != MOL_OK) {
        return CKB_INVALID_DATA;
    }

    mol_seg_t args_seg = MolReader_Script_get_args(&script_seg);
    mol_seg_t args_bytes_seg = MolReader_Bytes_raw_bytes(&args_seg);
    if (args_bytes_seg.size != 32) {
        return CKB_INVALID_DATA;
    }

    memcpy(code_hash, args_bytes_seg.ptr, 32);
    return 0;
}

int get_witness(uint8_t* witness) {
    int ret;

    uint8_t temp[TEMP_SIZE];
    uint64_t witness_len = MAX_WITNESS_SIZE;
    ret = ckb_load_witness(temp, &witness_len, 0, 0, CKB_SOURCE_GROUP_INPUT);
    if (ret != CKB_SUCCESS) {
        printf("load witness failed, err: %d", ret);
        return ret;
    }

    if (witness_len < 20) {
        printf("witness len (%d) < 20", witness_len);
        return CKB_INVALID_DATA;
    }

    uint32_t lock_length = *((uint32_t*)(&temp[16]));
    if (lock_length != 32) {
        printf("lock witness len (%d) is not 32", lock_length);
        return CKB_INVALID_DATA;
    }

    memcpy(witness, &(temp[20]), 32);
    return CKB_SUCCESS;
}

int run_ipc_func(CSIChannel* client_channel, char* payload,
                 uint64_t payload_len, CSIResponsePacket* response) {
    CSIRequestPacket request = {0};
    request.version = 0;
    request.method_id = 0;

    request.payload_len = payload_len;
    request.payload = payload;

    int err = csi_call(client_channel, &request, response);
    if (err) {
        printf("csi_call failed, err: %d", err);
        return err;
    }

    if (response->error_code) {
        printf("csi_call response->error_code: %d", response->error_code);
        return err;
    }

    return 0;
}

int extract_ctx_from_json(const char* json_str, uint64_t* ctx) {
    const char* key = "\"HasherNew\"";
    const char* pos = my_strstr(json_str, key);
    if (!pos) {
        return -1;
    }

    pos = my_strchr(pos, ':');
    if (!pos) {
        return -2;
    }
    pos++;
    while (*pos && my_isspace((unsigned char)*pos)) {
        pos++;
    }

    uint64_t value = 0;
    if (!my_isdigit((unsigned char)*pos)) {
        return -3;  // not a digit
    }

    while (my_isdigit((unsigned char)*pos)) {
        value = value * 10 + (*pos - '0');
        pos++;
    }

    *ctx = value;

    return 0;
}

int hasher_new(CSIChannel* channel, uint64_t* ctx) {
    int err = 0;
    CSIResponsePacket response;
    char* payload = "{ \"HasherNew\": { \"hash_type\": \"CkbBlake2b\" } }";
    uint64_t payload_len = strlen(payload);
    err = run_ipc_func(channel, payload, payload_len, &response);
    if (err) {
        return err;
    }

    err = extract_ctx_from_json(response.payload, ctx);
    if (err) {
        printf("Parse json failed");
        return err;
    }

    csi_client_free_response_payload(&response);
    return 0;
}

int hasher_update(CSIChannel* channel, uint64_t ctx, uint8_t* buf,
                  uint64_t buf_len) {
    int err = 0;
    CSIResponsePacket response;
    char payload[1024];

    int offset = 0;
    offset += sprintf_(payload + offset,
                       "{ \"HasherUpdate\": { \"ctx\": %d, \"data\": [", ctx);
    for (uint64_t i = 0; i < buf_len; i++) {
        if (i == buf_len - 1)
            offset += sprintf_(payload + offset, "%u", buf[i]);
        else
            offset += sprintf_(payload + offset, "%u,", buf[i]);
    }
    offset += sprintf_(payload + offset, "] }}");
    uint64_t payload_len = offset;

    err = run_ipc_func(channel, payload, payload_len, &response);
    if (err) {
        return err;
    }

    csi_client_free_response_payload(&response);
    return 0;
}

int extract_hash_from_json(const char* json_str, uint8_t* hash) {
    const char* p = json_str;
    while (*p) {
        if (p[0] == '"' && p[1] == 'O' && p[2] == 'k' && p[3] == '"' &&
            p[4] == ':' && p[5] == '[') {
            p += 6;
            break;
        }
        p++;
    }

    if (!*p) return -1;

    for (int i = 0; i < 32; i++) {
        while (*p == ' ' || *p == '\n' || *p == '\t') p++;
        int val = read_uint(&p);
        if (val < 0 || val > 255) return -2;

        hash[i] = (uint8_t)val;
        while (*p == ' ' || *p == ',') p++;
    }

    return 0;
}

int hasher_finalize(CSIChannel* channel, uint64_t ctx, uint8_t* hash) {
    int err = 0;
    CSIResponsePacket response;
    char payload[1024];
    uint64_t payload_len =
        sprintf_(payload, "{ \"HasherFinalize\": { \"ctx\": %d } }", ctx);

    err = run_ipc_func(channel, payload, payload_len, &response);
    if (err) {
        return err;
    }

    err = extract_hash_from_json(response.payload, hash);
    if (err) {
        printf("parse finalize result failed");
        return err;
    }
    csi_client_free_response_payload(&response);
    return 0;
}

int main() {
    int err = 0;

    csi_init_payload(g_payload_buf, sizeof(g_payload_buf), 2);
    csi_init_iobuf(g_io_buf, sizeof(g_io_buf), 2);

    // load ckb-crypto-service code hash with args
    uint8_t code_hash[32] = {0};
    err = get_code_hash(code_hash);
    if (err) {
        printf("load code hash on args failed : %d\n", err);
        return err;
    }

    uint8_t hash_1[32] = {0};
    err = get_witness(hash_1);
    if (err) {
        printf("load witness failed : %d\n", err);
        return err;
    }

    CSIChannel channel = {0};
    err = csi_spawn_cell_server(code_hash, 1, NULL, 0, &channel);
    if (err) {
        printf("failed to spawn server: %d\n", err);
        return err;
    }

    uint64_t ctx = 0;
    err = hasher_new(&channel, &ctx);
    if (err) {
        printf("new hasher failed, err: %d", err);
        return err;
    }

    uint8_t data[] = {
        0xFF, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    };
    err = hasher_update(&channel, ctx, data, sizeof(data));
    if (err) {
        printf("update hasher failed, err: %d", err);
        return err;
    }

    uint8_t hash_2[32] = {0};
    err = hasher_finalize(&channel, ctx, hash_2);
    if (err) {
        printf("finalize hasher failed, err: %d", err);
        return err;
    }

    for (size_t i = 0; i < 32; i++) {
        if (hash_1[i] != hash_2[i]) {
            printf("chech hasher failed");
            return 1;
        }
    }

    return 0;
}