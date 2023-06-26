//Imports
const express = require('express')
const bodyParser = require('body-parser')
const user = require('../Model/User.js')
const airports = require('../Model/Airports')
const bookings = require('../Model/Bookings')
const flights = require('../Model/Flights')
const promos = require('../Model/Promotions')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const cors = require('cors')
const verifyToken = require('../Model/verifyToken')
const userDB = require('../Model/User.js')
const BookingsDB = require('../Model/Bookings')

//Create Web Server
const app = express()

//Use CORS
app.options('*', cors())
app.use(cors())

//Use Body-Parser
const urlencodedParser = bodyParser.urlencoded({extended: false})
app.use(bodyParser.json()) //Parse application/json
app.use(urlencodedParser) //Parse application/x-www-form-urlencoded

//------------------- Web Services ------------------

// << User Login API >>
app.post('/api/user/login',function(req, res){

    //Retrieve POST Data
    var Email=req.body.Email;
    var Password = req.body.Password;

    user.userLogin(Email, Password, function(err, token, result){
        if (!err) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            //delete result[0]['Password'];//clear the password in json data, do not send back to client [Safety Reasons]
            console.log(result);
            res.json({success: true, UserData: JSON.stringify(result), token:token, status: 'You are successfully logged in!'})

        } else {
            res.status(500);
            res.send(err.statusCode);
        }
    })
})

// << User Logout API >>
app.post('/api/user/logout', function(req,res){

    console.log("..Logging Out.");
    res.clearCookie('session-id'); //clears the cookie in the response
    res.setHeader('Content-Type', 'application/json');
    res.json({success: true, status: 'Logout successful!'});

})

// << API 1 >>
app.post('/api/users', verifyToken, function (req, res) {

    //Retrieve POST Data
    var Username = req.body.Username
    var Email = req.body.Email
    var Contact = req.body.Contact
    var Password = req.body.Password
    var Role = req.body.Role
    var Profile_Pic_URL = req.body.Profile_Pic_URL

    //Insert
    user.addUser(Username, Email, Contact, Password, Role, Profile_Pic_URL, function (err, result) {
        
        //If not error
        if (!err) {
            //Respond to client with New UserID
            res.status(201).json({'UserID':`${result}`})

        //Else if Duplicate Error  
        } else if (err.code == 'ER_DUP_ENTRY') {
            //Reply to client with 422 Error Code
            res.status(422).send()
        
        //Else/api
        } else {
            //Reply to client with 500 Error Code
            res.status(500).send()
        }
    })
})


// << Sign Up API >>
app.post('/api/public/user', function (req, res) {

    //Retrieve POST Data
    var Username = req.body.Username
    var Email = req.body.Email
    var Contact = req.body.Contact
    var Password = req.body.Password
    var Role = req.body.Role
    var Profile_Pic_URL = req.body.Profile_Pic_URL

    //Insert
    user.addUser(Username, Email, Contact, Password, Role, Profile_Pic_URL, function (err, result) {
        
        //If not error
        if (!err) {
            //Respond to client with New UserID
            res.status(201).json({'UserID':`${result}`})

        //Else if Duplicate Error  
        } else if (err.code == 'ER_DUP_ENTRY') {
            //Reply to client with 422 Error Code
            res.status(422).send()
        
        //Else
        } else {
            //Reply to client with 500 Error Code/api
            res.status(500).send()
        }
    })
})

// << API 2 >>
app.get('/api/users', function (req, res) {

    user.getUsers(function (err, result) {
        
        //If Result is Empty
        if (result.length == 0) {

            res.status(422).send()

        //If Not Error
        } else if (!err) {

            //Send Status Code & Results
            res.status(200).send(result)
        
        //Else
        } else {
            
            //Print Error Message & Send Error Code
            console.log(err)
            res.status(500).send()
        
        }
    })
})


// << API 3 >>
app.get('/api/users/:id', verifyToken, function (req, res) {

    var UserID = req.params.id
    
    user.findUser(UserID, function (err, result) {

        //If not Error
        if (result.length === 0) {
            res.status(422).send()
        
        //Else if
        } else if (!err) {
        
            //Send Status Code & Results
            res.status(200).send(result)

        //Else
        } else {
        
            //Print Error Message & Send Error Code
            console.log(err)
            res.status(500).send()
        }
    })
})

