#!/bin/bash
set -e

mongo <<EOF
use ${MONGO_INITDB_DATABASE};

db.createCollection("shops");

db.createUser({
  user: "admin",
  pwd: "admin",
  roles: [
    { role: "readWrite", db: "${MONGO_INITDB_DATABASE}" }
  ]
});
EOF