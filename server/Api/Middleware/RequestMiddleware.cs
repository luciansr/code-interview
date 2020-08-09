using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.Logging;

namespace Api.Middleware
{
    internal class RequestMiddleware
    {
        private readonly RequestDelegate _next;

        public RequestMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task Invoke(
            HttpContext context,
            IWebHostEnvironment hostingEnvironment,
            IHttpContextAccessor httpContextAccessor,
            ILogger<RequestMiddleware> logger)
        {
            Exception exception = null;
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                exception = ex;
            }
            finally
            {
                var request = context.Request;
                var statusCode = context.Response.StatusCode;

                var authenticationResult = string.Empty;

                var action = httpContextAccessor.HttpContext.GetRouteValue("action")?.ToString() ?? string.Empty;
                var controller = httpContextAccessor.HttpContext.GetRouteValue("controller")?.ToString() ?? string.Empty;

                var hasError = statusCode > 499 || exception != null;

                if (hasError)
                {
                    var customFields = new[]
                    {
                        ("requestHost", context.Request.Host.Host),
                        ("action", action),
                        ("controller", controller),
                        ("statuscode", statusCode.ToString()),
                        ("path", context.Request.Path.ToString()),
                        ("env", hostingEnvironment.EnvironmentName.ToLowerInvariant()),
                        ("method", request.Method),
                        ("authResult", authenticationResult)
                    };

                    logger.LogError($"Error{Environment.NewLine}{string.Join(Environment.NewLine, customFields.Select(x => $"{x.Item1} - {x.Item2}"))}", exception);
                }
            }
        }
    }
}