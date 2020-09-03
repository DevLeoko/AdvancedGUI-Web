/* eslint-disable @typescript-eslint/no-explicit-any */
import Vue from "vue";
import App from "./App.vue";
import { setup as componentSetup } from "./utils/ComponentManager";
import { setup as actionSetup } from "./utils/ActionManager";
import { setup as checkSetup } from "./utils/CheckManager";
import { registerDefaultFonts } from "./utils/FontManager";

Vue.config.productionTip = false;

registerDefaultFonts();
componentSetup();
checkSetup();
actionSetup();

new Vue({
  render: h => h(App)
}).$mount("#app");
