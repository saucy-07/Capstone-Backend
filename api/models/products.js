const db = require("../config");

class Products {
  fetchProducts(req, res) {
    const query = `
        SELECT productID,
        productName,
        gender,
        quantity,
        amount,
        category,
        productUrl
        FROM Products;
        `;
    db.query(query, (err, results) => {
      if (err) throw err;
      res.json({
        status: res.statusCode,
        results,
      });
    });
  }
  fetchProduct(req, res) {
    const query = `
        SELECT productID,
        productName,
        gender,
        quantity,
        amount,
        category,
        productUrl
        FROM Products
        WHERE productID = ${req.params.id};
        `;
    db.query(query, (err, results) => {
      if (err) throw err;
      res.json({
        status: res.statusCode,
        results,
      });
    });
  }
  addProduct(req, res) {
    const { productName, gender, quantity, amount, category, productUrl } =
      req.body;
    const query = `
      INSERT INTO Products (productName, gender, quantity, amount, category, productUrl)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    db.query(
      query,
      [productName, gender, quantity, amount, category, productUrl],
      (err, results) => {
        if (err) throw err;
        res.json({
          status: res.statusCode,
          results,
        });
      }
    );
  }
  updateProduct(req, res) {
    const query = `
    UPDATE Product
    SET ?
    WHERE productID = ?
    `;
    db.query(query, [req.body, req.params.id], (err) => {
      if (err) throw err;
      res.json({
        status: res.statusCode,
        msg: "The product record has been updated.",
      });
    });
  }
  deleteProduct(req, res) {
    const query = `
    DELETE FROM Products
    WHERE productID = ${req.params.id};
    `;
    db.query(query, (err) => {
      if (err) throw err;
      res.json({
        status: res.statusCode,
        msg: "A product record has been deleted.",
      });
    });
  }
}

module.exports = Products