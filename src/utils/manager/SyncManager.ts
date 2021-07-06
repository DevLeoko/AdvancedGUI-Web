import { ref } from "vue";
import { BACKEND_URL } from "../Config";
import { getCookie } from "../CookieUtils";
import { getCurrentTransferData } from "../handler/ProjectSerializationHandler";
import { licenseKey, licensePromptDoneAction } from "./ProjectManager";
import { error } from "./WorkspaceManager";

export enum SyncStatus {
  DISCONNECTED,
  SYNCING,
  CONNECTED
}

export const syncPromptOpen = ref(false);
export const serverAddress = ref(null as string | null);
export const syncKey = ref(
  "48c39069f0cd498de4e508f677499875bd1787c0b5054b24b58c8f22608b69ac" as
    | string
    | null
);
export const syncStatus = ref(SyncStatus.DISCONNECTED);

async function callSyncServer(): Promise<string> {
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
        savepoint: getCurrentTransferData()
      })
    }
  );

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
  syncKey.value = null;
  syncPromptOpen.value = true;

  callSyncServer()
    .then(id => (syncKey.value = id))
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
