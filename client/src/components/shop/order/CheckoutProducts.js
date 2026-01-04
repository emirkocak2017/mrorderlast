import React, { Fragment, useEffect, useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import { LayoutContext } from "../layout";
import { subTotal, quantity, totalCost } from "../partials/Mixins";

import { cartListProduct } from "../partials/FetchApi";
import { getBrainTreeToken, getPaymentProcess } from "./FetchApi";
import { fetchData, fetchbrainTree, pay } from "./Action";

import DropIn from "braintree-web-drop-in-react";

const apiURL = process.env.REACT_APP_API_URL;

export const CheckoutComponent = (props) => {
  const history = useHistory();
  const { data, dispatch } = useContext(LayoutContext);

  const [state, setState] = useState({
    address: "",
    phone: "",
    error: false,
    success: false,
    clientToken: null,
    instance: {},
    couponCode: "",
    couponApplied: false,
    discount: 0,
  });

  useEffect(() => {
    fetchData(cartListProduct, dispatch);
    fetchbrainTree(getBrainTreeToken, setState);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (data.loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <svg
          className="w-12 h-12 animate-spin text-gray-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          ></path>
        </svg>
        Lütfen bekleyiniz...
      </div>
    );
  }
  return (
    <Fragment>
      <section className="mx-4 mt-20 md:mx-12 md:mt-32 lg:mt-24">
        <div className="text-2xl mx-2">Sipariş</div>
        {/* urun listesi */}
        <div className="flex flex-col md:flex md:space-x-2 md:flex-row">
          <div className="md:w-1/2">
            <CheckoutProducts products={data.cartProduct} />
          </div>
          <div className="w-full order-first md:order-last md:w-1/2">
            {state.clientToken !== null ? (
              <Fragment>
                <div
                  onBlur={(e) => setState({ ...state, error: false })}
                  className="p-4 md:p-8"
                >
                  {state.error ? (
                    <div className="bg-red-200 py-2 px-4 rounded">
                      {state.error}
                    </div>
                  ) : (
                    ""
                  )}
                  <div className="flex flex-col py-2">
                    <label htmlFor="address" className="pb-2">
                      Teslimat Adresi
                    </label>
                    <input
                      value={state.address}
                      onChange={(e) =>
                        setState({
                          ...state,
                          address: e.target.value,
                          error: false,
                        })
                      }
                      type="text"
                      id="address"
                      className="border px-4 py-2"
                      placeholder="Adres..."
                    />
                  </div>
                  <div className="flex flex-col py-2 mb-2">
                    <label htmlFor="phone" className="pb-2">
                      Telefon
                    </label>
                    <input
                      value={state.phone}
                      onChange={(e) =>
                        setState({
                          ...state,
                          phone: e.target.value,
                          error: false,
                        })
                      }
                      type="number"
                      id="phone"
                      className="border px-4 py-2"
                      placeholder="+90 555 123 45 67"
                    />
                  </div>
                  {/* indirim kodu */}
                  <div className="flex flex-col py-2 mb-2">
                    <label htmlFor="coupon" className="pb-2">
                      İndirim Kodu
                    </label>
                    <div className="flex space-x-2">
                      <input
                        value={state.couponCode}
                        onChange={(e) =>
                          setState({
                            ...state,
                            couponCode: e.target.value.toUpperCase(),
                            error: false,
                          })
                        }
                        type="text"
                        id="coupon"
                        className="border px-4 py-2 flex-1"
                        placeholder="İndirim kodu girin"
                        disabled={state.couponApplied}
                      />
                      {!state.couponApplied ? (
                        <button
                          onClick={() => {
                            if (state.couponCode === "HOSGELDIN20") {
                              const total = totalCost();
                              const discount = total * 0.2;
                              setState({
                                ...state,
                                couponApplied: true,
                                discount: discount,
                                success: "İndirim kodu başarıyla uygulandı!",
                              });
                            } else if (state.couponCode) {
                              setState({
                                ...state,
                                error: "Geçersiz indirim kodu",
                              });
                            }
                          }}
                          className="px-4 py-2 bg-gray-800 text-white hover:bg-gray-700"
                        >
                          Uygula
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setState({
                              ...state,
                              couponCode: "",
                              couponApplied: false,
                              discount: 0,
                            });
                          }}
                          className="px-4 py-2 bg-red-600 text-white hover:bg-red-700"
                        >
                          Kaldır
                        </button>
                      )}
                    </div>
                    {state.couponApplied && (
                      <div className="text-green-600 text-sm mt-1">
                        %20 indirim uygulandı! (-{state.discount.toFixed(2)}₺)
                      </div>
                    )}
                  </div>
                  {/* toplam fiyat gosterimi */}
                  {state.couponApplied && (
                    <div className="mb-2 p-3 bg-gray-50 rounded">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Ara Toplam:</span>
                        <span>{totalCost().toFixed(2)}₺</span>
                      </div>
                      <div className="flex justify-between text-sm mb-1 text-green-600">
                        <span>İndirim:</span>
                        <span>-{state.discount.toFixed(2)}₺</span>
                      </div>
                      <div className="flex justify-between font-bold border-t pt-1">
                        <span>Toplam:</span>
                        <span>{(totalCost() - state.discount).toFixed(2)}₺</span>
                      </div>
                    </div>
                  )}
                  <DropIn
                    options={{
                      authorization: state.clientToken,
                      paypal: {
                        flow: "vault",
                      },
                    }}
                    onInstance={(instance) => (state.instance = instance)}
                  />
                  <div
                    onClick={(e) =>
                      pay(
                        data,
                        dispatch,
                        state,
                        setState,
                        getPaymentProcess,
                        totalCost,
                        history,
                        state.discount
                      )
                    }
                    className="w-full px-4 py-2 text-center text-white font-semibold cursor-pointer"
                    style={{ background: "#303031" }}
                  >
                    Ödeme Yap
                  </div>
                </div>
              </Fragment>
            ) : (
              <div className="flex items-center justify-center py-12">
                <svg
                  className="w-12 h-12 animate-spin text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  ></path>
                </svg>
              </div>
            )}
          </div>
        </div>
      </section>
    </Fragment>
  );
};

