const express = require('express');
const { resolve } = require('path');
let cors = require('cors');

const app = express();
const port = 3000;
app.use(cors());

app.use(express.static('static'));

let cart = [
  { productId: 1, name: 'Laptop', price: 50000, quantity: 1 },
  { productId: 2, name: 'Mobile', price: 20000, quantity: 2 }
];

app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});

function addItemToCart(cartArray, productId, name, price, quantity) {
    cartArray.push({
      productId: productId,
      name: name,
      price: price,
      quantity: quantity
    });
}

app.get('/cart/add', (req, res) => {
  const productId = parseInt(req.query.productId);  
  const name = req.query.name;                      
  const price = parseFloat(req.query.price);        
  const quantity = parseInt(req.query.quantity);    

  addItemToCart(cart, productId, name, price, quantity);

  res.json({ cartItems: cart });
});

function editCartItemQuantity(cart, productId, newQuantity) {
  const product = cart.find(item => item.productId === productId);
  product.quantity = newQuantity;
  return { cartItems: cart };
}

app.get('/cart/edit', (req, res) => {
  const productId = parseInt(req.query.productId);
  const newQuantity = parseInt(req.query.quantity);

  const result = editCartItemQuantity(cart, productId, newQuantity);

  res.json(result);
});


function deleteCartItem(cart, productId) {
  const updatedCart = cart.filter(item => item.productId !== productId);
  return updatedCart;
}

app.get('/cart/delete', (req, res) => {
  let productId = parseInt(req.query.productId);

  const updatedCart = deleteCartItem(cart, productId);
  res.json({cartItems: updatedCart});
});

app.get("/cart", (req, res) => {
  res.json({cartItem: cart})
})

function cartTotalQuantity(cart) {
  return cart.reduce((total, item) => total + item.quantity, 0);
}

app.get('/cart/total-quantity', (req, res) => {
  const totalQuantity = cartTotalQuantity(cart);
  res.json({ totalQuantity: totalQuantity }); 
});

function cartTotalPrice(cart) {
  return cart.reduce((total, item) => total + item.price * item.quantity, 0);
}

app.get('/cart/total-price', (req, res) => {
  const totalPrice = cartTotalPrice(cart);
  res.json({ totalPrice: totalPrice }); 
});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
