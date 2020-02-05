const express = require('express')
const consign = require('consign')
const bodyParser = require('body-parser')

const app = express(),
  port = process.env.PORT || 4004;

app.use((_, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next()
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


consign().include('app/controllers')
  .then('app/routes')
  .into(app)

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})