var express = require('express');
var exphbs = require('express-handlebars');
var app = express();

var fortunes = require('./lib/fortune');

app.engine('handlebars', exphbs({defaultLayout: 'main'}))
app.set('view engine', 'handlebars');

app.set('port', process.env.PORT || 3000);

app.use(express.static(__dirname + '/public'));

app.use(function (req, res, next) {
    res.locals.showTests = app.get('env') !== 'production' && req.query.test === '1';
    next();
})

// some Routes
app.get('/', function (req, res) {
    res.render('home');
});

app.get('/about', function (req, res) {
    res.render('about',
        {
            fortune: fortunes.getFortune(),
            pageTestScript: '/qa/tests-about.js'
        });
});

app.get('/tours/hood-river', function (req, res) {
    res.render('tours/hood-river');
});

app.get('', function (req, res) {
    res.render('tours/request-group-rate');
});

app.get('/headers', function(req,res){
    res.set('Content-Type','text/plain');
    var s = '';
    for(var name in req.headers) s += name + ': ' + req.headers[name] + '\n';
    res.send(s);
});

//Custom 404 page
app.use(function (req, res) {
    res.status(404);
    res.render('404');
});

// Custom 505 page
app.use(function (err, req, res, next) {
    res.status(505);
    res.render('505', {errorMessage: err});
});

app.listen(app.get('port'), function () {
    console.log('Express started on http://localhost:' +
        app.get('port') + '; press Ctrl-C to terminate.');
})