kubectl cp C:\Users\uotin\duely\duely\duely-postgres\duely-migrate.sql duely-postgres-master-statefulset-0:duely-migrate.sql
kubectl exec -it duely-postgres-master-statefulset-0 bash
psql -U postgres -d duely -f duely-migrate.sql
rm duely-migrate.sql
exit
