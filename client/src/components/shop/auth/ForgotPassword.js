import React, { Fragment, useState } from "react";
import { useSnackbar } from 'notistack';

const ForgotPassword = (props) => {
  const [step, setStep] = useState(1); // 1: email, 2: code, 3: reset password
  const [data, setData] = useState({
    email: "",
    code: "",
    newPassword: "",
    confirmPassword: "",
    error: false,
    loading: false,
  });

  const { enqueueSnackbar } = useSnackbar();

  const alert = (msg) => <div className="text-xs text-red-500">{msg}</div>;

  const handleEmailSubmit = () => {
    if (!data.email) {
      setData({ ...data, error: "Lütfen e-posta adresinizi giriniz" });
      return;
    }
    setStep(2);
    setData({ ...data, error: false });
  };

  const handleCodeSubmit = () => {
    // Accept any 4 or 6 digit code
    const codePattern = /^\d{4}$|^\d{6}$/;
    if (!codePattern.test(data.code)) {
      setData({ ...data, error: "Lütfen 4 veya 6 haneli bir kod giriniz" });
      return;
    }
    setStep(3);
    setData({ ...data, error: false });
  };

  const handlePasswordReset = () => {
    if (!data.newPassword || !data.confirmPassword) {
      setData({ ...data, error: "Tüm alanları doldurunuz" });
      return;
    }
    if (data.newPassword !== data.confirmPassword) {
      setData({ ...data, error: "Şifreler eşleşmiyor" });
      return;
    }
    if (data.newPassword.length < 8) {
      setData({ ...data, error: "Şifre en az 8 karakter olmalıdır" });
      return;
    }
    // Simulated success
    enqueueSnackbar('Şifreniz başarıyla değiştirildi', { variant: 'success' });
    // Reset form
    setStep(1);
    setData({
      email: "",
      code: "",
      newPassword: "",
      confirmPassword: "",
      error: false,
      loading: false,
    });
    // Close modal after a delay
    setTimeout(() => {
      if (props.onClose) {
        props.onClose();
      }
    }, 1500);
  };

  return (
    <Fragment>
      <div className="text-center text-2xl mb-6">Şifremi Unuttum</div>
      
      {step === 1 && (
        <form className="space-y-4">
          <div className="flex flex-col">
            <label htmlFor="email">
              E-posta Adresi
              <span className="text-sm text-gray-600 ml-1">*</span>
            </label>
            <input
              onChange={(e) =>
                setData({ ...data, email: e.target.value, error: false })
              }
              value={data.email}
              type="email"
              id="email"
              className={`${
                data.error ? "border-red-500" : ""
              } px-4 py-2 focus:outline-none border`}
              placeholder="ornek@email.com"
            />
            {data.error && alert(data.error)}
          </div>
          <div
            onClick={handleEmailSubmit}
            style={{ background: "#303031" }}
            className="font-medium px-4 py-2 text-white text-center cursor-pointer"
          >
            Devam Et
          </div>
        </form>
      )}

      {step === 2 && (
        <form className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 py-2 px-4 rounded mb-4">
            <p className="text-sm text-blue-800">
              Lütfen mail adresinize gönderilen kodu giriniz.
            </p>
          </div>
          <div className="flex flex-col">
            <label htmlFor="code">
              Doğrulama Kodu (4 veya 6 haneli)
              <span className="text-sm text-gray-600 ml-1">*</span>
            </label>
            <input
              onChange={(e) =>
                setData({ ...data, code: e.target.value, error: false })
              }
              value={data.code}
              type="text"
              id="code"
              maxLength="6"
              className={`${
                data.error ? "border-red-500" : ""
              } px-4 py-2 focus:outline-none border`}
              placeholder="1234 veya 123456"
            />
            {data.error && alert(data.error)}
          </div>
          <div className="flex space-x-2">
            <div
              onClick={() => {
                setStep(1);
                setData({ ...data, code: "", error: false });
              }}
              style={{ border: "1px solid #303031", color: "#303031" }}
              className="font-medium px-4 py-2 text-center cursor-pointer flex-1"
            >
              Geri
            </div>
            <div
              onClick={handleCodeSubmit}
              style={{ background: "#303031" }}
              className="font-medium px-4 py-2 text-white text-center cursor-pointer flex-1"
            >
              Doğrula
            </div>
          </div>
        </form>
      )}

      {step === 3 && (
        <form className="space-y-4">
          <div className="flex flex-col">
            <label htmlFor="newPassword">
              Yeni Şifre
              <span className="text-sm text-gray-600 ml-1">*</span>
            </label>
            <input
              onChange={(e) =>
                setData({ ...data, newPassword: e.target.value, error: false })
              }
              value={data.newPassword}
              type="password"
              id="newPassword"
              className={`${
                data.error ? "border-red-500" : ""
              } px-4 py-2 focus:outline-none border`}
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="confirmPassword">
              Yeni Şifre (Tekrar)
              <span className="text-sm text-gray-600 ml-1">*</span>
            </label>
            <input
              onChange={(e) =>
                setData({
                  ...data,
                  confirmPassword: e.target.value,
                  error: false,
                })
              }
              value={data.confirmPassword}
              type="password"
              id="confirmPassword"
              className={`${
                data.error ? "border-red-500" : ""
              } px-4 py-2 focus:outline-none border`}
            />
            {data.error && alert(data.error)}
          </div>
          <div className="flex space-x-2">
            <div
              onClick={() => {
                setStep(2);
                setData({
                  ...data,
                  newPassword: "",
                  confirmPassword: "",
                  error: false,
                });
              }}
              style={{ border: "1px solid #303031", color: "#303031" }}
              className="font-medium px-4 py-2 text-center cursor-pointer flex-1"
            >
              Geri
            </div>
            <div
              onClick={handlePasswordReset}
              style={{ background: "#303031" }}
              className="font-medium px-4 py-2 text-white text-center cursor-pointer flex-1"
            >
              Şifreyi Değiştir
            </div>
          </div>
        </form>
      )}
    </Fragment>
  );
};

export default ForgotPassword;

