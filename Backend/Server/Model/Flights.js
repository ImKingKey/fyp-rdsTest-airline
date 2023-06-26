//Imports
var db = require('./DatabaseConfig.js')

//Create Flights Database
const FlightsDB = {
    
    //Function to Add Flights
    addFlight: function(FlightCode, Aircraft, OriginAirport, DestinationAirport, EmbarkDate, ArrivalDate, TravelTime, Price, callback) {

        //Create Database Connection
        const conn = db.getConnection()

        conn.connect(function (err) {

            //If error 
            if (err) {
                //Print Error Message
                console.log(err)
                return callback(err, null)
                
            //Else
            } else {
                //Print Connected
                console.log('<< Connected >>\n')

                //SQL Statement
                var sql =  `INSERT into flights(FlightCode, Aircraft, OriginAirport, DestinationAirport, EmbarkDate, ArrivalDate, TravelTime, Price) values(?,?,?,?,?,?,?,?)`

                //Send SQL Query
                conn.query(sql, [FlightCode, Aircraft, OriginAirport, DestinationAirport, EmbarkDate, ArrivalDate, TravelTime, Price], function (err, result) {
                    conn.end()

                    //If there is an error
                    if (err) {

                        //Print Error Code
                        console.log(err)
                        return callback(err, null)
                    
                    //Else
                    } else {

                        //Print Affected Rows & New UserID
                        console.log(`Affected Rows: ${result.affectedRows}\nFlightID: ${result.insertId}`)
                        return callback(null, result)
                    }
                })
            }
        })
    },


    //Function to Find Flights
    findFlight: function(OriginAirport, DestinationAirport, callback) {

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
                var sql = `SELECT f.FlightID, f.FlightCode, f.Aircraft, a1.Name as OriginAirport, a2.Name as DestinationAirport, f.EmbarkDate, f.ArrivalDate, f.TravelTime, f.Price from flights f
                                JOIN airports a1 ON a1.AirportID = f.OriginAirport
                                JOIN airports a2 ON a2.AirportID = f.DestinationAirport
                                where OriginAirport=? and DestinationAirport=?`

                //Send SQL Query
                conn.query(sql, [OriginAirport, DestinationAirport], function (err, result) {
                    conn.end()

                    //If Error
                    if (err) {
                        console.log(err)
                        //Return Error
                        return callback(err, null)

                    //Else
                    } else {
                        //Return and Print Results
                        console.log(result)
                        return callback(null, result)
                    }
                })
            }
        })
    },

    //Function to Delete Flights
    deleteFlight: function(FlightID, callback) {
        
        //Create Database Connection
        var conn = db.getConnection()
        
        conn.connect(function(err) {

            //If Error
            if (err) {
                //Print Error & Return Error
                console.log(err)
                return callback(err, null)
            
            //Else
            } else {
                //Print Connected
                console.log('<< Connected >>\n')

                //SQL Statement
                var sql = `DELETE from bookings where Flight=?;`
                var sql2 = `DELETE from flights where FlightID=?;`

                //Send 1st SQL Query
                conn.query(sql, [FlightID], function (err, result) {

                    //If Error
                    if (err) {

                        //Print Error & Return Error Code
                        console.log(err)
                        return callback(err, null)

                    //Else if there's no error
                    } else {
                        //Send 2nd SQL Query
                        conn.query(sql2, [FlightID], function (err, result) {
                            conn.end()

                            //If Error
                            if (err) {

                                //Print Error & Return Error Code
                                console.log(err)
                                return callback(err, null)
                               
                            //Else
                            } else {

                                //Print Affected Rows
                                console.log(`Affected Rows: ${result.affectedRows}`)
                                return callback(null, result)
                            }
                        })
                    }
                })
            }
        })
    },


    //Function to Find Transfer Flights
    findTransferFlight: function(OriginAirport1, DestinationAirport1, OriginAirport2, DestinationAirport2, OriginAirport3, callback) {

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

                //SQL Sstatement
                var sql = `SELECT f1.FlightID AS FirstFlightID, f2.FlightID AS SecondFlightID, f1.FlightCode AS FlightCode1, f2.FlightCode AS FlightCode2, f1.Aircraft AS Aircraft1, f2.Aircraft AS Aircraft2, a1.Name AS OriginAirport, a2.Name AS TransferAirport, a3.Name AS DestinationAirport, f1.Price + f2.Price AS TotalPrice FROM flights f 
                            JOIN flights f1 ON f1.OriginAirport = ?
                            JOIN flights f2 ON f1.DestinationAirport = f2.OriginAirport and f2.DestinationAirport = ?
                            JOIN airports a1 ON a1.AirportID = ?
                            JOIN airports a2 ON a2.AirportID = f1.DestinationAirport
                            JOIN airports a3 ON a3.AirportID = ?
                            Where f.OriginAirport = ? and f.DestinationAirport = f2.OriginAirport;`

                //Send SQL Query   
                conn.query(sql, [OriginAirport1, DestinationAirport1, OriginAirport2, DestinationAirport2, OriginAirport3], function (err, result) {
                    conn.end()

                    if (err) {

                        //Print Error Code
                        console.log(err)
                        return callback(err, null)
                    
                    //Else
                    } else {

                        //Return Results
                        return callback(null, result)
                    }
                })
            }
        })
    },


    //Function to Get Flights with Airport Name Subbed In
    getFlights: function(callback) {

        //Create Database Connection
        const conn = db.getConnection()

        conn.connect(function (err) {

            //If Error
            if (err) {
 
                //Prnt Error
                console.log(err)
                return callback (err, null)
            
            //Else
            } else {

                //Print Connected
                console.log('<< Connected >>\n')

                //SQL Statement
                var sql = `SELECT f.FlightID, f.FlightCode, f.Aircraft, a1.Name AS OriginAirport, a2.Name AS DestinationAirport, f.EmbarkDate, f.ArrivalDate, f.TravelTime, f.Price FROM flights f
                                JOIN airports a1 ON a1.AirportID = f.OriginAirport
                                JOIN airports a2 ON a2.AirportID = f.DestinationAirport`

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
    }
}

module.exports = FlightsDB