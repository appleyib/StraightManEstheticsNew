// var date = new Date();
// date.setDate(date.getDate() + 5);
var userName;
var isadmin;
if (document.cookie !== undefined) {
	var result;
	$.getScript("./scripts/main.js", function() {
		result = getCookie();
		userName = result[0];
		isadmin = result[1];
	})
	if (userName !== undefined) {
		if (isadmin == "false") {
			window.location = "./CustomerIndex.html";
		} else {
			window.location = "./Admin.html";
		}
	}
}

$(document).ready(function(){
	$("#button").click(function(e){
		e.preventDefault();
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
				// var isadmin = response[1];
				// $.getScript("./scripts/main.js", function() {
				// 	createIsAdminCookie(response);
				// });
			// document.cookie = "curUser=" + username + ";expires="
				// 								+ date.toUTCString();
				if (response[1]) {
					$.getScript("./scripts/main.js", function() {
						createCookie(username, true);
					});
					window.location = "./Admin.html";
				} else {
					$.getScript("./scripts/main.js", function() {
						createCookie(username, false);
					});
					window.location = "./CustomerIndex.html";
				}
	    		// window.location = "./CustomerIndex.html?username="+username;
            },
            error:function(xhr){
            	alert(xhr.responseText);
            }
	    });
    	}

    });


})
