import React from "react";
import { useForm } from "react-hook-form";
import "./Header.scss";
import searchLogo from "./../../assets/icons/icon_search.png";
import logo from "./../../assets/icons/logo.png";

interface Props {
  getProductsEmitter: (finderValue?: string) => void;
}

const Header: React.FC<Props> = ({ getProductsEmitter }) => {
  const { register, handleSubmit } = useForm();

  const onSubmit = (data: { finder: string }) =>
    getProductsEmitter(data.finder);

  return (
    <header className="App-header bg-yellow flex justify-center available-width">
      <div className="Finder-wrapper max-width-1400 full-width">
        <img
          src={logo}
          alt="Logo de mercadolibre"
          className="Header-logo cursor-pointer max-height-40 mt8 mb8"
          onClick={() => getProductsEmitter()}
        />
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="Header-finder flex full-height items-center"
        >
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Nunca dejes de buscar"
              {...register("finder")}
            />
            <div
              className="input-group-append cursor-pointer"
              onClick={() => handleSubmit(onSubmit)()}
            >
              <span className="input-group-text" id="basic-addon2">
                <img
                  src={searchLogo}
                  alt="Finder logo"
                  className="Finder-icon"
                />
              </span>
            </div>
          </div>
        </form>
      </div>
    </header>
  );
};

export default Header;
