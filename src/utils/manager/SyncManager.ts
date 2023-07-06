import { ref } from "vue";
import { BACKEND_URL } from "../Config";
import { getCookie } from "../CookieUtils";
import {
  BK,
  getCurrentTransferData
} from "../handler/ProjectSerializationHandler";
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
export const syncStatus = ref(SyncStatus.DISCONNECTED);
export const syncType = ref(SyncType.SOCKET);

async function manaulSync(): Promise<void> {
  const resp = await fetch(`${BACKEND_URL}/sync/write`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": licenseKey.value,
      "x-bk": BK
    },
    body: JSON.stringify({
      name: settings.projectName,
      savepoint: getCurrentTransferData()
    })
  });

  const data = await resp.text();

  if (resp.status >= 400) throw data;
}

async function socketSync(): Promise<void> {
  const resp = await fetch(`${BACKEND_URL}/sync/direct-call`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": licenseKey.value,
      "x-bk": BK
    },
    body: JSON.stringify({
      name: settings.projectName,
      savepoint: getCurrentTransferData(),
      serverAddress: serverAddress.value
    })
  });

  const data = await resp.text();

  if (resp.status >= 400) throw data;
}

async function querySyncKey(): Promise<string> {
  const resp = await fetch(`${BACKEND_URL}/sync/generate-key`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": licenseKey.value,
      "x-bk": BK
    },
    body: JSON.stringify({
      name: settings.projectName
    })
  });

  const data = await resp.text();

  if (resp.status >= 400) throw data;

  return JSON.parse(data).id;
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

  querySyncKey()
    .then(key => {
      syncKey.value = key;
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

  try {
    if (syncType.value == SyncType.MANUAL) {
      await manaulSync();
    }

    if (syncType.value == SyncType.SOCKET) {
      await socketSync();
    }

    syncStatus.value = SyncStatus.CONNECTED;
  } catch (exc) {
    syncStatus.value = SyncStatus.DISCONNECTED;
    throw exc;
  }
}
