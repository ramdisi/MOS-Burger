const dateObject = new Date();
let date = dateObject.toISOString();
date = date.split("T");
let orderArray = [];
if(localStorage.getItem("orderArray")!=null){
    orderArray = JSON.parse(localStorage.getItem("orderArray"));
}
loadBill();//it calls when page is loads first
function loadBill(){
    let transaction = JSON.parse(localStorage.getItem("transaction"));
    let billedCustomerDetails = JSON.parse(localStorage.getItem("billedCustomerDetails"))
    let itemArray = JSON.parse(localStorage.getItem("itemArray"));
    let cartForCheckout = JSON.parse(localStorage.getItem('cart'));
    let detailsForBilling=[];
    let itemCount=1;
    let savedMoney=0;
    let netTotal = 0;
    cartForCheckout.forEach(orderedItem => {    
        //detailsForBilling.push(itemArray.findIndex(item => item.itemCode==orderedItem.itemId));
        let index = itemArray.findIndex(item => item.itemCode==orderedItem.itemId);
        detailsForBilling.push({
            itemCount:itemCount,
            itemCode:itemArray[index].itemCode,
            itemName:itemArray[index].itemName,
            itemType:itemArray[index].type,
            quantity:orderedItem.qty,
            discountForItem:itemArray[index].discount,
            price:itemArray[index].price,
            total:(itemArray[index].price-(itemArray[index].discount/100)*itemArray[index].price)*orderedItem.qty
        })
        itemCount++;
        netTotal+=(itemArray[index].price-(itemArray[index].discount/100)*itemArray[index].price)*orderedItem.qty;
        savedMoney+=itemArray[index].discount*itemArray[index].price;
    });
    let html = `
    <div class="card-body">
    <h5 class="card-title text-center text-danger" style="text-align: center;">MOS Burgers</h5>
    <pre class="card-subtitle mb-2 text-body-secondary" style="font-size: large;font-weight: bold;">Order ID              : ${billedCustomerDetails.orderId}</pre>
    <pre class="card-subtitle mb-2 text-body-secondary" style="font-size: large;font-weight: bold;">Customer Name         : ${billedCustomerDetails.customerName}</pre>
    <pre class="card-subtitle mb-2 text-body-secondary" style="font-size: large;font-weight: bold;">Customer Telephone-No : ${billedCustomerDetails.customerTel}</pre>
    <pre class="card-subtitle mb-2 text-body-secondary" style="font-size: large;font-weight: bold;">Special Discounts     : ${billedCustomerDetails.discount}%</pre>
    <pre class="card-subtitle mb-2 text-body-secondary" style="font-size: large;font-weight: bold;">Billed Date & Time    : ${date[0]+" "+date[1].split(".")[0]}</pre>
    <div style="overflow: auto">
    <table class="table" width="100%">
    <thead>
      <tr>
        <th scope="col">#</th>
        <th scope="col">Item Code</th>
        <th scope="col">Item Name</th>
        <th scope="col">Quatity</th>
        <th scope="col">Unit Price</th>
        <th scope="col">Discount</th>
        <th scope="col">Total(Rs.)</th>
      </tr>
    </thead>
    <tbody>
    `;
    detailsForBilling.forEach(element => {
        html+=`
        <tr>
            <th scope="row">${element.itemCount}</th>
            <td>${element.itemCode}</td>
            <td>${element.itemName}</td>
            <td>${element.quantity}</td>
            <td>${element.price}.00</td>
            <td>${element.discountForItem}%</td>
            <td>${element.total}.00</td>
        </tr>
        `;
    });
    html+=`
    </tbody>
  </table>
  </div>
<table style="margin-left: 5%;margin-top: 30px;">
    <tr>
      <td>
        <h6 class="card-subtitle mb-2 text-body-secondary" >Net Total</h6>
      </td>
      <td>
        <h6>: Rs.${netTotal.toFixed(2)} </h6>
      </td>
    </tr>
    <tr>
      <td>
        <h6 class="card-subtitle mb-2 text-body-secondary" >Total After Discount&nbsp;</h6>
      </td>
      <td>
        <h6>: Rs.${(netTotal-netTotal*billedCustomerDetails.discount/100).toFixed(2)}</h6>
      </td>
    </tr>
    <tr>
    <tr>
      <td>
        <h6 class="card-subtitle mb-2 text-body-secondary" >Your Payment(Cash)&nbsp;</h6>
      </td>
      <td>
        <h6>: Rs.${transaction[1]}</h6>
      </td>
    </tr>
    <tr>
    <tr>
      <td>
        <h6 class="card-subtitle mb-2 text-body-secondary" >Balance &nbsp;</h6>
      </td>
      <td>
        <h6>: Rs.${(transaction[1]-transaction[0]).toFixed(2)}</h6>
      </td>
    </tr>
    <tr>
      <td>
        <h6 class="card-subtitle mb-2 text-body-secondary" >You Saved today</h6>
      </td>
      <td>
        <h6>: Rs.${(savedMoney+netTotal*billedCustomerDetails.discount/100).toFixed(2)}</h6>
      </td>
    </tr>
  </table>
  <h5 class="card-subtitle mb-2 text-body-secondary" style="text-align: center;">Have a Good Day ! See you again.</h5>
  <p style="text-align: center;">RamdisiAbeywickrama Tech Solutions&copy;</p>
  </div>
    `;
    saveOrderDetails(detailsForBilling,billedCustomerDetails,date);
    document.getElementById("billArea").innerHTML=html;
    document.getElementById("goBackButton").innerHTML='<button class="btn btn-danger m-5" onclick="goBack()">Place Another Order</button>';
    localStorage.removeItem("cart");
    localStorage.removeItem("billedCustomerDetails");
    document.getElementById("downloadButton").disabled = false;
}

function goBack() {
    window.location.replace("pos.html");//if any error has let order again
}

function saveOrderDetails(detailsForBilling,billedCustomerDetails,date) {
    let itemlist = [];
    detailsForBilling.forEach(element => {
        itemlist.push({
            itemCode:element.itemCode,
            priceForItem:element.price,
            discount:element.discountForItem,
            quantity:element.quantity,
            type:element.itemType
        });
    });
    orderArray.push({
        orderID:billedCustomerDetails.orderId,
        customerTel:billedCustomerDetails.customerTel,
        customerName:billedCustomerDetails.customerName,
        orderTimeDate:date,
        itemList:itemlist,
        orderDiscount:billedCustomerDetails.discount
    });
    localStorage.setItem("orderArray",JSON.stringify(orderArray));
}

function generatePDF(){
  const element = document.getElementById("billArea");
  html2pdf().set({ filename:"MOS-Burgers-Bill"+date[0]+"-"+date[1].split(".")[0]+".pdf",}).from(element).save();
}