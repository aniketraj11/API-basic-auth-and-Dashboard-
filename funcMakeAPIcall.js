process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
var request = require('request')
var username = ''
var password = '!'

var iplist = ['', '', ''];
var options ;
var token ;


options = [{
    url: 'url',
    method : 'POST',
    auth: {
        user: username,
        password: password
    }
},
           {
               url: 'url',
               method : 'POST',
               auth: {
                   user: username,
                   password: password
               }
           },
           {
               url: 'url',
               method : 'POST',
               auth: {
                   user: username,
                   password: password
               }
           }
          ];

var optionsList = [];

for(var i = 0; i < iplist.length ; i++)
{
    var obj = {
        url: 'https://' + iplist[i] +':8443/admin/api/v1/login',
        method : 'POST',
        auth: {
            user: username,
            password: password
        },
        ip: iplist[i]
    }

    optionsList.push(obj);
}



var result  = [];

var tokenlist = [];

for(var i = 0 ; i<iplist.length; i++)
{
console.log("===============  " + i + "  ==================");
    request(optionsList[i], function (err, res, body) {
        if (err) {
            console.dir(err)
            return
        }
        console.log(i + "    ======     " +optionsList[i].ip);
        console.log('token');
        var obj = JSON.parse(body);
        console.log(obj.token);
        token = 'Bearer ' + obj.token;



    })


}





setTimeout(function(){ printResutl();}, 30000);

function printResutl(){
    console.log(result);
}



