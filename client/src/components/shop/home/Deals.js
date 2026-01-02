import React, { Fragment, useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import Layout from "../layout";
import { LayoutContext } from "../index";
import { addToCart, cartList } from "../productDetails/Mixins";
import { useSnackbar } from 'notistack';
import axios from "axios";

const apiURL = process.env.REACT_APP_API_URL;

const Deals = () => {
  const history = useHistory();
  const { data: layoutData, dispatch: layoutDispatch } = useContext(LayoutContext);
  const { enqueueSnackbar } = useSnackbar();
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDealProducts();
  }, []);

  const fetchDealProducts = async () => {
    try {
      const response = await axios.get(`${apiURL}/api/product/deals`);
      if (response.data && response.data.Products) {
        setProducts(response.data.Products);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching deal products:", error);
      setLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    const cart = localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")) : [];
    const existingItem = cart.find(item => item.id === product._id);
    
    if (existingItem) {
      enqueueSnackbar('Ürün zaten sepette', { variant: 'info' });
    } else {
      cart.push({ id: product._id, quantitiy: 1, price: product.offerPrice > 0 ? product.offerPrice : product.pPrice });
      localStorage.setItem("cart", JSON.stringify(cart));
      layoutDispatch({ type: "inCart", payload: cartList() });
      enqueueSnackbar('Ürün sepete eklendi', { variant: 'success' });
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-xl">Yükleniyor...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* İNDİRİM Banner */}
      <div className="relative bg-gradient-to-r from-red-600 to-pink-600 text-white py-8 mb-8 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/2 translate-y-1/2"></div>
        </div>
        <div className="relative container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-2">İNDİRİM</h1>
          <p className="text-xl">Özel fırsatları kaçırmayın!</p>
        </div>
        {/* Decorative Ribbons */}
        <div className="absolute top-0 left-0 w-0 h-0 border-l-[50px] border-l-transparent border-t-[50px] border-t-red-800"></div>
        <div className="absolute top-0 right-0 w-0 h-0 border-r-[50px] border-r-transparent border-t-[50px] border-t-red-800"></div>
      </div>

      <div className="container mx-auto px-4 pb-12">
        {products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-gray-600">Şu anda indirimli ürün bulunmamaktadır.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product, index) => (
              <div
                key={product._id}
                className="relative bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow group"
              >
                {/* İNDİRİM Badge */}
                <div className="absolute top-4 right-4 z-10 bg-red-600 text-white px-4 py-2 rounded-full font-bold text-sm transform rotate-12 shadow-lg">
                  İNDİRİM
                </div>
                
                {/* Product Image */}
                <div
                  className="relative h-64 overflow-hidden cursor-pointer"
                  onClick={() => history.push(`/products/${product._id}`)}
                >
                  <img
                    src={`${apiURL}/uploads/products/${product.pImages[0]}`}
                    alt={product.pName}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <h3
                    className="text-lg font-semibold mb-2 cursor-pointer hover:text-red-600 transition-colors line-clamp-2"
                    onClick={() => history.push(`/products/${product._id}`)}
                  >
                    {product.pName}
                  </h3>
                  
                  {/* Price Section */}
                  <div className="flex items-center space-x-2 mb-4">
                    {product.offerPrice > 0 ? (
                      <>
                        <span className="text-2xl font-bold text-red-600">
                          {product.offerPrice}₺
                        </span>
                        <span className="text-lg text-gray-400 line-through">
                          {product.pPrice}₺
                        </span>
                        <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-xs font-semibold">
                          %{Math.round(((product.pPrice - product.offerPrice) / product.pPrice) * 100)} İNDİRİM
                        </span>
                      </>
                    ) : (
                      <span className="text-2xl font-bold text-gray-800">
                        {product.pPrice}₺
                      </span>
                    )}
                  </div>

                  {/* Stock Status */}
                  <div className="mb-4">
                    {product.pQuantity > 0 ? (
                      <span className="text-green-600 text-sm font-medium">✓ Stokta Var</span>
                    ) : (
                      <span className="text-red-600 text-sm font-medium">✗ Stokta Yok</span>
                    )}
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={() => handleAddToCart(product)}
                    disabled={product.pQuantity === 0}
                    className={`w-full py-2 rounded-lg font-semibold transition-colors ${
                      product.pQuantity > 0
                        ? 'bg-red-600 text-white hover:bg-red-700'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {product.pQuantity > 0 ? 'Sepete Ekle' : 'Stokta Yok'}
                  </button>
                </div>

                {/* Corner Ribbon */}
                <div className="absolute top-0 left-0 w-24 h-24 overflow-hidden">
                  <div className="absolute top-0 left-0 w-32 h-8 bg-red-600 transform -rotate-45 -translate-x-8 translate-y-4 shadow-lg">
                    <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-xs font-bold">
                      ÖZEL
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Deals;

