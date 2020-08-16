export interface ListItem {
  id: string;
  icon: string;
  hideable: boolean;
  delete: () => void;
  isGroup: () => this is ListItemGroup;
  toJson: () => string;
  duplicate: () => ListItem | null;
}

export interface ListItemGroup extends ListItem {
  getItems: () => ListItem[];
  itemLimit?: number;
  itemClasses?: string[];
}
