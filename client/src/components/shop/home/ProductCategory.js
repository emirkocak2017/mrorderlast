import React, { Fragment, useContext, useState } from "react";
import ProductCategoryDropdown from "./ProductCategoryDropdown";
import { HomeContext } from "./index";
import { getAllProduct } from "../../admin/products/FetchApi";

const ProductCategory = (props) => {
  const { data, dispatch } = useContext(HomeContext);
  const [sort, setSort] = useState('newest');

  const handleSortChange = async (e) => {
    const newSort = e.target.value;
    setSort(newSort);
    dispatch({ type: "loading", payload: true });
    try {
      let responseData = await getAllProduct(newSort);
      if (responseData && responseData.Products) {
        dispatch({ type: "setProducts", payload: responseData.Products });
        dispatch({ type: "loading", payload: false });
      }
    } catch (error) {
      console.log(error);
      dispatch({ type: "loading", payload: false });
    }
  };

  return (
    <Fragment>
      <div className="flex justify-between font-medium">
        <div
          onClick={(e) =>
            dispatch({
              type: "categoryListDropdown",
              payload: !data.categoryListDropdown,
            })
          }
          className={`flex items-center space-x-1 cursor-pointer ${
            data.categoryListDropdown ? "text-yellow-700" : ""
          }`}
        >
          <span className="text-md md:text-lg hover:text-yellow-700">
            Kategoriler
          </span>
          <svg
            className="w-4 h-4 text-yellow-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            ></path>
          </svg>
        </div>
        <div className="flex space-x-2">
          <div
            onClick={(e) =>
              dispatch({
                type: "filterListDropdown",
                payload: !data.filterListDropdown,
              })
            }
            className={`flex items-center space-x-1 cursor-pointer ${
              data.filterListDropdown ? "text-yellow-700" : ""
            }`}
          >
            <span className="text-md md:text-lg">Filtrele</span>
            <span>
              <svg
                className="w-4 h-4 text-gray-700 text-yellow-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                ></path>
              </svg>
            </span>
          </div>
          <span>/</span>
          <div
            onClick={(e) =>
              dispatch({
                type: "searchDropdown",
                payload: !data.searchDropdown,
              })
            }
            className={`flex items-center space-x-1 cursor-pointer ${
              data.searchDropdown ? "text-yellow-700" : ""
            }`}
          >
            <span className="text-md md:text-lg">Ara</span>
            <span>
              <svg
                className="w-4 h-4 text-gray-700 text-yellow-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                ></path>
              </svg>
            </span>
          </div>
        </div>
      </div>
      {/* Sıralama Dropdown */}
      <div className="flex justify-end my-4">
        <select
          value={sort}
          onChange={handleSortChange}
          className="px-4 py-2 border focus:outline-none rounded-lg text-sm md:text-base"
        >
          <option value="newest">En Yeniler</option>
          <option value="price-asc">Fiyat: Düşükten Yükseğe</option>
          <option value="price-desc">Fiyat: Yüksekten Düşüğe</option>
        </select>
      </div>
      <ProductCategoryDropdown />
    </Fragment>
  );
};

export default ProductCategory;
