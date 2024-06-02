var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.urlencoded({extended:false}));
var fs = require('fs');

app.listen(3000, function(){
    console.log('Listening on port 3000');
})

// Jade Template Engine의 소스를 깔끔하게 보기 위한 코드.
app.locals.pretty = true;
app.set('view engine', 'jade');
app.set('views', './doosan');

app.get('/main', (req, res) => {
    res.render('search');
})

app.post('/main', (req, res) => {
    var backnumber = req.body.backnumber;
    fs.readFile('players/' + backnumber, 'utf-8', function(err, data) {
        if (err){
            console.log(err);
            res.render('error');
        }
        res.render('players', {number: backnumber, description: data.split('\n')});
    })
})