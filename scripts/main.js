


function getCookie() {
    var name = "curUser=";
    var ca = document.cookie.split(";");
    for (let i = 0; i < ca.length; i++) {
        let cur = ca[i];
        while (cur.charAt(0) == ' ') {
            cur = cur.substring(1);
        }
        if (cur.indexOf(name) == 0) {
            return cur.substring(name.length, cur.length);
        }
        return undefined;
    }
}

function createCookie(username) {
    var date = new Date();
    date.setDate(date.getDate() + 5);
    document.cookie = "curUser=" + username + ";expires=" + date.toUTCString();
}
