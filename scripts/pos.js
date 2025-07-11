let itemArray=[];
let foundIndexes ;
let cart = [];
let itemCount=0;
let table;
let amount=0;
//get current date
const dateObject = new Date();
let date = dateObject.toISOString();
date = date.split("T")[0].split("-");
// codes for first load of the page
function firstLoad() {
    itemArray = JSON.parse(localStorage.getItem("itemArray"));//to get latest state
    foundIndexes = [];
    for (let index = 0; index < itemArray.length; index++) {
        foundIndexes.push(index);
    }
    showResults();
}

function dynamicSearch() {
    itemArray = JSON.parse(localStorage.getItem("itemArray"));//to get latest state
    foundIndexes = [];
    let searchTerm = document.getElementById("searchbar").value.toLowerCase();
    let currentCharCount = searchTerm.length;
    let count = 0;
    itemArray.forEach(element => {
        if(element.itemCode.toLowerCase().substring(0,currentCharCount)==searchTerm | element.itemName.toLowerCase().substring(0,currentCharCount)==searchTerm | element.type.toLowerCase().substring(0,currentCharCount)==searchTerm){
            foundIndexes.push(count);    
        }
        count++;
    });
    showResults();
}

function showResults() {
    let itemDetailsHTML=`
    <div class="container text-center">
        <div class="row">
    `;
    let count = 0;
    foundIndexes.forEach(element => {
        let EXP = itemArray[element].DOE.split("-");
        let warning = date[0]>EXP[0] | (date[0]==EXP[0] & date[1]>EXP[1]) | (date[0]==EXP[0] & date[1]==EXP[1] & date[2]>EXP[2])?" Expired ":"";
        itemDetailsHTML+=`
        <div class="col">
        <div class="card m-3" style="width: 18rem;">
            <div class="card-body bg-danger-subtle rounded">
                <h5 class="card-title">${itemArray[element].itemName}</h5>
                <h6 class="card-subtitle mb-2 text-body-secondary">Item Code : ${itemArray[element].itemCode}</h6>
                <h6 class="card-text" style="color: rgb(97, 155, 11);">Special Discount : ${itemArray[element].discount}%</h6>
                <p class="card-text">Type : ${itemArray[element].type}</p>
                <p class="card-text">DOE : ${itemArray[element].DOE}</p>
                <p class="card-text text-danger">${warning}</p>
                <h5 class="card-text font-weight-bold">Price : Rs.${itemArray[element].price}.00</h5>
                <span class="input-group-text">
                    Number Of Items&nbsp;<input type="number" class="form-control" id="${itemArray[element].itemCode}Qty" value="1">
                </span>
                <button class="btn btn-danger mt-2" onclick="addToCart('${itemArray[element].itemCode}')" ${warning==" Expired "?"disabled":""}>Add to Cart</button>
            </div>
        </div>
        </div>
        `
        count++;
        //set grid system to cards
        if(count%3==0){
            itemDetailsHTML+=`
                </div>
            </div>
            <div class="container text-center">
                <div class="row">
            `
        }
    });
    document.getElementById("itemDisplayArea").innerHTML = itemDetailsHTML;
    document.getElementById("transactionArea").innerHTML=`
    <div class="card" style="max-width: 96%;margin: 2%;">
        <div class="card-body">
            <div class="container text-center">
            <div class="row">
                <div class="col">
                <span class="input-group-text" id="basic-addon1">Amount : Rs.
                <input value="0" type="number" class="form-control text-danger" aria-describedby="basic-addon1" id="amount" readonly>
                </span>
                </div>
                <div class="col">
                <span class="input-group-text" id="basic-addon1" >Payment(Cash) : Rs.
                <input value="0" type="number" class="form-control text-danger" aria-describedby="basic-addon1" id="payment">
                </span>
                </div>
            </div>
            <button class="btn btn-success m-2" onclick="cancelOrder()">Cancel This Order</button>
            <p id="errorBalance" class="text-danger"></p>
            </div>
        </div>
    </div>
    `;
}

function addToCart(itemCode){
    let discount;
    let price ;
    let specialDiscount = JSON.parse(localStorage.getItem("billedCustomerDetails"));
    specialDiscount = specialDiscount.discount;
    let quantity = document.getElementById(itemCode+"Qty").value;
    let item = {
        itemId:itemCode,
        qty:quantity,
    }
    itemArray.forEach(element => {
        if(element.itemCode==itemCode){
            discount = element.discount;
            price = element.price;
        }
    });
    amount+=((price-price*discount/100)*quantity)-((price-price*discount/100)*quantity)*specialDiscount/100;
    cart.push(item);
    itemCount++;
    document.getElementById("itemcount").innerHTML="&nbsp;"+itemCount+"&nbsp;"
    document.getElementById("amount").value = amount.toFixed(2);
    localStorage.setItem("cart",JSON.stringify(cart));
}

function openCheckOut() {
    let amount = document.getElementById("amount").value;
    let payment = document.getElementById("payment").value;
    if (localStorage.getItem('cart')!="" & localStorage.getItem('cart')!=null & payment>=amount & amount!=0) {
        localStorage.setItem("transaction",JSON.stringify([amount,payment]));//store transaction for billing 
        window.location.assign("checkout.html");//if no item added then cant access checkout
        document.getElementById("cusTel").value="";
        document.getElementById("cusName").value="";
    }
    if(payment<amount){
        document.getElementById("errorBalance").innerText = "Insufficiant Balance!Enter payment again";
    }
}