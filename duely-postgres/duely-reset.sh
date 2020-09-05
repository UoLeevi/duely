#!/bin/sh

kubectl cp C:\Users\uotin\duely\duely\duely-postgres\duely-schema.sql duely-postgres-master-statefulset-0:duely-schema.sql
kubectl cp C:\Users\uotin\duely\duely\duely-postgres\duely-seed.sql duely-postgres-master-statefulset-0:duely-seed.sql
kubectl cp C:\Users\uotin\duely\duely\duely-postgres\duely-prepare.sql duely-postgres-master-statefulset-0:duely-prepare.sql
kubectl cp C:\Users\uotin\duely\duely\duely-postgres\duely-reset.sql duely-postgres-master-statefulset-0:duely-reset.sql
kubectl cp C:\Users\uotin\duely\duely\duely-postgres\duely-test.sql duely-postgres-master-statefulset-0:duely-test.sql
kubectl cp C:\Users\uotin\duely\duely\duely-postgres\tests duely-postgres-master-statefulset-0:tests
kubectl exec duely-postgres-master-statefulset-0 -- psql -U postgres -d postgres -f duely-reset.sql
kubectl exec duely-postgres-master-statefulset-0 -- psql -U duely -d duely -f duely-test.sql
kubectl exec duely-postgres-master-statefulset-0 -- rm -r duely-prepare.sql duely-schema.sql duely-seed.sql duely-test.sql duely-reset.sql tests
