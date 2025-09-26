#!/bin/bash
SCRIPT_DIR=$(dirname "$(realpath "$0")")

# Get all dApp directories except simple-lock
DAPP_DIRS=$(find "$SCRIPT_DIR/../examples/dApp" -maxdepth 1 -type d -name "*" ! -name "simple-lock" ! -path "*/dApp" | sort)

for dapp_dir in $DAPP_DIRS; do
    dapp_name=$(basename "$dapp_dir")
    echo "Processing dApp: $dapp_name"
    
    cd "$dapp_dir"
    
    # Check if package.json exists
    if [ ! -f "package.json" ]; then
        echo "Warning: No package.json found in $dapp_name, skipping..."
        continue
    fi
    
    echo "Installing dependencies for $dapp_name..."
    npm install
    if [ $? -ne 0 ]; then
        echo "Error: npm install failed for $dapp_name"
        exit 1
    fi
    
    echo "Building $dapp_name..."
    npm run build
    if [ $? -ne 0 ]; then
        echo "Error: npm run build failed for $dapp_name"
        exit 1
    fi
    
    echo "Successfully processed $dapp_name"
    echo "---"
done

echo "All dApp examples processed successfully!"

