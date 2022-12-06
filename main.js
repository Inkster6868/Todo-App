// selecting all elements in the DOM

const form = document.querySelector("#itemForm");
const itemInput = document.querySelector("#itemInput");
const itemList = document.querySelector("#itemList");
const messageDiv = document.querySelector("#message");
const clearButton = document.querySelector("#clearBtn");
const filters = document.querySelectorAll(".nav-item");
//all to-do aur completed ka array miljayega


// create empty item array jiske andar local storage mai values dalege  aur lenge
let todoItems = [];



//ye jabhi koi value update delelte ya add hogi toh is div ko call  krenge
const showAlert = function (message, msgClass) {
  console.log("msg");
  messageDiv.innerHTML = message; // jab bhi alert call krenge yhan value update hojayegi
  messageDiv.classList.add(msgClass, "show");
  messageDiv.classList.remove("hide");
  //pehle show hojaye aur 'hide' vali class hide hojaye
  setTimeout(() => {
    messageDiv.classList.remove("show",msgClass);
    messageDiv.classList.add("hide");
  }, 3000);
  //fir 3 sec baad hum usse hide krdenge firse.
  return;
};






// filter tab items(if the isdone value is true then we will add those in the filter items array)
const getItemsFilter = function (type) {
  let filterItems = [];
  console.log(type);
  switch (type) {
    case "todo":   //agar type todo aayi filter krne ke liye toh jo elements ka is done fale hai unhe ismai dikha dunga
      filterItems = todoItems.filter((item) => !item.isDone);
      break;
    case "done":  //agr type done aayi toh jin elements ka isDone true hai usse ismai dikha dunga 
      filterItems = todoItems.filter((item) => item.isDone);
      break;
    default: //by default toh 'sare 'ALL' vale hae honge toh sbhi ko show krdenge 
      filterItems = todoItems;
  }
  getList(filterItems);
};


// update item(list mao bhi update krdenge is item ki value)
const updateItem = function (itemIndex, newValue) {
  console.log(itemIndex);
  const newItem = todoItems[itemIndex];
  newItem.name = newValue;
  todoItems.splice(itemIndex, 1, newItem);
  //splice krdenge itemindex se 1 value ko aur uski jgah daal denge new item jo ki update hai
  setLocalStorage(todoItems);
  //local storage ko update krdenge
};






// remove/delete item(when we click ok to the prompt box which asks us whether we want to delelte it or not)
const removeItem = function (item) {
  const removeIndex = todoItems.indexOf(item);
  todoItems.splice(removeIndex, 1);//list mai se bhio uda denge us item ko jisse delete kiay ahi
};




//bi-check-circle-fill  // bi-check-circle
//5.) handle item
const handleItem = function (itemData) {  //item data pass kara 
  console.log("le data-->",itemData)
  const items = document.querySelectorAll(".list-group-item");
  items.forEach((item) => {
    if (
      item.querySelector(".title").getAttribute("data-time") == itemData.addedAt
    ) {
      // done(agr done hai toh background fill kredenege aur completed vali tab mai bhej denge)
      item.querySelector("[data-done]").addEventListener("click", function (e) {
        e.preventDefault();
        const itemIndex = todoItems.indexOf(itemData); //tag ka index get krlenge
        const currentItem = todoItems[itemIndex];//apne item ka index get krlenge us tag mai se 
        const currentClass = currentItem.isDone //fir isdone attribute check ki vlaue checkk krlenge  
          ? "bi-check-circle-fill"
          : "bi-check-circle";
        currentItem.isDone = currentItem.isDone ? false : true;
        todoItems.splice(itemIndex, 1, currentItem);
        // todoItems.splice(itemIndex, noofelem, element);
        setLocalStorage(todoItems);
        //console.log(todoItems[itemIndex]);
        const iconClass = currentItem.isDone
          ? "bi-check-circle-fill"  //agar fill hai toh empty krdo agr empty hai toh fill
          : "bi-check-circle";

        this.firstElementChild.classList.replace(currentClass, iconClass);
        const filterType = document.querySelector("#filterType").value;
        getItemsFilter(filterType);
      });




      // edit(ye value leke jarhe hai box mai edit pe click krte hae)
      item.querySelector("[data-edit]").addEventListener("click", function (e) {
        e.preventDefault();
        itemInput.value = itemData.name;
        document.querySelector("#citem").value = todoItems.indexOf(itemData);
        //jo bhi element pe edit click kroge uska index leke uski value uppar box mai daal dega
        return todoItems;
      });






      //delete(ye jab delete per click krenge toh list se gayab hojegae elemennt)
      item
        .querySelector("[data-delete]")  //delete vale ko select krliya 
        .addEventListener("click", function (e) {  //uspe click krte hae
          e.preventDefault(); //default prevent krlo uska pehele
          if (confirm("Are you sure want to delete?")) {  //fir ek confirm message ki bhai pakka krna chhate ho ya nhi?  agr ok aaya toh enter hoga
            itemList.removeChild(item);  //remove krdega child with the item as matched
            removeItem(item);
            setLocalStorage(todoItems);
            showAlert("Item has been deleted.", "alert-success");
            return todoItems.filter((item) => item != itemData);
          }
        });
    }
  });
};




