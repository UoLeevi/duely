using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace Duely.Connect.Proxy;

public class RequestTemplateSpecHttpMethodBinder : IModelBinder
{
    public Task BindModelAsync(ModelBindingContext bindingContext)
    {
        if (bindingContext.HttpContext.Request.Query.TryGetValue("method", out var method))
        {
            var httpMethod = method.Single().ToUpper() switch
            {
                "DELETE" => HttpMethod.Delete,
                "GET" => HttpMethod.Get,
                "HEAD" => HttpMethod.Head,
                "OPTIONS" => HttpMethod.Options,
                "PATCH" => HttpMethod.Patch,
                "POST" => HttpMethod.Post,
                "PUT" => HttpMethod.Put,
                "TRACE" => HttpMethod.Trace,
                _ => null
            };

            if (httpMethod is null)
            {
                bindingContext.ModelState.AddModelError(
                    nameof(RequestTemplate.Method),
                    $"'{method}' is not a valid value for 'method' parameter.");
            }
            else
            {
                bindingContext.Result = ModelBindingResult.Success(httpMethod);
            }

        }

        return Task.CompletedTask;
    }
}
