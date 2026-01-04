export const subTotal = (id, price) => {
  let subTotalCost = 0;
  let carts = JSON.parse(localStorage.getItem("cart"));
  // Güvenli Erişim: carts null/undefined ise forEach çağrılmaz
  if (carts && Array.isArray(carts)) {
    carts.forEach((item) => {
      // Eğer item veya item.id null ise, atla (silinmiş ürün)
      if (item && item.id === id) {
        subTotalCost = (item.quantitiy || 0) * (price || 0);
      }
    });
  }
  return subTotalCost;
};

export const quantity = (id) => {
  let product = 0;
  let carts = JSON.parse(localStorage.getItem("cart"));
  // Güvenli Erişim: carts null/undefined ise forEach çağrılmaz
  if (carts && Array.isArray(carts)) {
    carts.forEach((item) => {
      // Eğer item veya item.id null ise, atla (silinmiş ürün)
      if (item && item.id === id) {
        product = item.quantitiy || 0;
      }
    });
  }
  return product;
};

export const totalCost = () => {
  let totalCost = 0;
  let carts = JSON.parse(localStorage.getItem("cart"));
  // Güvenli Erişim: carts null/undefined ise forEach çağrılmaz
  if (carts && Array.isArray(carts)) {
    carts.forEach((item) => {
      // Eğer item null ise veya gerekli özellikler yoksa, atla (silinmiş ürün)
      if (item && item.quantitiy && item.price) {
        totalCost += (item.quantitiy || 0) * (item.price || 0);
      }
    });
  }
  return totalCost;
};
