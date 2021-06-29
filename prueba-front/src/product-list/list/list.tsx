import React from "react";
import { useHistory } from "react-router-dom";
import RoutesDefinition from "../../services/constants/urls";
import { IProductList } from "../../services/types/ProductList";
import freeShippingLogo from "./../../assets/icons/icon_shipping.png";
import "./List.scss";

interface Props {
  items: IProductList;
}

const List: React.FC<Props> = ({ items }) => {
  const history = useHistory();

  function numberWithCommas(x: any): string {
    if (!x) return "";
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  return (
    <div className="List flex available-width justify-center">
      <div className="List-wrapper bg-light-gray max-width-1400 full-width mt12 flex flex-column">
        <p className="Breadcrumb m0">{items?.categories[0]}</p>
        <div className="List-items bg-white rounded">
          {items?.items.map((item) => (
            <div
              key={`item-${item.id}`}
              className="Item p16 cursor-pointer flex"
              onClick={() =>
                history.push(`${RoutesDefinition.BASE_PATH}/${item.id}`)
              }
            >
              <img
                src={`${item.picture}`}
                alt="Imagen del producto"
                className="rounded"
              />
              <div className="flex flex-column ml16 full-width">
                <div className="Price-grid flex items-center justify-between">
                  <p className="m0 mt12 font-size-24 flex items-center">
                    $ {numberWithCommas(item.price.amount)}{" "}
                    {item.free_shipping && (
                      <img
                        src={freeShippingLogo}
                        alt="Icono de envio gratis"
                        className="max-width-16 max-height-16 ml8"
                      />
                    )}
                  </p>
                  <p className="Location m0 mt12 text-gray">{item.location}</p>
                </div>
                <p className="m0 text-dark-gray max-width-584">{item.title}</p>
                <p className="m0 text-gray">{item.condition}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default List;
