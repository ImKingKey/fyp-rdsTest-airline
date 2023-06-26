//Imports
var db = require('./DatabaseConfig.js')

//Create Transfer Flights Database
const BookingsDB = {
    
    //Functions
    addBooking: function (Name, Passport, Nationality, Age, UserID, Flight, callback) {

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
                var sql  = `INSERT into bookings(Name, Passport, Nationality, Age, UserID, Flight) VALUES(?,?,?,?,?,?);`

                //Send SQL Query
                conn.query(sql, [Name, Passport, Nationality, Age, UserID, Flight], function (err, result) {
                    conn.end()

                    if (err) {

                        //Print Error Code
                        console.log(err)
                        return callback(err, null)

                    //Else if there's no error
                    } else {

                        //Print Affected Rows & New BookingID
                        console.log(`Affected Rows: ${result.affectedRows}\nBookingID = ${result.insertId}`)
                        return callback(null, result.insertId)
                    }
                })
            }

        })
    },

    getBookings: function (callback) {

        //Create Database Connection
        const conn = db.getConnection()

        conn.connect(function (err) {

            //If Error
            if (err) { //If there's an error

                //Print Error
                console.log(err)
                return callback(err, null)

            //Else
            } else {
                //Print Connected
                console.log("<< Connected >>\n")

                //SQL Statement
                var sql = `SELECT * from bookings`

                //Send SQL Query
                conn.query(sql, function (err, result) {
                    conn.end()

                    //If Error
                    if (err) {

                        //Print Error
                        console.log(err)
                        return callback(err, null)

                    //Else
                    } else {

                        //Return Results
                        return callback (null, result)
                    }
                })
            }
        })
    },

    getUserBookings: function(UserID, callback) {

        //Create Database Connection
        var conn = db.getConnection()

        conn.connect(function(err) {

            //If Error
            if (err) {

                //Print Error
                console.log(err)
                return callback(err, null)

            //Else
            } else {
                //Print Connected
                console.log('<< Connected >>\n')

                //SQL Statement
                var sql = `SELECT b.BookingID, b.Name AS Passenger, b.Passport, b.Nationality, b.Age, f.FlightCode, f.Aircraft, a1.Name AS OriginAirport, a2.Name AS DestinationAirport, f.EmbarkDate, f.ArrivalDate, f.TravelTime FROM bookings b
                                JOIN flights f on b.Flight = f.FlightID
                                JOIN airports a1 on f.OriginAirport = a1.AirportID
                                JOIN airports a2 on f.DestinationAirport = a2.AirportID
                                WHERE b.UserID = ?;`

                //Send SQL Query
                conn.query(sql, [UserID], function (err, result) {
                    conn.end()

                    //If Error
                    if (err) {

                        //Print Error
                        console.log(err)
                        return callback (err, null)
                    
                    //Else
                    } else {

                        //Return Results
                        return callback (null, result)
                    }
                })
            }
        })
    },

    deleteBooking: function(BookingID, callback) {

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
                var sql = `DELETE from bookings where BookingID=?`

                //Send SQL Query
                conn.query(sql, [BookingID], function (err, result) {

                    //If Error
                    if (err) {

                        //Print Error & Return Error Code
                        console.log(err)
                        return callback (err, null)
                    
                    //Else
                    } else {

                        //Print Result & Print Affected Rows
                        console.log(`Affected Rows: ${result.affectedRows}`)
                        return callback(null, result)
                    }
                })
            }
        })
    }
}

module.exports = BookingsDB