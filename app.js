var express = require('express');

var bodyParser = require('body-parser');
var session = require('express-session');
var expressValidator = require('express-validator');
var expressMessages = require('express-messages');
var path = require('path');
var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, '/public')));
// 5. fix khi xuất báo cáo ra file excel
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(bodyParser.json({limit: '50mb', extended: true}));
app.locals.errors = null;
var server = require("http").Server(app);
server.listen(3000);

var test = require('./routes/test.js');
app.use('/',test);

app.get('*', function(req, res){
    res.render('error_404', {
        title: 'Trang không tồn tại'
    });
})