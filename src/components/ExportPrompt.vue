<template>
  <div class="exportPrompt" :style="{ display: modelValue ? 'flex' : 'none' }">
    <div class="exportPromptContainer">
      <h1><span class="material-icons">get_app</span> Export for usage</h1>
      <p>
        Click below to download the AdvancedGUI file that you can use with our
        plugin. Place this file in the <i>layouts/</i>-folder to use it in-game.
        Make sure to also download a savepoint as you will
        <b>not be able to import this file back into the editor!</b>
      </p>
      <div class="license-key">
        <input type="text" placeholder="License key" v-model="key" /> <br />
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
        automated and takes only a few seconds.
      </p>
      <div class="action-row">
        <div class="btn export" @click="exportFU()">
          <span class="material-icons">get_app</span>
          <span class="text"
            >Export
            {{ key ? "" : "without key (works until 21.04.2021)" }}</span
          >
        </div>

        <div class="btn close" @click="$emit('update:modelValue', false)">
          <span class="text">Close</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { eraseCookie, getCookie, setCookie } from "../utils/CookieUtils";
export default defineComponent({
  data() {
    return {
      key: "",
      remember: false,
      savedKey: null as null | string
    };
  },

  props: {
    modelValue: {
      type: Boolean
    }
  },

  emits: ["export"],

  mounted() {
    this.savedKey = getCookie("license-key");
    if (this.savedKey) {
      this.key = this.savedKey;
      this.remember = true;
    }
  },

  methods: {
    exportFU() {
      if (this.remember && this.key && this.key != this.savedKey) {
        setCookie("license-key", this.key, 10 * 365);
      }

      if (!this.remember && this.savedKey) {
        eraseCookie("license-key");
        this.savedKey = "";
      }

      this.$emit("export", this.key);
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
