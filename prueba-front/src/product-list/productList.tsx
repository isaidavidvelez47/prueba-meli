import React from "react";
import { IProductList } from "../services/types/ProductList";
import List from "./list/list";

interface Props {
  items: IProductList;
}

const ProductList: React.FC<Props> = ({ items }) => {
  return (
    <>
      <List items={items as IProductList} />
    </>
  );
};

export default ProductList;
