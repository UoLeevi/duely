using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.Mvc.ModelBinding.Binders;
using System.Text.Json.Nodes;

namespace Duely.Connect.Proxy;

public class ProxyControllerBinderProvider : IModelBinderProvider
{
    public IModelBinder? GetBinder(ModelBinderProviderContext context)
    {
        if (context.Metadata.ContainerType == typeof(RequestTemplateSpec))
        {
            if (context.Metadata.ModelType == typeof(HttpMethod))
            {
                return new BinderTypeModelBinder(typeof(RequestTemplateSpecHttpMethodBinder));
            }

            if (context.Metadata.PropertyName == nameof(RequestTemplateSpec.Context))
            {
                return new BinderTypeModelBinder(typeof(RequestTemplateSpecContextBinder));
            }
        }

        if (context.Metadata.ModelType == typeof(Dictionary<string, JsonNode?>) && context.Metadata.Name == "context")
        {
            return new BinderTypeModelBinder(typeof(ProxyRequestContextBinder));
        }

        return null;
    }
}
