


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

function quitBtn() {
    var date = new Date();
    date.setDate(date.getDate());
    document.cookie = "curUser=;expires=" + date.toUTCString();
}
// function getIsAdmin(){
//     var isadmin = "isadmin=";
//     var ca = document.cookie.split(";");
//      for (let i = 0; i < ca.length; i++) {
//         let cur = ca[i];
//         while (cur.charAt(0) == ' ') {
//             cur = cur.substring(1);
//         }
//         if (cur.indexOf(name) == 0) {
//             console.log(cur.substring(name.length, cur.length));
//             return cur.substring(name.length, cur.length);
//         }
//         return undefined;
//     }
// }

// function createIsAdminCookie(isadmin){
//     var date = new Date();
//     date.setDate(date.getDate() + 5);
//     document.cookie = "isadmin=" + isadmin + ";expires=" + date.toUTCString();
// }
