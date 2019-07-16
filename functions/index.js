const functions = require('firebase-functions');
const express = require('express');
const bodyParser = require('body-parser');
const firebase = require('firebase-admin')
const engines = require(`consolidate`);
const path = require('path');
require('dotenv').config()


const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

const cf = {
    apiKey: process.env.apiKey,
    authDomain: process.env.authDomain,
    databaseURL: process.env.databaseURL,
    projectId: process.env.projectId,
    storageBucket: process.env.storageBucket,
    messagingSenderId: process.env.messagingSenderId,
    appId: process.env.appId
}

// Initialize Firebase
firebase.initializeApp(cf);
const auth = firebase.auth()
const db = firebase.firestore()

app.engine('hbs', engines.handlebars);

app.set('views', `./views`);
app.set('view engine', `hbs`);


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


app.post('/sendEmail', (req, res) => {
    var data = req.body
    var email = data.email
    console.log(data.uid);
    console.log('send email');
    console.log(process.env.pass);


    var transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            type: 'login',
            user: process.env.email,
            pass: process.env.pass

        }
    });

    var mailOptions = {
        from: 'bilaarta@gmail.com',
        to: 'bilaartawirawan@gmail.com',
        subject: 'Sending Email using Node.js',
        text: 'That was easy!'
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    })
})



//================SEND EMAIL========================

//================input data========================
app.post('/addSo', (req, res) => {
    var data = req.body
    console.log(data);
    res.render('dasboard', {
        title: 'dataSO',
        data: data
    })
})


//================input data========================

app.get(`/test`, (req, res) => {
    res.set('Cache-Control', `public, max-age=300 s-maxage=600`);

    res.render('test', {
        dataFb : cf
    })
})

app.get(`/home`, (req, res) => {
    res.set('Cache-Control', `public, max-age=300 s-maxage=600`);

    res.render('dasboard', {
        dataFb: cf
    })
})

app.get(`/app/home`, (req, res) => {
    res.set('Cache-Control', `public, max-age=300 s-maxage=600`);

    res.render('dasboard', {
        dataFb: cf
    })
})


app.get('/', (req, res) => {
    res.set('Cache-Control', `public, max-age=300 s-maxage=600`);
    
    res.render('login.hbs', {
        dataFb: cf
    })
})


app.get(`*`, (req, res) => {
    // res.set('Cache-Control', `public, max-age=300 s-maxage=600`);
    res.send('ERROR PAGE NOT FOUND')
})
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.app = functions.https.onRequest(app);