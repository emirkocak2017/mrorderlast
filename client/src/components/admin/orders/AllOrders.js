import React, { Fragment, useContext, useEffect } from "react";
import moment from "moment";

import { OrderContext } from "./index";
import { fetchData, editOrderReq, deleteOrderReq } from "./Actions";

const apiURL = process.env.REACT_APP_API_URL;

const AllOrders = (props) => {
  const { data, dispatch } = useContext(OrderContext);
  const { orders, loading } = data;

  useEffect(() => {
    fetchData(dispatch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
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
    );
  }

  return (
    <Fragment>
      <div className="col-span-1 overflow-auto bg-white shadow-lg p-4">
        <table className="table-auto border w-full my-2">
          <thead>
            <tr>
              <th className="px-4 py-2 border">Ürünler</th>
              <th className="px-4 py-2 border">Durum</th>
              <th className="px-4 py-2 border">Toplam</th>
              <th className="px-4 py-2 border">İşlem ID</th>
              <th className="px-4 py-2 border">Müşteri</th>
              <th className="px-4 py-2 border">Email</th>
              <th className="px-4 py-2 border">Telefon</th>
              <th className="px-4 py-2 border">Adres</th>
              <th className="px-4 py-2 border">Oluşturulma</th>
              <th className="px-4 py-2 border">Güncelleme</th>
              <th className="px-4 py-2 border">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {orders && orders.length > 0 ? (
              orders.map((item, i) => {
                return (
                  <OrderTable
                    key={i}
                    order={item}
                    editOrder={(oId, type, status) =>
                      editOrderReq(oId, type, status, dispatch)
                    }
                  />
                );
              })
            ) : (
              <tr>
                <td
                  colSpan="12"
                  className="text-xl text-center font-semibold py-8"
                >
                  Sipariş bulunamadı
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="text-sm text-gray-600 mt-2">
          Toplam {orders && orders.length} sipariş
        </div>
      </div>
    </Fragment>
  );
};

/* Tekil Sipariş Bileşeni (OrderTable) */
const OrderTable = ({ order, editOrder }) => {
  const { dispatch } = useContext(OrderContext);

  return (
    <Fragment>
      <tr className="border-b">
        <td className="w-48 hover:bg-gray-200 p-2 flex flex-col space-y-1">
          {/* HATA ÇÖZÜMÜ BURADA */}
          {order.allProduct.map((product, i) => {
            // Güvenli Resim Kaynağı Oluşturma
            // product.id?.pImages?.[0] yapısı verinin null olup olmadığını kontrol eder.
            // Eğer veri yoksa kod patlamaz, sadece undefined döner.
            const hasProduct = product && product.id;
            const hasImage = hasProduct && product.id.pImages && product.id.pImages.length > 0;
            
            return (
              <span className="block flex items-center space-x-2" key={i}>
                {hasImage ? (
                  <img
                    className="w-8 h-8 object-cover object-center"
                    src={`${apiURL}/uploads/products/${product.id.pImages[0]}`}
                    alt="productImage"
                  />
                ) : (
                  // Resim veya Ürün Yoksa Gösterilecek Kutu
                  <span className="w-8 h-8 bg-gray-300 flex items-center justify-center text-xs text-red-500 font-bold">
                    X
                  </span>
                )}
                
                <span className="text-sm">
                  {hasProduct ? product.id.pName : <span className="text-red-500">Silinmiş Ürün</span>}
                </span>
                <span className="text-xs text-gray-600">({product.quantitiy}x)</span>
              </span>
            );
          })}
        </td>

        <td className="hover:bg-gray-200 p-2 text-center cursor-default">
          {order.status === "Not processed" && (
            <span className="block text-red-600 rounded-full text-center text-xs px-2 font-semibold">
              {order.status}
            </span>
          )}
          {order.status === "Processing" && (
            <span className="block text-yellow-600 rounded-full text-center text-xs px-2 font-semibold">
              {order.status}
            </span>
          )}
          {order.status === "Shipped" && (
            <span className="block text-blue-600 rounded-full text-center text-xs px-2 font-semibold">
              {order.status}
            </span>
          )}
          {order.status === "Delivered" && (
            <span className="block text-green-600 rounded-full text-center text-xs px-2 font-semibold">
              {order.status}
            </span>
          )}
          {order.status === "Cancelled" && (
            <span className="block text-red-600 rounded-full text-center text-xs px-2 font-semibold">
              {order.status}
            </span>
          )}
        </td>
        <td className="hover:bg-gray-200 p-2 text-center">
          {order.amount}₺
        </td>
        <td className="hover:bg-gray-200 p-2 text-center">
          {order.transactionId}
        </td>
        {/* Kullanıcı Silinmişse Koruma */}
        <td className="hover:bg-gray-200 p-2 text-center">
            {order.user ? order.user.name : <span className="text-red-500">Silinmiş Kullanıcı</span>}
        </td>
        <td className="hover:bg-gray-200 p-2 text-center">
            {order.user ? order.user.email : "-"}
        </td>
        <td className="hover:bg-gray-200 p-2 text-center">{order.phone}</td>
        <td className="hover:bg-gray-200 p-2 text-center">{order.address}</td>
        <td className="hover:bg-gray-200 p-2 text-center">
          {moment(order.createdAt).format("lll")}
        </td>
        <td className="hover:bg-gray-200 p-2 text-center">
          {moment(order.updatedAt).format("lll")}
        </td>
        <td className="p-2 flex items-center justify-center">
          <span
            onClick={(e) => editOrder(order._id, true, order.status)}
            className="cursor-pointer hover:bg-gray-200 rounded-lg p-2 mx-1"
          >
            <svg
              className="w-6 h-6 fill-current text-green-500"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
              <path
                fillRule="evenodd"
                d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
                clipRule="evenodd"
              />
            </svg>
          </span>
          <span
            onClick={(e) => deleteOrderReq(order._id, dispatch)}
            className="cursor-pointer hover:bg-gray-200 rounded-lg p-2 mx-1"
          >
            <svg
              className="w-6 h-6 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </span>
        </td>
      </tr>
    </Fragment>
  );
};

export default AllOrders;