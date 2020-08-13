export interface ListItem {
  id?: string;
  icon: string;
  isGroup: () => this is ListItemGroup;
  toJson: () => string;
  duplicate: () => ListItem | null;
}

export interface ListItemGroup extends ListItem {
  getItems: () => ListItem[];
  removeItem: (item: ListItem) => void; //TODO remove
}
