<template>
  <div class="exportPrompt" :style="{ display: value ? 'flex' : 'none' }">
    <div class="exportPromptContainer">
      <h1><span class="material-icons">get_app</span> Export for usage</h1>
      <p>
        Click below to download the AdvancedGUI file that you can use with our
        plugin. Rename the file to the Layout-Name you want to use in-game (<i
          >e.g. SeverSelector.json</i
        >) and place it in the <i>layouts/</i>-folder. Make sure to also
        download a savepoint as you will
        <b>not be able to import this file back into the editor!</b>
      </p>
      <div class="action-row">
        <div class="btn export" @click="$emit('export')">
          <span class="material-icons">get_app</span>
          <span class="text">Export</span>
        </div>

        <div class="btn close" @click="$emit('input', false)">
          <span class="text">Close</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  data() {
    return {};
  },

  props: {
    value: {
      type: Boolean
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
