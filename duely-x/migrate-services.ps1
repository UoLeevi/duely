$pod = kubectl get pods -l app=duely-x -o custom-columns=:metadata.name
$pod = ($pod -split '\n')[1]
kubectl exec $pod -- sh -c 'rm -rf /app/data/services'
kubectl cp .\duely-x\services ${pod}:/app/data/services
