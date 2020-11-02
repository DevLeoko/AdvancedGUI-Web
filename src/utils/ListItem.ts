export interface ListItem {
  id: string;
  icon: string;
  name: string;
  hideable: boolean;
  delete: () => void;
  isGroup: () => this is ListItemGroup<this>;
  toJson: () => string;
  duplicate: () => ListItem | null;
}

export interface ListItemGroup<T extends ListItem> extends ListItem {
  getItems: () => T[];
  expanded: boolean;
  itemLimit?: number;
  itemClasses?: string[];
}

export function traverseTree<T extends ListItem>(
  root: T,
  callback: (component: T) => void
) {
  callback(root);

  if (root.isGroup()) {
    root.getItems().forEach((comp: T) => traverseTree(comp, callback));
  }
}
