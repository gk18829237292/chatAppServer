var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;
var db = require('./app/userDao.js')();

var onLineUser=[];
var userList={};

io.on('connection', function(socket){
	console.log('-- ' + socket.id + ' joined --');
    userList[socket.id] = '1212';
	socket.on('chat message', function(msg){
		io.emit('chat message', msg);
	});
  
	socket.on('register',function(account,password,nickname,sex){
		db.insertUser(account,password,nickname,sex,function(result){
			socket.emit('register_result',result);
		});
	});
	
	socket.on('login',function(account,password){
		
		db.login(account,password,function(result){
			if(result){
				console.log('-- ' + account + ' login success');
				onLineUser.push(account);
				var key = socket.id;
				userList[socket.id] = account;
				console.log(userList);
			}else{
				console.log('-- ' + account + ' login failed');
			}
			socket.emit('login_result',result);
		});
	});
	
	socket.on('disconnect',function(){
		console.log(onLineUser);
		console.log(userList);
		delete(userList[socket.id]);
		console.log(userList);
	});
	
	
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});
