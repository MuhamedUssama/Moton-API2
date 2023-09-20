const { Router } = require("express");
const {
  uploadEventImageController,
  uploadEventImageMiddleware,
} = require("../services/eventImageUpload");

const router = Router();

router.post(
  "/eventimage",
  uploadEventImageMiddleware.single("image"),
  uploadEventImageController
);

module.exports = router;
