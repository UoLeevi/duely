using Duely.Utilities;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using System.Text.Json.Nodes;

namespace Duely.Connect.Proxy;

public class RequestTemplateSpecContextBinder : IModelBinder
{
    public Task BindModelAsync(ModelBindingContext bindingContext)
    {
        if (QueryStringUtils.ParseQueryAsJson(bindingContext.HttpContext.Request.QueryString, "context") is JsonObject context)
        {
            bindingContext.Result = ModelBindingResult.Success(context);
        }

        return Task.CompletedTask;
    }
}
