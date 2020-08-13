export interface Action {
  name: string;
  toJson(): string;
}
