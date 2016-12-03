$(document).ready(function(){
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

	getUsers();
	function addUser(user){
		console.log(user.userName);
		$("#userfield").append(
	   '<tr>\
        <td height="105" align="center" valign="middle" class="td2"><img src="images/people1.gif" width="48" height="48" alt="" /></td>\
        <td height="105" align="left" valign="bottom" class="td3"><font color="#005dc3" size="3" ><a>'+user.userName+'</a></font>\
        <img src="images/1.gif" width="17" height="15" alt="" />\
        <br /><font color="#000000" size="2">'+user.gender+'</font>\
        <br /><font color="#000000" size="2">'+user.introduction+'</font>\
       <button id="focus1" onclick = "edit(\''+user.userName+'\')">Edit</button>\
        <button id="focus1" onclick="remove(\'' + user.userName +
                                                    '\')">Remove</button></td>\
      </tr>'
			);
	}


})

    function remove(username){
    	console.log(username);
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