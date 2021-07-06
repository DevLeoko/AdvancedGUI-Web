<template>
  <div
    class="exportPrompt"
    :style="{ display: syncPromptOpen ? 'flex' : 'none' }"
  >
    <div class="exportPromptContainer">
      <h1><span class="material-icons">cloud_upload</span> Start live sync</h1>
      <p>
        <b>1.</b> What is the server address, that you woud like to sync to?
      </p>
      <div class="address">
        <input
          type="text"
          placeholder="hypixel.net:25565"
          v-model="serverAddress"
        />
        <br />
      </div>
      <p><b>2.</b> Run this command on your server:</p>
      <div class="command">
        <span class="spin material-icons" v-if="!syncKey">autorenew</span>
        <input
          v-else
          ref="commandInput"
          type="text"
          @input="$refs.commandInput.value = `/ag sync ${syncKey}`"
          :value="`/ag sync ${syncKey}`"
        />
        <span
          class="material-icons copyBtn"
          ref="copyCommandIcon"
          @click="copyCommand()"
          >content_copy</span
        >
      </div>
      <div class="action-row">
        <b>3.</b>
        <div
          class="btn export"
          :class="!serverAddress ? 'inactive' : ''"
          @click="syncPromptOpen = false"
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
import {
  serverAddress,
  syncPromptOpen,
  syncStatus,
  syncKey
} from "../utils/manager/SyncManager";
import { vueRef } from "../utils/VueRef";

export default defineComponent({
  data() {
    return {
      serverAddress: vueRef(serverAddress),
      syncPromptOpen: vueRef(syncPromptOpen),
      syncStatus: vueRef(syncStatus),
      syncKey: vueRef(syncKey)
    };
  },

  mounted() {
    this.serverAddress = getCookie("server-address") || null;
  },

  methods: {
    sync() {
      setCookie("server-address", this.serverAddress!, 10 * 365);
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
    max-width: 30vw;
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
