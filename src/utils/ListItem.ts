export interface ListItem {
  id: string;
  icon: string;
  isGroup: () => this is ListItemGroup;
}

export interface ListItemGroup extends ListItem {
  getItems: () => ListItem[];
  removeItem: (item: ListItem) => void;
}
