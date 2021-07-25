import { reactive } from "@vue/reactivity";

export interface GeneralSettings {
  width: number;
  height: number;
  zoom: number;
  projectName: string;
}

export const settings = reactive({
  width: 3,
  height: 2,
  zoom: 2,
  projectName: "Starter"
} as GeneralSettings);
