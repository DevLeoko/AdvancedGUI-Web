import { JsonObject } from "../manager/ComponentManager";

export interface Check {
  name: string;
  toCheckDataObj(): JsonObject;
}
