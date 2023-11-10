const express = require("express");

const {
  createpageImage,
  getallpageImages,
  getpageImage,
  updatepageImage,
  deletepageImage,
  uploadpageImage,
  resizeImages,
} = require("../services/pageImageServices");

const authServices = require("../services/authServices");

const router = express.Router();

router
  .route("/")
  .get(getallpageImages)
  .post(
    authServices.prodect,
    authServices.allowedTo("admin"),
    uploadpageImage,
    resizeImages,
    createpageImage
  );
router
  .route("/:id")
  .get(getpageImage)
  .put(
    authServices.prodect,
    authServices.allowedTo("admin"),
    uploadpageImage,
    resizeImages,

    updatepageImage
  )
  .delete(
    authServices.prodect,
    authServices.allowedTo("admin"),
    deletepageImage
  );

module.exports = router;
