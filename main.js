var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.urlencoded({extended:false}));
var fs = require('fs');
var path = require('path');

app.listen(3000, function(){
    console.log('Listening on port 3000');
})

// Jade Template Engine의 소스를 깔끔하게 보기 위한 코드.
app.locals.pretty = true;
app.set('view engine', 'jade');
app.set('views', path.join(__dirname, './doosan'));

app.get('/', (req ,res)=>{
    res.redirect('/main');
})

app.get('/main', (req, res) => {
    var backnumber = req.query.backnumber;
    var coaches = JSON.parse(fs.readFileSync("./players/coaches.json", "utf-8"));
    var pitchers = JSON.parse(fs.readFileSync("./players/pitchers.json", "utf-8"));
    var batters = JSON.parse(fs.readFileSync("./players/batters.json", "utf-8"));

    if (backnumber) {
        fs.readFile('players/' + backnumber, 'utf-8', function(err, data) {
            if (err){
                console.log(err);
                res.render('error');
            } else {
                res.render('players', {number: backnumber, description: data.split('\n')});
            }
        });
    } else {
        res.render('search', { coaches: coaches, pitchers: pitchers, batters: batters });
    }
});

app.get('/comment', (req, res) => {
    var backnumber = req.query.backnumber;
    var comment = req.query.comment;

    if (!backnumber || !comment) {
        res.render('error', { message: '등번호 혹은 댓글 정보가 누락되었습니다.' });
        return;
    }

    fs.appendFile('players/' + backnumber, '\n' + comment, function(err) {
        if (err) {
            console.log(err);
            res.render('error');
        } else {
            res.redirect('/main?backnumber=' + backnumber);
        }
    });
});