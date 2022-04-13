$pod = kubectl get pods -l app=duely-connect -o custom-columns=:metadata.name
$pod = ($pod -split '\n')[1]
kubectl exec $pod -- sh -c 'rm -rf /app/data/services'
kubectl cp .\duely-connect\services ${pod}:/app/data/services
