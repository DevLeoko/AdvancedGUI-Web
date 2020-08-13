/* eslint-disable @typescript-eslint/no-explicit-any */
import Vue from "vue";
import App from "./App.vue";
import { setup } from "./utils/ComponentManager";

Vue.config.productionTip = false;

setup();

new Vue({
  render: h => h(App)
}).$mount("#app");
