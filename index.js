var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;



io.on('connection', function(socket){
	console.log('-- ' + socket.id + ' joined --');
    
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
  
  socket.on('register',function(account,password,nickname,sex){
	console.log('---' + account + ' '+ password + ' ' + nickname + ' ' + sex);
	});
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});
