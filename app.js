const express = require('express')
const consign = require('consign')
const bodyParser = require('body-parser')

const app = express(),
  port = process.env.PORT || 4004;


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


consign().include('app/controllers')
  .then('app/routes')
  .into(app)


app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})