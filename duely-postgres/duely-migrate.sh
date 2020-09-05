#!/bin/sh

kubectl cp C:\Users\uotin\duely\duely\duely-postgres\duely-migrate.sql duely-postgres-master-statefulset-0:duely-migrate.sql
kubectl exec duely-postgres-master-statefulset-0 -- psql -U postgres -d duely -f duely-migrate.sql
kubectl exec duely-postgres-master-statefulset-0 -- rm duely-migrate.sql
