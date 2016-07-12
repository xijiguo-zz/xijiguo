var express = require('express');
var app = express();

app.use(express.static(__dirname + '/'));
app.use('/slack', express.static(__dirname + '/slack'));

app.listen(3000);