// << API to Delete User >>
app.delete('/api/users/:id/', verifyToken, function (req, res) {
    
    //REtrieve DELETE data
    var UserID = req.params.id

    userDB.deleteUser(UserID, function (err, result) {

        //If NOT Error
        if (err) {

            //Send 500 Error Code
            res.status(500).send()
            
        } else if (result.affectedRows == 0) {

            //Send 422 Error Code
            res.status(422).json({'Message':'Deletion Failed - UserID Does NOT Exist'})
        
        } else if (!err) {

            //Send Success Status Code
            res.status(200).json({'Message':'Deletion Successful'})
        
        } else {

            //Send Error Status Code
            res.status(500).send()
        }
    })
})

// << API 4 >>
app.put('/api/users/:id', verifyToken, function (req, res) {
    
    //Retrieve POST data
    var UserID = req.params.id
    var Username = req.body.Username
    var Email = req.body.Email
    var Contact = req.body.Contact
    var Password = req.body.Password
    var Role = req.body.Role
    var Profile_Pic_URL = req.body.Profile_Pic_URL

    user.updateUser(Username, Email, Contact, Password, Role, Profile_Pic_URL, UserID, function (err, result) {

    //If Any Fields are Empty
    if (Username == '' | Email == '' | Contact == '' | Password == '' | Role == '' | Profile_Pic_URL == '') {
        //Send Error Code
        res.status(411).send()
            
    //If NOT Error
    } else if (!err) {
                
        //Send Success Status Code
        console.log("Update Successful")
        res.statusCode = 204
        res.setHeader('Content-Type', 'application/json')
        res.json({success: true, result: result, status: 'Record Updated Successfully'})
            
    //Else If Username or Email Already Exists
    } else if(err.code == 'ER_DUP_ENTRY') {

        //Send Error Status Code
        res.status(422).send()
            
    //Any Other Errors
    } else {

        //Send Error Status Code
        res.status(500).send()
            }   
        })
    }
)


// << API 5 >>
app.post('/api/airport',verifyToken, function (req, res) {
    
    //Retrieve POST data
    var Name = req.body.Name
    var Country = req.body.Country
    var Description = req.body.Description

    airports.addAirport(Name, Country, Description, function (err, result) {
        
        //If not error
        if (!err) {
            //Acknowledge POST request
            res.status(204).send(result)
            //res.json({success: true, result: result, status: 'Record Updated Successfully'}).send()
        
        //Else If Entry Exists
        } else if (err.code == 'ER_DUP_ENTRY') {
            //Reply to client with 422 Error Code
            res.status(422).send()

        //Else
        } else {
            //Send Error Status
            console.log(err)
            res.status(500).send()
        }
    })
})


// << API 6 >>
app.get('/api/airport', function (req, res) {

    airports.findAirport(function (err, result) {

        //If not Error
        if (!err) {
            //Send Status Code & Results
            res.status(200).send(result)

        //Else
        } else {
            //Send Statis Code & Results
            res.status(500).send()
        }
    })
})


app.delete('/api/airport/:AirportID', function (req, res) {

    //Retrieve Delete Data
    var AirportID = req.params.AirportID

        airports.deleteAirport(AirportID, function (err, result) {

        //If NOT Error
        if (err) {

            //Send 500 Error Code
            res.status(500).send()

        } else if (result.affectedRows == 0) {

            //Send 422 Error Code
            res.status(422).json({'Message':'Deletion Failed - AirportID Does NOT Exist'})
            
        } else if (!err) { 
            
            //Send Success Status Code
            res.status(200).json({'Message':'Deletion Successful'})

        } else {
            //Send Error Status Code
            res.status(500).send()
        }
    })
})

