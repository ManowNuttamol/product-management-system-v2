const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./swagger_output.json");

const app = express();
const port = 5000;
const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "test",
});

con.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
  const sql =
    "CREATE TABLE products (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), category VARCHAR(255), price FLOAT, stock INT)";
  con.query(sql, function (err, result) {
    if (err) console.log("Table already exists");;
    console.log("Table created");
  });
});

app.use((req, res, next) => {
  console.log(`${req.method} request for ${req.url}`);
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/doc", swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.get("/products", (req, res) => {
  /* #swagger.tags = ['Product']
   #swagger.description = 'Show all product information' */

  /* #swagger.responses[200] = { 
    schema: { $ref: "#/definitions/Products" },
    description: 'Product information' 
  } */

  const sql = "SELECT * FROM products";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Show all product information");
    res.status(200).json(result);
  });

  /* #swagger.responses[404] = { 
    description: 'Product not found' 
  } */
});

app.get("/products/:id", (req, res) => {
  /* #swagger.tags = ['Product']
   #swagger.description = 'Show product information' */

  const sql = `SELECT * FROM products WHERE id = ${req.params.id}`;
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log(`Show product id ${req.params.id} information`);
    res.status(200).json(result);
  });

  /* #swagger.responses[200] = { 
    schema: { $ref: "#/definitions/Products" },
    description: 'Product information' 
  } */

  /* #swagger.responses[404] = { 
    description: 'Product not found' 
  } */
});

app.post("/products", (req, res) => {
  /* #swagger.tags = ['Product']
    #swagger.description = 'Add product information to the system' */

  /* #swagger.parameters['newProduct'] = {
    in: 'body',
    description: 'New product information',
    required: true,
    schema: { $ref: "#/definitions/AddProduct" }
  }
  */

  if (
    !req.body.name &&
    !req.body.category &&
    !req.body.price &&
    !req.body.stock
  ) {
    res.status(500).send("Please fill in the product information");
  } else {
    if (!req.body.name) {
      req.body.name = null;
    }
    if (!req.body.category) {
      req.body.category = null;
    }
    if (!req.body.price) {
      req.body.price = null;
    }
    if (!req.body.stock) {
      req.body.stock = null;
    }

    const sql = `INSERT INTO products (name, category, price, stock) VALUES ('${req.body.name}', '${req.body.category}', ${req.body.price}, ${req.body.stock})`;
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log(`New product information`);
      res.status(201).json(result);
    });
  }
  // #swagger.responses[500]
});

app.put("/products/:id", (req, res) => {
  /* #swagger.tags = ['Product']
   #swagger.description = 'Update product information in the system' */

  /* #swagger.parameters['id'] = { in: 'path', description: 'Product id to be updated' } */

  const sql1 = `SELECT * FROM products WHERE id = ${req.params.id}`;
  con.query(sql1, function (err1, result1) {
    if (err1) throw err1;
    console.log(`Show product id ${req.params.id} information`);
    console.log(result1[0].name);
    if (req.body.name) {
      result1[0].name = req.body.name;
    }
    if (req.body.category) {
      result1[0].category = req.body.category;
    }
    if (req.body.price) {
      result1[0].price = req.body.price;
    }
    if (req.body.stock) {
      result1[0].stock = req.body.stock;
    }
    const sql2 = `UPDATE products SET name = '${result1[0].name}', category = '${result1[0].category}', price = ${result1[0].price}, stock = ${result1[0].stock} WHERE id = ${req.params.id}`;
    con.query(sql2, function (err2, result2) {
      if (err2) throw err2;
      console.log(`Update product id ${req.params.id} information`);
      res.status(200).json(result2);
    });
  });

  /* #swagger.parameters['editProduct'] = { 
    in: 'body',
    description: 'Edit product information',
    schema: { $ref: "#/definitions/AddProduct" }
  } */

  /* #swagger.responses[404] = { 
    description: 'Product not found' 
  } */
});

app.delete("/products/:id", (req, res) => {
  /* #swagger.tags = ['Product']
    #swagger.description = 'Delete product information from the system' */

  /* #swagger.parameters['id'] = { in: 'path', description: 'Product id to be deleted' } */

  const sql = `DELETE FROM products WHERE id = ${req.params.id}`;
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log(`Delete product id ${req.params.id} information`);
    res.status(204).send();
  });

  /* #swagger.responses[404]= { 
    description: 'Product not found' 
  } */
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
