const express = require('express')
const app = express()
const cors = require('cors')
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 5000
require('dotenv').config();

const nodemailer = require('nodemailer');
const log = console.log;

//middle ware
app.use(cors());
app.use(express.json());




const uri = "mongodb+srv://iqradb22:TnlCkMSG3F13HDb1@cluster0.lsvtkkf.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
      const contactCollection = client.db('iqradb22').collection('contact')
      const QuickRequestsCollection = client.db('iqradb22').collection('quickRequests')
      const RequestsDemoCollection = client.db('iqradb22').collection('requests')


      //Request Demo Home Information
      app.post('/quickRequests', async(req,res) => {
        const uiPhone = req.body
        const phone = req.body.phone

        // Step 1
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD 
            }
        });
        // Step 2
        let mailOptions = {
            from: process.env.EMAIL, // TODO: email sender
            to: process.env.EMAIL, // TODO: email receiver
            cc: 'iqrasysinfo@gmail.com, webiqra22@gmail.com',
            subject: 'Request Demo Home',
            text: `
            phone : ${phone} 
            `, 
        };

        // Step 3
        transporter.sendMail(mailOptions, (err, data) => {
            if (err) {
                return log('Error occurs', err);
            }
            return log('Email sent!!!');
        });


        const result = await QuickRequestsCollection.insertOne(uiPhone)
        res.send(result)
      })

      // Request Demo User Information
      app.post('/requests', async(req,res) => {
        const demo = req.body
        const name = req.body.name
        const email = req.body.email
        const phone = req.body.phone
        const text = req.body.text
        const solutions = req.body.solutions

        // Step 1
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD 
            }
        });

        // Step 2
        let mailOptions = {
            from: process.env.EMAIL, // TODO: email sender
            to: email, // TODO: email receiver
            cc: 'iqrasysinfo@gmail.com, webiqra22@gmail.com',
            subject: 'Request Demo',
            text: `
            name : ${name} 
            phone : ${phone} 
            message : ${text}
            email : ${email}
            solutions : ${solutions}
            `, 
        };

        // Step 3
        transporter.sendMail(mailOptions, (err, data) => {
            if (err) {
                return log('Error occurs', err);
            }
            return log('Email sent!!!');
        });

        const result = await RequestsDemoCollection.insertOne(demo)
        res.send(result)

      })


      //Contact Us User Information
      app.post('/contact', async (req, res) => {
            const msg = req.body
            const email = req.body.email
            const name = req.body.name
            const phone = req.body.phone
            const text = req.body.text

            // Step 1
            let transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL,
                    pass: process.env.PASSWORD 
                }
            });

            // Step 2
            let mailOptions = {
                from: process.env.EMAIL, // TODO: email sender
                to: email, // TODO: email receiver
                cc: 'iqrasysinfo@gmail.com, webiqra22@gmail.com',
                subject: 'Contact Us',
                text: `
                name : ${name} 
                phone : ${phone} 
                message : ${text}
                email : ${email}
                `, 
            };

            // Step 3
            transporter.sendMail(mailOptions, (err, data) => {
                if (err) {
                    return log('Error occurs', err);
                }
                return log('Email sent!!!');
            });

            const result = await contactCollection.insertOne(msg)
            res.send(result)
      })


      app.get('/contact', async(req, res) => {
        const query = {}
        const result = await contactCollection.find(query).toArray()
        res.send(result)
      })
  
  
    } finally {
      
    }
  }
  run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('Hello World!')
})


app.listen(port, () => {
console.log(`Example app listening on port ${port}`)
})