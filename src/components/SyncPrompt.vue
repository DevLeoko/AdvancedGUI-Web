<template>
  <div
    class="exportPrompt"
    :style="{ display: syncPromptOpen ? 'flex' : 'none' }"
  >
    <div class="exportPromptContainer">
      <h1><span class="material-icons">cloud_upload</span> Start live sync</h1>
      <p><b>1.</b> Select sync type:</p>
      <div>
        <div>
          <input
            type="radio"
            name="syncType"
            id="socket"
            :value="SyncType.SOCKET"
            v-model.number="syncType"
          />
          <label for="socket"
            >Socket <i>- Default (Works for most servers)</i></label
          >
        </div>
        <div>
          <input
            type="radio"
            name="syncType"
            id="manual"
            :value="SyncType.MANUAL"
            v-model.number="syncType"
          />
          <label for="manual"
            >Manual <i>- Use this when socket doesn't work</i></label
          >
        </div>
      </div>
      <div v-if="syncType == SyncType.SOCKET">
        <p>
          <b>2.</b> Enter your server address and the port configured for the
          sync socket (default 27757):
        </p>
        <div class="address">
          <input
            type="text"
            placeholder=" hypixel.net:27757"
            v-model="serverAddress"
          />
        </div>
      </div>
      <p>
        <b>{{ syncType == SyncType.SOCKET ? "3" : "2" }}.</b> Run this command
        on your server:
      </p>
      <div class="command">
        <span class="spin material-icons" v-if="!syncKey">autorenew</span>
        <input
          v-else
          ref="commandInput"
          type="text"
          @input="$refs.commandInput.value = syncCommand"
          :value="syncCommand"
        />
        <span
          class="material-icons copyBtn"
          ref="copyCommandIcon"
          @click="copyCommand()"
          >content_copy</span
        >
      </div>
      <div class="action-row">
        <b>{{ syncType == SyncType.SOCKET ? "4" : "3" }}.</b>
        <div
          class="btn export"
          :class="
            (!serverAddress || !syncKey) && syncType == SyncType.SOCKET
              ? 'inactive'
              : ''
          "
          @click="sync()"
        >
          <span class="material-icons">cloud_upload</span>
          <span class="text">Connect live sync</span>
        </div>
      </div>
      <div class="action-row">
        <div class="btn close" @click="syncPromptOpen = false">
          <span class="text">Close</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { getCookie, setCookie } from "../utils/CookieUtils";
import { settings } from "../utils/manager/SettingsManager";
import {
  serverAddress,
  syncPromptOpen,
  syncStatus,
  syncKey,
  syncType,
  SyncType,
  pingServer
} from "../utils/manager/SyncManager";
import { error, loading } from "../utils/manager/WorkspaceManager";
import { vueRef } from "../utils/VueRef";

export default defineComponent({
  data() {
    return {
      serverAddress: vueRef(serverAddress),
      syncPromptOpen: vueRef(syncPromptOpen),
      syncStatus: vueRef(syncStatus),
      syncKey: vueRef(syncKey),
      syncType: vueRef(syncType),
      settings,
      SyncType
    };
  },

  mounted() {
    this.serverAddress = getCookie("server-address") || null;
  },

  computed: {
    syncCommand(): string {
      return `/ag sync ${this.syncType == SyncType.MANUAL ? "-manual " : ""}${
        this.syncKey
      } ${this.settings.projectName}`;
    }
  },

  methods: {
    async sync() {
      setCookie("server-address", this.serverAddress!, 10 * 365);
      setCookie("sync-type", this.syncType!.toString(), 10 * 365);
      loading(true);
      try {
        await pingServer();
        syncPromptOpen.value = false;
        loading(false);
      } catch (exc) {
        error(exc.message || exc);
      }
    },

    copyCommand() {
      const input = this.$refs.commandInput as HTMLInputElement;
      const icon = this.$refs.copyCommandIcon as HTMLElement;

      input.select();
      input.setSelectionRange(0, 99999);
      document.execCommand("copy");

      icon.innerText = "assignment_turned_in";

      setTimeout(() => (icon.innerText = "content_copy"), 1000);
    }
  }
});
</script>

<style lang="scss" scoped>
.exportPrompt {
  z-index: 10;
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  backdrop-filter: blur(5px);
  justify-content: center;
  align-items: center;

  .exportPromptContainer {
    padding: 30px;
    box-shadow: $shadow;
    background-color: $dark1;
    width: 30rem;
    color: $light2;

    p {
      margin-bottom: 0.3rem;
    }

    h1 {
      display: flex;
      align-items: center;
      margin: 0;
      font-size: 1.8rem;
      font-weight: 300;
      margin-bottom: 2rem;

      .material-icons {
        color: $green;
        margin-right: 1rem;
      }
    }

    i {
      color: $light3;
    }

    .address input[type="text"] {
      width: 200px;
      border-radius: 0;
      background-color: transparent;
      border: none;
      border-bottom: $inputBorder;
      // border-radius: 5px;
      color: $light2;
      padding: 5px 10px;
      margin-bottom: 8px;

      &::placeholder {
        font-weight: 600;
        text-transform: uppercase;
      }

      &:focus {
        outline: none;
      }
    }

    .command {
      // margin-top: 0.5rem;
      display: flex;
      align-items: center;

      .copyBtn {
        cursor: pointer;
        margin-left: 0.5rem;
        font-size: 1.2rem;
      }

      input[type="text"] {
        border: none;
        border-radius: 0;
        width: 200px;
        padding: 5px 13px;
        background-color: $dark2;
        color: $light2;
        white-space: nowrap;
        display: block;

        &:focus {
          outline: none;
        }
      }
    }

    .action-row {
      margin-top: 1.5rem;
      display: flex;
      padding-top: 5px;
      align-items: center;
      // justify-content: space-between;

      .export {
        background-color: $green;
        color: $dark2;
        margin-left: 1rem;
        margin-right: auto;

        &.inactive {
          background-color: $light3 !important;
          cursor: not-allowed;
        }
      }

      .close {
        margin-left: auto;
        background-color: transparent;
        border: 1px solid transparentize($color: $red, $amount: 0.2);
        color: transparentize($color: $red, $amount: 0.2);

        &:hover {
          border: 1px solid $red;
          color: $red;
        }
      }
    }
  }
}
</style>
