#!/bin/sh

kubectl cp ./duely-schema.sql duely-postgres-master-statefulset-0:duely-schema.sql
kubectl cp ./duely-seed.sql duely-postgres-master-statefulset-0:duely-seed.sql
kubectl cp ./duely-prepare.sql duely-postgres-master-statefulset-0:duely-prepare.sql
kubectl cp ./duely-reset.sql duely-postgres-master-statefulset-0:duely-reset.sql
kubectl cp ./duely-test.sql duely-postgres-master-statefulset-0:duely-test.sql
kubectl cp ./tests duely-postgres-master-statefulset-0:tests
kubectl exec duely-postgres-master-statefulset-0 -- psql -v service_account_password="'$DUELY_SERVICE_ACCOUNT_PASSWORD'" -U postgres -d postgres -f duely-reset.sql
kubectl exec duely-postgres-master-statefulset-0 -- psql -U duely -d duely -f duely-test.sql
kubectl exec duely-postgres-master-statefulset-0 -- rm -r duely-prepare.sql duely-schema.sql duely-seed.sql duely-test.sql duely-reset.sql tests
