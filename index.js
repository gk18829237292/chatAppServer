var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;
var db = require('./app/userDao.js')();
var qn = require('./app/qiniu.js')();
var onlineUser={};
var userList={};
var userList1={};

io.on('connection', function(socket){
	console.log('-- ' + socket.id + ' joined --');

	socket.on('register',function(account,password,nickname,signature){
		db.insertUser(account,password,nickname,signature,function(result){
			socket.emit('register_result',result);
			socket.broadcast.emit('newUser',account,nickname,signature,'');
		});
	});

	//处理用户登录请求
	socket.on('login',function(account,password){
		//db 为自己写的操作数据库的工具类
		db.login(account,password,function(result,account,nickname,signature,image){
			console.log('-- ' + account + ' ' +  password  + '-- try to login');
			if(result){//校验成功，在服务器中更新该用户的在线状态
				console.log('-- ' + socket.id + ' == ' + account + ' login success');
				onlineUser[account] = 'on';
				userList[socket.id] = account;
				userList1[account]=socket.id;
				socket.broadcast.emit('login_client',account);//通知其他用户该用户上线消息
			}else{//校验失败
				console.log('-- ' + account + ' login failed');
			}
			//返回登录结果
			socket.emit('login_result',result,account,nickname,signature,image);
		});
	});
	
	socket.on('getAllUser',function(){
		db.getAllUser(function(userList){
			console.log('onLineUser : ' + onlineUser);
			console.log('userList : ' + userList);
			socket.emit('getAllUser_result',userList,onlineUser);
		});
	});
	
	socket.on('getAllUserOnline',function(){
		socket.emit('getAllUserOnline_result',onlineUser);
	});
	
	socket.on('disconnect',function(){
		console.log('-- ' + userList[socket.id] + ' left');
		var account = userList[socket.id];
		socket.broadcast.emit('logout_client',account);
		delete(onlineUser[account]);
		delete(userList1[account]);
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
		delete(onlineUser[account]);
		socket.broadcast.emit('logout_client',account);
	});

	socket.on('getToken',function(bucket,key){
		qn.getToken(bucket,key,function(token){
			socket.emit('token_result',token);
		});
	});
	
	socket.on('init',function(src,des){
		console.log('init' + ' ' + src + '->' + des);
		var otherSocket = io.sockets.connected[userList1[des]];
		if (!otherSocket) {
			return;
		}
		otherSocket.emit('init',src,des);
	});
	
	socket.on('offer',function(src,des,sdp){
		console.log('offer' + ' ' + src +'->' + des);
		var otherSocket = io.sockets.connected[userList1[des]];
		if (!otherSocket) {
			return;
		}
		otherSocket.emit('offer',src,des,sdp);
	});
	
	socket.on('answer',function(src,des,sdp){
		console.log('answer' + ' ' + src +'->' + des);
		var otherSocket = io.sockets.connected[userList1[des]];
		if (!otherSocket) {
			return;
		}
		otherSocket.emit('answer',src,des,sdp);
	});
	
	socket.on('reject',function(src,des){
		console.log('reject' + ' ' + src +'->' + des);
		var otherSocket = io.sockets.connected[userList1[des]];
		if (!otherSocket) {
			return;
		}
		otherSocket.emit('reject',src,des);
	});
	
	socket.on('ice',function(src,des,sdpMid,index,sdp){
		console.log('ice ' + ' ' + src + '->' + des);
		var otherSocket = io.sockets.connected[userList1[des]];
		if (!otherSocket) {
			return;
		}
		otherSocket.emit('ice',src,des,sdpMid,index,sdp);
	});
	
	socket.on('hangup',function(src,des){
		console.log('hangup' + ' ' + src +'->' + des);
		var otherSocket = io.sockets.connected[userList1[des]];
		if (!otherSocket) {
			return;
		}
		otherSocket.emit('hangup',src,des);
	});
});

http.listen(port, function(){
  console.log('listening on localhost:' + port);
});
