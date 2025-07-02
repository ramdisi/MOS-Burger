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
    let newCusName = document.getElementById("cusName").value;
    let newCusTel = document.getElementById("cusTel").value;
    for (let i = 0; i < customerArray.length; i++) {
        if(customerArray[i].customerTel == newCusTel){
            isExists = true ;
        }
    }
    if(newCusTel.length==10 & !isExists){
        customerArray.push({
            customerName : newCusName,
            customerTel : newCusTel
        });
        localStorage.setItem("customerArray",JSON.stringify(customerArray));
        document.getElementById("warntext").innerText="";
        alert("Successfully added "+newCusName);
    }else{
        document.getElementById("warntext").innerText="Please enter a valid Telephone nunber again"
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

function searchCustomer(){
    let index = -1;
    let customerName;
    let customerTel;
    let count = 0;
    let seachTerm = document.getElementById("searchbar-customer").value;
    customerArray = JSON.parse(localStorage.getItem("customerArray"));
    customerArray.forEach(element => {
        if(element.customerName.toLowerCase()==seachTerm.toLowerCase() | element.customerTel==seachTerm){
            index=count;
            customerName = element.customerName;
            customerTel = element.customerTel;
        }
        ++count;
    });
    if (index==-1) {
        document.getElementById("massage-pane-customer").innerText = "Customer Didn't Exist in System";
    } else {
        document.getElementById("massage-pane-customer").innerText = "";
        document.getElementById("customer-pane").innerHTML = `
            <span class="input-group-text mt-3" id="basic-addon1">Customer Name &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <input type="text" value="${customerName}" class="form-control text-danger" aria-describedby="basic-addon1" id="editedname">
            </span>
            <span class="input-group-text mt-2" id="basic-addon1" >Telelphone Number &nbsp; 
                <input  type="tel" value="${customerTel}" class="form-control text-danger" aria-describedby="basic-addon1" id="editedTel">
            </span>
            <button class="btn btn-success m-2" onclick="editCustomer(${index})">Edit This Customer Details</button>
            <button class="btn btn-danger m-2" onclick="deleteCustomer(${index})">Delete This Customer Details</button>
            <button class="btn btn-dark m-2" onclick="reloadUser()">Cancel Editing  & Deleting</button>
        `
    }
}

function reloadUser() {
    window.location.reload();
}

function editCustomer(index){
    let editedCusName = document.getElementById("editedname").value;
    let editedCusTel = document.getElementById("editedTel").value;
    customerArray[index] = {
        customerName:editedCusName,
        customerTel:editedCusTel
    };
    localStorage.setItem("customerArray",JSON.stringify(customerArray));
    reloadUser();
    alert("Succesfully edited "+editedCusName);
}

function deleteCustomer(index){
    let DeletedCusName = customerArray[index].customerName;
    customerArray.splice(index,1);
    localStorage.setItem("customerArray",JSON.stringify(customerArray));
    reloadUser();
    alert("Succesfully deleted "+DeletedCusName);
}

function searchOrder(){
    let index = 0;
    let orderArray = JSON.parse(localStorage.getItem("orderArray"));
    let searchTerm = document.getElementById("searchbar-order").value;
    let isExists=false;
    let multipleOrders=false;//for search by tele-no
    let table = `
    <table class="table">
        <thead>
    `;
    orderArray.forEach(element => {
        if(element.customerTel==searchTerm){
            isExists=true;
            multipleOrders=true;
            table+=`
            <tr>
                <td>${element.orderID}</td>
                <td>${element.orderTimeDate[0]+"  "+element.orderTimeDate[1].split(".")[0]}</td>
                <td><button class="btn btn-danger" onclick="loadOrderDetails('${element.orderID}',${index})">Load this Order</button></td>
            </tr>
            `;
        }
        if(element.orderID==searchTerm.toUpperCase()){
            isExists=true;
            loadOrderDetails(searchTerm,index);
        }
        index++;
    });
    if(!isExists){
        document.getElementById("massage-pane-order").innerText = "Searched Order or Tel-No doesn't Exists!";
    }else{
        document.getElementById("massage-pane-order").innerText = "";
    }
    if (multipleOrders) {
        table += `
            </tbody>
        </table>
        <button class="btn btn-dark m-2" onclick="reloadUser()">Cancel Editing  & Deleting</button>
        `;
        document.getElementById("order-pane").innerHTML = table;
    }
}

function loadOrderDetails(orderId,index){
    let orderArray = JSON.parse(localStorage.getItem("orderArray"));
    let element = orderArray[index];
    let orderInfo = `
    <h6 class="mt-2">Date & Time :${element.orderTimeDate[0]+"  "+element.orderTimeDate[1].split(".")[0]}</h6>   
    <h6>Customer Name : ${element.customerName}</h6>
    <h6>Customer Telephone-no : ${element.customerTel}</h6>   
    <table class="table">
        <thead>
            <tr>
                <th scope="col">ID</th>
                <th scope="col">price</th>
                <th scope="col">discount</th>
                <th scope="col">Quantity</th>
            </tr>
        </thead>
    <tbody>
    `;
    element.itemList.forEach(item => {
        orderInfo+=`
        <tr>
            <th scope="row">${item.itemCode}</th>
            <td>Rs.${item.priceForItem}</td>
            <td>${item.discount}%</td>
            <td><input type="number" class = "text-danger" id="${item.itemCode}-edited" style="width: 100%;" value="${item.quantity}"></td>
        </tr>
        `;
    });
    orderInfo+=`
        </tbody>
    </table>
    <button class="btn btn-danger m-2" onclick="editOrder(${index})">Edit This Order</button>
    <button class="btn btn-success m-2" onclick="deleteOrder(${index})">Delete This Order</button>
    <button class="btn btn-dark m-2" onclick="reloadUser()">Finish View</button>
    <p class="text-danger">&#8599;Enter 0 to quantity for remove item</p>
    `;
    document.getElementById("order-pane").innerHTML = orderInfo;
}

function editOrder(index){
    let orderArray = JSON.parse(localStorage.getItem("orderArray"));
    let element = orderArray[index];
    let editedItemlist = [];
    element.itemList.forEach(item => {
        let itemCode = item.itemCode;
        let itemQty = document.getElementById(itemCode+"-edited").value;
        if(itemQty>0){
            editedItemlist.push({
                discount:item.discount,
                itemCode:itemCode,
                priceForItem:item.priceForItem,
                quantity:itemQty
            })
        }
    });
    orderArray[index].itemList = editedItemlist;
    localStorage.setItem("orderArray",JSON.stringify(orderArray));
    alert("Successfully Order Edited")
    reloadUser();
}

function deleteOrder(index){
    let orderArray = JSON.parse(localStorage.getItem("orderArray"));
    orderArray.splice(index,1);
    localStorage.setItem("orderArray",JSON.stringify(orderArray));
    alert("Successfully Order Deleted");
    reloadUser();
}