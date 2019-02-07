const {User} = require('../../../models/objects/users/user');
const{Food} = require('../../../models/objects/food/food');
const auth = require('../../../middleware/auth');
const asyncMiddleware = require('../../../middleware/async');
const validation = require('../../helpers/transaction/validation');
const express = require('express');
const router = express.Router();

/**
 *  Route handler for api/transaction
 *  Fetches receiver and food, if either fails to retrieve, 
        an error wil be sent as response.
        Checks if receiver has enough foodStamps, if true then giver gets
        0.5 towards earned stamps. Receiver decrements -1 foodStamps. 
 */
router.post('/', auth, asyncMiddleware (async (req,res) => {
    const validate = validation(req.body);

    if(validate.error) return res.status(400).send(validate.error.details[0].message);

    const receiver = await User.findById(req.user);
    const food = await Food.findById(req.body._id);

    if(!receiver) return res.status(400).send('Receiver not found');
    if(!food) return res.status(400).send("Food object not found");

    if(!enoughStamps(receiver)) return res.status(400).send('Insufficient funds');
    
    const giver = await User.findByIdAndUpdate(food.postedBy, {
        $inc: {earnedStamps: 0.5} 
    });

    if(!giver) return res.status(400).send("Giver not found");

    receiver.foodStamp -= 1;
    receiver.save();
    food.delete();
    res.send(receiver);//maybe send a req for api/update/delete?
    /*.redirect(`/api/update/delete/${food._id}`)*/ 
}));

/**
 *  Boolean function that checks if user has foodStamps or not 
 *  @param {User} user 
 */
function enoughStamps(user){
    if(user.foodStamp || user.earnedStamps >= 1){
        return true;
    }
    return false;
}

module.exports = router;