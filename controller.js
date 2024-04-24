const express = require("express");
const router = express.Router();
const multer = require("multer");
const multerConfig = require("./config/multer_config");
const upload = multer(multerConfig.config).single(multerConfig.keyUpload);

router.get("/product", (req, res) => {
  res.send(`GET product `);
});

router.get("/product/:id", (req, res) => {
  res.send(`GET product ,${req.params.id}`);
});

router.post("/product", (req, res, next) => {
  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      console.log(`Error: ${JSON.stringify(err)}`);
    } else if (err) {
      console.log(`Error: ${JSON.stringify(err)}`);
    }
  });
  const fileName = req.file ? req.file.fieldname : undefined;
  res.send(`POST product`);
});

module.exports = router;
