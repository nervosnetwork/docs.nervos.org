SCRIPT_DIR=$(dirname "$(realpath "$0")")
cd "$SCRIPT_DIR/../examples/simple-lock/"

cd rust-simple-lock

make fmt clippy build test
if [ $? -ne 0 ]; then
    exit 1
fi

cd ../ts-simple-lock

pnpm install
if [ $? -ne 0 ]; then
    exit 1
fi

pnpm build
if [ $? -ne 0 ]; then
    exit 1
fi

pnpm test
if [ $? -ne 0 ]; then
    exit 1
fi

cd ../frontend
npm install  
if [ $? -ne 0 ]; then
    exit 1
fi

