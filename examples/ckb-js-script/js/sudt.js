
const CKB_INDEX_OUT_OF_BOUND = 1;
const ERROR_AMOUNT = -52;

function assert(cond, obj1) {
    if (!cond) {
        throw Error(obj1);
    }
}

function compare_array(a, b) {
    if (a.byteLength != b.byteLength) {
        return false;
    }
    for (let i = 0; i < a.byteLength; i++) {
        if (a[i] != b[i]) {
            return false;
        }
    }
    return true;
}

function unpack_script(buf) {
    let script = new Uint32Array(buf);
    let raw_data = new Uint8Array(buf);

    let full_size = script[0];
    assert(full_size == buf.byteLength, 'full_size == buf.byteLength');
    let code_hash_offset = script[1];
    let code_hash = buf.slice(code_hash_offset, code_hash_offset + 32);
    let hash_type_offset = script[2];
    let hash_type = raw_data[hash_type_offset];
    let args_offset = script[3];
    let args = buf.slice(args_offset + 4);
    return {'code_hash': code_hash, 'hash_type': hash_type, 'args': args};
}

function* iterate_field(source, field) {
    let index = 0;
    while (true) {
        try {
            let ret = ckb.load_cell_by_field(index, source, field);
            yield ret;
            index++;
        } catch (e) {
            if (e.error_code == CKB_INDEX_OUT_OF_BOUND) {
                break;
            } else {
                throw e;
            }
        }
    }
}

function* iterate_cell_data(source) {
    let index = 0;
    while (true) {
        try {
            let ret = ckb.load_cell_data(index, source);
            yield ret;
            index++;
        } catch (e) {
            if (e.error_code == CKB_INDEX_OUT_OF_BOUND) {
                break;
            } else {
                throw e;
            }
        }
    }
}

function main() {
    console.log('simple UDT ...');
    let buf = ckb.load_script();
    let script = unpack_script(buf);
    let owner_mode = false;
    // ckb-js-vm has leading 35 bytes args
    let real_args = script.args.slice(35);
    for (let lock_hash of iterate_field(ckb.SOURCE_INPUT, ckb.CKB_CELL_FIELD_LOCK_HASH)) {
        if (compare_array(lock_hash, real_args)) {
            owner_mode = true;
        }
    }
    if (owner_mode) {
        return 0;
    }
    let input_amount = 0n;

    for (let data of iterate_cell_data(ckb.SOURCE_GROUP_INPUT)) {
        if (data.byteLength != 16) {
            throw `Invalid data length: ${data.byteLength}`;
        }
        let n = new BigUint64Array(data);
        let current_amount = n[0] | (n[1] << 64n);
        input_amount += current_amount;
    }
    let output_amount = 0n;
    for (let data of iterate_cell_data(ckb.SOURCE_GROUP_OUTPUT)) {
        if (data.byteLength != 16) {
            throw `Invalid data length: ${data.byteLength}`;
        }
        let n = new BigUint64Array(data);
        let current_amount = n[0] | (n[1] << 64n);
        output_amount += current_amount;
    }
    console.log(`verifying amount: ${input_amount} and ${output_amount}`);
    if (input_amount < output_amount) {
        return ERROR_AMOUNT;
    }
    console.log('Simple UDT quit successfully');
    return 0;
}

let exit_code = main();
if (exit_code != 0) {
    ckb.exit(exit_code);
}
