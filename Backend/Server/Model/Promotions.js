//Imports
var db = require('./DatabaseConfig.js')

//Create Promotions Database
const PromoDB = {

    //Function to Add Promos
    addPromo: function(Code, Value, ExpiryDate, PromoCondition, callback) {

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
                var sql = `INSERT into promotions(Code, Value, ExpiryDate, PromoCondition) VALUES(?,?,?,?)`

                //Send SQL Query
                conn.query(sql, [Code, Value, ExpiryDate, PromoCondition], function(err, result) {
                    conn.end()

                    //If there is an error
                    if (err) {

                        //Print Error Code
                        console.log(err)
                        return callback(err, null)

                    //Else
                    } else {

                        //Print Affected Rows & New PromoID
                        console.log(`Affected Rows: ${result.affectedRows}\nPromoID: ${result.insertId}`)
                        return callback(null, result)
                    }
                })
            }
        })
    },


    //Function to List All Promos
    getPromos: function(callback) {

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
                console.log('<< Connected >>\n')

                //SQL Statement
                var sql = 'SELECT * from promotions;'

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


    //Function to Delete Promo
    deletePromo: function(PromoID, callback) {

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
                console.log('<< Connected >>')

                //SQL Statement
                var sql = `DELETE from promotions where PromoID=?;`

                //Send SQL Query
                conn.query(sql, [PromoID], function (err, result) {

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
    },


    //Function to List Promo Flights
    getPromoFlights: function(PromoID, callback) {

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
                console.log('<< Connected >>\n')

                //SQL Statement
                var sql = `SELECT p.Code AS Promo_Code, p.CreationDate AS Offer_Ends, f1.FlightCode, f1.Aircraft, a2.Name AS Origin_Airport, a1.Name AS Destination_Airport, f1.EmbarkDate, f1.TravelTime, f1.Price AS Original_Price ,CAST(((f1.price/100) * (100 - p.Value)) AS DECIMAL(64,2)) AS Discounted_Price from promotions p 
                            join airports a1 on a1.Country = p.PromoCondition
                            join flights f1 on f1.DestinationAirport = a1.AirportID
                            join airports a2 on f1.OriginAirport = a2.AirportID
                            where p.PromoID=? and p.ExpiryDate > current_timestamp();`

                //Send SQL Query
                conn.query(sql, [PromoID], function (err, result) {
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

module.exports = PromoDB