const ls = window.localStorage;

var cart = ls.getItem("cart");

var price = 0;

if (cart != null) {
    cart = JSON.parse(cart);
    cart.forEach((item, index) => {
        fetch(item.source).then((res) => { 
            if (res.status == 200) {
                res.json().then((data) => {
                    if (data.preorder) {
                        document.getElementsByClassName("warning")[0].classList.remove("hidden");
                    }

                    const itemContainer = document.createElement('div');
                    itemContainer.className = "cartItem";

                    const itemImage = document.createElement('img');
                    itemImage.src = data.images[0];
                    itemImage.className = "cartItemImage";

                    const detailDiv = document.createElement('div');
                    detailDiv.className = "cartItemDetails";

                    const itemTitle = document.createElement('h3');
                    itemTitle.innerText = `${data.styleName} ${data.name}`;

                    const itemPrice = document.createElement('p');
                    itemPrice.innerText = `£${(data.price * item.quantity).toFixed(2)}`;
                    price += data.price * item.quantity;
                    document.getElementsByClassName("totalPrice")[0].innerText = `£${price.toFixed(2)}`;


                    const decreaseBtn = document.createElement('button');
                    decreaseBtn.innerText = "-";
                    decreaseBtn.className = "decreaseBtn btn"
                    decreaseBtn.addEventListener('click', (e) => {
                        if (cart[index].quantity > 1) {
                            cart[index].quantity--;
                            ls.setItem("cart", JSON.stringify(cart));
                            location.reload();
                        }
                    })

                    const increaseBtn = document.createElement('button');
                    increaseBtn.innerText = "+";
                    increaseBtn.className = "increaseBtn btn"
                    increaseBtn.addEventListener('click', (e) => {
                        cart[index].quantity++;
                        ls.setItem("cart", JSON.stringify(cart));
                        location.reload();
                    })

                    const quantityElem = document.createElement('div');
                    quantityElem.type = "number";
                    quantityElem.innerText = item.quantity;
                    quantityElem.min = 1;

                    quantityElem.addEventListener('change', (e) => {
                        cart[index].quantity = e.target.value;
                        ls.setItem("cart", JSON.stringify(cart));
                        location.reload();
                    })

                    const quantityBar = document.createElement('div');
                    quantityBar.className = "quantityBar";

                    quantityBar.appendChild(decreaseBtn);
                    quantityBar.appendChild(quantityElem);
                    quantityBar.appendChild(increaseBtn);


                    const labels = document.createElement('div');
                    labels.className = "labels";

                    if (data.preorder) {
                        const preorderLabel = document.createElement('div');
                        preorderLabel.className = "preorderLabel";
                        preorderLabel.innerText = "Preorder";

                        labels.appendChild(preorderLabel);
                    }

                    const sizeLabel = document.createElement('div');
                    sizeLabel.className = "sizeLabel";
                    sizeLabel.innerText = item.priceName;

                    labels.appendChild(sizeLabel);

                    
                    detailDiv.appendChild(itemTitle);
                    detailDiv.appendChild(itemTitle);
                    detailDiv.appendChild(itemPrice);
                    detailDiv.appendChild(labels);


                    const removeLabel = document.createElement('div');
                    removeLabel.className = "removeLabel";
                    removeLabel.innerText = "Remove";
                    removeLabel.addEventListener('click', (e) => {
                        cart.splice(index, 1);
                        ls.setItem("cart", JSON.stringify(cart));
                        location.reload();
                    });

                    labels.appendChild(removeLabel);
                    
                    detailDiv.appendChild(quantityBar);

                    itemContainer.appendChild(itemImage);
                    itemContainer.appendChild(detailDiv);



                    document.getElementsByClassName('cartItems')[0].appendChild(itemContainer);
                }) 
            } else {
                alert(`Unfortunately, there was an error processing ${item.name} in cart.`)
            }
        })
    })

}

function showShipping() {
    document.getElementsByClassName("selectOptions")[0].classList.remove("hidden");
}

function dismiss(item) {
    document.getElementById(item).remove();
}

function shipping() {
    var fail = false;

    if (cart == null) {
        fail = true;
        alert("Please add an item to your cart before proceeding to checkout.");
        window.location.href = "/"
    }
    if (cart.length == 0) {
        fail = true;
        alert("Please add an item to your cart before proceeding to checkout.");
        window.location.href = "/"
    }

    if (!fail) {
        window.location.href = "shipping"
    }
}