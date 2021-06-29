import HttpProvider from '../../services/providers/httpProvider';
import { IProductList } from '../../services/types/ProductList';

export interface IProductClient {
    getProducts: (finderValue?: string) => Promise<IProductList>;
    getProduct: (itemId: string) => Promise<any>;
}

const buildProductsClient = (httpProvider: HttpProvider): IProductClient => {
    const headers = {
        'Content-Type': 'application/json',
    };

    const getProducts = (finderValue?: string) => {
        const filter = !!finderValue ? `?q=${finderValue}` : '';
        return httpProvider.get<IProductList>(
            `http://localhost:8000/api/items${filter}`,
            headers,
        );
    };

    const getProduct = (itemId: string) => {
        return httpProvider.get<void>(
            `http://localhost:8000/api/items/${itemId}`,
            headers,
        );
    };

    return {
        getProducts,
        getProduct
    };
};

export default buildProductsClient;