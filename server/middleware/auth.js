const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/keys");
const userModel = require("../models/users");

exports.loginCheck = (req, res, next) => {
  try {
    let token = req.headers.token;
    if (!token) {
      return res.json({
        error: "Lütfen giriş yapınız",
      });
    }
    token = token.replace("Bearer ", "");
    const decode = jwt.verify(token, JWT_SECRET);
    req.userDetails = decode;
    // isAdmin middleware'i icin loggedInUserId'yi req.body'ye ekle
    req.body.loggedInUserId = decode._id;
    next();
  } catch (err) {
    res.json({
      error: "Lütfen giriş yapınız",
    });
  }
};

exports.isAuth = (req, res, next) => {
  let { loggedInUserId } = req.body;
  if (
    !loggedInUserId ||
    !req.userDetails._id ||
    loggedInUserId != req.userDetails._id
  ) {
    return res.status(403).json({ error: "Kimlik doğrulaması başarısız" });
  }
  next();
};

exports.isAdmin = async (req, res, next) => {
  try {
    let reqUser = await userModel.findById(req.body.loggedInUserId);
    // eger kullanici role 0 ise admin degil musteri demektir
    if (!reqUser || reqUser.userRole === 0) {
      return res.status(403).json({ error: "Erişim reddedildi" });
    }
    next();
  } catch (err) {
    return res.status(404).json({ error: "Kullanıcı bulunamadı" });
  }
};
