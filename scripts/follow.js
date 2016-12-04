var currentuserName=document.URL.split('?')[1].split("=")[1];//we are on this user's page

var userName;
var isadmin;


var result;
result = getCookie();
userName = result[0];
isadmin = (result[1]=="true");
console.log(isadmin);

if (userName == undefined) {
    window.location = "./login.html";
}

$(document).ready(function() {
    // changeTrHeight();
    /* generate followed users' list on page*/
    function generateFollow(userName) {
        $.ajax({
            url: "/users?userName=" + userName,
            type: "GET",
            dataType: "JSON",
            success: function(user) {
                load(user);
                var fList = user.follow;
                for (let item in fList) {
                    addUserProf(fList[item]);
                }
            }
        });
    }
    function load(user){
        if (isadmin){
            $("#profile").css('display', 'none');
            $("#home").attr("href", "./Admin.html");
        }
        $("#genderbodfield").html("&nbsp;"+user.gender+"&nbsp;"+user.birthday.substring(0,10));
        $("#namefield").html(currentuserName);
        // $("#namefield").attr("href", "./setting.html?=userName="+currentuserName);
        $("#postnum").html(user.posts.length);
        $("#follownum").html(user.follow.length);
        $("#followernum").html(user.followers.length);
        $("#profile").attr("href", "./setting.html?userName="+userName);
        $("#getfollow").attr("href", "./follow.html?userName="+currentuserName);
        $("#getfollower").attr("href", "./follower.html?userName="+currentuserName);
    }
    $("#quitBtn").click(function(e) {
		e.preventDefault();
		var date = new Date();
	    date.setDate(date.getDate() - 1);
        document.cookie = "curUser=;expires=" + date.toUTCString();
        document.cookie = "isadmin=;expires=" + date.toUTCString();
		window.location = "./login.html";
	});

    generateFollow(currentuserName);

    function addUserProf(user) {
        if (currentuserName==userName){
        $("#tb1").append(
            '<tr>\
              <td height="105" align="center" valign="middle" class="td2">\
                <img src="images/icon.jpg" width="48" height="48" alt="" />\
              </td>\
              <td height="105" align="left" valign="bottom" class="td3">\
                <font color="#005dc3" size="3">\
                  <a href="./setting.html?userName='+user+'">'  + user + '</a>\
                </font>\
                <img src="images/1.gif" width="17" height="15" alt="" />\
                <br />\
                <br />\
                <button class="focus1" onclick="unfollow(\'' + user +
                                                    '\')">Unfollow</button>\
              </td>\
            </tr>');
        }else{
        $("#tb1").append(
            '<tr>\
              <td height="105" align="center" valign="middle" class="td2">\
                <img src="images/icon.jpg" width="48" height="48" alt="" />\
              </td>\
              <td height="105" align="left" valign="bottom" class="td3">\
                <font color="#005dc3" size="3">\
                  <a href="./setting.html?userName='+user+'">'  + user + '</a>\
                </font>\
                <img src="images/1.gif" width="17" height="15" alt="" />\
                <br />\
                <br />\
              </td>\
            </tr>');            
        }
    }



});



function unfollow(user) {
    $.ajax({
        url: '/follow',
        type: "POST",
        dataType: "JSON",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({ 'followTo': user, 'followFrom': userName }),
        success: function(response) {
            window.location.reload();
        }
    });
}

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

function quitBtn() {
    var date = new Date();
    date.setDate(date.getDate() - 1);
    document.cookie = "curUser=;expires=" + date.toUTCString();
    window.reload();
}
