const swaggerAutogen = require('swagger-autogen')()

const outputFile = './swagger_output.json'
const endpointsFiles = ['./index.js']

const doc = {
    info: {
        version: "1.0.0",
        title: "Product Management System",
        description: "Documentation for request APIs from product management systems."
      },
      host: "localhost:5000",
      basePath: "/",
      schemes: [
        "http",
        "https"
      ],
      consumes: [
        "application/json"
      ],
      produces: [
        "application/json"
      ],
      tags: [
        {
          "name": "Product",
          "description": "Tools for managing products in the system"
        }
      ],
      definitions: {
        Products: {
            id: 0,
            name: "Product name",
            category: "Product category",
            price: 0,
            stock: 0
        },
        AddProduct: {
            $name: "Product name",
            $category: "Product category",
            $price: 0,
            $stock: 0
        }
      }
}

swaggerAutogen(outputFile, endpointsFiles, doc)