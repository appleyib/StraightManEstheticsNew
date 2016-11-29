
var userName="testUser2";

$(document).ready(function() {
    changeTrHeight();
    /* generate followed users' list on page*/
    function generateFollow(userName) {
        $.ajax({
            url: "/users?userName=" + userName,
            type: "GET",
            dataType: "JSON",
            success: function(user) {
                var fList = user.follow;
                for (let item in fList) {
                    $.ajax({
                        url: "/users?userName=" + fList[item],
                        type: "GET",
                        dataType: "JSON",
                        success: function(response) {
                            console.log(response);
                            addUserProf(response);
                        }
                    });
                }
            }
        });
    }

    generateFollow(userName);

    function addUserProf(user) {
        $("#tb1 tr:last").remove();
        $("#tb1").append(
            "<tr>\
              <td height='105' align='center' valign='middle' class='td2'>\
                <img src='images/people1.gif' width='48' height='48' alt='' />\
              </td>\
              <td height='105' align='left' valign='bottom' class='td3'>\
                <font color='#005dc3' size='3'>\
                  <a>" + user.userName + "</a>\
                </font>\
                <img src='images/1.gif' width='17' height='15' alt='' />\
                <button id='focus1' onClick='unFollow("
                                            + userName + ")'>Unfollow</button>\
              </td>\
            </tr>");
        $("#tb1").append(
            "<tr>\
              <td height='41' class='td2 height'></td>\
              <td height='41' class='td3 height'></td>\
            </tr>");
    }

    function unFollow(user) {
        var url = "/follow";
        $.post(url, function(req, res) {

            console.log(req.body);

            res.send(JSON.stringify({
                "followTo": user,
                "followFrom": userName
            }));
            console.log(res.body);
            if (res == "Success") {
                // successfully unfollowed
                window.alert("Successful");
                window.location.reload();
            } else {
                window.alert(res);
            }
        });
    }


    function changeTrHeight() {
		var mainBanner = document.getElementById("mainBanner");
		var mainRight = document.getElementById("mainRight");
		initTrHeight(mainBanner,mainRight);//设置高度为自动
		var height = mainBanner.offsetHeight > mainRight.offsetHeight ? mainBanner.offsetHeight : mainRight.offsetHeight;//获取高度高的值
		mainBanner.style.height = height + "px";//为他们的高度都赋高的那个值
		mainRight.style.height = height+ "px";//
	}

    function initTrHeight(divObj1,divObj2) {
		divObj1.style.height = "auto";
		divObj2.style.height = "auto";
	}
});
