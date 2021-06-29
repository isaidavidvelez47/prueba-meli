import React from "react";
import { useParams } from "react-router-dom";
import { IProductClient } from "../clients/productClient/productClient";
import { IProduct } from "../services/types/ProductList";
import "./ProductDetail.scss";

interface Params {
  id: string;
}

interface Props {
  productClient: IProductClient;
}

const ProductDetail: React.FC<Props> = ({ productClient }) => {
  const [item, setItem] = React.useState<IProduct>();
  const detail = item?.item;
  const params: Params = useParams();

  async function getItemDetail(itemId: string) {
    try {
      const returnedItem = await productClient.getProduct(itemId);
      setItem(returnedItem);
      console.log(returnedItem);
    } catch (error) {
      console.error(error);
    }
  }

  React.useEffect(() => {
    console.log("item", params.id);
    getItemDetail(params.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function numberWithCommas(x: any): string {
    if (!x) return "";
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  return (
    <>
      <div className="Detail flex available-width justify-center">
        {detail && (
          <div className="Detail-wrapper bg-light-gray max-width-1400 full-width mt12 flex flex-column">
            <p className="Breadcrumb m0">{detail.category}</p>
            <div className="Item bg-white rounded p32">
              <div className="Info-section flex mb32">
                <img
                  src={detail.picture}
                  alt="Imagen del producto"
                  className="width-680 rounded"
                />
                <div className="ml24">
                  <p className="font-size-14 mb14">
                    {detail.condition} - {detail.sold_quantity} vendidos
                  </p>
                  <p className="font-size-24 bold title mb32">{detail.title}</p>
                  <p className="font-size-46 flex mb32">
                    ${" "}
                    {numberWithCommas(
                      String(detail.price.amount).split(".").shift()
                    )}
                    {detail.price.decimals > 0 && (
                      <span className="font-size-24 ml4 mt10">
                        {String(detail.price.amount).split(".").pop()}
                      </span>
                    )}
                  </p>
                  <input
                    className="btn btn-primary bg-blue full-width"
                    type="button"
                    value="Comprar"
                  />
                </div>
              </div>
              <div className="Description-section">
                <h3 className="mb32 font-size-28">Descripción del producto</h3>
                <p className="m0 font-size-16 max-width-680 text-gray">
                  {detail.description}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ProductDetail;