const CheckoutProducts = ({ products }) => {
  const history = useHistory();

  return (
    <Fragment>
      <div className="grid grid-cols-2 md:grid-cols-1">
        {products !== null && products.length > 0 ? (
          products.map((product, index) => {
            // guvenli erisim: ?. operatoru (optional chaining)
            if (!product) {
              return (
                <div
                  key={index}
                  className="col-span-1 m-2 md:py-6 md:border-t md:border-b md:my-2 md:mx-0 md:flex md:items-center md:justify-between"
                >
                  <div className="md:flex md:items-center md:space-x-4">
                    <span className="text-red-500">Silinmiş Ürün</span>
                  </div>
                </div>
              );
            }
            
            const pImages = product?.pImages;
            const pName = product?.pName;
            const pPrice = product?.pPrice;
            const productId = product?._id;
            
            return (
              <div
                key={index}
                className="col-span-1 m-2 md:py-6 md:border-t md:border-b md:my-2 md:mx-0 md:flex md:items-center md:justify-between"
              >
                <div className="md:flex md:items-center md:space-x-4">
                  {pImages && Array.isArray(pImages) && pImages.length > 0 && pImages[0] ? (
                    <img
                      onClick={(e) => productId && history.push(`/products/${productId}`)}
                      className="cursor-pointer md:h-20 md:w-20 object-cover object-center"
                      src={`${apiURL}/uploads/products/${pImages[0]}`}
                      alt="wishListproduct"
                    />
                  ) : (
                    <span className="text-red-500 md:h-20 md:w-20 flex items-center justify-center">Resim Yok</span>
                  )}
                  <div className="text-lg md:ml-6 truncate">
                    {pName || <span className="text-red-500">Deleted Product</span>}
                  </div>
                  <div className="md:ml-6 font-semibold text-gray-600 text-sm">
                    Fiyat : {pPrice || 0}₺
                  </div>
                  <div className="md:ml-6 font-semibold text-gray-600 text-sm">
                    Miktar : {productId ? quantity(productId) : 0}
                  </div>
                  <div className="font-semibold text-gray-600 text-sm">
                    Ara Toplam : {productId && pPrice ? subTotal(productId, pPrice) : 0}₺
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div>Sipariş için ürün bulunamadı</div>
        )}
      </div>
    </Fragment>
  );
};

export default CheckoutProducts;
