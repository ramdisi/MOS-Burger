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
            switch (dateObject.getDay(order.orderTimeDate[0])) {
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
        <canvas id="days"></canvas>
        <canvas id="items"></canvas>
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

}

function generatePDF(){
  const element = document.getElementById("report-canvas");
  html2pdf().set({ filename:"MOS-Burgers-Report.pdf",}).from(element).save();
}