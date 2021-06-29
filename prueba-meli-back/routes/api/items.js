const express = require("express");
var request = require("request");
var axios = require("axios");
const constants = require("./../../constants/constants");

function getMostOccurrences(array) {
  return array
    .sort(
      (a, b) =>
        array.filter((v) => v === a).length -
        array.filter((v) => v === b).length
    )
    .reverse();
}

function removeRepeatedItems(array) {
  return Array.from(new Set(array));
}

function itemsApi(app) {
  const router = express.Router();
  app.use("/api/items", router);

  // Calcular cuántos decimales tiene el precio
  Number.prototype.countDecimals = function () {
    if (Math.floor(this.valueOf()) === this.valueOf()) return 0;
    return this.toString().split(".")[1].length || 0;
  };

  router.get("/", async function (req, res, next) {
    const { q } = req.query;

    try {
      request(
        `https://api.mercadolibre.com/sites/MLA/search?q=${q}`,
        function (error, response, body) {
          const items = JSON.parse(body);

          // Sólo retornar los 4 primeros productos
          items.results = items.results.slice(0, 4);

          // Crear un arreglo con todos los category_id
          const allCategories = items.results.reduce(
            (categories, product) => [...categories, product.category_id],
            []
          );

          // Ordenar por categorias más repetidas
          const sortedAndUnrepeatedCategories = removeRepeatedItems(
            getMostOccurrences(allCategories)
          );

          /*
            transformar 
            [                                 [
              'MLA4599',                        'https://api.mercadolibre.com/categories/MLA4599',
              'MLA1645',       en ==>           'https://api.mercadolibre.com/categories/MLA1645',
              'MLA1612',                        'https://api.mercadolibre.com/categories/MLA1612',
              'MLA401457'                       'https://api.mercadolibre.com/categories/MLA401457'
            ]                                 ]
          */
          const URLs = sortedAndUnrepeatedCategories.map(
            (category) => `https://api.mercadolibre.com/categories/${category}`
          );

          function getCategoryNames(urls) {
            return Promise.all(urls.map(fetchData));
          }

          function fetchData(URL) {
            return axios
              .get(URL)
              .then(function (response) {
                return response.data.name;
              })
              .catch(function (error) {
                return { success: false };
              });
          }

          /*
            Transformar 
              [                                [
                'MLA4599',                        'Eléctricas',
                'MLA1645',       en ==>           'Ventiladores',
                'MLA1612',                        'Colchones',
                'MLA401457'                       'Aspiradoras Robot'
              ]                                 ]
          */

          getCategoryNames(URLs)
            .then((categoryNames) => {
              const infoItems = items.results.map((item) => ({
                id: item.id,
                title: item.title,
                price: {
                  currency: item.currency_id,
                  amount: item.price,
                  decimals: item.price.countDecimals(),
                },
                picture: item.thumbnail,
                condition: item.condition,
                free_shipping: item.shipping.free_shipping,
                location: item.address.city_name,
              }));

              res.status(200).json({
                items: infoItems,
                results: [...items.results],
                author: constants.author,
                categories: categoryNames,
              });
            })
            .catch((e) => {
              console.log(e);
            });
        }
      );
    } catch (err) {
      next(err);
    }
  });

  router.get("/:id", async function (req, res, next) {
    const { id } = req.params;

    try {
      /*
            transformar 
                                              [
                                                'https://api.mercadolibre.com/items/MLA1645',
              'MLA1645',       en ==>           'https://api.mercadolibre.com/items/MLA1645/description',
                                              ]
          */
      const URLs = [
        `https://api.mercadolibre.com/items/${id}`,
        `https://api.mercadolibre.com/items/${id}/description`,
      ];

      function getItemDetails(urls) {
        return Promise.all(urls.map(fetchData));
      }

      function fetchData(URL) {
        return axios
          .get(URL)
          .then(function (response) {
            console.log(response);
            return response.data;
          })
          .catch(function (error) {
            return { success: false };
          });
      }

      getItemDetails(URLs)
        .then((resp) => {
          const item = resp[0];
          const description = resp[1];

          axios
            .get(`https://api.mercadolibre.com/categories/${item.category_id}`)
            .then(function (response) {
              res.status(200).json({
                item: {
                  id: item.id,
                  title: item.title,
                  price: {
                    currency: item.currency_id,
                    amount: item.price,
                    decimals: item.price.countDecimals(),
                  },
                  picture: item.thumbnail,
                  condition: item.condition,
                  sold_quantity: item.sold_quantity,
                  description: description.plain_text,
                  category: response.data.name
                },
                author: constants.author,
              });
            })
            .catch(function (error) {
              return { success: false };
            });
        })
        .catch((e) => {
          console.log(e);
        });
    } catch (err) {
      next(err);
    }
  });

  // router.get("/:productId", async function (req, res, next) {
  //   cacheResponse(res, SIXTY_MINUTES_IN_SECONDS);
  //   const { productId } = req.params;

  //   try {
  //     const product = await productService.getProduct({ productId });

  //     res.status(200).json({
  //       data: product,
  //       message: "product retrieved",
  //     });
  //   } catch (err) {
  //     next(err);
  //   }
  // });

  // router.post(
  //   "/",
  //   validation(createProductSchema),
  //   async function (req, res, next) {
  //     const { body: product } = req;

  //     try {
  //       const createdProduct = await productService.createProduct({ product });

  //       res.status(201).json({
  //         data: createdProduct,
  //         message: "product created",
  //       });
  //     } catch (err) {
  //       next(err);
  //     }
  //   }
  // );

  // router.post(
  //   "/availability",
  //   validation(getProductByISBNSchema),
  //   async function (req, res, next) {
  //     const { body: product } = req;

  //     try {
  //       const returnedProduct = await productService.getProductByISBN(product.isbn);
  //       res.status(201).json({
  //         isAvailable: !returnedProduct._id,
  //       });
  //     } catch (err) {
  //       next(err);
  //     }
  //   }
  // );

  // router.put(
  //   "/:productId",
  //   passport.authenticate("jwt", { session: false }),
  //   validation({ productId: productIdSchema }, "params"),
  //   validation(updateProductSchema),
  //   async function (req, res, next) {
  //     const { productId } = req.params;
  //     const { body: product } = req;

  //     try {
  //       const updatedProduct = await productService.updateProduct({
  //         productId,
  //         product,
  //       });
  //       res.status(200).json({
  //         data: updatedProduct,
  //         message: "product updated",
  //       });
  //     } catch (err) {
  //       next(err);
  //     }
  //   }
  // );

  // router.delete(
  //   "/:productId",
  //   passport.authenticate("jwt", { session: false }),
  //   async function (req, res, next) {
  //     const { productId } = req.params;

  //     try {
  //       const deletedProduct = await productService.deleteProduct({
  //         productId,
  //       });

  //       res.status(200).json({
  //         data: deletedProduct,
  //         message: "product deleted",
  //       });
  //     } catch (err) {
  //       next(err);
  //     }
  //   }
  // );
}

module.exports = itemsApi;
