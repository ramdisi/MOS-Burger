let itemArray=[];

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
        console.log(itemArray);
        
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