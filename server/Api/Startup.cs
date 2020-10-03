using Api.Middleware;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using PeerJs.Middleware;
using Repositories;
using Services;

namespace Api
{
    public class Startup
    {
        readonly string MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

        private IConfiguration _configuration;

        public Startup(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddCors(
                options =>
                {
                    options.AddPolicy(
                        name: MyAllowSpecificOrigins,
                        builder =>
                        {
                            builder.WithOrigins(
                                    "*")
                                .AllowAnyHeader()
                                .AllowAnyMethod();
                        });
                });
            services.AddControllers();

            services.AddSingleton<ICodeWorkspaceRepository, CodeWorkspaceRepository>();
            services.AddSingleton<ICodeWorkspaceManager, CodeWorkspaceManager>();
            services.AddMemoryCache();
            services.AddHttpContextAccessor();
            services.AddHealthChecks();
            services.AddPeerJsServer();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            app.UseCors(MyAllowSpecificOrigins);
            app.UseMiddleware<RequestMiddleware>();
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseHttpsRedirection();

            app.UseRouting();
            app.UsePeerJsServer();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                endpoints.MapHealthChecks("/health");
            });
        }
    }
}