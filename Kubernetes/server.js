const express = require('express');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/test'
const VERSION = '0.1'

// DB
mongoose.connect(MONGODB_URI, (err) => {
    console.log('Mongodb connected')
});
const PageVisitSchema = new mongoose.Schema({
    name: String,
    node: String,
}, { timestamps: true })
PageVisitSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 });

const PageVisit = mongoose.model('PageVisit', PageVisitSchema);

// App
const app = express();
app.get('/signup/:name', async (req, res) => {
    const { name } = req.params

    const ins = new PageVisit({ name, node: process.env.HOSTNAME })

    await ins.save()

    res.json({
        status: 200,
        data: {
            msg: `Hello ${name}, ${process.env.DEMO_GREETING}`,
            from: process.env.HOSTNAME,
        },
        _v: VERSION
    });
});

app.get('/list', async (req, res) => {

    const queries = await PageVisit.find()
        .select({name:1, createdAt: 1})
        .sort({ createdAt: -1 })
        .limit(100)
        .exec()

    res.json({
        status: 200,
        data: queries,
        _v: VERSION
    })
})

app.get('/', (req, res) => {
    res.json({
        status: 200,
        data: {
            msg: 'I am ok!',
            from: process.env.HOSTNAME,
        },
        _v: VERSION
    });
})

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);