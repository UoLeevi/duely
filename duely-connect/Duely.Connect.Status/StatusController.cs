using Microsoft.AspNetCore.Mvc;

namespace Duely.Connect.Status;

[ApiController]
[Route("/status")]
[Route("/.well-known/server-health")]
public class StatusController : ControllerBase
{
    public StatusController()
    {
    }

    [HttpGet]
    public string Get() => "ok";
}
