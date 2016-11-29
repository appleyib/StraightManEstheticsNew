
var userName="testUser2";

$(document).ready(function() {

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
        $("#tb1").
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
});
