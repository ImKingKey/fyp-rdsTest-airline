//Imports
var db = require('../Model/DatabaseConfig')
var jwt = require('jsonwebtoken')
require('dotenv').config('../../.env')

//Create User Database
const userDB = {

    //Function to Add User
    addUser: function (Username, Email, Contact, Password, Role, Profile_Pic_URL, callback) {

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
                var sql = 'INSERT into users(Username, Email, Contact, Password, Role, Profile_Pic_URL) values(?,?,?,?,?,?);'

                //Send SQL Query
                conn.query(sql, [Username, Email, Contact, Password, Role, Profile_Pic_URL], function (err, result) {
                    conn.end()
                    
                    //If entry is duplicated
                    if (err) {
                
                        //Print Error Code
                        console.log(err)
                        return callback(err, null)
                        
                    } else {

                        //Print Affected Rows & New UserID
                        console.log(`Affected Rows: ${result.affectedRows}\nUserID: ${result.insertId}`)
                        return callback(null, result.insertId)
                    }
                })
            }
        })
    },

    userLogin: function (Email, Password, callback) {

        var conn = db.getConnection();

        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
                
            } else {
                console.log("Connected!");

                var sql = 'SELECT * from users where Email=? and Password=?';

                conn.query(sql, [Email, Password], function (err, result) {
                    conn.end();

                    if (err) {
                        console.log("Error: " + err);
                        return callback(err, null, null);
                    } else {
                        var token = "";
                        var i;
                        if (result.length == 1) {

                            token = jwt.sign({ id: result[0].userid, role: result[0].role }, process.env.SECRET, {
                                expiresIn: 86400 //expires in 24 hrs
                            });
                            console.log("@@token " + token);
                            return callback(null, token, result);


                        } else {
                            var err2 = new Error("UserID/Password does not match.");
                            err2.statusCode = 500;
                            return callback(err2, null, null);
                        }
                    }  //else
                });
            }
        });
    },

    //Function to Get Users
    getUsers: function (callback) {
        
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
                var sql = 'SELECT * from users;'

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


    //Function to Find Users
    findUser: function(UserID, callback) {

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
                var sql = 'SELECT * from users where UserID=?;'

                //Send SQL Query
                conn.query(sql, [UserID], function (err, result) {
                    conn.end()

                    //If Error
                    if (err) {

                        //Print Error Code
                        console.log(err.statusCode + 'Internal Server Error')
                        return callback(err, null)

                    //Else
                    } else {
                        console.log(result)
                        //Return Result
                        return callback(null, result)

                    }
                })
            }
        })
    },


    //Function to Update User
    updateUser: function(Username, Email, Contact, Password, Role, Profile_Pic_URL, UserID, callback) {

        //Create Database Connection
        const conn = db.getConnection()
        conn.connect(function (err) {

            //If Error
            if (err) {

                //Print Error
                console.log(err)
                return callback(err, null)
            
            //Else
            } else {
                //Print Connected
                console.log("<< Connected >>\n")

                //SQL Statement
                var sql = 'UPDATE users SET Username = ?, Email = ?, Contact = ?, Password = ?, Role = ?, Profile_Pic_URL = ? WHERE UserID = ?;'
                
                conn.query(sql, [Username, Email, Contact, Password, Role, Profile_Pic_URL, UserID], function (err, result) {
                    conn.end()

                    //If 
                    if (err) {
                        
                        //Print Error Code
                        console.log(err)
                        return callback(err, null)

                    } else {
                        console.log("No. of records updated successfully: " + result.affectedRows)
                        return callback(null, result)
                    }
                }) 
            }
        })
    },

    
    deleteUser: function(UserID, callback) {

        //Create Database Connection
        const conn = db.getConnection()

        conn.connect(function(err) {

            //If Error
            if (err) {
                console.log(err)
                return callback(err, null)

            //Else
            } else {
                //Print Connected
                console.log('<< Connected >>\n')

                //SQL Statement
                var sql = `DELETE from users WHERE UserID=?;`
                var sql2 = `DELETE from bookings WHERE UserID=?;`

                //Send 1st SQL Query 
                conn.query(sql2, [UserID], function (err, result) {

                    //IF Error
                    if (err) {

                        //Print Error & Return Error Code
                        console.log(err)
                        return callback(err, null)

                    //Else if there's no error
                    } else {
                        
                        //Send 2nd Query
                        conn.query(sql, [UserID], function (err, result) {
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

    //Function to Update User Profile Picture
    UpdateProfilePic: function(Profile_Pic_URL, UserID, callback) {

        //Create Database Connection
        const conn = db.getConnection()
        conn.connect(function (err) {

            //If Error
            if (err) {

                //Print Error
                console.log(err)
                return callback (err, null)
            
            //Else
            } else {
                //Print Connected
                console.log('<< Connected >>\n')

                //SQL Statement
                var sql = `UPDATE users SET Profile_Pic_URL=? WHERE UserID=?`

                console.log(Profile_Pic_URL)

                conn.query(sql, [Profile_Pic_URL, UserID], function (err, result) {
                    console.log('ConnQuery')
                    conn.end()

                    //If Error
                    if (err) {

                        //Print Error Code
                        console.log('usr' + err)
                        return callback(err, null)

                    } else {
                        console.log('result' + result)
                        return callback(null, result)
                    }
                })
            }
        })
    }
}

module.exports = userDB