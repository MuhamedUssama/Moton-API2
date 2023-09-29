const express = require("express");

const {
  addBookToFavorite,
  getLoggedUserFavorite,
  removeSpecificFavoriteItem,
  clearAllFavoriteItems,
  updateFavoriteItemQuantity,
} = require("../services/favoriteServices");

const authServices = require("../services/authServices");

const router = express.Router();

router
  .route("/")
  .post(authServices.prodect, authServices.allowedTo("user"), addBookToFavorite)
  .get(
    authServices.prodect,
    authServices.allowedTo("user"),
    getLoggedUserFavorite
  )
  .delete(
    authServices.prodect,
    authServices.allowedTo("user"),
    clearAllFavoriteItems
  );

router
  .route("/:itemId")
  .delete(
    authServices.prodect,
    authServices.allowedTo("user"),
    removeSpecificFavoriteItem
  )
  .put(
    authServices.prodect,
    authServices.allowedTo("user"),
    updateFavoriteItemQuantity
  );

module.exports = router;
