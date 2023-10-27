const express = require("express");

const {
  createBookValidator,
  updateBookValidator,
  deleteBookValidator,
} = require("../utils/validator/bookValidator");

const {
  createBookPublisher,
  updateBookPublisher,
  deleteBookPublisher,
  getBooksCountForPublisher,
  uploadBookImage,
  resizeImages,
} = require("../services/bookServices");

const authServices = require("../services/authServices");

const reviewsRoute = require("./reviewRoute");

const router = express.Router();

//POST /books/ndfjhjdshfhsdhfusdi/reviews
//GET /books/ndfjhjdshfhsdhfusdi/reviews
//GET /books/ndfjhjdshfhsdhfusdi/reviews/hfudhfuihdsfh
router.use("/:bookId/reviews", reviewsRoute);

router
  .route("/")
  .post(
    authServices.prodect,
    authServices.allowedTo("admin", "publisher"),
    uploadBookImage,
    resizeImages,
    createBookValidator,
    createBookPublisher
  );
router
  .route("/:id")
  .put(
    authServices.prodect,
    authServices.allowedTo("admin", "publisher"),
    uploadBookImage,
    resizeImages,
    updateBookValidator,
    updateBookPublisher
  )
  .delete(
    authServices.prodect,
    authServices.allowedTo("admin", "publisher"),
    deleteBookValidator,
    deleteBookPublisher
  );

router.get(
  "/booksCount/:publisherName",
  authServices.prodect,
  authServices.allowedTo("admin", "publisher"),
  getBooksCountForPublisher
);

module.exports = router;