// << API 7 >>
app.post('/api/flight', verifyToken, function(req, res) {

    //Retrieve POST Data
    var FlightCode = req.body.FlightCode
    var Aircraft = req.body.Aircraft
    var OriginAirport = req.body.OriginAirport
    var DestinationAirport = req.body.DestinationAirport
    var EmbarkDate = req.body.EmbarkDate
    var ArrivalDate = req.body.ArrivalDate
    var TravelTime = req.body.TravelTime
    var Price = req.body.Price

    //Insert
    flights.addFlight(FlightCode, Aircraft, OriginAirport, DestinationAirport, EmbarkDate, ArrivalDate, TravelTime, Price, function(err, result) {

        //If not error
        if (!err) {
            //Respond to Client with New FlightID
            res.status(201).json({'FlightID':`${result.insertId}`})

        //Else
        } else {
            //Reply to Client with 500 Error Code
            res.status(500).send()
        }
    })
})


// << API 8 >>
app.get('/api/flightDirect/:originAirportId/:destinationAirportId', function (req, res) {

    var OriginAirport = req.params.originAirportId
    var DestinationAirport = req.params.destinationAirportId

    flights.findFlight(OriginAirport, DestinationAirport, function (err, result) {

        //If result is empty
        if (result.length == 0) {
            //Send Error Code
            res.status(500).send()
        }

        //Else If not Error
        else if (!err) {

            //Send Status Code & Results
            res.status(200).send(result)

        //Else
        } else {

            //Print Error Message  & Send Error Code
            console.log(err)
            res.status(500).send()
        }
    })
})


// << API 9 >>
app.post('/api/booking', verifyToken, function (req, res) {

    //Retrieve POST Data
    var UserID = req.body.UserID
    var Flight = req.body.Flight
    var Name = req.body.Name
    var Passport = req.body.Passport
    var Nationality = req.body.Nationality
    var Age = req.body.Age

    bookings.addBooking(Name, Passport, Nationality, Age, UserID, Flight, function (err, result) {
        
        //If Not Error
        if (!err) {
            //Respond to client with New BookingID
            res.status(201).json({'BookingID':`${result}`})

        //Else
        } else {
            //Print Error Message & Send Error Code
            console.log(err)
            res.status(500).send()
        }
    })
})

// << Get Bookings API >>
app.get('/api/bookings', function (req, res) {
    
    bookings.getBookings(function (err, result) {

        //If Result is Empty
        if (result.length == 0) {

            res.status(422).send()

        //If NOT Error 
        } else if (!err) {

            //Send Status Code & Results
            res.status(200).send(result)

        //Else
        } else {

            //Print Error Message & Send Error Code
            console.log(err)
            res.status(500).send()
        }
    })
})

// << API to Delete Bookings >>
app.delete('/api/booking/:BookingID', verifyToken, function (req, res) {

    //Retrieve Data
    var BookingID = req.params.BookingID

    bookings.deleteBooking(BookingID, function (err, result) {

        //If Result is Empty
        if (result.length == 0) {

            res.status(422).send()

        //Else If NOT Error
        } else if (!err) {

            //Send Status Code & Results
            res.status(200).send(result)
        
        //Else
        } else {

            //Print Error Message & Send Error Code
            console.log(err)
            res.status(500).send()
        }
    })
})

app.get('/api/bookings/:UserID', verifyToken, function (req, res) {

    var UserID = req.params.UserID

    BookingsDB.getUserBookings(UserID, function (err, result) {

        //If NOT Error
        if (result.length === 0) {
            res.status(422).send()

        //Else If 
        } else if (!err) {

            //Send Status Code & Results
            res.status(200).send(result)

        //Else 
        } else {

            //Print Error Message & Send Error Code
            console.log(err)
            res.status(500).send()
        }
    })
})

// << API to GET Flights >>
app.get('/api/flights', function (req, res) {

    flights.getFlights(function (err, result) {

        //If Result is Empty
        if (result.length == 0) {

            res.status(422).send()

        //If NOT Error
        } else if (!err) {

            //Send Status Code & Results
            res.status(200).send(result)

        //Else
        } else {

            //Print Error Message & Send Error Code
            console.log(err)
            res.status(500).send()
        }
    })
})

