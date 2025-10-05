const path = require('path');
const express = require('express');
const session = require('express-session');

// Import rutera
const homeRouter = require('./routes/home.routes');
const cartRouter = require('./routes/cart.routes');
const data = require('./data/mydata.js'); 

// Inicijalizacija Express aplikacije
const app = express();

// Middleware za parsiranje podataka
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Postavke sesije
app.use(
  session({
    secret: 'tajna',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 30 * 60 * 1000 } // 30 minuta
  })
);

app.use((req, res, next) => {
  res.locals.data = data;
  next();
});

// Postavke EJS template enginea
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Statički resursi
app.use(express.static(path.join(__dirname, 'public')));

// Rutiranje
app.use('/home', homeRouter);
app.use('/cart', cartRouter);
app.use('/', (req, res) => {
  res.redirect('/home/getCategories');
});

// Pokretanje servera
app.listen(3000, () => {
  console.log(`Server pokrenut na portu 3000`);
});