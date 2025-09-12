export interface Board {
  id: number;
  name: string;
  color: string;
}

export interface BoardWithColumnsAndItems extends Board {
  columns: Column[]
  items: Item[]
}

export interface Column {
  id: number;
  name: string;
  order: number;
}

export interface Item {
  id: number;
  column_id: number
  title: string;
  content: string | null;
  order: number;
}
