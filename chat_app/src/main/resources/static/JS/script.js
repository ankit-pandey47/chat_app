var stompClient = null

function sendMessage(){
	
	let JsonOb = {
		name : localStorage.getItem("name"),
		content:$("#message-value").val()
	}
	stompClient.send("/app/message", {} , JSON.stringify(JsonOb))
}


function connect(){
	
	let socket = new SockJS("https://chatapp-production-ankit.up.railway.app/server1");

	
	stompClient = Stomp.over(socket)
	
	stompClient.connect({}, function(frame){
		
		console.log("connected"+frame)
		
		$("#name-form").addClass('d-none')
		$("#chat-room").removeClass('d-none')
		
		
		//subscribe
		stompClient.subscribe("/topic/return-to" , function(response){
			showMessage(JSON.parse(response.body))
		})
		
	})
	
}


function showMessage(message){
	$("#message-container-table").prepend(`<tr><td><b>${message.name} : </b> ${message.content}</td></tr>`)
	
}


$(document).ready((e)=>{
	
	$("#login").click(()=>{
		
	let name =	$("#name-value").val()
	localStorage.setItem("name" , name);
	$("#name-title").html(`welcome , <b>${name}</b>`)
		connect();
	})
	
	$("#send-btn").click(()=>{
		sendMessage()
	})
	
	$("#logout").click(()=>{
		localStorage.removeItem("name")
		if(stompClient!=null){
			stompClient.disconnect();
			$("#name-form").removeClass('d-none')
			$("#chat-room").addClass('d-none')
		}
		
	})
	
	
	
	
})
