var express = require('express');
var exphbs = require('express-handlebars');
var app = express();

var fortunes = [
    "Conquer your fears or they will conquer you.",
    "Rivers need springs.",
    "Do not fear what you don't know.",
    "You will have a pleasant surprise.",
    "Whenever possible, keep it simple.",
];

app.engine('handlebars', exphbs({defaultLayout: 'main'}))
app.set('view engine', 'handlebars');

app.set('port', process.env.PORT || 3000);

app.use(express.static(__dirname + '/public'));

// some Routs
app.get('/', function (req, res) {
    res.render('home');
});

app.get('/about', function (req, res) {
    var randomForture = fortunes[Math.floor(Math.random() * fortunes.length)];
    res.render('about', {fortune: randomForture});
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