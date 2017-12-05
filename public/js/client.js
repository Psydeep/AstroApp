var socket = io();

socket.on("new document",function(data){
	data = JSON.parse(data);
	console.log(data);
	var container = document.querySelector("#documentos");
	var source = document.querySelector("#item-template").innerHTML;

	var template = Handlebars.compile(source);

	container.innerHTML= template(data) + container.innerHTML;
});

socket.on("new notice",function(data){
	data = JSON.parse(data);
	console.log(data);
	var container = document.querySelector("#publicaciones");
	var source = document.querySelector("#item-template2").innerHTML;

	var template = Handlebars.compile(source);

	container.innerHTML= template(data) + container.innerHTML;
});