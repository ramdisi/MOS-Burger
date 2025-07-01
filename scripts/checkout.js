loadBill();//it calls when page is loads first
function loadBill(){
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
    <pre class="card-subtitle mb-2 text-body-secondary" style="font-size: large;font-weight: bold;">Customer Name         :</pre>
    <pre class="card-subtitle mb-2 text-body-secondary" style="font-size: large;font-weight: bold;">Customer Telephone-No : </pre>
    <pre class="card-subtitle mb-2 text-body-secondary" style="font-size: large;font-weight: bold;">Special Discounts     : </pre>
    <pre class="card-subtitle mb-2 text-body-secondary" style="font-size: large;font-weight: bold;">Billed Date & Time    : </pre>
    <table class="table">
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
            <td>${element.discountForItem}</td>
            <td>${element.total}.00</td>
        </tr>
        `;
    });
    html+=`
    </tbody>
  </table>
<table style="margin-left: 5%;margin-top: 30px;">
    <tr>
      <td>
        <h6 class="card-subtitle mb-2 text-body-secondary" >Net Total</h6>
      </td>
      <td>
        <h6>: Rs.${(netTotal%100)*100}.00 </h6>
      </td>
    </tr>
    <tr>
      <td>
        <h6 class="card-subtitle mb-2 text-body-secondary" >Special Discounts</h6>
      </td>
      <td>
        <h6>: 10%</h6>
      </td>
    </tr>
    <tr>
      <td>
        <h6 class="card-subtitle mb-2 text-body-secondary" >Total After Discount&nbsp;</h6>
      </td>
      <td>
        <h6>: 10%</h6>
      </td>
    </tr>
    <tr>
      <td>
        <h6 class="card-subtitle mb-2 text-body-secondary" >Paid Amount</h6>
      </td>
      <td>
        <h6>: Rs.15000.00</h6>
      </td>
    </tr>
    <tr>
      <td>
        <h6 class="card-subtitle mb-2 text-body-secondary" >Balance Amount</h6>
      </td>
      <td>
        <h6>: 10%</h6>
      </td>
    </tr>
    <tr>
      <td>
        <h6 class="card-subtitle mb-2 text-body-secondary" >You Saved today</h6>
      </td>
      <td>
        <h6>: Rs.300</h6>
      </td>
    </tr>
  </table>
  <h5 class="card-subtitle mb-2 text-body-secondary" style="text-align: center;">Have a Good Day ! See you again.</h5>
  <p style="text-align: center;">RamdisiAbeywickrama Tech Solutions&copy;</p>
  </div>
    `;
    document.getElementById("billArea").innerHTML=html;
    localStorage.removeItem("cart");
}

function error() {
    window.location.replace("pos.html");//if any error has let order again
}