const express = require('express')
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
require('dotenv').config()
const port = process.env.PORT || 5000


// middlewhare
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ibql9.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        await client.connect();

        const ApiCollection = client.db("IELTS-Proficiency").collection("api");
        const FormCollection = client.db("IELTS-Proficiency").collection("form");

        // get data into database
        app.get('/api', async (req, res) => {
            const result = await ApiCollection.find().toArray()
            res.send(result)
        })

        // Post data into database
        app.post('/addData', async (req, res) => {
            const query = req.body
            const result = await ApiCollection.insertOne(query)
            res.send(result)
        })

        // delete api
        app.delete('/api/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await ApiCollection.deleteOne(query)
            res.send(result)
        })

        // update api
        app.put('/api/:id', async (req, res) => {
            const id = req.params.id
            console.log(id)
            const data = req.body
            console.log(data)
            const query = { _id: ObjectId(id) }
            const upsert = { upsert: true }
            const updateDoc = {
                $set: data
            }
            const result = await ApiCollection.updateOne(query, updateDoc, upsert)
            res.send(result)
        })

        // post user signIn Information
        app.post('/form', async (req, res) => {
            const data = req.body
            const result = await FormCollection.insertOne(data)
            res.send(result)
        })

        // Update User Information
        app.put('/form/:email', async (req, res) => {
            const email = req.params.email
            console.log(email)
            const user = req.body
            const filter = { email: email };
            const option = { upsert: true };
            const updateDoc = {
                $set: user,
            }
            const result = await FormCollection.updateOne(filter, updateDoc, option)
            res.send(result)
        })

    }

    finally {
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hello From IELTS Proficiency!')
})

app.listen(port, () => {
    console.log(`IELTS Proficiency listening on port ${port}`)
})

