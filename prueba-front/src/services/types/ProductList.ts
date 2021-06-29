export interface Author {
  name: string;
  lastname: string;
}

export interface Price {
  currency: string;
  amount: Number;
  decimals: Number
}

export interface Item {
  id: string;
  title: string;
  price: Price;
  picture: string;
  condition: string;
  free_shipping: Boolean;
  location: string;
}

export interface ItemDetail {
  id: string;
  title: string;
  price: Price;
  picture: string;
  condition: string;
  sold_quantity: Number,
  description: string,
  category: string;
}

export interface IProductList {
  author: Author;
  categories: string[];
  items: Item[]
}

export interface IProduct {
  author: Author;
  item: ItemDetail;
}
