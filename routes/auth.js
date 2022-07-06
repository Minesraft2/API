const router = require('express').Router();
const User = require('../model/User');
const jwt = require('jsonwebtoken');
const jsoning = require("jsoning");
const { registerValidation } = require('../validation');
const fs = require('fs');
const bcrypt = require('bcryptjs');

const TOKEN_SECRET = process.env.TOKEN_SECRET;
const ERRORS = {
    TAKEN_NAME: "Username is already taken.",
    TAKEN_EMAIL: "Email already in use.",
    INCORRECT_PASS: "Email or password is incorrect."
}

router.post('/register', async (req, res) => {
    const { error } = registerValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const emailExist = await User.findOne({ email: req.body.email });
    if (emailExist) return res.status(400).send(ERRORS.TAKEN_EMAIL);

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    var user = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword
    });
    try {
        const savedUser = await user.save();
        res.send({ user: user._id });
    } catch (e) {
        console.log(e)
        res.status(400).send(e)
    }
});

router.post('/login', async (req, res) => {
    var user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send(ERRORS.INCORRECT_PASS);

    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) return res.status(400).send(ERRORS.INCORRECT_PASS);

    const token = jwt.sign({ _id: user._id, password: user.password, createdAt: user.date }, TOKEN_SECRET);
    res.header('authentication', token).send(token);
})

module.exports = router;

function allUsers() {
    return fs.readdirSync('./database/users').map(x => JSON.parse(fs.readFileSync('./database/users/' + x, { encoding: 'utf-8' })));
}