// var date = new Date();
// date.setDate(date.getDate() + 5);


$(document).ready(function(){
	$("#savebtn").click(function(){
        var username = $("#usernamefield").val();
        var dob = $("#dobfield").val();
        var gender = $("#genderfield").val();
        var introduction = $("#textfield5").val();
        var password1 = $("#textfield2").val();
        var password2 = $("#textfield3").val();

        if (username=="" | password1=="" | password2 ==""){
        	alert("username or password cannot be empty");
        }else if(password1 != password2){
        	alert("different password");
        }else{
        $.ajax({
	        url: "/newuser",
	        type: "POST",
	        dataType: "JSON",
	    	contentType: "application/json; charset=utf-8",
	    	data: JSON.stringify({
				"userName": username,
				"birthday": dob,
				"gender": gender,
				"introduction": introduction,
				"password": password1
			}),
	    	success:function(response){
	    		console.log(response);
				// document.cookie = "curUser=" + username + ";expires="
				// 										+ date.toUTCString();
				$.getScript("./scripts/main.js", function() {
					createCookie(username);
				});
				window.location = "./CustomerIndex.html";
	    		// window.location = "./CustomerIndex.html?username="+username;
            },
            error:function(xhr){
            	alert(xhr.responseText);
            }
	    });
    	}

    });


})
