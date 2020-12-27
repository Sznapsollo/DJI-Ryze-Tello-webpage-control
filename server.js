var nStatic = require('node-static')
var http = require('http');
var udp = require('dgram');

var fileServer = new nStatic.Server('./public');
http.createServer(function (req, res) {
  if (req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });
    req.on('end', () => {
        console.log(body);
        var djiActionJson = JSON.parse(body)
        res.end('ok');

        var command1 = Buffer.from('command')
        var command2 = Buffer.from(djiActionJson.action)

        client.send(command1, 8889,'192.168.10.1',function(error){
          // client.send(commands,8889,'localhost',function(error){
            if(error){
              client.close();
            } else{
              console.log('client sent message command')
            }
          });

        client.send(command2,8889,'192.168.10.1',function(error){
          // client.send(commands,8889,'localhost',function(error){
            if(error){
              client.close();
            } else{
              console.log('client sent message ' + djiActionJson.action)
            }
          });
    });
    return
  }
  fileServer.serve(req, res);
}).listen(8083);

// --------------------creating a udp server --------------------

// creating a udp server
var server = udp.createSocket('udp4');

// emits when any error occurs
server.on('error',function(error){
  console.log('Error: ' + error);
  server.close();
});

// emits on new datagram msg
server.on('message',function(msg,info){
  console.log('Data received from client : ' + msg.toString());
  console.log('Received %d bytes from %s:%d\n',msg.length, info.address, info.port);

  //sending msg
  server.send(msg,info.port,'localhost',function(error){
    if(error){
      client.close();
    }else{
      console.log('Data sent !!!');
    }
  });
});

//emits when socket is ready and listening for datagram msgs
server.on('listening',function(){
  var address = server.address();
  var port = address.port;
  var family = address.family;
  var ipaddr = address.address;
  console.log('Server is listening at port: ' + port);
  console.log('Server ip:' + ipaddr);
  console.log('Server is IP4/IP6: ' + family);
});

//emits after the socket is closed using socket.close();
server.on('close',function(){
  console.log('Socket is closed !');
});

server.bind(8889);

// setTimeout(function(){
//   server.close();
// },8000);

// -------------------- udp client ----------------

var buffer = require('buffer');

// creating a client socket
var client = udp.createSocket('udp4');

//buffer msg
var data = Buffer.from('siddheshrane');

client.on('message',function(msg,info){
  console.log('Data received from server : ' + msg.toString());
  console.log('Received %d bytes from %s:%d\n',msg.length, info.address, info.port);
});