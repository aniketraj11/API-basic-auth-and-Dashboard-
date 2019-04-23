// server.js
var express = require('express');  
var app = express();  
var server = require('http').createServer(app); 
var io = require('socket.io')(server); 
var pgp = require('pg-promise')();
var datetime = require('node-datetime');
var schedule = require('node-schedule');
const sendmail = require('sendmail')();
let date = require('date-and-time');
const request = require('request');


var cn = {
    host: '',
    user: '',
    database: '',
    password: '',
    port: 5432
};

var mailflag = "notsent";
var resumetime ;
var now ;
var diff ;
var cur;
var interval = 900 ;
app.use(express.static(__dirname + '/public'));

var j = schedule.scheduleJob('*/45 * * * * *', function(){
    performCheck();
});

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
var username = '';
var password = '!';

var options ;
var token ;

options = [{
    url: '',
    method : 'POST',
    auth: {
        user: username,
        password: password
    }
},
           {
               url: '',
               method : 'POST',
               auth: {
                   user: username,
                   password: password
               }
           },
           {
               url: '',
               method : 'POST',
               auth: {
                   user: username,
                   password: password
               }
           }
          ];

var result  = [];



//redirect / to our index.html file
app.get('/', function(req, res,next) {  
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/details', function(req, res,next) {  
    res.sendFile(__dirname + '/public/details.html');
});



io.on('connection', function(client) { 
    console.log('Client connected...'); 



    client.on('clicked', function(data) {
        console.log("Clicked the button");
    });

    client.on('clicked2', function(data) {

        performCheck();

    });

    client.on('acknowledge', function(data) {
        console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$Acknowledging");
        console.log(data);
        var inHour = data * 60 * 60 ;
        console.log(inHour);
        interval = inHour;
        console.log("interval : " + interval);
    });
});


function performCheck(){



    request(options[0], function (err, res, body) {
        if (err) {
            console.dir(err)
            return
        }
        console.dir(options[0]);
        console.dir('token');
        var obj = JSON.parse(body);
        console.dir(obj.token);
        token = 'Bearer ' + obj.token;
        request({
            url: '',
            headers: {
                'Authorization': token
            },
            rejectUnauthorized: false 
        }, function(err, res) {
            if(err) {
                console.error(err);
            } else {
                healthresponse1 = JSON.parse(res.body);
                //console.log(healthresponse);
                console.log("First");
                var status = 'HEALTHY';
                var hostname = healthresponse1[1].hostName;
                for(var j =0; j < healthresponse1.length ; j++)
                {
                    if (healthresponse1[j].status == 'DISABLED')
                    {
                        if (healthresponse1[j].id == '' || healthresponse1[j].id == '')
                            {
                                
                            }
                        else
                            {
                                status = 'CRITICAL';
                            }
                    }
                }
                //console.log(healthresponse1);
                result.push({
                    "ip" : "",
                    "status" : status,
                    "hostname" : hostname,
                    "metrics" : healthresponse1
                });
            }

        });


    })

    request(options[1], function (err, res, body) {
        if (err) {
            console.dir(err)
            return
        }
        console.dir(options[1]);
        console.dir('token');
        var obj = JSON.parse(body);
        console.dir(obj.token);
        token = 'Bearer ' + obj.token;
        request({
            url: '',
            headers: {
                'Authorization': token
            },
            rejectUnauthorized: false 
        }, function(err, res) {
            if(err) {
                console.error(err);
            } else {
                healthresponse2 = JSON.parse(res.body);
                console.log("Second");
                //console.log(healthresponse2);
                var status = 'HEALTHY';
                var hostname = healthresponse2[1].hostName;
                for(var j =0; j < healthresponse2.length ; j++)
                {
                    if (healthresponse2[j].status == 'DISABLED')
                    {
                        
                        if (healthresponse2[j].id == '' || healthresponse2[j].id == '')
                            {
                                
                            }
                        else
                            {
                                status = 'CRITICAL';
                            }
                    }
                }
                result.push({
                    "ip" : "",
                    "status" : status,
                    "hostname" : hostname,
                    "metrics" : healthresponse2
                });
            }

        });


    })
    
    request(options[2], function (err, res, body) {
        if (err) {
            console.dir(err)
            return
        }
        console.dir(options[2]);
        console.dir('token');
        var obj = JSON.parse(body);
        console.dir(obj.token);
        token = 'Bearer ' + obj.token;
        request({
            url: '',
            headers: {
                'Authorization': token
            },
            rejectUnauthorized: false 
        }, function(err, res) {
            if(err) {
                console.error(err);
            } else {
                healthresponse3 = JSON.parse(res.body);
                console.log("third");
                //console.log(healthresponse2);
                var status = 'HEALTHY';
                var hostname = healthresponse3[1].hostName;
                for(var j =0; j < healthresponse3.length ; j++)
                {
                    if (healthresponse3[j].status == 'DISABLED')
                    {
                        
                        if (healthresponse3[j].id == '' || healthresponse3[j].id == '')
                            {
                                
                            }
                        else
                            {
                                status = 'CRITICAL';
                            }
                    }
                }
                result.push({
                    "ip" : "",
                    "status" : status,
                    "hostname" : hostname,
                    "metrics" : healthresponse3
                });
            }

        });


    })

    setTimeout(function(){ printResutl();}, 30000);

    function printResutl(){
        console.log(result);
        var i ;
        for(i = 0 ; i < result.length; i++){
            //call api and get values here 
            //then check for criticals as below 

            if (result[i].status == 'CRITICAL')
            {
                console.log("Critical send mail");
                //console.log(mailflag);

                if(mailflag == "notsent")
                {
                    now = new Date();
                    cur = date.addSeconds(now, 0);
                    //console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
                    //console.log("Print date : " + cur);
                    resumetime = date.addSeconds(now, interval);
                    console.log("interval   " + interval);
                    diff = date.subtract(resumetime, cur).toSeconds();  
                    console.log("Diff  " +  diff);
                    mailflag = "sent";
                    //console.log(healthresponse[i].hostName + ' -- ' + healthresponse[i].id + ' --- '+healthresponse[i].status);
                    sendMail(result[i].ip,result[i].status);
                }
                else
                {
                    now = new Date();
                    cur = date.addSeconds(now, 0);
                    diff = date.subtract(resumetime, cur).toSeconds(); 
                    console.log("Diff  " +  diff);

                    if(diff < 0)
                    {
                        mailflag = "notsent";
                        //console.log("==================Sending new again===================");
                        //interval = 20 ;
                        //console.log(healthresponse[i].hostName + ' -- ' + healthresponse[i].id + ' --- '+healthresponse[i].status);
                        sendMail(result[i].ip,result[i].status);
                    }
                    else
                    {
                        //console.log("==================Already sent===================");
                    }


                }

            }

        }
        
        sendStatus(result);
    }

    //end of API call 




}

function sendStatus(values){
    //console.log(id);
    if (values.length == 3)
        {
            io.emit('doneAnsible', values);
        }
    else
        {
            console.log("Missing values");
        }
    result  = [];


}

function sendMail(host, status){
    console.log("######################### Sending Mail ############################");
    console.log(host + " " + status);
   

}




//start our web server and socket.io server listening
server.listen(3000, function(){
    console.log('listening on :3000');
});

