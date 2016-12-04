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
		$("#tb2").append(
	   '<tr id = "'+user.userName+'">\
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

    $("#clearDatabase").click(function(){
    	$.ajax({
    		url:"/repopulating",
    		type:"DELETE",
    		dataType:"JSON",
    		success:function(response){
    			console.log(response);
    			window.location.reload();
    		},
		    error:function(xhr){
            	alert(xhr.responseText);
            }

    	});
    })
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

    $("#home").click(function(){
        
        window.location="./Admin.html";
    })
    $("#addUserBtn").click(function(e){
        e.preventDefault();
        console.log("kk");
        window.location = "./register.html";
    })

})
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
    function edit(username){
         window.location="./setting.html?username="+username;
    }