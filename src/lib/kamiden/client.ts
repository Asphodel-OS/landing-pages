import { createChannel, createClient } from 'nice-grpc-web';

import { KamidenServiceClient, KamidenServiceDefinition } from './proto';
import { FeedCallbacks, MessageCallbacks } from './subscriptions';
// import { getGrpcTransport } from '../../workers/sync/grpcTransport';

let Client: KamidenServiceClient | null = null;

export function getClient(): KamidenServiceClient | null {
  // if (!import.meta.env.VITE_KAMIGAZE_URL) return Client; // null when kamigaze url is not set

  if (!Client) {
    // Use local proxy if in production to avoid CORS, or direct URL if VITE_KAMIGAZE_URL is set (dev/local)
    // When running on Vercel, we need to go through the rewrite to bypass browser CORS restrictions
    const baseUrl = import.meta.env.VITE_KAMIGAZE_URL || (import.meta.env.PROD ? '/api/proxy' : 'https://api.prod.kamigotchi.io');
    
    const channel = createChannel(
      baseUrl,
    );
    Client = createClient(KamidenServiceDefinition, channel);

    // Set up the perennial subscription
    setupSubscription();
  }
  return Client;
}

// Subscribe to messages and trigger all registered callbacks
// NOTE(jb): not sure if callback handling should be the client's responsibility.
// feels like it could get a bit messy
async function setupSubscription() {
  try {
    const stream = Client!.subscribeToStream({});

    for await (const response of stream) {
      // Handle messages
      for (const message of response.Messages) {
        MessageCallbacks.forEach((cb) => cb(message));
      }

      // Handle feed if present
      if (response.Feed) {
        FeedCallbacks.forEach((cb) => cb(response.Feed!));
      }
    }
  } catch (error) {
    console.error('[kamiden] Stream error:', error);
    // Attempt to reconnect after a delay
    setTimeout(setupSubscription, 5000);
  }
}
