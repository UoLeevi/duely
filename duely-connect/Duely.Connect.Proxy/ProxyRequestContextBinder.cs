﻿using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace Duely.Connect.Proxy;

public class ProxyRequestContextBinder : IModelBinder
{
    public Task BindModelAsync(ModelBindingContext bindingContext)
    {
        var context = Utilities.ParseQueryAsJsonObject(bindingContext.HttpContext.Request.Query);
        bindingContext.Result = ModelBindingResult.Success(context);

        return Task.CompletedTask;
    }
}
