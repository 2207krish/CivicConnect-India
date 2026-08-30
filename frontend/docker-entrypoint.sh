#!/bin/sh
set -e

# Ensure .data directory exists and has full write permissions even when mounted via Railway volume
mkdir -p /app/.data
chown -R nextjs:nodejs /app/.data 2>/dev/null || true
chmod -R 777 /app/.data 2>/dev/null || true

# If running as root, drop privileges to nextjs user using su-exec
if [ "$(id -u)" = '0' ]; then
    exec su-exec nextjs "$@"
fi

exec "$@"
