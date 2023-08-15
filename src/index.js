const express = require('express');
const app = express();
const path = require('path');

// const bodyParser = require('body-parser');
const session = require('express-session');
const nocache = require('nocache');




// disable caching
app.use(nocache());
// using sessions
app.use(
    session({
          key : 'user_sid',
          secret:"this is random stuff",
          resave:false,
          saveUninitialized:false,
          cookie:{
                expires:600000   //6 days storing cookie inside browser
          }
    })
)

const views = path.join(__dirname,'../views')

//session and cokkie





//route

app.use(express.json());
app.set('view engine','ejs');
app.set('views', views);
// app.use('/css', express.static(path.join(__dirname, '../public/css')));

// app.use('/js', express.static(path.join(__dirname,'../public/js')));
app.use('/css', express.static(path.resolve(__dirname,"../public/css")))

app.use('/js', express.static(path.resolve(__dirname,"../public/js")))

app.use(express.urlencoded({extended:false}))

//login routes

    app.use('/',require('../server/routes/router'))


   app.listen(5000,()=>{
    console.log('port connected');
})