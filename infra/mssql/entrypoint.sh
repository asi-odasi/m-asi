#!/bin/bash
set -e

mkdir -p /var/opt/mssql
chown -R mssql:root /var/opt/mssql

exec setpriv --reuid=10001 --regid=0 --clear-groups /opt/mssql/bin/sqlservr
