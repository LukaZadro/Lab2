const express = require('express');
const router = express.Router();
const data = require('../data/mydata');

router.get('/', (req, res) => {
   res.redirect('/home/getCategories');
});

//dohvat katergorija
router.get('/getCategories', (req, res) => {
   const prvaKategorija = data.categories[0];
   
   res.render('home', {
      website: data.website,
      categories: data.categories,
      products: prvaKategorija ? prvaKategorija.products : [],
      selectedCategory: null,
      selectedCategoryName: null,
      session: req.session,
   });
});

//dohvat proizvoda za kategoriju
router.get('/getProducts/:id', (req, res) => {
   const categoryId = req.params.id;
   const category = data.categories.find(c => c.id === categoryId);
   
   if (category) {
      res.render('home', {
         website: data.website,
         categories: data.categories,
         products: category.products,
         selectedCategory: category.id,
         selectedCategoryName: category.name,
         session: req.session,
      });
   } else {
      res.status(404).send('Kategorija nije pronađena');
   }
});

module.exports = router;