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

    if (allUsers().find(x => x.user.username === req.body.username)) return res.status(400).send(ERRORS.TAKEN_NAME);
    if (allUsers().find(x => x.user.email === req.body.email)) return res.status(400).send(ERRORS.TAKEN_EMAIL);

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    var user = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
        date: Date.now()
    });
    try {
        const database = new jsoning(`./database/users/${user.username}.json`);
        await database.set('user', user);
        res.send(await database.all());
    } catch (e) {
        console.log(e)
        res.status(400).send(e)
    }
});

router.post('/login', async (req, res) => {
    var user = allUsers().find(x => x.user.email === req.body.email)?.user;
    if (!user) return res.status(400).send(ERRORS.INCORRECT_PASS);

    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) return res.status(400).send(ERRORS.INCORRECT_PASS);

    const token = jwt.sign({ username: user.username, createdAt: user.date }, TOKEN_SECRET);
    res.header('authentication', token).send(token);
})

module.exports = router;

function allUsers() {
    return fs.readdirSync('./database/users').map(x => JSON.parse(fs.readFileSync('./database/users/' + x, { encoding: 'utf-8' })));
}