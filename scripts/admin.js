
// get current login user's name
// whether it is admin
if (document.cookie !== undefined) {
	result = getCookie();
	userName = result[0];
	isadmin = result[1];
}


$(document).ready(function(){

    // function to get information of all users
	function getUsers(){
        $.ajax({
            url: "/users",
            type: "GET",
            dataType: "JSON",
            success: function(users) {
                for (let item in users) {
                    addUser(users[item]);
                }
            }
        });
	}
    // logout
	$("#quitBtn").click(function(e) {
		e.preventDefault();
		var date = new Date();
	    date.setDate(date.getDate() - 1);
	    document.cookie = "curUser=;expires=" + date.toUTCString();
	    document.cookie = "isadmin=;expires=" + date.toUTCString();
		window.location = "./login.html";
	});
    //get infomation of all users
	getUsers();
    // load each user's infomation
	function addUser(user){
		$("#tb2").append(
	   '<tr id = "'+user.userName+'">\
        <td height="105" align="center" valign="middle" class="td2"><img src="images/icon.jpg" width="48" height="48" alt="" /></td>\
        <td height="105" align="left" valign="bottom" class="td3"><font color="#005dc3" size="3" ><a href="./setting.html?userName='
        +user.userName+'">'+user.userName+'</a></font>\
        <img src="images/1.gif" width="17" height="15" alt="" />\
        <br /><font color="#000000" size="2">'+user.gender+'</font>\
        <br /><font color="#000000" size="2">'+user.introduction+'</font>\
       <button id="focus1" onclick = "edit(\''+user.userName+'\')">Edit</button>\
        <button id="focus1" onclick="remove(\'' + user.userName +
                                                    '\')">Remove</button></td>\
      </tr>'
			);
	}
    // admin is able to clear Database
    $("#clearDatabase").click(function(){
    	$.ajax({
    		url:"/repopulating",
    		type:"DELETE",
    		dataType:"JSON",
    		success:function(response){
    			window.location.reload();
    		},
		    error:function(xhr){
            	alert(xhr.responseText);
            }

    	});
    })

    // can search user by key words
    $("#searchUser").click(function(e){
    	e.preventDefault();
        var keyword= $("#textfield2").val();
 		$.ajax({
            url:'/users?searchName='+keyword,
	 	    type:"GET",
	  	    dataType:"JSON",
	    	success:function(response){
	    		var responseField = $("#tb2");
	    		responseField.empty();
	    		for (let i = 0;i<response.length;i++){
					addUser(response[i]);
				}
		    },
		    error:function(xhr){
            	alert(xhr.responseText);
            }
       });

    });
    // click home will stay at admin page
    $("#home").click(function(){

        window.location="./Admin.html";
    })
    // admin is able to add a new user
    $("#addUserBtn").click(function(e){
        e.preventDefault();
        console.log("kk");
        window.location = "./register.html";
    })
})
    // function to remove user in the database by username
    function remove(username){
         $.ajax({
            url: "/deleteUser?userName="+username,
            type: "DELETE",
            dataType: "JSON",
            success: function(respose) {
            	console.log(respose);
            	window.location.reload();
                },
             error:function(xhr){
            	alert(xhr.responseText);
            }
        });

    }
    // when click edit button
    // transfer to setting page
    function edit(username){
         window.location="./setting.html?username="+username;
    }
    // get cookie
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

