const express = require('express');
const app = express();
const { MongoClient, ObjectId } = require('mongodb')
const methodOverride = require('method-override')


app.use(methodOverride('_method'));
app.use(express.json()); 
app.use(express.urlencoded({extended:true}));
require('dotenv').config();

let db
const url = process.env.mongodb_URL;
new MongoClient(url).connect().then((client)=>{
  console.log('DB연결성공')
  db = client.db('forum')
}).catch((err)=>{
  console.log(err)
})

app.set('view engine', 'ejs'); 


app.listen('3000', () => {
    console.log('http://localhost:3000');
})

app.get("/", (req, res) => {
    res.render('index.ejs');
})

app.get("/list", async (req, res) => {
    let result = await db.collection('post').find().toArray();
    res.render('list.ejs', { result });
})

app.get('/write', (req, res) => {
    res.render('write.ejs');
})

app.post('/post_add', async (req, res) => {
    await db.collection('post').insertOne({ title: req.body.title, content: req.body.content });
    res.redirect('/list');
})

app.get("/detail/:id", async (req, res) => {
    let result = await db.collection('post').findOne({ _id: new ObjectId(req.params.id)});
    res.render('detail.ejs', { result });
})

app.get('/edit/:id', async (req, res) => {
    let result = await db.collection('post').findOne({ _id: new ObjectId(req.params.id)});
    res.render('edit.ejs', { result });
})
app.put('/post_edit', async(req, res) => {
    await db.collection('post').updateOne({ _id: new ObjectId(req.body.id)}, {$set: {title: req.body.title, content: req.body.content}});
    res.redirect("/list");
})
app.get('/delete/:id', async(req, res) => {
    await db.collection('post').deleteOne({ _id: new ObjectId(req.params.id)});
    res.redirect('/list');
})