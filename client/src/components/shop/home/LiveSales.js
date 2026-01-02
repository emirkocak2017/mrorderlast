import React, { Fragment, useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import Layout from "../layout";
import { LayoutContext } from "../index";
import { addToCart, cartList } from "../productDetails/Mixins";
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
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    fetchLiveSalesProducts();
  }, []);

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
      setPlaying(true);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setPlaying(true);
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
      layoutDispatch({ type: "inCart", payload: cartList() });
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
      <div className="relative h-screen w-full overflow-hidden bg-black">
        {/* Video Container */}
        <div className="absolute inset-0 flex items-center justify-center">
          {videoUrl ? (
            videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be') || videoUrl.includes('vimeo.com') ? (
              <iframe
                src={videoUrl}
                className="w-full h-full"
                frameBorder="0"
                allow="autoplay; encrypted-media"
                allowFullScreen
                style={{ minHeight: '100vh' }}
              />
            ) : (
              <video
                src={videoUrl}
                className="w-full h-full object-contain"
                autoPlay
                muted
                loop
                playsInline
                controls={!playing}
              />
            )
          ) : (
            <div className="text-white text-center">
              <p>Video yüklenemedi</p>
            </div>
          )}
        </div>

        {/* Product Info Overlay - Bottom */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent p-6 pb-20">
          <div className="max-w-md mx-auto">
            <h2 className="text-white text-2xl font-bold mb-2">{currentProduct.pName}</h2>
            <p className="text-white/80 text-sm mb-4 line-clamp-2">{currentProduct.pDescription}</p>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                {currentProduct.offer && currentProduct.offerPrice > 0 ? (
                  <>
                    <span className="text-red-500 text-xl font-bold">{currentProduct.offerPrice}₺</span>
                    <span className="text-white/60 line-through">{currentProduct.pPrice}₺</span>
                  </>
                ) : (
                  <span className="text-white text-xl font-bold">{currentProduct.pPrice}₺</span>
                )}
              </div>
              {currentProduct.pQuantity > 0 ? (
                <span className="text-green-400 text-sm">Stokta Var</span>
              ) : (
                <span className="text-red-400 text-sm">Stokta Yok</span>
              )}
            </div>
            <button
              onClick={() => handleAddToCart(currentProduct)}
              disabled={currentProduct.pQuantity === 0}
              className={`w-full py-3 rounded-lg font-semibold ${
                currentProduct.pQuantity > 0
                  ? 'bg-white text-black hover:bg-gray-200'
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              } transition-colors`}
            >
              {currentProduct.pQuantity > 0 ? 'Sepete Ekle' : 'Stokta Yok'}
            </button>
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex flex-col space-y-4">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className={`p-3 rounded-full bg-white/20 backdrop-blur-sm text-white ${
              currentIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/30'
            } transition-all`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </button>
          <button
            onClick={handleNext}
            disabled={currentIndex === products.length - 1}
            className={`p-3 rounded-full bg-white/20 backdrop-blur-sm text-white ${
              currentIndex === products.length - 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/30'
            } transition-all`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {/* Product Counter */}
        <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm">
          {currentIndex + 1} / {products.length}
        </div>

        {/* Back Button */}
        <button
          onClick={() => history.push('/')}
          className="absolute top-4 left-4 p-3 rounded-full bg-black/50 backdrop-blur-sm text-white hover:bg-black/70 transition-all"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>

        {/* Play/Pause Button */}
        <button
          onClick={() => setPlaying(!playing)}
          className="absolute top-20 left-4 p-3 rounded-full bg-black/50 backdrop-blur-sm text-white hover:bg-black/70 transition-all"
        >
          {playing ? (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>
      </div>
    </Layout>
  );
};

export default LiveSales;

