// This is mainly used for testing and debugging
// This script can be run through kubectl using command:
// kubectl run -it --rm --restart=Never curl --image=curlimages/curl -- -X POST http://duely-lambda-service:8080/run/echo/arg1/arg2/arg3
console.log(process.argv.slice(3));
