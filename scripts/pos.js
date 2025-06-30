let itemArray = JSON.parse(localStorage.getItem("itemArray"));
let foundIndexes ;
firstLoad();
// codes for first load of the page
function firstLoad() {
    foundIndexes = [];
    for (let index = 0; index < itemArray.length; index++) {
        foundIndexes.push(index);
    }
    showResults();
}

function dynamicSearch() {
    foundIndexes = [];
    let searchTerm = document.getElementById("searchbar").value;
    let currentCharCount = searchTerm.length;
    let count = 0;
    itemArray.forEach(element => {
        if(element.itemCode.substring(0,currentCharCount)==searchTerm | element.itemName.substring(0,currentCharCount)==searchTerm ){
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
        itemDetailsHTML+=`
        <div class="col">
        <div class="card m-3" style="width: 18rem;">
            <div class="card-body bg-danger-subtle rounded">
                <h5 class="card-title">${itemArray[element].itemName}</h5>
                <h6 class="card-subtitle mb-2 text-body-secondary">Item Code : ${itemArray[element].itemCode}</h6>
                <h6 class="card-text" style="color: rgb(97, 155, 11);">Special Discount : ${itemArray[element].discount}</h6>
                <p class="card-text">Type : ${itemArray[element].type}</p>
                <p class="card-text">DOE : ${itemArray[element].DOE}</p>
                <h5 class="card-text font-weight-bold">Price : Rs.${itemArray[element].price}.00</h5>
                <span class="input-group-text">
                    Number Of Items&nbsp;<input type="number" class="form-control" id="${itemArray[element].itemCode}Price" value="1" placeholder="price" onchange="validator(1,-1,'price')">
                </span>
                <button class="btn btn-danger mt-2" onclick="addToCart(${itemArray[element].itemCode})">Add to Cart</button>
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
}