//4.) get list items(displaying list items on their DOM)
const getList = function (todoItems) {
  console.log("ye le todoitems",todoItems)
  itemList.innerHTML = "";
  if (todoItems.length > 0) {
    todoItems.forEach((item) => {
      const iconClass = item.isDone
        ? "bi-check-circle-fill"
        : "bi-check-circle";
      itemList.insertAdjacentHTML( // ye list ke end se pehle hum values dal denge all mai 
        "beforeend",
        `<li class="list-group-item d-flex justify-content-between align-items-center">
          <span class="title" data-time="${item.addedAt}">${item.name}</span> 
          <span>
              <a href="#" data-done><i class="bi ${iconClass} green"></i></a>
              <a href="#" data-edit><i class="bi bi-pencil-square blue"></i></a>
              <a href="#" data-delete><i class="bi bi-x-circle red"></i></a>
          </span>
        </li>`
      );
      //ab items toh add krdiye , ab handle krenge baaki operations
/*f-call--->*/      handleItem(item); //to handle the complete, edit and update operations
    });
  } else { //by default koi record nhi hoga toh islie else
    itemList.insertAdjacentHTML(
      "beforeend",
      `<li class="list-group-item d-flex justify-content-between align-items-center">
        No record found.
      </li>`
    );
  }
};






//3.) get localstorage from the page(ab jo value humne dali hai local storage mai usse get krenge taaki display kara payain bhyuiyiyii)
const getLocalStorage = function () {
  //ek variable bana liya todoStorage naam ka jismai store krenge content
  const todoStorage = localStorage.getItem("todoItems");
  if (todoStorage === "undefined" || todoStorage === null) {
    //agr undefined ya null hai toh todoItems mai kuch nhi hai mtlab empty hai .
    todoItems = [];
  } else {
          //nhi toh usko todoitems mai store kra denge
    todoItems = JSON.parse(todoStorage);
    //console.log("items", todoItems);
  }
          //fir getList mai is list ko pass krdenge
/*f-call--->*/    getList(todoItems);
};






//2.) set list in local storage(we pass the array in this and usse fir .setitem use krke set krado)
//setlocalstorage ek key value pair mai items store krleta hai humare browser ki local storage mai
const setLocalStorage = function (todoItems) {
  localStorage.setItem("todoItems", JSON.stringify(todoItems));
  //setitem is ibuilt function to set values to the local storage 
};





//1.)let DOM content load first
document.addEventListener("DOMContentLoaded", () => {
  form.addEventListener("submit", (e) => {
    e.preventDefault(); //prevents default action of the submit listener
    const itemName = itemInput.value.trim(); //gets the value inside the input tag and  trims any extra spaces if present from the both ends
    if (itemName.length === 0) {   //agr user koi value na dale toh alert show krdo ki kuch enter kro krke
      showAlert("Please enter a TO-DO", "alert-danger");
      return;
    } else {
      // update existing Item
      const currenItemIndex = document.querySelector("#citem").value;
      if (currenItemIndex) {  //agr current value kuch hai box ke andr toh
        updateItem(currenItemIndex, itemName);  //update function call krdo 
        document.querySelector("#citem").value = "";
        showAlert("Item has been updated.", "alert-success");
      } else {
        // Add new Item(jo value enter krega user usse store kara lenge object mai key:value pair mai )
        const itemObj = {
          name: itemName,
          isDone: false, //we will use this to add items to the completed tab, by initial we mark evey task as not done
          addedAt: new Date().getTime(), //.time is used to return time elapsed b/w 1st Jan and present time. we are basically using it here so that we can push them into the completed and  remaining tabs.
        };
        //jo to-do items banaya the empty array usmai push kara denge is object ko
        todoItems.push(itemObj);
        // fir is todo-Items vale array ko passs krdiya fucntion maio

/*f-call--->*/    setLocalStorage(todoItems);
        showAlert("New item has been added.", "alert-success");
      }

/*f-call--->*/    getList(todoItems);
      // get list of all items
    }
    console.log(todoItems);
    itemInput.value = "";  //kyuki new task input karana hai toh poorana vala udana podega
  });


  
  // filters
  filters.forEach((tab) => {  
    tab.addEventListener("click", function (e) {
      e.preventDefault(); //default action prevent krdo 
      const tabType = this.getAttribute("data-type");  //data-type nikal lege ki kis type ka hai yani completed hai ya penidng hai (to-do hai ya competed hai ya all hai)
      document.querySelectorAll(".nav-link").forEach((nav) => {
        nav.classList.remove("active"); //sabse active class hata denge aur bas
      });
      this.firstElementChild.classList.add("active");  // jis tab per click krenge bas vo hae active hojana chahie baaki per se active hata do 
      document.querySelector("#filterType").value = tabType;
      getItemsFilter(tabType); //fir jo link active hai usmai filter akra dunga 
    });
  });

  // load items
  getLocalStorage();
});
