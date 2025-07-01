let customerArray = [];
let isContain;
let OrderNumber = 0;
if (localStorage.getItem("OrderNumber")!=null){
    OrderNumber = JSON.parse(localStorage.getItem("OrderNumber"));
}
if (localStorage.getItem("customerArray")!=null){
    customerArray = JSON.parse(localStorage.getItem("customerArray"));
}
function AddCustomer() {
    isExists = false;//for avoid tele number duplication
    let cusName = document.getElementById("cusName").value;
    let cusTel = document.getElementById("cusTel").value;
    for (let i = 0; i < customerArray.length; i++) {
        if(customerArray[i].customerTel == cusTel){
            isExists = true ;
        }
    }
    if(cusTel.length==10 & !isExists){
        customerArray.push({
            customerName : cusName,
            customerTel : cusTel
        });
        localStorage.setItem("customerArray",JSON.stringify(customerArray));
        document.getElementById("warntext").innerText="";
    }else{
        document.getElementById("warntext").innerText="Please eneter a valid Telephone nunber again"
    }
    document.getElementById("cusTel").value="";
    document.getElementById("cusName").value="";
}

function placeOrder(){
    localStorage.setItem("OrderNumber",JSON.stringify(++OrderNumber));//if close window it doesnt affect to itemlist 
    OrderId = "I"+OrderNumber.toString().padStart(4, "0");
    let cusName = document.getElementById("cusName").value;
    let cusTel = document.getElementById("cusTel").value;
    let discount = document.getElementById("discount").value;
    if(!isContain){
        customerArray.push({
            customerName : cusName,
            customerTel : cusTel
        });
        localStorage.setItem("customerArray",JSON.stringify(customerArray));
    }
    firstLoad();//then load content
    document.getElementById("cusName").disabled = true;
    document.getElementById("cusTel").disabled = true;
    document.getElementById("placeOrderButton").disabled = true;
    document.getElementById("searchbar").disabled = false;
    localStorage.setItem("billedCustomerDetails",JSON.stringify({
        customerName:cusName,
        customerTel:cusTel,
        discount:discount,
        orderId:OrderId
    }));
}

function check() {
    isContain = false ;
    let cusNameTXT = "";
    let userMassage = "&#9888;Maybe a New User.Enter name(must)";
    let cusTel = document.getElementById("cusTel").value;
    if (cusTel.length>=10) {
        if(cusTel.length!=10){
            document.getElementById("warntext").innerHTML="&#9746;Please Enter A Valid Tel No";
            document.getElementById("cusTel").value="";
            document.getElementById("cusName").value="";
        }else{
                for (let i = 0; i < customerArray.length; i++) {
                    if(customerArray[i].customerTel == cusTel){
                        cusNameTXT=customerArray[i].customerName;
                        userMassage = "&#9745;Customer is already Registered";
                        isContain = true;
                    }
                }
                document.getElementById("userNametxt").innerHTML=userMassage;
                document.getElementById("cusName").disabled = isContain;//if contains then disable=true
                document.getElementById("cusName").value = cusNameTXT ;
        }
    } 
}

function cancelOrder() {
    localStorage.setItem("OrderNumber",JSON.stringify(--OrderNumber));
    window.location.reload();
}