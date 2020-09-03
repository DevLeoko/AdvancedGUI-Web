import { JsonObject } from "../ComponentManager";

export interface Check {
  name: string;
  toCheckDataObj(): JsonObject;
}
