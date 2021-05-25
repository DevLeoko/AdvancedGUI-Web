import { Ref } from "@vue/reactivity";

export type VueRef<R extends Ref> = R["value"];

export function vueRef<R extends Ref>(ref: R): VueRef<typeof ref> {
  return ref;
}
