var express = require('express');

var exphbs = require('express-handlebars').create({
    defaultLayout: 'main',
    helpers: {
        section: function (name, options) {
            if (!this._sections) this._sections = {};
            this._sections[name] = options.fn(this);
            return null;
        }
    }
});

var formidable = require('formidable');

var app = express();

var fortunes = require('./lib/fortune');

app.engine('handlebars', exphbs.engine)
app.set('view engine', 'handlebars');

app.set('port', process.env.PORT || 3000);

app.use(express.static(__dirname + '/public'));
app.use(require('body-parser')());

app.use(function (req, res, next) {
    res.locals.showTests = app.get('env') !== 'production' && req.query.test === '1';
    next();
})

// some Routes

app.get('/contest/vacation-photo', function (req, res) {
    var now = new Date();
    res.render('contest/vacation-photo',
        {year: now.getFullYear(), month: now.getMonth()}
    )
});

app.post('/contest/vacation-photo/:year/:month', function (req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files){
        if(err) return res.redirect(303, '/error');
        console.log('received fields:');
        console.log(fields);
        console.log('received files:');
        console.log(files);
        res.redirect(303, '/thank-you');
    });
})

app.get('/newsletter', function (rep, res) {
    res.render('newsletter', {csrf: 'CSRF token goes here'})
});

app.post('/process', function (req, res) {
    console.log('Form (from querystring): ' + req.query.form);
    console.log('CSRF token (from hidden form field): ' + req.body._csrf);
    console.log('Name (from visible form field): ' + req.body.name);
    console.log('Email (from visible form field): ' + req.body.email);

    if (req.xhr || req.accepts('json,html') === 'json') {
        res.send({success: true});
    } else {
        res.redirect(303, '/thank-you');
    }
});

app.get('/', function (req, res) {
    res.render('home', {
        currency: {
            name: 'United States dollars',
            abbrev: 'USD',
        },
        tours: [
            {name: 'Hood River', price: '$99.95'},
            {name: 'Oregon Coast', price: '$159.95'},
        ],
        specialsUrl: '/january-specials',
        currencies: ['USD', 'GBP', 'BTC']
    });
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

app.get('/headers', function (req, res) {
    res.set('Content-Type', 'text/plain');
    var s = '';
    for (var name in req.headers) s += name + ': ' + req.headers[name] + '\n';
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