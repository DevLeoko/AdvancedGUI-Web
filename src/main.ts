/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApp } from "vue";
import App from "./App.vue";
import { registerDefaultFonts } from "./utils/manager/FontManager";

registerDefaultFonts();

createApp(App).mount("#app");
