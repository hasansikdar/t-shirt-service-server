const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');

//middleware
app.use(cors());
app.use(express.json());
require('dotenv').config();


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASSWORD}@cluster0.i9b8vs8.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try{
        const serviceCollection = client.db('individual-service').collection('services');
        const reviewsCollection = client.db('individual-service').collection('reviews');

        app.post('/addService', async(req, res) =>{
            const service = req.body;
            const result = await serviceCollection.insertOne(service);
            res.send(result);
        })

        app.get('/services', async(req, res) => {

            const email = req.query.email;

            const cursor = serviceCollection.find({});
            const result = await cursor.toArray();
            res.send(result);
        })
        app.delete('/services/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await serviceCollection.deleteOne(query);
            res.send(result);
        })
        app.get('/homeServices', async(req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query);
            const result = await cursor.limit(3).toArray();
            res.send(result);
        })
        app.get('/services/:id', async(req, res) =>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result  = await serviceCollection.findOne(query)
            res.send(result);
        })
        app.post('/reviews', async(req, res) =>{
            const review = req.body;
            const result = await reviewsCollection.insertOne(review);
            res.send(result);
            
        })
        app.get('/myReviews', async(req, res) =>{
            const email = req.query.email;
            const cursor = reviewsCollection.find({});
            const result = await cursor.toArray();
            const myReviewsFiltering = result.filter(rev => rev.userEmail === email);
            res.send(myReviewsFiltering);
        })
        app.get('/productReviews', async(req, res) => {
            const id = req.query.serviceID;
            const query = {};
            const cursor = reviewsCollection.find(query);
            const result = await cursor.toArray();
            const filteringServiceId = result.filter(review => review.serviceID === id);
            res.send(filteringServiceId);
        })
        app.delete('/productReviews/:id', async(req, res) =>{
            const id = req.params.id;
            const query = {_id:ObjectId(id)};
            const result = await reviewsCollection.deleteOne(query);
            res.send(result);
        })
    }
    finally{

    }



}
run().catch(error => console.log(error));







app.get('/', (req, res) =>{
    res.send('t-shirt server is running')
})
app.listen(port, (req, res) => console.log('t-shirt server is running'))