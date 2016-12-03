
var userName="testUser1";


$(document).ready(function() {
    // changeTrHeight();
    /* generate followed users' list on page*/
    function generateFollow(userName) {
        $.ajax({
            url: "/users?userName=" + userName,
            type: "GET",
            dataType: "JSON",
            success: function(user) {
                var fList = user.follow;
                console.log(user);
                for (let item in fList) {
                    addUserProf(fList[item]);
                }
            }
        });
    }


    generateFollow(userName);


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



    function addUserProf(user) {
        $("#tb1").append(
            '<tr>\
              <td height="105" align="center" valign="middle" class="td2">\
                <img src="images/people1.gif" width="48" height="48" alt="" />\
              </td>\
              <td height="105" align="left" valign="bottom" class="td3">\
                <font color="#005dc3" size="3">\
                  <a>'  + user + '</a>\
                </font>\
                <img src="images/1.gif" width="17" height="15" alt="" />\
                <br />\
                <br />\
                <button class="focus1" onclick="unfollow(\'' + user +
                                                    '\')">Unfollow</button>\
              </td>\
            </tr>');

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
