if(localStorage.getItem("userArray")== null){
    localStorage.setItem("userArray",JSON.stringify([{username:"admin",password:"123",role:"admin"},{username:"user",password:"456",role:"sales"}]));
}
function login() {
    let role;
    let isAuthentic = false;
    let password = document.getElementById("password").value;
    let user = document.getElementById("username").value;
    let userArray = JSON.parse(localStorage.getItem("userArray"));
    userArray.forEach(element => {
        if(element.username==user & element.password==password){
            isAuthentic=true;
            role = element.role
        }
    });
    if(isAuthentic){
        if (role=="admin") {
            window.location.replace("admin.html");
        } else {
            window.location.replace("user.html");
        }

    }else{
        document.getElementById("warning").innerHTML='<p style="color: red ;">Incorrect Password Or UserName</p>';
    }
}
function logout() {
    window.location.replace("index.html");
}
function openPOS() {
    open("pos.html","_blank");
}
