const paypal = require("paypal-rest-sdk");

paypal.configure({
  mode: "live", //sandbox or live
  client_id: process.env.PAYPAL_CLIENT_ID,
  client_secret: process.env.PAYPAL_CLIENT_SECRET,
});

const createAsyncPayment = (create_payment_json) => {
  return new Promise((resolve, reject) => {
    paypal.payment.create(create_payment_json, function (error, payment) {
      if (error) {
        reject(error);
      } else {
        for (let i = 0; i < payment.links.length; i++) {
          if (payment.links[i].rel === "approval_url") {
            resolve(payment.links[i].href);
          }
        }
      }
    });
  });
};

exports.createPaypalPayment = async (totalPrice, currency, cartId) => {
  try {
    const create_payment_json = {
      intent: "sale",
      payer: {
        payment_method: "paypal",
      },
      redirect_urls: {
        return_url: "https://kutopedia.com/paypal/payment/success",
        cancel_url: "https://kutopedia.com/paypal/payment/cancel",
        // return_url: "https://moton.vercel.app/paypal/payment/success",
        // cancel_url: "https://bookstore-iti.herokuapp.com/cancel",
      },
      transactions: [
        {
          amount: {
            currency: currency,
            total: totalPrice + 12,
          },
          description: cartId,
        },
      ],
    };

    const paymentUrl = await createAsyncPayment(create_payment_json);
    return paymentUrl;
  } catch (e) {
    console.log(e);
  }
};

exports.executePaypalPayment = async (paymentId, payerId) => {
  try {
    const payment = await new Promise((resolve, reject) => {
      paypal.payment.get(paymentId, function (error, payment) {
        if (error) {
          console.log(error);
          reject(error);
        } else {
          resolve(payment);
        }
      });
    });

    return payment;
  } catch (e) {
    console.log(e);
  }
};
