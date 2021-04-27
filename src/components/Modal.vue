<template>
  <div class="modal" :style="{ display: modelValue ? 'flex' : 'none' }">
    <div class="modalContainer">
      <h1 v-if="title">
        <span class="material-icons" v-if="icon">{{ icon }}</span> {{ title }}
      </h1>
      <slot></slot>
      <div class="action-row" v-if="closeBtn">
        <div class="btn close" @click="$emit('update:modelValue', false)">
          <span class="text">Okay</span>
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
    modelValue: {
      type: Boolean
    },
    closeBtn: {
      type: Boolean,
      default: false
    },
    icon: {
      type: String
    },
    title: {
      type: String
    }
  }
});
</script>

<style lang="scss" scoped>
.modal {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  backdrop-filter: blur(5px);
  justify-content: center;
  align-items: center;

  .modalContainer {
    padding: 30px;
    box-shadow: $shadow;
    background-color: $dark1;
    max-width: 30vw;
    color: $light2;

    h1 {
      margin: 0;

      .material-icons {
        // color: $green;
      }
    }

    i {
      color: $light3;
    }

    .action-row {
      display: flex;
      padding-top: 10px;
      justify-content: space-between;

      .close {
        background-color: transparent;
        border: 1px solid transparentize($color: $blue, $amount: 0.2);
        color: transparentize($color: $blue, $amount: 0.2);

        &:hover {
          border: 1px solid $blue;
          color: $blue;
        }
      }
    }
  }
}
</style>
