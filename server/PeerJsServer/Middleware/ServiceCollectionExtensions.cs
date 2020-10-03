using Microsoft.Extensions.DependencyInjection;
using PeerJs.BackgroundTasks;

namespace PeerJs.Middleware
{
    public static class ServiceCollectionExtensions
    {
        public static void AddPeerJsServer(this IServiceCollection services)
        {
            services.AddSingleton<IPeerJsServer, PeerJsServer>();
            services.AddHostedService<ZombieConnectionsBackgroundTask>();
            services.AddHostedService<ExpiredMessagesBackgroundTask>();
        }
    }
}