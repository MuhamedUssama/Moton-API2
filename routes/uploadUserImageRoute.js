const { Router } = require("express");
const {
  uploadUserImageController,
  uploadUserImageMiddleware,
} = require("../services/userImageUpload");

const router = Router();

router.post(
  "/userimage",
  uploadUserImageMiddleware.single("image"),
  uploadUserImageController
);

module.exports = router;
