const CHANNEL_NAME = "smartcity-cms-sync";
const STORAGE_KEY = "smartcity-cms-sync-token";

export function broadcastCmsUpdate() {
  if (typeof window === "undefined") {
    return;
  }

  const token = Date.now().toString();
  window.dispatchEvent(new CustomEvent(CHANNEL_NAME, { detail: token }));

  if ("BroadcastChannel" in window) {
    const channel = new BroadcastChannel(CHANNEL_NAME);
    channel.postMessage(token);
    channel.close();
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, token);
  } catch {
    // Ignore storage errors in private browsing contexts.
  }
}

export function subscribeToCmsUpdates(onUpdate: () => void) {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const handleCustomEvent = () => onUpdate();
  window.addEventListener(CHANNEL_NAME, handleCustomEvent as EventListener);

  const handleStorageEvent = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY && event.newValue) {
      onUpdate();
    }
  };
  window.addEventListener("storage", handleStorageEvent);

  let channel: BroadcastChannel | null = null;
  if ("BroadcastChannel" in window) {
    channel = new BroadcastChannel(CHANNEL_NAME);
    channel.onmessage = () => onUpdate();
  }

  return () => {
    window.removeEventListener(CHANNEL_NAME, handleCustomEvent as EventListener);
    window.removeEventListener("storage", handleStorageEvent);
    channel?.close();
  };
}