// << API 10 >>
app.delete('/api/flight/:id/', verifyToken, function (req, res) {

    //Retrieve Data
    var FlightID = req.params.id

    //If FlightID Does NOT Exist
    if (isNaN(FlightID)) {

        res.status(500).send()
        return
    
    //Else
    } else {
        flights.deleteFlight(FlightID, function (err, result) {

            //If NOT Error
            if (result.affectedRows == 0){

                //Send Error Status Code
                res.status(500).send()

            } else if (!err) {

                //Send Success Status Code
                res.status(200).json({'Message':'Deletion Successful'})
            
            //Else
            } else {

                //Send Error Status Code
                res.status(500).send()
            }
        })
    }
})


// << API 11 >>
app.get('/api/transfer/flight/:originAirportId/:destinationAirportId', function(req, res) {

    var OriginAirport1 = req.params.originAirportId
    var DestinationAirport1 = req.params.destinationAirportId
    var OriginAirport2 = req.params.originAirportId
    var DestinationAirport2 = req.params.destinationAirportId
    var OriginAirport3 = req.params.originAirportId

    flights.findTransferFlight(OriginAirport1, DestinationAirport1, OriginAirport2, DestinationAirport2, OriginAirport3, function (err, result) {

        //If NOT error
        if (!err) {

            //Print Status Code & Results
            res.status(201).send(result)

        //Else
        } else {

            //Print Error Message & Send Error Code
            console.log(err)
            res.status(500).send()
        }
    })

})


// --<< Bonus Requirements >>--

// << Promotion APIs >>
app.post('/api/promos', verifyToken, function (req, res) {

    //Retrieve POST Data
    var Code = req.body.Code
    var Value = req.body.Value
    var ExpiryDate = req.body.ExpiryDate
    var PromoCondition = req.body.PromoCondition

    //If Value is more than 100 or less than 0
    if (Value > 100 || 0 > Value) {

        //Print Error & Send Error Status Code
        console.log(`Value NOT Within Limits [1 - 100]\n`)
        res.status(422).send()
    
    //Else
    } else {
        //Insert
        promos.addPromo(Code, Value, ExpiryDate, PromoCondition, function (err, result) {
            
            //If not error
            if (!err) {
                //Respond with new PromoID
                res.status(201).json({'PromoID':`${result.insertId}`})

            //Else
            } else if (err.code == 'ER_DUP_ENTRY') {
                //Reply with 422 Error Code
                res.status(422).send()
            
            //Else
            } else {
                //Reply to client with 500 Error Code
                res.status(500).send()
            }
        })
    }
})


app.get('/api/promos', function (req, res) {

    promos.getPromos(function (err, result) {

        //If Not Error
        if (!err) {

            //Send Status Code & Results
            res.status(200).send(result)

        //Else
        } else {

            //Print Error Message & Send Error Code
            console.log(err)
            res.status(500).send()
        }
    })
})


app.delete('/api/promos/:PromoID', verifyToken, function (req, res) {

    //Retrieve Delete Data
    var PromoID = req.params.PromoID

    //If ID Does NOT Exist
    if (isNaN(PromoID)) {

        //Send Error Code
        res.status(500).send()
        return
    
    //Else
    } else {
        promos.deletePromo(PromoID, function (err, result) {

            //If NOt Error
            if (err) {

                //Send 500 Error Code
                res.status(500).send()

            } else if (result.affectedRows == 0) {

                //Send 422 Error Code
                res.status(422).json({'Message':'Deletion Failed - PromoID Does NOT Exist'})
            
            //Else
            } else if (!err) { 
            
                //Send Success Status Code
                res.status(200).json({'Message':'Deletion Successful'})

            } else {

                //Send Error Status Code
                res.status(500).send()
            }
        })
    }
})


app.get('/api/promos/:PromoID', function(req, res) {

    //Retrieve Data
    var PromoID = req.params.PromoID

    //If ID Does NOT Exist
    if (isNaN(PromoID)) {

        //Send Error Code
        res.status(500).send()
        return
    
    //Else
    } else {
        promos.getPromoFlights(PromoID, function (err, result) {

            //If NOT Error
            if (err) {

                //Send 500 Error Code
                res.status(500).send()

            } else if (result.length == 0) {

                //Send 422 Error Code
                res.status(422).json({'Message':`No Available Promos Under PromoID: ${PromoID}`})
            
            //Else 
            } else if (!err) {

                //Send Error Status Code
                res.status(200).send(result)
            
            //Else
            } else {

                //Print Error Message & Send Error Code
                console.log(err)
                res.status(500).send()
            }
        })
    }
})


