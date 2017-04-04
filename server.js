var snmp=require("net-snmp");
var express = require('express');
var app = express();

var session = snmp.createSession("218.54.189.196", "public");
var oids =["1.3.6.1.2.1.1.5.0", "1.3.6.1.2.1.1.1.0", "1.3.6.1.2.1.1.6.0"];

app.get('/', function (req, res) {
  var device = {};
 var desc = getsnmp(session, device, function (error, device) {
  	if (error) {
  		console.error (error.toString ());
  	} else {
      console.log(device.name);
      console.log(device.description);
      console.log(device.location);
      res.send("Hello !<p> DMS1200Rel6 Information <p> "+"name:"+device.name+"<p>description:"+device.description+"<p>loc:"+device.location);
  		// console.warn (util.inspect (device, {depth: 3}));
  	}
  });

  // res.send("result>>"+desc);

});


function getsnmp(session, device, pollCb) {
console.log ("getting system properties...");
  var s = session.get(oids, function(error, varbinds){
        if (error){
          console.error(error);
          pollCb (error, null);
        }
        else {
          for( var i=0; i< varbinds.length; i++){
            if(snmp.isVarbindError(varbinds[i]))
              console.error(snmp.varbindError(varbinds[i]));
            // else{
            //   tmp  = rlt + varbinds[i].oid+ "="+ varbinds[i].value +">>";
            //   res.send(tmp);
            //   }
          }
          device.name = varbinds[0].value.toString ();
          device.description = varbinds[1].value.toString ();
    			device.location = varbinds[2].value.toString ();

          console.log("name:"+device.name);
          console.log("description:"+device.description);
          console.log("loc:"+device.location);

          pollCb(null, device);
          console.log("end of for loop");
        }
      });
}

function sleep(delay) {
  console.log("sleep start"+delay);
       var start = new Date().getTime();
       while (new Date().getTime() < start + delay);
       console.log("sleep end"+delay);
     }

//start a server on port 80 and log its start to our console
var server = app.listen(80, function () {
  console.log("server start !!");
  var port = server.address().port;
  console.log('Example app listening on port ', port);

});
