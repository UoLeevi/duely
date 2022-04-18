using Microsoft.AspNetCore.Mvc.ModelBinding;
using System.Text.Json.Nodes;

namespace Duely.Connect.Proxy;

public class RequestTemplateSpecContextBinder : IModelBinder
{
    public Task BindModelAsync(ModelBindingContext bindingContext)
    {
        if (Utilities.ParseQueryAsJsonObject(bindingContext.HttpContext.Request.Query)?.TryGetValue("context", out var contextNode) is true)
        {
            if (contextNode is JsonObject context)
            {
                bindingContext.Result = ModelBindingResult.Success(context);
            }
        }

        return Task.CompletedTask;
    }
}
