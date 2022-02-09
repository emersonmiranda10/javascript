const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true }))
app.use(bodyParser.json())
app.use(cors());
app.use(express.json());
require('./src/Routes/index')(app);
app.listen(3333);
