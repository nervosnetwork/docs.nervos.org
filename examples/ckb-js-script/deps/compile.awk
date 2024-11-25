#!/usr/bin/awk -f

{
    # Check if the line starts with "Script log: "
    if ($0 ~ /^Script log: /) {
        # Remove "Script log: " from the line
        line_data = gensub(/^Script log: /, "", "g")

        # If the remaining line is not empty, print it
        if (line_data != "") {
            print line_data
        }
    }
}
