export interface ListItem {
  id: string;
  icon: string;
  hideable: boolean;
  isGroup: () => this is ListItemGroup;
  toJson: () => string;
  duplicate: () => ListItem | null;
}

export interface ListItemGroup extends ListItem {
  getItems: () => ListItem[];
  isCheck: boolean;
  itemLimit?: number;
}
