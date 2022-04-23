using Duely.Utilities;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace Duely.Connect.Proxy;

public class ProxyRequestContextBinder : IModelBinder
{
    public Task BindModelAsync(ModelBindingContext bindingContext)
    {
        var context = QueryStringUtils.ParseQueryAsJson(bindingContext.HttpContext.Request.QueryString);
        bindingContext.Result = ModelBindingResult.Success(context);

        return Task.CompletedTask;
    }
}
