<template>
  <div
    class="exportPrompt"
    :style="{ display: licensePromptDoneAction ? 'flex' : 'none' }"
  >
    <div class="exportPromptContainer">
      <h1><span class="material-icons">vpn_key</span> License required</h1>
      <p>
        To download project files you are required to have a license key. Saving
        your projects to the web-editor works without a license key. So you
        won't lose any progress if you don't have a key yet.
      </p>
      <div class="license-key">
        <input
          type="text"
          autocomplete="off"
          placeholder="License key"
          v-model="licenseKey"
        />
        <br />
        <input type="checkbox" v-model="remember" /> <span>Remember key</span>
      </div>
      <p>
        To receive a license key please join our
        <a
          href="https://discord.gg/ycDG6rS"
          target="_blank"
          rel="noopener noreferrer"
          >discord</a
        >
        and use the <i>#verify-purchase</i> channel. The verifcation process is
        automated and only takes a few seconds.
      </p>
      <div class="action-row">
        <div
          class="btn export"
          :class="!licenseKey ? 'inactive' : ''"
          @click="saveKey()"
        >
          <span class="material-icons">vpn_key</span>
          <span class="text">Save license key</span>
        </div>

        <div class="btn close" @click="licensePromptDoneAction = null">
          <span class="text">Close</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { eraseCookie, getCookie, setCookie } from "../utils/CookieUtils";
import {
  licenseKey,
  licensePromptDoneAction
} from "../utils/manager/ProjectManager";
import { vueRef } from "../utils/VueRef";

export default defineComponent({
  data() {
    return {
      licenseKey: vueRef(licenseKey),
      remember: false,
      licensePromptDoneAction: vueRef(licensePromptDoneAction),
      savedKey: null as null | string
    };
  },

  mounted() {
    this.savedKey = getCookie("license-key");
    if (this.savedKey) {
      this.licenseKey = this.savedKey;
      this.remember = true;
    }
  },

  methods: {
    saveKey() {
      if (!this.licenseKey) return;

      if (
        this.remember &&
        this.licenseKey &&
        this.licenseKey != this.savedKey
      ) {
        setCookie("license-key", this.licenseKey, 10 * 365);
      }

      if (!this.remember && this.savedKey) {
        eraseCookie("license-key");
        this.savedKey = "";
      }

      this.licensePromptDoneAction!();
      this.licensePromptDoneAction = null;
    }
  }
});
</script>

<style lang="scss" scoped>
.exportPrompt {
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

    h1 {
      margin: 0;

      .material-icons {
        color: $green;
      }
    }

    i {
      color: $light3;
    }

    .license-key {
      input[type="text"] {
        width: 200px;
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
    }

    .action-row {
      display: flex;
      padding-top: 5px;
      justify-content: space-between;

      .export {
        background-color: $green;
        color: $dark2;

        &.inactive {
          background-color: $light3 !important;
          cursor: not-allowed;
        }
      }

      .close {
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
