import React from "react";
import "./App.scss";
import buildProductsClient from "./clients/productClient/productClient";
import ProductList from "./product-list/productList";
import ProductDetail from "./product-detail/productDetail";
import axiosProvider from "./services/providers/axiosProvider";
import {
  Route,
  Redirect,
  Switch,
  useLocation,
  useHistory,
} from "react-router-dom";
import Header from "./components/Header/header";
import { IProductList } from "./services/types/ProductList";
import RoutesDefinition from "./services/constants/urls";

function getSearchFromURL(url: string) {
  const urlParams = new URLSearchParams(url);
  return urlParams.get("search") as string;
}

function App() {
  const productClient = buildProductsClient(axiosProvider);
  const [items, setItems] = React.useState<IProductList>();
  const { search } = useLocation();
  const history = useHistory();

  React.useEffect(() => {
    getProducts(getSearchFromURL(search), false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function getProducts(finderValue?: string, shouldRedirect = true) {
    setItems(undefined);
    try {
      if (shouldRedirect) {
        const filter = !!finderValue ? `?search=${finderValue}` : "";
        history.push(`${RoutesDefinition.BASE_PATH}${filter}`);
      }
      const returnedItems = await productClient.getProducts(finderValue);
      setItems(returnedItems);
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <div className="App full-height">
      <Header getProductsEmitter={getProducts} />
      <Switch>
        <Redirect exact from="/" to={RoutesDefinition.BASE_PATH} />
        <Route
          exact
          path={RoutesDefinition.BASE_PATH}
          render={() => <ProductList items={items as IProductList} />}
        />
        <Route
          exact
          path={RoutesDefinition.DETAIL}
          render={() => <ProductDetail productClient={productClient} />}
        />
      </Switch>
    </div>
  );
}

export default App;
