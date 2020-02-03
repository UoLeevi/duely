kubectl cp C:\Users\uotin\duely\duely\duely-postgres\duely-schema.sql  duely-postgres-master-statefulset-0:duely-schema.sql
kubectl cp C:\Users\uotin\duely\duely\duely-postgres\duely-prepare.sql  duely-postgres-master-statefulset-0:duely-prepare.sql
kubectl cp C:\Users\uotin\duely\duely\duely-postgres\duely-test.sql  duely-postgres-master-statefulset-0:duely-test.sql
kubectl exec -it duely-postgres-master-statefulset-0 bash
psql -U postgres -d postgres -f duely-test.sql
rm duely-prepare.sql duely-schema.sql duely-test.sql
