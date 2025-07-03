let itemArray=[];
let dateObject = new Date();
let date = dateObject.toISOString();
date = date.split("T")[0].split("-");

function addItem() {
    itemArray = localStorage.getItem("itemArray");
    let itemId = document.getElementById("itemid").value;
    let itemName = document.getElementById("itemname").value;
    let doe = document.getElementById("doe").value;
    let discount = document.getElementById("discount").value;
    let price = document.getElementById("price").value;
    let foodType = document.getElementById("type").value;
    let item = {
    "itemCode":itemId,
    "itemName":itemName,
    "DOE":doe,
    "discount":discount,
    "type":foodType,
    "price":price
    };
    if (localStorage.getItem("itemArray")!=null) {
        itemArray = JSON.parse(localStorage.getItem("itemArray"));
        itemArray.push(item);
    }else{
        itemArray=[item,];//if local storage is empty
    }
    localStorage.setItem("itemArray",JSON.stringify(itemArray))
}
function validator(lowerLimit ,upperLimit,id) {
    let value = document.getElementById(id).value;
    if (value < lowerLimit){
        document.getElementById(id).value=0;
    }
    if(value>upperLimit & upperLimit!=-1){
        document.getElementById(id).value=0;
    }
}

function monthlyReport(){
    let noOfTransactions=0;
    let foodItemCount={Beverages:0,Burgers:0,Submarines:0,Fries:0,Pasta:0,Chicken:0};
    let givenDiscounts = 0;
    let income = 0;
    let billValue=0;
    let salesDay = {Monday:0,Tuesday:0,Wednsday:0,Thursday:0,Friday:0,Saturday:0,Sunday:0}//get most busyest day
    let year =["January","February","March","April","May","June","July","August","September","October","November","December"];
    let orderArray = JSON.parse(localStorage.getItem("orderArray"));
    orderArray.forEach(order => {
        let billedDate = order.orderTimeDate[0].split("-");
        if( billedDate[0]==date[0] & billedDate[1]==date[1] ){
            noOfTransactions++;
            order.itemList.forEach(item => {
                switch(item.type){
                    case "Beverages":
                        foodItemCount.Beverages+=Number(item.quantity);
                        break;
                    case "Burgers":
                        foodItemCount.Burgers+=Number(item.quantity);
                        break;
                    case "Submarines":
                        foodItemCount.Submarines+=Number(item.quantity);
                        break;
                    case "Fries":
                        foodItemCount.Fries+=Number(item.quantity);
                        break;
                    case "Pasta":
                        foodItemCount.Pasta+=Number(item.quantity);
                        break;
                    case "Chicken":
                        foodItemCount.Chicken+=Number(item.quantity);
                        break;
                }
                billValue +=(Number(item.priceForItem)-Number(item.priceForItem)*Number(item.discount)/100)*Number(item.quantity);
                givenDiscounts+=(Number(item.priceForItem)*Number(item.discount)/100)*Number(item.quantity);
            });
            let orderDateObject = new Date(order.orderTimeDate[0]);
            switch (orderDateObject.getDate()) {
                    case 0:
                        salesDay.Sunday+=1;
                        break;
                    case 1:
                        salesDay.Monday+=1;
                        break;
                    case 2:
                        salesDay.Tuesday+=1;
                        break;
                    case 3:
                        salesDay.Wednsday+=1;
                        break;
                    case 4:
                        salesDay.Thursday+=1;
                        break;
                    case 5:
                        salesDay.Friday+=1;
                        break;
                    case 6:
                        salesDay.Saturday+=1;
                        break;
                }
                givenDiscounts += billValue*Number(order.orderDiscount)/100;
                income += billValue - billValue*Number(order.orderDiscount)/100;
            }
    });
    document.getElementById("report-canvas").style.border = "dotted darkslategray";
    document.getElementById("report-canvas").innerHTML=`
        <h4 style="text-align: center;" class="text-danger mt-3">${year[date[1]-1]} - Sales Report</h4>
        <h6 style="text-align: center;" class="text-danger">Mos Bugers - Generated Date : ${date[0]+"-"+date[1]+"-"+date[2]}</h6>
        <pre class="fs-4 m-2">Number Of Orders    : ${noOfTransactions}</pre>
        <pre class="fs-4 m-2">Monthly Income      : Rs.${income.toFixed(2)}</pre>
        <pre class="fs-4 m-2">Discounts Given     : Rs.${givenDiscounts.toFixed(2)}</pre>
        <pre class="fs-4 m-2">Number Of Items Sold: ${foodItemCount.Beverages+foodItemCount.Burgers+foodItemCount.Submarines+foodItemCount.Fries+foodItemCount.Pasta+foodItemCount.Chicken}</pre>
        <h6>Order Volumes vs Days</h6>
        <canvas id="days" style="height:500px; width:100%"></canvas>
        <h6>Order quantity vs Food type</h6>
        <canvas id="items" style="height:500px; width:100%"></canvas>
    `;
    //chart.jspart
    const daysChartPane = document.getElementById('days');
        new Chart(daysChartPane, {
          type: 'pie',
          data: {
            labels: ['Monday', 'Tuesday', 'Wednsday', 'Thursday', 'Friday' ,'Saturday', 'Sunday'],
            datasets: [{
              label: '# of Votes',
              data: [salesDay.Monday, salesDay.Tuesday, salesDay.Wednsday, salesDay.Thursday, salesDay.Friday, salesDay.Saturday, salesDay.Saturday],
              borderWidth: 1
            }]
          },
          options: {
            responsive:false,
            scales: {
              y: {
                beginAtZero: true
              }
            }
          }
        });
    const itemsChartPane = document.getElementById('items');
        new Chart(itemsChartPane, {
          type: 'pie',
          data: {
            labels: ['Beverages', 'Burgers', 'Submarines', 'Fries', 'Pasta', 'Chicken'],
            datasets: [{
              label: '# of Votes',
              data: [foodItemCount.Beverages, foodItemCount.Burgers, foodItemCount.Submarines, foodItemCount.Fries, foodItemCount.Pasta, foodItemCount.Chicken],
              borderWidth: 1
            }]
          },
          options: {
            responsive:false,
            scales: {
              y: {
                beginAtZero: true
              }
            }
          }
        });
  generatePDF();
}

