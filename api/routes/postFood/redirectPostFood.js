/******************************
 

    Route handler for api/redirectPostFood. 
    Redirects user to /postFood.
 

 ******************************/


const auth = require('../../../middleware/auth');
const express = require('express');
const _ = require('lodash');
const bodyParser = require('body-parser');
const router = express.Router();
const app = express();


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


/**
 *  Fetching user data for given ID if given token is correct for user asked after
 */
router.post('/', auth, async (req, res) => {
    return res.redirect('/postfood');
});


module.exports = router;