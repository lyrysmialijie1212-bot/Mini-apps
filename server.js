const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const PORT = process.env.PORT || 3001;
const mongoUrl = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017';
const dbName = 'moodSwingDB';
let db;

MongoClient.connect(mongoUrl)
  .then(client => {
    db = client.db(dbName);
    console.log('MongoDB connected');
  })
  .catch(err => console.error(err));

app.post('/submit-score', async (req,res)=>{
  const {username, score} = req.body;
  if(!username || score==null) return res.status(400).send('Invalid data');
  await db.collection('scores').insertOne({username, score, date:new Date()});
  res.send({success:true});
});

app.get('/leaderboard', async (req,res)=>{
  const topScores = await db.collection('scores').find({}).sort({score:-1}).limit(10).toArray();
  res.send(topScores);
});

app.listen(PORT, ()=>console.log(`Server running on port ${PORT}`));
