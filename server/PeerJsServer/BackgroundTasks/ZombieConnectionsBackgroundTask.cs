using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using PeerJs.Helpers;
using PeerJs.Models;

namespace PeerJs.BackgroundTasks
{
    public class ZombieConnectionsBackgroundTask : BackgroundService
    {
        private readonly ILogger<ExpiredMessagesBackgroundTask> _logger;
        private readonly IPeerJsServer _peerJsServer;

        public ZombieConnectionsBackgroundTask(
            ILogger<ExpiredMessagesBackgroundTask> logger,
            IPeerJsServer peerJsServer)
        {
            _logger = logger;
            _peerJsServer = peerJsServer;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    var realms = _peerJsServer.GetRealms();

                    foreach (var realm in realms)
                    {
                        await PruneZombieConnectionsAsync(realm.Value);
                    }
                }
                catch (Exception e)
                {
                    Console.WriteLine(e);
                }
                finally
                {
                    await Task.Delay(TimeSpan.FromSeconds(300), stoppingToken);
                }
            }
        }

        private async Task PruneZombieConnectionsAsync(IRealm realm)
        {
            var clientIds = realm.GetClientIds();

            var now = DateTime.UtcNow;
            var aliveTimeout = TimeSpan.FromSeconds(60);

            var count = 0;

            foreach (var clientId in clientIds)
            {
                var client = realm.GetClient(clientId);
                var timeSinceLastHeartbeat = now - client.GetLastHeartbeat();

                if (timeSinceLastHeartbeat < aliveTimeout)
                {
                    continue;
                }

                var socket = client.GetSocket();

                try
                {
                    if(socket != null)
                    {
                        await socket.CloseAsync($"Zombie connection, time since last heartbeat: {timeSinceLastHeartbeat.TotalSeconds}s");
                    }
                }
                finally
                {
                    realm.ClearMessageQueue(clientId);
                    realm.RemoveClientById(clientId);

                    socket?.Dispose();
                }

                count++;
            }

            if (count > 0)
            {
                _logger.LogInformation($"Pruned zombie connections for {count} peers.");
            }
        }
    }
}