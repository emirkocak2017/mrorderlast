var braintree = require("braintree");
require("dotenv").config();

var gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

class brainTree {
  ganerateToken(req, res) {
    gateway.clientToken.generate({}, (err, response) => {
      if (err) {
        return res.json(err);
      }
      return res.json(response);
    });
  }

  paymentProcess(req, res) {
    let { amountTotal, paymentMethod } = req.body;
    
    // simule edilmis odeme - test icin her zaman basarili don
    const mockTransactionId = `mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const mockResult = {
      success: true,
      transaction: {
        id: mockTransactionId,
        amount: amountTotal,
        status: "settled",
        type: "sale"
      }
    };
    console.log("Simulated Payment Success - Transaction ID: " + mockTransactionId);
    return res.json(mockResult);
    
    // orijinal braintree kodu (simulasyon icin yorum satirina alindi)
    // gercek braintree kullanmak icin asagidaki yorumu kaldir ve yukaridaki simulasyon kodunu sil
    /*
    gateway.transaction.sale(
      {
        amount: amountTotal,
        paymentMethodNonce: paymentMethod,
        options: {
          submitForSettlement: true,
        },
      },
      (err, result) => {
        if (err) {
          console.error("Braintree Error:", err);
          return res.status(500).json({ 
            success: false, 
            error: "Ödeme işlemi sırasında bir hata oluştu",
            details: err.message 
          });
        }

        if (result.success) {
          console.log("Transaction ID: " + result.transaction.id);
          return res.json(result);
        } else {
          console.error("Transaction Failed:", result.message);
          return res.status(400).json({ 
            success: false, 
            error: "Ödeme işlemi başarısız oldu",
            message: result.message 
          });
        }
      }
    );
    */
  }
}

const brainTreeController = new brainTree();
module.exports = brainTreeController;
