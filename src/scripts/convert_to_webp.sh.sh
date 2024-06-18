#!/bin/bash

# Get the directory of the current script
script_dir="$(dirname "$(realpath "$0")")"

# Define the target directory relative to the script directory
target_dir="$script_dir/../../public"

# Find all jpg, jpeg, and png files in the target directory and its subdirectories
find "$target_dir" -type f \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" \) | while read file; do
    # Get the file name without the extension
    base_name=$(basename "$file" | sed 's/\(.*\)\..*/\1/')
    # Get the directory of the file
    dir_name=$(dirname "$file")
    # Convert the file to webp
    convert "$file" "$dir_name/$base_name.webp"
    echo "Converted $file to $dir_name/$base_name.webp"
done
