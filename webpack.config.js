const path = require('path');

module.exports = {
 entry: path.join(__dirname, "src", "client", "app.jsx"),
 output: {
   path: path.join(__dirname, "public"),
   filename: "bundle.js"
 },
 mode: "development",
 module: {
   rules: [{
     loader: "babel-loader",
     test: /\.(js|jsx)$/,
     exclude: /node_modules/
   }]
 }
}