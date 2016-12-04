// get current log in user's name
// and whether it is admin
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
    // if user already login
    // go to mainpage
	if (userName !== undefined) {
		if (isadmin == "false") {
			window.location = "./CustomerIndex.html";
		} else {
			window.location = "./Admin.html";
		}
	}


	// when login button is clicked
	$("#button").click(function(e){
		e.preventDefault();
		//get username and password
        var username=$("#userId").val();
        var password=$("#passWord").val();
        //alert
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
	    	//set cookie to store current login user name and
			// whether it is admin
				if (response[1]) {
					$.getScript("./scripts/main.js", function() {
						createCookie(username, "true");
					});
					window.location = "./Admin.html";
				} else {
					$.getScript("./scripts/main.js", function() {
						createCookie(username, "false");
					});
					window.location = "./CustomerIndex.html";
				}
            },
            //error
            error:function(xhr){
            	alert(xhr.responseText);
            }
	    });
    	}

    });


})

//get cookie
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
