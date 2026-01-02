import React, { Fragment, useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import Layout from "../layout";
import { LayoutContext } from "../index";
import { useSnackbar } from 'notistack';
import axios from "axios";

const apiURL = process.env.REACT_APP_API_URL;

const LiveSales = () => {
  const history = useHistory();
  const { data: layoutData, dispatch: layoutDispatch } = useContext(LayoutContext);
  const { enqueueSnackbar } = useSnackbar();
  
  const [products, setProducts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLiveSalesProducts();
  }, []);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentIndex, products.length]);

  const fetchLiveSalesProducts = async () => {
    try {
      const response = await axios.get(`${apiURL}/api/product/live-sales`);
      if (response.data && response.data.Products) {
        setProducts(response.data.Products);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching live sales products:", error);
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (currentIndex < products.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleAddToCart = (product) => {
    const cart = localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")) : [];
    const existingItem = cart.find(item => item.id === product._id);
    
    if (existingItem) {
      enqueueSnackbar('Ürün zaten sepette', { variant: 'info' });
    } else {
      cart.push({ id: product._id, quantitiy: 1, price: product.offer && product.offerPrice > 0 ? product.offerPrice : product.pPrice });
      localStorage.setItem("cart", JSON.stringify(cart));
      layoutDispatch({ type: "inCart", payload: cart.length });
      enqueueSnackbar('Ürün sepete eklendi', { variant: 'success' });
    }
  };

  const getVideoUrl = (videoUrl) => {
    if (!videoUrl) return null;
    // Handle YouTube URLs
    if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
      const videoId = videoUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId[1]}?autoplay=1&mute=1&controls=1&loop=1&playlist=${videoId[1]}`;
      }
    }
    // Handle Vimeo URLs
    if (videoUrl.includes('vimeo.com')) {
      const videoId = videoUrl.match(/vimeo.com\/(\d+)/);
      if (videoId) {
        return `https://player.vimeo.com/video/${videoId[1]}?autoplay=1&muted=1&loop=1`;
      }
    }
    // Direct video URL
    return videoUrl;
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

  if (products.length === 0) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-xl text-center">
            <p>Henüz canlı satış ürünü bulunmamaktadır.</p>
            <p className="text-sm text-gray-600 mt-2">Admin panelinden ürünlere video URL'si ekleyerek canlı satış başlatabilirsiniz.</p>
          </div>
        </div>
      </Layout>
    );
  }

  const currentProduct = products[currentIndex];
  const videoUrl = getVideoUrl(currentProduct.videoUrl);

  return (
    <Layout>
      <div className="min-h-screen bg-gray-100">
        {/* Back Button */}
        <button
          onClick={() => history.push('/')}
          className="fixed top-4 left-4 z-50 p-3 rounded-full bg-white shadow-lg hover:bg-gray-100 transition-all"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>

        {/* Product Counter */}
        <div className="fixed top-4 right-4 z-50 bg-white shadow-lg text-gray-800 px-4 py-2 rounded-full text-sm font-semibold">
          {currentIndex + 1} / {products.length}
        </div>

        {/* Split Screen Layout */}
        <div className="flex flex-col lg:flex-row h-screen pt-16 lg:pt-0">
          {/* Left Side - Video */}
          <div className="w-full lg:w-1/2 h-1/2 lg:h-full bg-black relative overflow-hidden">
            {videoUrl ? (
              videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be') || videoUrl.includes('vimeo.com') ? (
                <iframe
                  src={videoUrl}
                  className="w-full h-full"
                  frameBorder="0"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                />
              ) : (
                <video
                  src={videoUrl}
                  className="w-full h-full object-contain"
                  autoPlay
                  muted
                  loop
                  playsInline
                  controls
                />
              )
            ) : (
              <div className="flex items-center justify-center h-full text-white text-center">
                <div>
                  <p className="text-xl mb-2">Video yüklenemedi</p>
                  <p className="text-sm text-gray-400">Geçerli bir video URL'si gerekli</p>
                </div>
              </div>
            )}
          </div>

          {/* Right Side - Product Info */}
          <div className="w-full lg:w-1/2 h-1/2 lg:h-full bg-white overflow-y-auto">
            <div className="p-6 md:p-12">
              {/* Product Image */}
              <div className="mb-6">
                <img
                  src={`${apiURL}/uploads/products/${currentProduct.pImages[0]}`}
                  alt={currentProduct.pName}
                  className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg"
                />
              </div>

              {/* Product Name */}
              <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
                {currentProduct.pName}
              </h1>

              {/* Product Description */}
              <p className="text-gray-600 mb-6 leading-relaxed">
                {currentProduct.pDescription}
              </p>

              {/* Price Section */}
              <div className="mb-6">
                {currentProduct.offer && currentProduct.offerPrice > 0 ? (
                  <div className="flex items-center space-x-4">
                    <span className="text-4xl font-bold text-red-600">
                      {currentProduct.offerPrice}₺
                    </span>
                    <span className="text-2xl text-gray-400 line-through">
                      {currentProduct.pPrice}₺
                    </span>
                    <span className="bg-red-100 text-red-600 px-3 py-1 rounded text-sm font-semibold">
                      %{Math.round(((currentProduct.pPrice - currentProduct.offerPrice) / currentProduct.pPrice) * 100)} İNDİRİM
                    </span>
                  </div>
                ) : (
                  <span className="text-4xl font-bold text-gray-800">
                    {currentProduct.pPrice}₺
                  </span>
                )}
              </div>

              {/* Stock Status */}
              <div className="mb-6">
                {currentProduct.pQuantity > 0 ? (
                  <span className="inline-block bg-green-100 text-green-800 px-4 py-2 rounded-lg font-semibold">
                    ✓ Stokta Var
                  </span>
                ) : (
                  <span className="inline-block bg-red-100 text-red-800 px-4 py-2 rounded-lg font-semibold">
                    ✗ Stokta Yok
                  </span>
                )}
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={() => handleAddToCart(currentProduct)}
                disabled={currentProduct.pQuantity === 0}
                className={`w-full py-4 rounded-lg font-semibold text-lg transition-colors mb-6 ${
                  currentProduct.pQuantity > 0
                    ? 'bg-gray-800 text-white hover:bg-gray-900'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {currentProduct.pQuantity > 0 ? 'Sepete Ekle' : 'Stokta Yok'}
              </button>

              {/* Category */}
              {currentProduct.pCategory && (
                <div className="text-sm text-gray-500 mb-4">
                  Kategori: <span className="font-semibold">{currentProduct.pCategory.cName}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Arrows */}
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 flex space-x-4">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className={`p-4 rounded-full bg-white shadow-lg ${
              currentIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'
            } transition-all`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={handleNext}
            disabled={currentIndex === products.length - 1}
            className={`p-4 rounded-full bg-white shadow-lg ${
              currentIndex === products.length - 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'
            } transition-all`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default LiveSales;