//Create Image Storage
var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './public/Uploads')
    },
    filename: function (req, file, callback) {
        callback(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`)
    }
})

//Upload Function
var upload = multer ({storage: storage})

//Function to Extract File Extension
function GetFileExtension(filename) {
    return String(filename.split('.').pop());
}

//Function to Delete Files
function RemoveFile(FilePath) {
    try {
        fs.unlinkSync(FilePath);
        console.log("File Removed:", FilePath);
    
      } catch (err) {

        //Print Error
        console.error(err);
      }
}

// Strictly Image Storing [Admin]
app.post('/api/ImageUpload', verifyToken, upload.single('ProfilePicture'), (req, res, next) => {
    var file = req.file;
    
    //If There's NO File
    if (!file) {

        //Return Error Status Code 
        return res.status(400).send({Message: 'No Files Attached'})
    
    //Else If File Is NOT JPG or PNG
    } else if (GetFileExtension(file.originalname) != 'png' && GetFileExtension(file.originalname) != 'jpg') {
        console.log(GetFileExtension(file.originalname))

        //Delete Bad File
        RemoveFile(file.path)

        //Send Error Status Code
        res.status(422).send({Message: 'File MUST Be [PNG or JPG]'})
    
    //Else If Image is Above 1MB
    } else if (file.size >= 1000000) {

        //Remove Bad File
        RemoveFile(file.path)

        //Send Error Status Code
        res.status(422).send({Message: 'File MUST Be Below 1MB'})

    //Else
    } else {
        return res.status(200).send(file.filename)
    }   
})


// Image Updating
app.post('/api/ImageUpdate', verifyToken, upload.single('ProfilePicture'), (req, res, next) => {
    
    var file = req.file;
    var OldProfilePicURL = req.body.Profile_Pic_URL
    
    //If There's NO File
    if (!file) {

        //Return Error Status Code 
        return res.status(400).send({Message: 'No Files Attached'})
    
    //Else If File Is NOT JPG or PNG
    } else if (GetFileExtension(file.originalname) != 'png' && GetFileExtension(file.originalname) != 'jpg') {
        console.log(GetFileExtension(file.originalname))

        //Delete Bad File
        RemoveFile(file.path)

        //Send Error Status Code
        res.status(422).send({Message: 'File MUST Be [PNG or JPG]'})
    
    //Else If Image is Above 1MB
    } else if (file.size >= 1000000) {

        //Remove Bad File
        RemoveFile(file.path)

        //Send Error Status Code
        res.status(422).send({Message: 'File MUST Be Below 1MB'})

    //Else
    } else {
        RemoveFile(`./public/Uploads/${OldProfilePicURL}`)
        return res.status(200).send(file.filename)
    }   
})


// Strictly Image Storing [Public]
app.post('/api/public/ImageUpload', upload.single('ProfilePicture'), (req, res, next) => {
    var file = req.file;
    
    //If There's NO File
    if (!file) {

        //Return Error Status Code 
        return res.status(400).send({Message: 'No Files Attached'})
    
    //Else If File Is NOT JPG or PNG
    } else if (GetFileExtension(file.originalname) != 'png' && GetFileExtension(file.originalname) != 'jpg') {
        console.log(GetFileExtension(file.originalname))

        //Delete Bad File
        RemoveFile(file.path)

        //Send Error Status Code
        res.status(422).send({Message: 'File MUST Be [PNG or JPG]'})
    
    //Else If Image is Above 1MB
    } else if (file.size >= 1000000) {

        //Remove Bad File
        RemoveFile(file.path)

        //Send Error Status Code
        res.status(422).send({Message: 'File MUST Be Below 1MB'})

    //Else
    } else {
        return res.status(200).send(file.filename)
    }   
})

module.exports = app