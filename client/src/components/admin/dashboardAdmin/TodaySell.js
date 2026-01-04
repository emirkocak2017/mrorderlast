import React, { Fragment, useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import moment from "moment";
import { DashboardContext } from "./";
import { todayAllOrders } from "./Action";

const apiURL = process.env.REACT_APP_API_URL;

const SellTable = () => {
  const history = useHistory();
  const { data, dispatch } = useContext(DashboardContext);

  useEffect(() => {
    todayAllOrders(dispatch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const ordersList = () => {
    let newList = [];
    // Güvenli Erişim: Orders null/undefined ise forEach çağrılmaz
    if (data.totalOrders?.Orders && Array.isArray(data.totalOrders.Orders)) {
      data.totalOrders.Orders.forEach(function (elem) {
        // Eğer elem null ise veya createdAt yoksa, atla
        if (elem && elem.createdAt) {
          if (moment(elem.createdAt).format("LL") === moment().format("LL")) {
            newList = [...newList, elem];
          }
        }
      });
    }
    return newList;
  };

  return (
    <Fragment>
      <div className="col-span-1 overflow-auto bg-white shadow-lg p-4">
        <div className="text-2xl font-semibold mb-6 text-center">
          Bugünün Siparişleri{" "}
          {data.totalOrders.Orders !== undefined ? ordersList().length : 0}
        </div>
        <table className="table-auto border w-full my-2">
          <thead>
            <tr>
              <th className="px-4 py-2 border">Ürünler</th>
              <th className="px-4 py-2 border">Resim</th>
              <th className="px-4 py-2 border">Durum</th>
              <th className="px-4 py-2 border">Sipariş Adresi</th>
              <th className="px-4 py-2 border">Sipariş Tarihi</th>
            </tr>
          </thead>
          <tbody>
            {data.totalOrders.Orders !== undefined ? (
              ordersList().map((item, key) => {
                return <TodayOrderTable order={item} key={key} />;
              })
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="text-xl text-center font-semibold py-8"
                >
                  Bugün sipariş bulunamadı
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="text-sm text-gray-600 mt-2">
          Toplam{" "}
          {data.totalOrders.Orders !== undefined ? ordersList().length : 0}{" "}
          sipariş bulundu
        </div>
        <div className="flex justify-center">
          <span
            onClick={(e) => history.push("/admin/dashboard/orders")}
            style={{ background: "#303031" }}
            className="cursor-pointer px-4 py-2 text-white rounded-full"
          >
            Tümünü Görüntüle
          </span>
        </div>
      </div>
    </Fragment>
  );
};

const TodayOrderTable = ({ order }) => {
  return (
    <Fragment>
      <tr>
        <td className="w-48 hover:bg-gray-200 p-2 flex flex-col space-y-1">
          {order.allProduct?.map((item, index) => {
            // Güvenli Erişim: ?. operatörü (Optional Chaining)
            
            // Eğer item kendisi null/undefined ise, atla
            if (!item) {
              return (
                <div key={index} className="flex space-x-2">
                  <span className="text-red-500">Deleted Product</span>
                  <span>0x</span>
                </div>
              );
            }
            
            const productId = item?.id;
            const pName = productId?.pName;
            
            // Eğer product.id null ise, silinmiş ürün olarak göster
            if (!productId || productId === null) {
              return (
                <div key={index} className="flex space-x-2">
                  <span className="text-red-500">Deleted Product</span>
                  <span>{item?.quantitiy || 0}x</span>
                </div>
              );
            }
            
            return (
              <div key={index} className="flex space-x-2">
                <span>{pName || <span className="text-red-500">Deleted Product</span>}</span>
                <span>{item?.quantitiy || 0}x</span>
              </div>
            );
          })}
        </td>
        <td className="p-2 text-left">
          {order.allProduct?.map((item, index) => {
            // Güvenli Erişim: ?. operatörü (Optional Chaining)
            
            // Eğer item kendisi null/undefined ise, atla
            if (!item) {
              return (
                <span key={index} className="text-red-500 text-xs">Deleted Product</span>
              );
            }
            
            const productId = item?.id;
            const pImages = productId?.pImages;
            
            // Eğer product.id null ise veya pImages yoksa, placeholder göster
            if (!productId || productId === null || !pImages || !Array.isArray(pImages) || pImages.length === 0 || !pImages[0]) {
              return (
                <span key={index} className="text-red-500 text-xs">Deleted Product</span>
              );
            }
            
            return (
              <img
                key={index}
                className="w-12 h-12 object-cover"
                src={`${apiURL}/uploads/products/${pImages[0]}`}
                alt="Pic"
              />
            );
          })}
        </td>
        <td className="p-2 text-center">
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
        <td className="p-2 text-center">{order.address}</td>
        <td className="p-2 text-center">
          {moment(order.createdAt).format("lll")}
        </td>
      </tr>
    </Fragment>
  );
};

const TodaySell = (props) => {
  return (
    <div className="m-4">
      <SellTable />
    </div>
  );
};

export default TodaySell;
