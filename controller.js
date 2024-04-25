const express = require("express");
const router = express.Router();
const multer = require("multer");
const multerConfig = require("./config/multer_config");
const upload = multer(multerConfig.config).single(multerConfig.keyUpload);
const db = require("./models");
const { where } = require("sequelize");

router.get("/products", async (req, res) => {
  try {
    const result = await db.Product.findAll({
      order: [["id", "DESC"]],
    });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

router.get("/products/:id", async (req, res) => {
  try {
    const result = await db.Product.findOne({
      where: { id: req.params.id },
    });
    if (result) res.status(200).json(result);
    else res.status(404).json({ message: "Product not found" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

router.post("/products", (req, res, next) => {
  upload(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      res.status(500).send({ message: err.message });
    } else if (err) {
      res.status(500).send({ message: err.message });
    }

    const data = {
      ...req.body,
      image: req.file ? req.file.filename : undefined,
    };

    try {
      const product = await db.Product.create(data);
      res.status(201).json(product);
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  });
});

router.put("/products/:id", async (req, res, next) => {
  try {
    const result = await db.Product.findOne({
      where: { id: req.params.id },
    });
    if (!result) return res.status(404).json({ message: "Product not found" });
    updateProduct(req, res, result);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

router.delete("/products/:id", async (req, res, next) => {
  try {
    const deleted = await db.Product.destroy({
      where: { id: req.params.id },
    });
    if (!deleted) return res.status(404).json({ message: "Product not found" });
    return res.status(204).json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

const updateProduct = (req, res, product) => {
  upload(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      res.status(500).send({ message: err.message });
    } else if (err) {
      res.status(500).send({ message: err.message });
    }

    const data = {
      ...req.body,
      image: req.file ? req.file.filename : undefined,
    };

    try {
      const [updated] = await db.Product.update(data, {
        where: {
          id: product.id,
        },
      });

      if (updated) {
        const updateProduct = await db.Product.findByPk(product.id);
        res.status(200).json(updateProduct);
      } else throw new Error("Product not found");
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  });
};

module.exports = router;
