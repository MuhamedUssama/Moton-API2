const { Router } = require("express");
const {
  uploadBookImageController,
  uploadBookImageMiddleware,
} = require("../services/bookImageUpload");

const router = Router();

router.post(
  "/bookimage",
  uploadBookImageMiddleware.single("image"),
  uploadBookImageController
);

module.exports = router;
