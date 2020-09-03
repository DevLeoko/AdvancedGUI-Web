<template>
  <div
    class="loadingPrompt"
    :style="{
      display:
        loading.loading || loading.error || loading.info ? 'flex' : 'none'
    }"
  >
    <span v-if="loading.loading" class="material-icons spin">
      autorenew
    </span>
    <div v-else-if="loading.error" class="errorScreen">
      <h1>
        <span class="material-icons">warning</span> Something went wrong :(
      </h1>
      <p>
        {{ loading.error }}
      </p>
      <div class="action-row">
        <div class="btn close" @click="loading.error = null">
          <span class="text">Close</span>
        </div>
      </div>
    </div>
    <div v-else class="infoScreen">
      <p>
        <span class="material-icons">info</span>
        <span v-html="loading.info"> </span>
      </p>
      <div class="action-row">
        <div class="btn close" @click="loading.info = null">
          <span class="text">Close</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

const loadingContainer = {
  loading: false,
  error: null as string | null,
  info: null as string | null
};

export function loading(val: boolean) {
  loadingContainer.loading = val;
}

export function info(val: string, keepLoadingState = false) {
  if (!keepLoadingState) loadingContainer.loading = false;
  loadingContainer.info = val;
}

export function error(val: string) {
  loadingContainer.loading = false;
  loadingContainer.error = val;
}

export default Vue.extend({
  data() {
    return {
      loading: loadingContainer
    };
  }
});
</script>

<style lang="scss" scoped>
.loadingPrompt {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  backdrop-filter: blur(5px);
  justify-content: center;
  align-items: center;

  .errorScreen,
  .infoScreen {
    padding: 30px;
    box-shadow: $shadow;
    background-color: $dark1;
    max-width: 30vw;
    color: $light2;

    h1 {
      margin: 0;
      font-size: 22px;
      display: flex;
      align-items: center;

      .material-icons {
        font-size: 24px;
        color: $red;
        margin-right: 10px;
      }
    }

    i {
      color: $light3;
    }

    .action-row {
      padding-top: 5px;
      display: flex;
      justify-content: center;

      .export {
        background-color: $green;
        color: $dark2;
      }

      .close {
        background-color: transparent;
        border: 1px solid transparentize($color: $light2, $amount: 0.2);
        color: transparentize($color: $light2, $amount: 0.2);

        &:hover {
          border: 1px solid $light2;
          color: $light2;
        }
      }
    }
  }

  .infoScreen {
    min-width: 20vw;

    p {
      display: flex;
      align-items: center;
      margin: 0 0 20px;
    }

    .material-icons {
      color: $blue;
      margin-right: 10px;
    }
  }

  .spin {
    font-size: 40px;
    animation-name: spin;
    animation-duration: 1.2s;
    animation-iteration-count: infinite;
    cursor: default;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }

    100% {
      transform: rotate(360deg);
    }
  }
}
</style>
