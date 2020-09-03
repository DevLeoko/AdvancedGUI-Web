/* eslint-disable @typescript-eslint/no-explicit-any */
import Vue from "vue";
import App from "./App.vue";
import { setup as componentSetup } from "./utils/manager/ComponentManager";
import { setup as actionSetup } from "./utils/manager/ActionManager";
import { setup as checkSetup } from "./utils/manager/CheckManager";
import { registerDefaultFonts } from "./utils/manager/FontManager";

Vue.config.productionTip = false;

registerDefaultFonts();
componentSetup();
checkSetup();
actionSetup();

new Vue({
  render: h => h(App)
}).$mount("#app");
