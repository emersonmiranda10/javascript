const express = require('express');
const cors = require('cors');

const app = express();
const bodyParser = require('body-parser');
const config = require('./config');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());
require('./src/Routes/index')(app);

app.listen(config.PORT, config.HOST, () => {
    console.log(`APP LISTENING ON http://${config.HOST}:${config.PORT}`);
});
