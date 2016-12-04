// var date = new Date();
// date.setDate(date.getDate() + 5);

	var userName;
	var isadmin;
	var result;
	$.getScript("./scripts/main.js", function() {
		result = getCookie();
		userName = result[0];
		isadmin = result[1];
	})
$(document).ready(function(){

	$("#savebtn").click(function(){
        var username = $("#usernamefield").val();
        var dob = $("#dobfield").val();
        var gender = 
        $("input[name='gender']:checked").val()
        console.log(gender);
        var introduction = $("#textfield5").val();
        var password1 = $("#textfield2").val();
        var password2 = $("#textfield3").val();

        if (username=="" | password1=="" | password2 ==""){
        	alert("username or password cannot be empty");
        }else if(password1 != password2){
        	alert("different password");
        }else{
        $.ajax({
	        url:"/newUser",
	        type:"POST",
	        dataType:"JSON",
	    	contentType:"application/json; charset=utf-8",
	    	data:JSON.stringify({
				"userName":username,
				"birthday":dob,
				"gender":gender,
				"introduction":introduction,
				"password":password1
			}),
	    	success:function(response){
	    		console.log(response);
				$.getScript("./scripts/main.js", function() {
					createCookie(username);
				});
				if (isadmin){ window.location = "./Admin.html"}
			    else {window.location = "./CustomerIndex.html"};
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

function createCookie(username, isadmin) {
    var date = new Date();
    date.setDate(date.getDate() + 5);
    document.cookie = "curUser=" + username + ";isadmin=" + isadmin + ";expires=" + date.toUTCString();

}
