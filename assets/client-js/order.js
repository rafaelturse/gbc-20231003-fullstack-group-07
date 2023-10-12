const showOrderForm = async (name, price, menuItemId, photo, menuDomRef) => {

    const menuLoaderItem = document.getElementById("linear-" + menuDomRef);

    menuLoaderItem.classList.add("linear-loading");

    const formScreen = document.getElementById("order-creation-form");

    const formItemName = document.getElementById("form-order-item-name");

    const formItemImage = document.getElementById("form-order-item-image");

    const formItemDiv = document.getElementById("order-creation-form-div");

    setTimeout(() => {

        formScreen.classList.add("show-order-creation");

        menuLoaderItem.classList.remove("linear-loading");

        formItemImage.src = photo;

        formItemName.innerHTML = `Item: <span style="color: red;font-weight: 600; font-size: 25px;">${name}</span>`;

        formItemDiv.innerHTML += `<button id='button-1' onclick="createOrder('${name}', '${price}', '${menuItemId}', '${photo}', '${menuDomRef}')"> Create now </button>`;

        formItemDiv.innerHTML += `<button id='button-2' class="order-form-dismiss" onclick="dismissOrderForm()"> Cancel </button>`;

    }, 500);

}

const dismissOrderFormButtons = () => {

    const buttonOne = document.getElementById("button-1");

    const buttonTwo = document.getElementById("button-2");

    if ( buttonOne ) buttonOne.remove();

    if ( buttonTwo ) buttonTwo.remove();

}

const dismissOrderForm = async (menuItemId) => {

    const formScreen = document.getElementById("order-creation-form");

    dismissOrderFormButtons();

    formScreen.classList.remove("show-order-creation");

}

const createOrder = async (name, price, menuItemId, photo, menuDomRef) => {

    dismissOrderFormButtons();

    const formLoaderItem = document.getElementById("form-loader");

    formLoaderItem.classList.add("linear-loading");

    const menuLoaderItem = document.getElementById("linear-" + menuDomRef);

    menuLoaderItem.classList.remove("linear-loading");

    const successScreen = document.getElementById("order-creation");

    const orderNumberElement = document.getElementById("order-creation-number");

    const orderAddressElement = document.getElementById("form-order-item-address-input");

    const customerNameElement = document.getElementById("form-order-item-address-name");

    setTimeout(() => {

        fetch("/", {

            method: "POST",

            headers: {

                "Content-Type": "application/json",

            },

            body: JSON.stringify({ 
                
                name, 
                
                price, 
                
                menuItemId, 
                
                photo, 
                
                orderAddress : orderAddressElement?.value || "Number 5 , Down The Drain",
                
                customerName: customerNameElement.value || "James Dean",
            
            })

        })

            .then((res) => res.json())

            .then((data) => {

                dismissOrderForm();

                formLoaderItem.classList.remove("linear-loading");

                successScreen.classList.add("show-order-creation");

                orderAddressElement.value = "";

                orderNumberElement.innerText = data?.data?.order_ref;

            })

            .catch((err) => console.log(err));

    }, 1000);

}


const dismissOrderCreationTab = async () => {

    const successScreen = document.getElementById("order-creation");

    successScreen.classList.remove("show-order-creation");

}

const switchView = (view) => {

    const menuView = document.getElementById("menu-items-view");

    const orderView = document.getElementById("order-items-view");

    const menuViewButton = document.getElementById("menu-button");

    const ordersViewButton = document.getElementById("orders-button");

    if (view === "orders") {

        menuView.classList.add("hide-view");

        orderView.classList.remove("hide-view");

        menuViewButton.classList.remove("active");

        ordersViewButton.classList.add("active");

        return;

    }

    menuView.classList.remove("hide-view");

    orderView.classList.add("hide-view");

    menuViewButton.classList.add("active");

    ordersViewButton.classList.remove("active");

}

const checkOrder = (view) => {

    const menuView = document.getElementById("menu-items-view");

    const orderView = document.getElementById("order-items-view");

    const menuViewButton = document.getElementById("menu-button");

    const ordersViewButton = document.getElementById("orders-button");

    if (view === "orders") {

        menuView.classList.add("hide-view");

        orderView.classList.remove("hide-view");

        menuViewButton.classList.remove("active");

        ordersViewButton.classList.add("active");

        return;

    }

    menuView.classList.remove("hide-view");

    orderView.classList.add("hide-view");

    menuViewButton.classList.add("active");

    ordersViewButton.classList.remove("active");

}

const resetOrderSummary = () => {

    const orderRefInputBox = document.getElementById("order-items-view-input-box");

    const orderRefSummary = document.getElementById("order-items-view-summary");

    const orderItemViewHeading = document.getElementById("order-items-view-intro");

    orderRefInputBox.classList.remove("hide-view");
            
    orderRefSummary.classList.add("hide-view");

    orderItemViewHeading.innerText = "Placed an order recently ? Input your order reference to view your order status";

}

const findOrder = async (view) => {

    const orderItemViewHeading = document.getElementById("order-items-view-intro");

    const orderRefInputBox = document.getElementById("order-items-view-input-box");

    const orderRefSummary = document.getElementById("order-items-view-summary");

    const orderRefInput = document.getElementById("order-item-view-input");

    orderRefInput.classList.remove("error-input");

    if ( !orderRefInput.value || (orderRefInput?.value?.length || 0) < 7) { 
        
        orderRefInput.classList.add("error-input");

        orderRefInput.value = "";

        orderRefInput.placeholder = "Please input a valid reference number";

        return;

    }

    await fetch(`/get-order/${orderRefInput.value}`).then((res)=> res.json())

          .then((res)=> {

            if ( res.success ) {
                
                orderRefInputBox.classList.add("hide-view");
            
                orderRefSummary.classList.remove("hide-view");

            }

            if ( res.order ) {

                orderItemViewHeading.innerText = "We found your order! Check out your summary below: ";

                orderRefSummary.innerHTML = `
                
                  <p> Order For : <span> ${res.order.menu_item} </span> </p>
                    
                  <p> Order Date : <span> ${new Date(res.order.order_date).toLocaleDateString()} </span> </p>

                  <p> Order Status : <span> ${res.order.order_status} </span> </p>

                  <button onclick="resetOrderSummary()"> Dismiss </button>
                
                `;

                return;

            }

            orderItemViewHeading.innerText = "We were unable to retrieve your order: "

                orderRefSummary.innerHTML = `
                
                  <p> Perhaps you tried a wrong <span> order-reference </span> ? </p>
                    
                  <p> Please try again later or contact our <span> Customers service </span> </p>

                  <button onclick="resetOrderSummary()"> Dismiss </button>
                
                `;
        
        })
    
          .catch((res)=> console.log("error", res.err));

}

