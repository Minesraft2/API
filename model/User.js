class User {
    constructor({username, email, password, date}) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.date = date;
    }
}

module.exports = User;