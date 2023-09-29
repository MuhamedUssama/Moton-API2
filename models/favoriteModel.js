const mongoose = require("mongoose");

const favoriteShcema = new mongoose.Schema(
  {
    favoriteItems: [
      {
        book: {
          type: mongoose.Types.ObjectId,
          ref: "Book",
        },
        quantity: {
          type: Number,
          default: 1,
        },
        price: Number,
      },
    ],
    totalFavoritePrice: Number,
    totalPriceAfterDiscount: Number,
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Favorite", favoriteShcema);
