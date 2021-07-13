import { ref } from "vue";
import { BACKEND_URL } from "../Config";
import { getCookie } from "../CookieUtils";
import { getCurrentTransferData } from "../handler/ProjectSerializationHandler";
import { licenseKey, licensePromptDoneAction } from "./ProjectManager";
import { settings } from "./SettingsManager";
import { error } from "./WorkspaceManager";

export enum SyncStatus {
  DISCONNECTED,
  SYNCING,
  CONNECTED
}

export enum SyncType {
  SOCKET = 0,
  MANUAL = 1
}

export const syncPromptOpen = ref(false);
export const serverAddress = ref(null as string | null);
export const syncKey = ref(null as string | null);
export const userIp = ref(null as string | null);
export const syncStatus = ref(SyncStatus.DISCONNECTED);
export const syncType = ref(SyncType.SOCKET);

async function callSyncServer(): Promise<{ id: string; ip: string }> {
  const resp = await fetch(
    // "http://127.0.0.1:3000/sync",
    `${BACKEND_URL}/sync`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        key: licenseKey.value,
        name: settings.projectName,
        savepoint: getCurrentTransferData()
      })
    }
  );

  const data = await resp.text();

  if (resp.status >= 400) throw data;

  const { id, ip } = JSON.parse(data);

  return {
    id,
    ip
  };
}

export function openSyncPrompt() {
  if (!licenseKey.value) {
    licensePromptDoneAction.value = openSyncPrompt;
    return;
  }

  serverAddress.value = getCookie("server-address") || null;
  syncType.value = Number.parseInt(getCookie("sync-type") || "0");
  syncKey.value = null;
  syncPromptOpen.value = true;

  callSyncServer()
    .then(data => {
      userIp.value = data.ip;
      syncKey.value = data.id;
    })
    .catch(exc => {
      const errorText = `Starting sync failed: ${exc.message || exc}`;
      const licenseError =
        errorText.toLocaleLowerCase().includes("licence") ||
        errorText.toLocaleLowerCase().includes("license");
      error(
        errorText,
        licenseError
          ? {
              label: "Change license key",
              callback: () => {
                licensePromptDoneAction.value = () => undefined;
              }
            }
          : undefined
      );

      syncPromptOpen.value = false;
    });
}

export async function pingServer() {
  if (syncStatus.value == SyncStatus.SYNCING) return;

  syncStatus.value = SyncStatus.SYNCING;

  await callSyncServer();

  if (syncType.value == SyncType.MANUAL) {
    syncStatus.value = SyncStatus.CONNECTED;
    return;
  }

  if (syncType.value == SyncType.SOCKET) {
    const socket = new WebSocket(`ws://${serverAddress.value || "localhost"}`);

    try {
      await new Promise<void>((resolve, reject) => {
        const timer = setTimeout(() => {
          console.error("Server not in sync mode, TIMEOUT.");
          syncStatus.value = SyncStatus.DISCONNECTED;
          reject("Server not reachable or not in sync mode!");
        }, 1000 * 5);

        socket.addEventListener("message", function(event) {
          clearTimeout(timer);

          if (event.data != syncKey.value) {
            console.error("Server not in sync mode, resp:", event.data);
            syncStatus.value = SyncStatus.DISCONNECTED;
            reject("Server not in sync mode!");
            return;
          }

          syncStatus.value = SyncStatus.CONNECTED;
          resolve();
        });
      });
    } finally {
      socket.close();
    }
  }
}
