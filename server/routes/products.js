const express = require("express");
const router = express.Router();
const productController = require("../controller/products");
const multer = require("multer");
// Güvenlik için middleware'leri içeri aktarıyoruz
const { loginCheck, isAdmin } = require("../middleware/auth"); 

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/products");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// Herkese açık rotalar (Ürünleri görmek gibi)
router.get("/all-product", productController.getAllProduct);
router.post("/product-by-category", productController.getProductByCategory);
router.post("/product-by-price", productController.getProductByPrice);
router.post("/wish-product", productController.getWishProduct);
router.post("/cart-product", productController.getCartProduct);

// SADECE ADMİNLERİN YAPABİLECEĞİ İŞLEMLER (Kilitli rotalar)
// Buraya loginCheck ve isAdmin koruması ekledim
router.post("/add-product", loginCheck, isAdmin, upload.any(), productController.postAddProduct);
router.post("/edit-product", loginCheck, isAdmin, upload.any(), productController.postEditProduct);
router.post("/delete-product", loginCheck, isAdmin, productController.getDeleteProduct);
router.post("/single-product", productController.getSingleProduct);

router.post("/add-review", productController.postAddReview);
router.post("/delete-review", productController.deleteReview);

module.exports = router;