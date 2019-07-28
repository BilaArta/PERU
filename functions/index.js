const functions = require('firebase-functions');
const express = require('express');
const bodyParser = require('body-parser');
const firebase = require('firebase-admin')
const engines = require(`consolidate`);
const database = require('firebase')
const path = require('path');
var nodemailer = require('nodemailer');
var directTransport = require('nodemailer-direct-transport');

var serviceAccount = require("service-adminSDK.json");


const cors = require('cors')({origin: true});

require('dotenv').config()

const app = express();
app.use(cors);


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
};

const AdminSDK = {
    credential: firebase.credential.cert(serviceAccount),
    databaseURL: "https://iconproject-f66b2.firebaseio.com"
}
// Initialize Firebase
firebase.initializeApp(AdminSDK)
const db = firebase.database()

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


app.get('/sendEmail', (req, res) => {
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


app.get("/home/email", (req,res) => {
    console.log(req.body.n);
    res.render('dasboard')
}) 
// https://medium.com/@mariusc23/send-an-email-using-only-javascript-b53319616782
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
        dataFb: cf,
        sendmail : transporter
    })
})

app.get(`/app/home`, (req, res) => {
    res.set('Cache-Control', `public, max-age=300 s-maxage=600`);

    res.render('dasboard', {
        dataFb: cf,
        sendmail : transporter
    })
})


app.get('/', (req, res) => {
    res.set('Cache-Control', `public, max-age=300 s-maxage=600`);
    
    res.render('login.hbs', {
        dataFb: cf,
        sendmail : transporter
    })
})


app.get(`*`, (req, res) => {
    // res.set('Cache-Control', `public, max-age=300 s-maxage=600`);
    res.send('ERROR PAGE NOT FOUND')
})
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//

function sendEmailApp (sendTo, cc, subject, from){
    // console.log(data.text);
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    // console.log("req.body");
    // const text = data.text
    var mail = nodemailer.createTransport({
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
        from: from,
        to: sendTo,
        cc: cc,
        subject: subject,
        text: 'Test nodemailer To : '+ sendTo +", CC to "+cc
    };
    console.log(".....");
    mail.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log("error");
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    })
    return true
}

exports.app = functions.https.onRequest(app);

exports.sendmail = functions.https.onRequest((req,res) => {
    var data = req.body.data
    var sendTo = data.sendTo.toString()
    var cc = data.CC.toString()
    var from = data.from
    var subject = data.subject
    // send = sendEmailApp(sendto, cc, data.subject, data.from)
    // if(send){
    //     console.log("sent");
    // }

    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    // console.log("req.body");
    // const text = data.text
    var mail = nodemailer.createTransport({
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
        from: from,
        to: sendTo,
        cc: cc,
        subject: subject,
        text: 'Test nodemailer To : '+ sendTo +", CC to "+cc
    };
    console.log(".....");
    return mail.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log("error");
            console.log(error);
            res.send({ data: 'Error sent Email' });
        } else {
            console.log('Email sent: ' + info.response);
            res.send({ data: 'Email sent' });
        }
    })

})