function topCustomers(){
  let orderArray = JSON.parse(localStorage.getItem("orderArray"));
  let topCustomers = [];
  let isAvailable;
  orderArray.forEach(order => {
    isAvailable = false;
    let index = 0;
    let total = 0;
    order.itemList.forEach(item => {
      total+=(Number(item.priceForItem)-Number(item.priceForItem)*Number(item.discount)/100)*Number(item.quantity);
    });
    total+=total - total*Number(order.orderDiscount)/100;
    topCustomers.forEach(topCustomer => {
      if(order.customerTel==topCustomer.customerTel){
        isAvailable=true;
        topCustomers[index].netPurchase += total;
      }
      index++;
    });
    if(!isAvailable){
      topCustomers.push({
        customerName:order.customerName,
        customerTel:order.customerTel,
        netPurchase:total
      });
    }
    
  });
  //bubble sorting
  for (let i = 0; i < topCustomers.length; i++) {
    for (let j = 0; j < topCustomers.length - i-1; j++) {
      if(topCustomers[j].netPurchase<topCustomers[j+1].netPurchase){
        let temp = topCustomers[j];
        topCustomers[j] = topCustomers[j+1];
        topCustomers[j+1] = temp;
      }
    }
  }
  let html=`
      <table class="table" id="table">
      <thead>
        <tr>
          <th scope="col">Rank</th>
          <th scope="col">Name</th>
          <th scope="col">Telephone-No</th>
          <th scope="col">Net Purchase</th>
        </tr>
      </thead>
      <tbody>
  `;
  let rank = 1;
  topCustomers.forEach(customer => {
    html += `
        <tr>
          <th scope="row">${rank++}</th>
          <td>${customer.customerName}</td>
          <td>${customer.customerTel}</td>
          <td>Rs.${customer.netPurchase.toFixed(2)}</td>
        </tr>
    `;
  });
  html+=`
      </tbody>
    </table>
  `;
  document.getElementById("report-canvas").innerHTML = html;
  generatePDF();
}

function generatePDF(){
  const element = document.getElementById("report-canvas");
  html2pdf().set().from(element).save();
}

function loadDeleteItem(){
  let searchTerm = document.getElementById("searchbar-item-delete").value;
  let isAvailable = false;
  let itemName;
  let exp;
  let count = 0;
  let index;
  itemArray = JSON.parse(localStorage.getItem("itemArray"));
  itemArray.forEach(item => {
    if(item.itemCode==searchTerm){
      isAvailable = true;
      itemName = item.itemName;
      exp = item.DOE;
      index = count;
    }
    count++;
  });
  if (isAvailable) {
    document.getElementById("warn-availability").innerText = " ";
    document.getElementById("delete-item-canvas").innerHTML = `
          <div class="form-group col-md-6">
            <label for="itemname">Item Name</label>
            <input type="text" class="form-control" value="${itemName}" readonly>
          </div>
          <div class="form-group col-md-6">
            <label for="doe">Expire Date</label>
            <input type="date" class="form-control" value="${exp}" readonly>
        </div>
        <button class="btn btn-danger mt-2" onclick="deleteItem(${index})">Confirm Deletion</button>
    `;
  } else {
     document.getElementById("warn-availability").innerText = "Item Not Available in System ";
  }
}

function deleteItem(index) {
  itemArray.splice(index,1);
  localStorage.setItem("itemArray",JSON.stringify(itemArray));
  alert("item Deleted SuccessFully!");
  window.location.reload();
}

function newPassword(){
 let userArray = JSON.parse(localStorage.getItem("userArray"));
 userArray[0].password = document.getElementById("Password").value;
 localStorage.setItem("userArray",JSON.stringify(userArray));
 alert("Admin Password is now Updated")
 window.location.reload();
}
document.getElementById("passwordButton").disabled = true;
function passwordStrogivity(){
  let password = document.getElementById("Password").value;
  let strongLevel = 0;
  document.getElementById("passwordButton").disabled = true;
  for (let index = 0; index < password.length; index++) {
    let char = password[index];
    switch(char){
      case "&":
        strongLevel+=2;
        break;
      case "/":
        strongLevel+=2;
        break;
      case "*":
        strongLevel+=2;
        break;
      default:
        strongLevel+=1;
    }
  }
  console.log(strongLevel);
  
  if(strongLevel<5){
    document.getElementById("password-notify").innerText = "Weak Password. Modify with &,/,*";
  }else if(strongLevel<10){
    document.getElementById("password-notify").innerText = "Average Password. Add more characters";

  }else{
    document.getElementById("password-notify").innerText = "Good Password. System Is Safe ";
    document.getElementById("passwordButton").disabled = false;
  }
}