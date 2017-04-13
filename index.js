var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;
var db = require('./app/userDao.js')();
var qn = require('./app/qiniu.js')();
var onlineUser=[];
var userList={};

io.on('connection', function(socket){
	console.log('-- ' + socket.id + ' joined --');

	socket.on('register',function(account,password,nickname,signature){
		db.insertUser(account,password,nickname,signature,function(result){
			socket.emit('register_result',result);
			socket.broadcast.emit('newUser',account,nickname,signature,'');
		});
	});

	socket.on('login',function(account,password){
		db.login(account,password,function(result,account,nickname,signature,image){
			console.log('-- ' + account + ' ' +  password  + '-- try to login');
			if(result){
				console.log('-- ' + account + ' login success');
				onlineUser.push(account);
				userList[socket.id] = account;
				socket.broadcast.emit('login_client',account);
			}else{
				console.log('-- ' + account + ' login failed');
			}
			socket.emit('login_result',result,account,nickname,signature,image);
		});
	});
	
	socket.on('getAllUser',function(){
		db.getAllUser(function(userList){
			socket.emit('getAllUser_result',userList,onlineUser);
		});
	});
	
	socket.on('getAllUserOnline',function(){
		socket.emit('getAllUserOnline_result',onlineUser);
	});
	
	socket.on('disconnect',function(){
		console.log('-- ' + userList[socket.id] + ' left');
		socket.broadcast.emit('logout_client',userList[socket.id]);
		delete(userList[socket.id]);
	});
	
	socket.on('updateUser',function(account,nickname,signature,image){
		db.updateUser(account,nickname,signature,image,function(result){
			socket.emit('updateUser_result',result);
			if(result){
				socket.broadcast.emit('userUpdate_result',account,nickname,signature,image);
			}

		});
	});
	socket.on('logout',function(account){
		console.log('-- ' + account + ' logout');
		socket.broadcast.emit('logout_client',account);
	});

	socket.on('getToken',function(bucket,key){
		qn.getToken(bucket,key,function(token){
			socket.emit('token_result',token);
		});
	});
});

http.listen(port, function(){
  console.log('listening on localhost:' + port);
});
