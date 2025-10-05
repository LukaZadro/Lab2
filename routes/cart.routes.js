const express = require('express');
const router = express.Router();
const data = require('../data/mydata');

function getProductById(id) {
   for (const category of data.categories) {
      const product = category.products.find(p => p.id === id);
      if (product) return { id: product.id, name: product.name };
   }
   return null;
}


// Dodavanje u košaricu
router.post('/add/:id', (req, res) => {
    const productId = req.params.id;
    const product = getProductById(productId);

    if (!product) {
        return res.status(404).json({ success: false, message: "Proizvod nije pronađen." });
    }

    if(!req.session.cart) {
        req.session.cart = [];
    }

    const existingProduct = req.session.cart.find(item => item.id === productId);
    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        req.session.cart.push({
            id: product.id,
            name: product.name,
            image: product.image,
            quantity: 1
        });
    }
    
    // Vraćamo ažuriranu košaricu
    res.json({
        success: true, 
        quantity: existingProduct ? existingProduct.quantity : 1,
        cart: req.session.cart
    });
});

// Uklanjanje iz košarice
router.post('/remove/:id', (req, res) => {
    const productId = req.params.id;

    if (!req.session.cart) {
        req.session.cart = [];
        return res.json({ success: true, quantity: 0, cart: [] });
    }

    const existingProduct = req.session.cart.find(item => item.id === productId);
    if (!existingProduct) {
        return res.json({ success: true, quantity: 0, cart: req.session.cart });
    }

    existingProduct.quantity -= 1;
    
    // Filtriramo samo proizvode s količinom > 0
    req.session.cart = req.session.cart.filter(item => item.quantity > 0);
    
    // Vraćamo ažuriranu košaricu i količinu
    const updatedQuantity = existingProduct.quantity > 0 ? existingProduct.quantity : 0;
    res.json({ 
        success: true, 
        quantity: updatedQuantity,
        cart: req.session.cart
    });
});
//dohvat svih proizvoda iz kosarice
// Dohvat svih proizvoda iz košarice
router.get('/getAll', (req, res) => {
    const cart = req.session.cart || [];
    const total = cart.reduce((sum, item) => sum + item.quantity, 0);

    // Ako je zahtjev iz fetch-a (AJAX), vrati JSON
    if (req.headers.accept && req.headers.accept.includes('application/json')) {
        return res.json({
            success: true,
            quantity: total,
            cart: cart,
            session: req.session
        });
    }
    // Inače renderiraj EJS stranicu za košaricu
    res.render('cart', {
        cart: cart,
        total: total,
        session: req.session
    });
});

module.exports = router;