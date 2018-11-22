var express = require('express');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;

var app = express();
var db;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Rest for news
app.post('/news', function (req, res) {
    console.log(req.body.title);
    var news = {
        title: req.body.title,
        news_comment: req.body.news_comment
    };

    db.db().collection('news').insert(news, function (err, result) {
        if (err) {
            console.log(err);
            return res.sendStatus(500);
        }

        res.send(news)
    });
});


app.put('/news/:id', function (req, res) {
    let news = {
        name: req.body.title,
        news_comment: req.body.news_comment
    };

    db.db().collection('news').updateOne(
        {_id: ObjectID(req.params.id)},
        {$set: news},
        function (err, result) {
            if (err) {
                console.log(err);
                return res.sendStatus(500);
            }
            res.sendStatus(200);
        }
    )
});


app.delete('/news/:id', function (req, res) {
    db.db().collection('news').deleteOne(
        {_id: ObjectID(req.params.id)},
        function (err, result) {
            if (err) {
                console.log(err);
                return res.sendStatus(500);
            }
            res.sendStatus(200);
        }
    )
});


app.get('/news', function (req, res) {
    db.db().collection('news').find().toArray(function (err, docs) {
        if (err) {
            console.log(err);
            return res.sendStatus(500);
        }

        res.send(docs)
    })
});


app.get('/news/:id', function (req, res) {
    db.db().collection('news').findOne({_id: ObjectID(req.params.id)}, function (err, doc) {
        if (err) {
            console.log(err);
            return res.sendStatus(500);
        }
        res.send(doc)
    });

});


// Rest for appeals
app.post('/appeals', function (req, res) {
    console.log(req.body.title);
    var appeal = {
        appeal: req.body.appeal,
    };

    db.db().collection('appeals').insert(appeal, function (err, result) {
        if (err) {
            console.log(err);
            return res.sendStatus(500);
        }

        res.send(appeal)
    });
});


app.put('/appeals/:id', function (req, res) {
    var appeal = {
        appeal: req.body.appeal,
    };

    db.db().collection('appeals').updateOne(
        {_id: ObjectID(req.params.id)},
        {$set: appeal},
        function (err, result) {
            if (err) {
                console.log(err);
                return res.sendStatus(500);
            }
            res.sendStatus(200);
        }
    )
});


app.delete('/appeals/:id', function (req, res) {
    db.db().collection('appeals').deleteOne(
        {_id: ObjectID(req.params.id)},
        function (err, result) {
            if (err) {
                console.log(err);
                return res.sendStatus(500);
            }
            res.sendStatus(200);
        }
    )
});


app.get('/appeals', function (req, res) {
    db.db().collection('appeals').find().toArray(function (err, docs) {
        if (err) {
            console.log(err);
            return res.sendStatus(500);
        }

        res.send(docs)
    })
});


app.get('/appeals/:id', function (req, res) {
    db.db().collection('appeals').findOne({_id: ObjectID(req.params.id)}, function (err, doc) {
        if (err) {
            console.log(err);
            return res.sendStatus(500);
        }
        res.send(doc)
    });

});






app.get('/', function (req, res) {
    res.send('Hello API')
});

MongoClient.connect('mongodb://localhost:27017/parkour_site_db', function (err, database) {
    if (err) {
        return console.log(err);
    }

    db = database;
    app.listen(3012, function () {
        console.log('Api app started')
    });
});