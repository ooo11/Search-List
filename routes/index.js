const auth = require('http-auth');
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const { check, validationResult } = require('express-validator');
const cors = require('cors');

const router = express.Router();
const Registration = mongoose.model('Registration');
const DataDE17 = mongoose.model('DataDE17'); //add this to define and mongoose.model (file name here)
const DataDK20 = mongoose.model('DataDK20'); //add this to define and mongoose.model (file name here)
const basic = auth.basic({
  file: path.join(__dirname, '../users.htpasswd'),
});

router.get('/addparts', (req, res) => {
  res.render('form', { title: 'Registration form' });
});

router.post('/',
  [
    //add requirement here if needed
    check('PartName')
      .isLength({ min: 1 })
      .withMessage('Part Name required!'),
    check('PartNo')
        .isLength({ min: 1 })
        .withMessage('Part Number required!'),
    check('Model')
        .isLength({ min: 1 })
        .withMessage('Select Others if no model selected!'),
  ],
    (req, res) => {
      const errors = validationResult(req);

      if (errors.isEmpty()) {
        req.body.Tags = req.body.Tags.replace(/\s/g, '').split(",");
        const datadk20 = new DataDK20(req.body); //-here to make new collection into mgoose
          DataDK20.findOne(req.body, function (err, success) {
            if (err) {
                console.log(err);
                res.send(err);
            }else {
              
              if (success == null) {
                  datadk20.save(function (err, success) {
                      if (err) {
                          console.log(err);
                          res.send(err);
                      }
                      else {
                          res.send("success");
                      }
                  });

              } else {
                res.send("Data already inserted");
              }
            }
          })
      }else{
        res.render('form', {
          title: 'Registration form',
          errors: errors.array(),
          data: req.body,
          });
      }
});



router.get('/', auth.connect(basic), (req, res) => {
  res.render('index', {title: 'Search parts', message: 'Hello there!'});
});


router.get('/5dk20', auth.connect(basic), (req, res) => {
  res.render('5dk20', {title: 'Search parts', message: 'Hello there!'});
});

router.get('/de18', auth.connect(basic), (req, res) => {
  res.render('de18', {title: 'Search parts', message: 'Hello there!'});
});


router.get('/6dk20', auth.connect(basic), (req, res) => {
  res.render('6dk20', {title: 'Search parts', message: 'Hello there!'});
});

router.get('/6dk28', auth.connect(basic), (req, res) => {
  res.render('6dk28', {title: 'Search parts', message: 'Hello there!'});
});

//router to get all data 
router.get('/data', auth.connect(basic), (req, res) => {
  Registration.find()
    .then((registrations) => {
      res.json(registrations); //returns the data in json format
    })
    .catch((err) => {
      console.log(err);
      res.send('Sorry! Something went wrong.');
    });
});


//router to get data based on model
router.get('/data/:query', auth.connect(basic), function(req, res){
  const query = req.params.query;
  Registration.find({Model: query},function(err,result){
    if(err){
      console.log(err);
    }else {
      res.json(result);
    }
  });
});

//datade18
router.get('/datade17', auth.connect(basic), (req, res) => {
  DataDE17.find()
    .then((datade17) => {
      res.json(datade17); //returns the data in json format
    })
    .catch((err) => {
      console.log(err);
      res.send('Sorry! Something went wrong.');
    });
});
//json data for 5dk20
router.get('/data5dk20', auth.connect(basic), (req, res) => {
  DataDK20.find()
    .then((datadk20) => {
      res.json(datadk20); //returns the data in json format
    })
    .catch((err) => {
      console.log(err);
      res.send('Sorry! Something went wrong.');
    });
});


//router to get all data 
router.get('/datatest', auth.connect(basic), (req, res) => {

 const arry20 = DataDK20.find().lean().exec(function (err, docs) {
   // docs are plain javascript objects instead of model instances
    res.send(JSON.stringify(docs))
  });
   
});

function escapeRegex(str) {
  return str.toString().replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = router;
