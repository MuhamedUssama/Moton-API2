const { Router } = require("express");
const {
  uploadPageImageController,
  uploadPageImageMiddleware,
} = require("../services/mainImageUplode");

const router = Router();

router.post(
  "/mainimage",
  uploadPageImageMiddleware.single("image"),
  uploadPageImageController
);

module.exports = router;
