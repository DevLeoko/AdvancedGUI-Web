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
  expanded: boolean;
  itemLimit?: number;
  itemClasses?: string[];
}
