const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');


const isAuth = require('../middlewares/isAuth');

const {
  validator,
  registerRules,
  loginRules,
} = require('../middlewares/validator');



//register
router.post('/register', registerRules(), validator, async (req, res) => {
  const { userName, email, password, isAdmin } = req.body;
  
  try {
    let user = await User.findOne({ email });
    
    if (user) {
        return res.status(400).json({ msg: `email already exists` });
    } 
    user = new User({ userName, email, password, isAdmin });
    
    /*const salt = 10;
    const hashedPassword = await bcrypt.hash(password, salt);

    user.password = hashedPassword;*/
    
    await user.save();

    const payload = {
        id: user._id,
    };

    const token = await jwt.sign(payload, process.env.secretKey);

    res.status(200).send({ msg: `${userName} is registred with success`, user, token });
  } catch (error) {
    res.status(500).send({ msg: 'Server Error', error });
  }
});


//login
router.post('/login', loginRules(), validator, async (req, res) => {
const { email, password } = req.body;

try {
    let user = await User.findOne({ email });
    if (!user) {
        return res.status(400).send({ msg: 'email or password incorrect' });
    }
    /*const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).send({ msg: 'email or password incorrect' });
    }*/
    const payload = {
        id: user._id,
    };

    const token = await jwt.sign(payload, process.env.secretKey);
    res.send({ msg: `${user.userName} is logged in with success`, user, token});
  } catch (error) {
    res.status(500).send({ msg: 'Server Error' });
  }
});


//Get authentified user
router.get('/authUser', isAuth, (req, res) => {
    res.status(200).json({ user: req.user });
});


//get all users
router.get("/allUsers", async (req, res) => {
try {
    const users = await User.find()
    res.json(users);
} catch (error) {
    console.log(error);
}
});

//delete a user
router.delete('/delete/:_id', async (req, res) => {
  const  _id  = req.params._id;
  try {
    const user = await User.findOneAndDelete({ _id });
    res.json({ msg: `${user.userName} is deleted`, user });
  } catch (error) {
    console.log(error);
  }
});


//edit a user
router.put("/update/:_id", registerRules(), async (req, res) => {

  const { _id } = req.params;
  let {picture, userName, email, password} = req.body
  /*const salt = 10;
  const hashedPassword = await bcrypt.hash(password, salt);
  password = hashedPassword*/

  try {
    const editedUser = await User.findByIdAndUpdate(_id, {picture, userName, email, password});
    res.status(200).json(editedUser);

  } catch (error) {
    console.log('user not edited', error);
  }
});


module.exports = router;