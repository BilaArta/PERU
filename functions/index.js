const functions = require('firebase-functions');
const express = require('express');
const bodyParser = require('body-parser');
const firebase = require('firebase-admin')
const engines = require(`consolidate`);
const database = require('firebase')
const path = require('path');
var nodemailer = require('nodemailer');
var directTransport = require('nodemailer-direct-transport');

var serviceAccount = require("./iconproject-f66b2-firebase-adminsdk-fddzn-d35c016d01.json");


const cors = require('cors')({
    origin: true
});

require('dotenv').config()

const app = express();
const test = express();
// test.use(cors); 
// app.use(cors);




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
const db = firebase.firestore()

app.engine('hbs', engines.handlebars);

app.set('views', `./views`);
app.set('view engine', `hbs`);


app.get(`/test`, (req, res) => {
    res.set('Cache-Control', `public, max-age=300 s-maxage=600`);

    res.render('test', {
        dataFb: cf
    })
})

app.get(`/home`, (req, res) => {
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

app.get('/home/:id', (req, res) => {
    cors(req, res, () => {
        var data = "Data not Found"
        var ref = db.collection("Data SO").get()
        ref.then((docs) => {
            docs.forEach((doc) => {
                if (doc.id == req.params.id) {
                    data = doc.data();
                }
            })
            console.log(data)
            res.render('viewData', {
                dataFb: cf,
                data: data,
                params : req.params.id
            })
        }).catch((err) => {
            data = err;
            res.send(err)
        })
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

exports.sendmail = functions.https.onRequest((req, res) => {
    cors(req, res, () => {
        console.log(req.body.data.sendTo);

        var data = req.body.data
        var sendTo = data.sendTo.toString()
        var cc = data.CC.toString()
        var from = data.from
        var subject = data.subject
        var link = data.link

        process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

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
            text: "Email from : " + from+". \n link dokumen : " +link
        };
        // console.log(".....");
        return mail.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log("error");
                console.log(error);
                res.send({
                    data: 'Error sent Email'
                });
            } else {
                console.log('Email sent: ' + info.response);
                res.send({
                    data: 'Email sent',
                    doc: data.doc
                });
            }
        })
    })

})