var express = require('express');
var router = express.Router();
const fs = require('fs');
var json2csv = require('async-json2csv');
const csv = require('csvtojson');
/* GET home page. */

var total = [
    {
        code: "CD0001",
        total: 0,
        count: 0,
        avg: 0,
    },
    {
        code: "CD0002",
        total: 0,
        count: 0,
        avg: 0,
    },
    {
        code: "CD0003",
        total: 0,
        count: 0,
        avg: 0,
    },
    {
        code: "CD0004",
        total: 0,
        count: 0,
        avg: 0,
    },
    {
        code: "CD0005",
        total: 0,
        count: 0,
        avg: 0,
    },
    {
        code: "CD0006",
        total: 0,
        count: 0,
        avg: 0,
    },
    {
        code: "CD0007",
        total: 0,
        count: 0,
        avg: 0,
    },
    {
        code: "CD0008",
        total: 0,
        count: 0,
        avg: 0,
    },
    {
        code: "CD0009",
        total: 0,
        count: 0,
        avg: 0,
    },
    {
        code: "CD0010",
        total: 0,
        count: 0,
        avg: 0,
    },
    {
        code: "CD0011",
        total: 0,
        count: 0,
        avg: 0,
    },
    {
        code: "CD0012",
        total: 0,
        count: 0,
        avg: 0,
    },
]
router.get('/', (req, res) => {
    for (let i = 0; i < total.length; i++) {
        total[i].count = 0;
        total[i].total = 0;
    }
    csv()
        .fromFile('./e.csv')
        .then((jsonObj) => {

            for (let i = 0; i < total.length; i++) {
                for (let j = 0; j < jsonObj.length; j++) {

                    if (total[i].code == jsonObj[j].code) {
                        total[i].total += Number(jsonObj[j].num);
                        total[i].count++;
                    }
                }
            }
            for (let i = 0; i < total.length; i++) {
                total[i].avg = (total[i].total / total[i].count);

            }


        })

    res.sendFile(__dirname + '/index.html')
});


router.get('/ajax/:id/:query', (req, res) => {
    console.log(total);
    csv()
        .fromFile('subject.csv')
        .then((jsonObj) => {
            let data = [];
            for (let i = 0; i < jsonObj.length; i++) {
                jsonObj[i].avg = total[i].avg;
                data.push(jsonObj[i]);

            }
            let resdata = [];

            if (req.params.id == 0 && req.params.query == 0) {
                res.json(data);
            } else if (req.params.id == 1) {//이름
                console.log(req.params);
                for (let i = 0; i < data.length; i++) {
                    if (data[i].name.indexOf(req.params.query) != -1) {
                        resdata.push(data[i]);
                    }
                }
                res.json(resdata);
            }
            else if (req.params.id == 2) {//코드
                for (let i = 0; i < data.length; i++) {
                    if (data[i].code.indexOf(req.params.query) != -1) {
                        resdata.push(data[i]);
                    }
                }
                res.json(resdata);
            }
            else if (req.params.id == 3) {//학년
                for (let i = 0; i < data.length; i++) {
                    if (data[i].grade.indexOf(req.params.query) != -1) {
                        resdata.push(data[i]);
                    }
                }
                res.json(resdata);
            }

        })

});
router.post('/sign', async (req, res) => {

    reqdata = {
        id: req.body.id,
        pw: req.body.pw,
        name: req.body.name,
    }
    const options = {
        data: [reqdata],
        fields: ['id', 'pw', 'name'],
        header: false
    }
    //console.log(options.data);
    const CsvData = await json2csv(options);
    await fs.appendFileSync('./user.csv', CsvData);

    res.json("성공");


});
router.post('/login', (req, res) => {
    console.log(req.body);

    csv()
        .fromFile('./user.csv')
        .then((jsonObj) => {
            let resData = {
                msg: "",
                name: ""
            }
            for (var i = 0; i < jsonObj.length; i++) {
                console.log(jsonObj[i].id)
                console.log(jsonObj[i].pw)
                if (req.body.id == jsonObj[i].id && req.body.pw == jsonObj[i].pw) {
                    resData.name = jsonObj[i].name;
                    resData.msg = "성공";
                    break;
                }
            }
            if (i == jsonObj.length) {
                resData.msg = "실패";
            }
            res.json(resData);
        })

});
router.post('/evaluation/write', async (req, res) => {
    console.log(req.body);
    reqdata = {
        code: req.body.code,
        text: req.body.text,
        num: Number(req.body.num),
    }
    const options = {
        data: [reqdata],
        fields: ['code', 'text', 'num'],
        header: false
    }
    //console.log(options.data);
    const CsvData = await json2csv(options);
    await fs.appendFileSync('./e.csv', CsvData);

    res.json("성공");
});
router.get('/evaluation/read/:idx', (req, res) => {
    console.log(req.params.idx);

    csv()
        .fromFile('./e.csv')
        .then((jsonObj) => {
            let resData = [];
            for (let i = 0; i < jsonObj.length; i++) {
                if (jsonObj[i].code == req.params.idx) {
                    resData.push(jsonObj[i]);
                }
            }
            res.json(resData);
        })

});
module.exports = router;
