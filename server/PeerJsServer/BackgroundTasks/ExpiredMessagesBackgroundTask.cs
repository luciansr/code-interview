using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using PeerJs.Models;

namespace PeerJs.BackgroundTasks
{
    public class ExpiredMessagesBackgroundTask : BackgroundService
    {
        private readonly ILogger<ExpiredMessagesBackgroundTask> _logger;
        private readonly IPeerJsServer _peerJsServer;

        public ExpiredMessagesBackgroundTask(
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
                        await PruneExpiredMessagesAsync(realm.Value, stoppingToken);
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

        private async Task PruneExpiredMessagesAsync(IRealm realm, CancellationToken stoppingToken)
        {
            var clientIds = realm.GetClientIdsWithQueue();

            var now = DateTime.UtcNow;
            var maxDiff = TimeSpan.FromSeconds(300);

            var seenMap = new Dictionary<string, bool>();

            foreach (var clientId in clientIds)
            {
                var messageQueue = realm.GetMessageQueueById(clientId);

                if (messageQueue == null)
                {
                    continue;
                }

                var lastReadDiff = now - messageQueue.GetReadTimestamp();

                if (lastReadDiff < maxDiff)
                {
                    continue;
                }

                var messages = messageQueue.GetAll();

                foreach (var message in messages)
                {
                    var seenKey = $"{message.Source}_{message.Destination};";

                    if (!seenMap.TryGetValue(seenKey, out var seen) || !seen)
                    {
                        var sourceClient = realm.GetClient(message.Source);

                        await realm.HandleMessageAsync(sourceClient, Message.Create(MessageType.Expire, string.Empty), stoppingToken);

                        seenMap[seenKey] = true;
                    }
                }

                realm.ClearMessageQueue(clientId);
            }

            if (seenMap.Keys.Count > 0)
            {
                _logger.LogInformation($"Pruned expired messages for {seenMap.Keys.Count} peers.");
            }
        }
    }
}