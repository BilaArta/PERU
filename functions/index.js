const functions = require('firebase-functions');
const express = require('express');
const bodyParser = require('body-parser');
const firebase = require('firebase-admin')
const engines = require(`consolidate`);
const mail = require('nodemailer')
const path = require('path');


const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));


var firebaseConfig = {
    apiKey: "AIzaSyDJEeiSWAfbwI9dbqAK0vBKGq8TEZ5IfbI",
    authDomain: "iconproject-f66b2.firebaseapp.com",
    databaseURL: "https://iconproject-f66b2.firebaseio.com",
    projectId: "iconproject-f66b2",
    storageBucket: "iconproject-f66b2.appspot.com",
    messagingSenderId: "852622610852",
    appId: "1:852622610852:web:1f26111fd604ad5b"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const db = firebase.firestore()

app.engine('hbs', engines.handlebars);

app.set('views', `./views`);
app.set('view engine', `hbs`);

app.get('/home', (req, res) => {
    console.log(req.body.username);

    res.render('home')
})

// app.post('/collection', (req, res) => {
//     db.collection("users").add({
//             username: req.body.username,
//             uid: req.body.uid
//         })
//         .then(function (docRef) {
//             console.log("Document written with ID: ", docRef.uid);
//         })
//         .catch(function (error) {
//             console.error("Error adding document: ", error);
//     });
//     res.render('test')

// })




//================SEND EMAIL========================

var directTransport = require('nodemailer-direct-transport');
var nodemailer = require('nodemailer');
var options = {};
var transporter = nodemailer.createTransport(directTransport(options))

var nodemailer = require('nodemailer');




app.post('/sendEmail', (req, res) => {
    var data = req.body
    var email = data.email
    console.log(data.uid);
    

    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            type: 'OAuth2',
            user: email
        }
    });
    
    transporter.set('oauth2_provision_cb', (user, renew, callback)=>{
        let accessToken = userTokens[user];
        if(!accessToken){
            return callback(new Error('Unknown user'));
        }else{
            return callback(null, accessToken);
        }
    });

    var mailOptions = {
        from: email,
        to: 'bilaartawirawan@gmail.com',
        subject: 'Sending Email using Node.js',
        text: 'That was easy!'
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      }); 
})





//================SEND EMAIL========================

app.get(`/test`, (req, res) => {
    res.set('Cache-Control', `public, max-age=300 s-maxage=600`);

    res.render('test')
})

app.get(`/home`, (req, res) => {
    res.set('Cache-Control', `public, max-age=300 s-maxage=600`);

    res.render('home')
})


app.get('/', (req, res) => {
    res.set('Cache-Control', `public, max-age=300 s-maxage=600`);
    res.render('login.hbs')
})

// app.get('/', (req,res) => {
//     res.set('Cache-Control', `public, max-age=300 s-maxage=600`);
//     res.send(`${Date.now()}`)
// })

app.get(`*`, (req, res) => {
    // res.set('Cache-Control', `public, max-age=300 s-maxage=600`);
    res.send('ERROR PAGE NOT FOUND')
})
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.App = functions.https.onRequest(app);