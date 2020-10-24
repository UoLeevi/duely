#!/bin/sh

if [ -d "/workspace/duely-secret" ]
then
  chmod 600 /workspace/duely-secret/.pgpass
fi
