document.getElementsByClassName("checkoutButton")[0].addEventListener('click', () => {
    selectOptions("/directory/cargosCream.json");
});

fetch("/directory/cargosCream.json")
.then((res) => res.json().then((data) => {
    const titleContainer = document.createElement('a');
    titleContainer.href = "#"

    const title = document.createElement('h2');
    title.innerText = data.name;
    title.setAttribute("onclick", `selectOptions("/directory/cargosCream.json")`);

    const price = document.createElement('p');
    var priceText = `£${data.price.toFixed(2)}`;
    
    if (data.preorder === true) {
        priceText = `Preorder from ${priceText}`;
    }

    price.innerText = priceText;

    const content = document.createElement('div');
    content.className = "content";

    titleContainer.appendChild(title);

    content.appendChild(titleContainer);
    content.appendChild(price);

    const imageCarousel = document.createElement('div');
    imageCarousel.className = "item-image-carousel";

    data.images.forEach((item) => {
        const image = document.createElement('img');
        image.src = item;
        imageCarousel.appendChild(image)
    })

    const item = document.createElement('div');
    item.className = "item";

    item.appendChild(imageCarousel)
    item.appendChild(content)

    document.getElementsByClassName('minishop')[0].appendChild(item)
}))

function selectOptions(item) {
    document.getElementsByClassName("slideableLoading")[0].classList.remove("hidden");
    fetchOptionScreen();

    function fetchOptionScreen() {
        fetch('/components/selectOpts.html').then((res) => res.text().then((data) => {

            document.getElementsByClassName("slideableLoading")[0].classList.add("hidden");
            const slideable = new DOMParser().parseFromString(data, "text/html");
            document.getElementsByClassName('slidables')[0].appendChild(slideable.body.firstChild);
            
            const status = document.getElementById("selectStatus");
            
            const ls = window.localStorage;

            var cart = JSON.parse(ls.getItem("cart"));

            if (cart === null) {
                cart = [];
            }

            status.innerText = "Fetching the latest updates"
            fetch(item).then((res) => res.json().then((data) => {
                const sizeGuide = document.createElement('div');

                const testImg = document.createElement('img');
                testImg.src = data.modelImage;
                testImg.className = "selectableImage";


                sizeGuide.appendChild(testImg);

                const text = document.createElement('p');
                text.innerText = `The model above is ${data.modelSize} and is wearing the ${data.modelWearing} size.`;

                sizeGuide.appendChild(text);

                document.getElementById("selectablesContent").appendChild(sizeGuide)
                
                data.options.forEach((item, index) => {
                    const form = document.createElement('form');
                    form.id = "form" + index;
                    
                    Object.keys(item).forEach((key) => {
                        var radio = document.createElement('input');
                        radio.type = "radio";
                        radio.name = index;
                        radio.id = key;
                        radio.value = item[key];
                        
                        var label = document.createElement('label');
                        label.htmlFor = key;
                        label.innerText = key;
                        
                        
                        const itemDiv = document.createElement('div');
                        itemDiv.appendChild(radio);
                        itemDiv.appendChild(label);
                       
                        form.appendChild(itemDiv);
                    })

                    document.getElementById("selectablesContent").appendChild(form);
                })

                var submitButton = document.createElement('button');
                submitButton.innerText = "ADD & CONTINUE TO CART";
                submitButton.addEventListener("click", () => {
                    
                    if (document.querySelector(`input[name="0"]:checked`) === null) {
                        alert("This field is required")
                    } else {
                        const price = document.querySelector(`input[name="0"]:checked`).value;
                        const priceName = document.querySelector(`input[name="0"]:checked`).id;

                        document.getElementsByClassName("loaderScreen")[0].classList.remove("hidden");
                        document.getElementById("selectablesContent").classList.add("hidden");
    
                        status.innerText = "Verifying new changes";
    
                        var alreadyInCart = false;
                        cart.forEach((item, index) => {
                            if (item.price == price) {
                                cart[index].quantity += 1;
                                alreadyInCart = true;
                            } else {
                                
                            }
                        })

                        console.log(alreadyInCart);
    
                        if (!alreadyInCart) {
                            cart.push({
                                "name": data.name,
                                "quantity": 1,
                                "price": price,
                                "priceName": priceName,
                                "source": item
                            });
                        }

                        // if (cart.length == 0) {
                        //     cart.push({
                        //         "name": data.name,
                        //         "quantity": 1,
                        //         "price": price,
                        //         "priceName": priceName
                        //     })
                        // }
    
    
                        ls.setItem("cart", JSON.stringify(cart));
                        dismiss('selectOptions');
                        window.location.href = "/cart";
                    }
                });

                document.getElementById("selectablesContent").appendChild(submitButton);

                document.getElementsByClassName("loaderScreen")[0].classList.add("hidden");
                document.getElementById("selectablesContent").classList.remove("hidden");
            }));
        }))
    }
}

function dismiss(item) {
    document.getElementById(item).remove();
}