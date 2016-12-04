// var date = new Date();
// date.setDate(date.getDate() + 5);
var userName;
var isadmin;
var result;

if (document.cookie !== undefined) {
	console.log(document.cookie);
	result = getCookie();
	userName = result[0];
	isadmin = result[1];
}

$(document).ready(function(){

	console.log(userName);
	if (userName !== undefined) {
		if (isadmin == "false") {
			window.location = "./CustomerIndex.html";
		} else {
			window.location = "./Admin.html";
		}
	}
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

function getCookie() {
    var result = [undefined, undefined];
    var name = "curUser=";
    var check = "isadmin=";
    var ca = document.cookie.split(";");
    for (let i = 0; i < ca.length; i++) {
        let cur = ca[i];
        while (cur.charAt(0) == ' ') {
            cur = cur.substring(1);
        }
        if (cur.indexOf(name) == 0) {
            result[0] = cur.substring(name.length, cur.length);
        }
        if (cur.indexOf(check) == 0) {
            result[1] = cur.substring(check.length, cur.length);
        }
    }
    return result;
}

// function createCookie(username, isadmin) {
//     var date = new Date();
//     date.setDate(date.getDate() + 5);
//     document.cookie = "curUser=" + username + ";isadmin=" + isadmin + ";expires=" + date.toUTCString();
//
// }
