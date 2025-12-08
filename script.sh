#!/usr/bin/env bash

# Output file
OUTFILE="commits.csv"

# Write header
echo "timestamp,hash,message" > "$OUTFILE"

# Export commits
git log --reverse --pretty='%ct,%H,"%s"' >> "$OUTFILE"

echo "CSV written to $OUTFILE"
