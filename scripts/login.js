$(document).ready(function(){
	$("#button").click(function(){
        var username=$("#userId").val();
        var password=$("#passWord").val();
        if (username=="" | password==""){
        	alert("username or password cannot be empty");
        }else{
        $.ajax({
	        url:"/login",
	        type:"POST",
	        dataType:"JSON",
	    	contentType:"application/json; charset=utf-8",
	    	data:JSON.stringify({
				"userName":username,
				"password":password
			}),
	    	success:function(response){
	    		window.location = "./CustomerIndex.html?username="+username;
            },
            error:function(xhr){
            	alert(xhr.responseText);
            }
	    });
    	}

    });

    
})