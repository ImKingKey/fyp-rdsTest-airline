//Imports
require('dotenv').config('../../.env')
const mysql = require('mysql')


const dbConnect = {

    getConnection: function () {
        var conn = mysql.createConnection({
    
            host: process.env.DB_HOST,

            user: process.env.DB_USERNAME,

            port: process.env.DB_PORT,

            password: process.env.DB_PASSWORD,

            database: process.env.DB_DATABASE
        })

        return conn
    }
}

// const dbConnect = {
    
//     getConnection: function () {
//         var conn = mysql.createConnection({
            
//             host: 'mysqldb.cet5w4nusbst.ap-southeast-1.rds.amazonaws.com',

//             user: 'admin',

//             port: '3307',

//             password: 'cream112',

//             database: 'mysqldb'
//         })

//         return conn
//     }
// }

module.exports = dbConnect