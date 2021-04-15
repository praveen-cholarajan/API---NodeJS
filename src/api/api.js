// # Express route controllers for all the endpoints of the app
const { body, validationResult } = require('express-validator');

module.exports = function(app,mysql){
    function generateOTP(){
    var digits = '0123456789';
    var otpLength = 4;
    var otp = '';
    for(let i=1; i<=otpLength; i++){
        var index = Math.floor(Math.random()*(digits.length));
        otp = otp + digits[index];
    }
    return otp;
}


    app.get('/user_list',function(req,res){
        mysql.query("SELECT * FROM Android.login",function(err,result){
            if(err){
                return res.status(200).json({
                    success: false,
                    message: err
                });
            }else{
                return res.status(200).json({
                    success: true,
                    message: "user list fetch successfully",
                    user : result
                });
            }
        })
    })

    app.post('/register',body('mobile').isLength({
        min: 10
    }),function(req,res){
    
        var userMobile = req.body.mobile
        const errors = validationResult(req);

        console.log("register : " + userMobile)

        if (!errors.isEmpty()) {
            return res.status(200).json({
                success: false,
                message: "invalid mobile number"
            });
        }else{
            mysql.query("SELECT * FROM Android.login",function(err,result){
                console.log(JSON.stringify(result))
                if(err){
                    return res.status(200).json({
                        success: false,
                        message: err
                    });
                }else{
                    console.log("select query called not error")
                    result.forEach(element => {
                        console.log("for-each"+JSON.stringify(element))
                        if(element.mobile == userMobile){
                            return res.status(200).json({
                                success: false,
                                message: "mobile already exit"
                            });              
                        }
                    }); 
                        console.log("mobile number available successfully")
                        var randomOTP = generateOTP()
                        mysql.query("INSERT INTO Android.login(id,mobile,otp) VALUES( NULL ,'"+userMobile+"','" + randomOTP + "')",
                        function(err,result){
                            if(err){
                                return res.status(202).json({
                                    success: false,
                                    message: err
                                });
                            }else{
                                console.log("mobile number insert successfully")
                                mysql.query("SELECT * FROM Android.login WHERE id = " + result.insertId,function(err,result){
                                    if(err){
                                        return res.status(200).json({
                                            success: false,
                                            message: err
                                        });
                                    }else{
                                        console.log("mobile number get successfully")
                                        return res.status(200).json({
                                            success: true,
                                            message: "mobile number register successfully",
                                            user : result[0]
                                        });
                                    }
                                })
                            }
                        })
                }
            })
        }
    })



    //otp verification
    app.post('/otp_verify',body('otp').isLength({min:4}),function(req,res){

        const error = validationResult(req)
        var requestOTP = req.body.otp
        var requestUserId = req.body.user_id

        if (!error.isEmpty()) {
            return res.status(200).json({
                success: false,
                message: "invalid otp number"
            });
        }else if(requestUserId.length == 0){
            return res.status(200).json({
                success: false,
                message: "user id requried"
            });
        }else{
            mysql.query("SELECT * FROM Android.login WHERE id = '" + requestUserId+"'",function(err,result){
                console.log(JSON.stringify(result))
                if(err){
                    return res.status(200).json({
                        success: false,
                        message: err
                    });
                }else{
                    result.forEach(element => {
                        console.log("for-each"+JSON.stringify(element))
                        if(element.id != requestUserId){
                            return res.status(200).json({
                                success: false,
                                message: "invalid user id"
                            });  

                        }else if(element.otp != requestOTP){
                        
                            return res.status(200).json({
                                success: false,
                                message: "invalid otp"
                            });              
                        }else{
                            var regiterStatus = 1;
                            mysql.query("UPDATE Android.login SET otp_status = '"+regiterStatus+"' WHERE id= '" + regiterStatus + "'",
                            function(err,result){
                                if(err){
                                    return res.status(202).json({
                                        success: false,
                                        message: err
                                    });
                                }else{
                                  mysql.query("SELECT * FROM Android.login WHERE id = " + requestUserId,function(err,result){
                                        if(err){
                                            return res.status(200).json({
                                                success: false,
                                                message: err
                                            });
                                        }else{
                                            return res.status(200).json({
                                                success: true,
                                                message: "otp verify successfully ",
                                                user : result[0]
                                            });
                                        }
                                    })
                                }
                            })
                        }
                    });
                    
                }
            })
        }
    })
}


