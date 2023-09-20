const { Router } = require("express");
const {
  uploadCategoryImageController,
  uploadCategoryImageMiddleware,
} = require("../services/categoryImageUpload");

const router = Router();

router.post(
  "/categoryimage",
  uploadCategoryImageMiddleware.single("image"),
  uploadCategoryImageController
);

module.exports = router;
