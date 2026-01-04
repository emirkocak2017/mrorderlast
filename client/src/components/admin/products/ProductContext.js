export const productState = {
  products: null,
  addProductModal: false,
  editProductModal: {
    modal: false,
    pId: "",
    pName: "",
    pDescription: "",
    pImages: null,
    pStatus: "",
    pCategory: "",
    pQuantity: "",
    pPrice: "",
    pOffer: "",
    videoUrl: "",
    offer: false,
    offerPrice: 0,
  },
};

export const productReducer = (state, action) => {
  switch (action.type) {
    /* tum urunleri getir */
    case "fetchProductsAndChangeState":
      return {
        ...state,
        products: action.payload,
      };
    /* urun olustur */
    case "addProductModal":
      return {
        ...state,
        addProductModal: action.payload,
      };
    /* urun duzenle */
    case "editProductModalOpen":
      return {
        ...state,
        editProductModal: {
          modal: true,
          pId: action.product.pId,
          pName: action.product.pName,
          pDescription: action.product.pDescription,
          pImages: action.product.pImages,
          pStatus: action.product.pStatus,
          pCategory: action.product.pCategory,
          pQuantity: action.product.pQuantity,
          pPrice: action.product.pPrice,
          pOffer: action.product.pOffer || "",
          videoUrl: action.product.videoUrl || "",
          offer: action.product.offer || false,
          offerPrice: action.product.offerPrice || 0,
        },
      };
    case "editProductModalClose":
      return {
        ...state,
        editProductModal: {
          modal: false,
          pId: "",
          pName: "",
          pDescription: "",
          pImages: null,
          pStatus: "",
          pCategory: "",
          pQuantity: "",
          pPrice: "",
          pOffer: "",
          videoUrl: "",
          offer: false,
          offerPrice: 0,
        },
      };
    default:
      return state;
  }
};
