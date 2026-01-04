import { createOrder } from "./FetchApi";

export const fetchData = async (cartListProduct, dispatch) => {
  dispatch({ type: "loading", payload: true });
  try {
    let responseData = await cartListProduct();
    if (responseData && responseData.Products) {
      setTimeout(function () {
        dispatch({ type: "cartProduct", payload: responseData.Products });
        dispatch({ type: "loading", payload: false });
      }, 1000);
    }
  } catch (error) {
    console.log(error);
  }
};

export const fetchbrainTree = async (getBrainTreeToken, setState) => {
  try {
    let responseData = await getBrainTreeToken();
    if (responseData && responseData) {
      setState({
        clientToken: responseData.clientToken,
        success: responseData.success,
      });
      console.log(responseData);
    }
  } catch (error) {
    console.log(error);
  }
};

export const pay = async (
  data,
  dispatch,
  state,
  setState,
  getPaymentProcess,
  totalCost,
  history,
  discount = 0
) => {
  console.log(state);
  if (!state.address) {
    setState({ ...state, error: "Lütfen adresinizi giriniz" });
  } else if (!state.phone) {
    setState({ ...state, error: "Lütfen telefon numaranızı giriniz" });
  } else {
    let nonce;
    state.instance
      .requestPaymentMethod()
      .then((data) => {
        dispatch({ type: "loading", payload: true });
        nonce = data.nonce;
        let paymentData = {
          amountTotal: Math.max(0, totalCost() - (discount || 0)),
          paymentMethod: nonce,
        };
        getPaymentProcess(paymentData)
          .then(async (res) => {
            if (res && res.success && res.transaction) {
              let orderData = {
                allProduct: JSON.parse(localStorage.getItem("cart")),
                user: JSON.parse(localStorage.getItem("jwt")).user._id,
                amount: Math.max(0, totalCost() - (discount || 0)),
                transactionId: res.transaction.id,
                address: state.address,
                phone: state.phone,
              };
              try {
                let resposeData = await createOrder(orderData);
                if (resposeData.success) {
                  localStorage.setItem("cart", JSON.stringify([]));
                  dispatch({ type: "cartProduct", payload: null });
                  dispatch({ type: "cartTotalCost", payload: null });
                  dispatch({ type: "orderSuccess", payload: true });
                  setState({ clientToken: "", instance: {}, error: "" });
                  dispatch({ type: "loading", payload: false });
                  return history.push("/");
                } else if (resposeData.error) {
                  setState({ ...state, error: resposeData.error || "Sipariş oluşturulamadı" });
                  dispatch({ type: "loading", payload: false });
                }
              } catch (error) {
                console.error("Order creation error:", error);
                setState({ ...state, error: "Sipariş oluşturulurken bir hata oluştu" });
                dispatch({ type: "loading", payload: false });
              }
            } else {
              setState({ ...state, error: res?.error || "Ödeme işlemi başarısız oldu" });
              dispatch({ type: "loading", payload: false });
            }
          })
          .catch((err) => {
            console.error("Payment error:", err);
            setState({ ...state, error: err.message || "Ödeme işlemi sırasında bir hata oluştu" });
            dispatch({ type: "loading", payload: false });
          });
      })
      .catch((error) => {
        console.log(error);
        setState({ ...state, error: error.message });
      });
  }
};
