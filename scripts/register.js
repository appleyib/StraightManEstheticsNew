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

$(document).ready(function() {
    if (isadmin == "true") {
            $("#quitBtn").html("Back");
        }
    // quit
    $("#quitBtn").click(function(e) {
        // when admin wants to add new user, hides the return button
        if (isadmin == "true") {
            window.location = "./Admin.html";
        } else {
            e.preventDefault();
            var date = new Date();
            date.setDate(date.getDate() - 1);
            document.cookie = "curUser=;expires=" + date.toUTCString();
            document.cookie = "isadmin=;expires=" + date.toUTCString();
            window.location = "./login.html";
        }
    });
    // when save button is clicked
    $("#savebtn").click(function() {
        //get all information of new user
        var username = $("#usernamefield").val();
        var dob = $("#dobfield").val();
        var gender =
            $("input[name='gender']:checked").val()
        console.log(gender);
        var introduction = $("#textfield5").val();
        var password1 = $("#textfield2").val();
        var password2 = $("#textfield3").val();
        // check whether username is empty or password is empty
        if (username=="" | password1=="" | password2 ==""){
        	alert("username or password cannot be empty");
        // if two password do not match
        }else if(password1 != password2){
        	alert("different password");
        }else{
        // send ajax
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
            // if success, go to the main page of new user
	    	success:function(response){
				if (isadmin != "true") {
					quitBtn();
					$.getScript("./scripts/main.js", function() {
						createCookie(username);
					});
				}

				if (isadmin == "true"){ window.location = "./Admin.html"}
			    else {window.location = "./CustomerIndex.html"};
            },
            error:function(xhr) {
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
    //split by ;
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

function quitBtn() {
    var date = new Date();
    date.setDate(date.getDate() - 1);
    document.cookie = "curUser=;expires=" + date.toUTCString();
    document.cookie = "isadmin=;expires=" + date.toUTCString();
}
