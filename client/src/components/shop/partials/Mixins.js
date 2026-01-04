export const subTotal = (id, price) => {
  let subTotalCost = 0;
  let carts = JSON.parse(localStorage.getItem("cart"));
  // guvenli erisim: carts null/undefined ise forEach cagrilmaz
  if (carts && Array.isArray(carts)) {
    carts.forEach((item) => {
      // eger item veya item.id null ise, atla (silinmis urun)
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
  // guvenli erisim: carts null/undefined ise forEach cagrilmaz
  if (carts && Array.isArray(carts)) {
    carts.forEach((item) => {
      // eger item veya item.id null ise, atla (silinmis urun)
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
  // guvenli erisim: carts null/undefined ise forEach cagrilmaz
  if (carts && Array.isArray(carts)) {
    carts.forEach((item) => {
      // eger item null ise veya gerekli ozellikler yoksa, atla (silinmis urun)
      if (item && item.quantitiy && item.price) {
        totalCost += (item.quantitiy || 0) * (item.price || 0);
      }
    });
  }
  return totalCost;
};
