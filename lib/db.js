let mysql = require('mysql');
let connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "timetable manager"
})

connection.connect((error) => {
    if (!!error) {
        console.log('Error connecting = ', error)
    } else {
        console.log('Connected successfully !');
    }
})

module.exports = connection;