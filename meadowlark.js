var express = require('express');
var exphbs = require('express-handlebars');
var app = express();

var fortunes = require('./lib/fortune');

app.engine('handlebars', exphbs({defaultLayout: 'main'}))
app.set('view engine', 'handlebars');

app.set('port', process.env.PORT || 3000);

app.use(express.static(__dirname + '/public'));

// some Routs
app.get('/', function (req, res) {
    res.render('home');
});

app.get('/about', function (req, res) {
    res.render('about', {fortune: fortunes.getFortune()});
});

//Custom 404 page
app.use(function (req, res) {
    res.status(404);
    res.render('404');
});

// Custom 505 page
app.use(function (err, req, res, next) {
    res.status(505);
    res.render('505');
});

app.listen(app.get('port'), function () {
    console.log('Express started on http://localhost:' +
        app.get('port') + '; press Ctrl-C to terminate.');
})