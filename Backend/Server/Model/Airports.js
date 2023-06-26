//Imports
var db = require('./DatabaseConfig.js')

//Create Transfer Flights Database
const AirportsDB = {
    
    //Function to Add Airport
    addAirport: function(Name, Country, Description, callback) {

        //Create Database Connection
        const conn = db.getConnection()

        conn.connect(function (err) {

            //If Error
            if (err) {
                //Print Error Message
                console.log(err)
                return callback(err, null)

            //Else
            } else {
                
                console.log('<< Connected >>\n')

                //SQL Statement
                var sql = `INSERT into airports(Name, Country, Description) values(?,?,?);`
                
                conn.query(sql, [Name, Country, Description], function(err, result) {
                    conn.end()

                    //If Entry Exists
                    if (err == 'ER_DUP_ENTRY') {      
                        //Print Error Code
                        console.log(err)
                        return callback(err, null)
                    
                    //Else If Error
                    } else if (err) {
                        //Print Error & Return Callback
                        console.log(err)
                        return callback(err, null)
                    
                    //Else
                    } else {
                        //Return Callback
                        return callback(null, result)
                    } 
                })
            }
        })
    },

    deleteAirport: function(AirportID, callback) {
        
        //Create Database Connection
        var conn = db.getConnection()

        conn.connect(function(err) {

            //If Error
            if(err) {
                //Print Error & Return Error
                console.log(err)
                return callback(err, null)

            //Else
            } else {
                //Print Connected
                console.log('<< Connected >>')

                //SQL Statement 
                var sql = `DELETE from airports where AirportID=?`
                var sql2 = `DELETE from flights where flights.OriginAirport = ? OR flights.DestinationAirport = ?;`

                //Send SQL Query
                conn.query(sql, [AirportID], function (err, result) {

                    //If Error
                    if (err) {

                        //Print Error & Return Error Code
                        console.log(err)
                        return callback(err, null)
                    
                    //Else
                    } else {
                        //Send 2nd SQL Query
                        conn.query(sql2, [AirportID, AirportID], function (err, result) {
                            conn.end()

                            //If Error
                            if (err) {

                                //Print Error & Return Error Code
                                console.log(err)
                                return callback(err, null)

                            //Else
                            } else {

                                //Return Result & Print Affected Rows
                                console.log(`Affected Rows: ${result.affectedRows}`)
                                return callback(null, result)
                            }
                        })
                    }
                })
            }
        })
    },
    
    findAirport: function(callback) {

        //Create Database Connection
        const conn = db.getConnection()

        conn.connect(function (err) {

            //If Error
            if (err) {
                //Print Error Message
                console.log(err)
                return callback(err, null)
            
            //Else
            } else {
                //Print Connected
                console.log('<< Connected >>\n')

                //SQL Statement
                var sql = `SELECT * from airports;`

                //Send SQL Query
                conn.query(sql, function (err, result) {
                    conn.end()

                    //If Error
                    if (err) {
                        //Print Error Code
                        console.log(err)
                        return callback(err, null)
                    
                    //Else 
                    } else {
                        return callback(null, result)
                    }
                })
            }
        })
    }
}

module.exports = AirportsDB