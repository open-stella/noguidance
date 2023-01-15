var stripe = Stripe('pk_live_51MPsEIHoteyJlbKjvNlC9iMqnsFs8vmgwVqn6rkmGa88q18ydmzOpHL2EXDHJZgDMZkLuwgqOxodPS0PKaEtHKMk00SqZbPf0t')

const zones = [
    'euz1',
    'euz2',
    'euz3',
    'wz1',
    'sz1'
]

var zoneList = {};

async function main() {
    for (item of zones) {
        await fetchShipping(item);
    }

    const zoneAlhabetical = Object.keys(zoneList).sort();

    for (item of zoneAlhabetical) {
        const option = document.createElement('option');
        option.value = item;
        document.getElementById("countries").appendChild(option);
    }
}
main();

async function fetchShipping(zone) {
    
    const res = await fetch(`/components/${zone}`);
    const resData = await res.text();
    const resSplit = resData.split("\n");

    for (item of resSplit) {
        zoneList[item.replace("\r","")] = zone;
        const itemElm = document.createElement('li');
        itemElm.innerText = item;
        try {
        document.getElementById(zone).appendChild(itemElm);
        } catch(e) {}
    }

    console.log("")
}

var shipping = {
    standardUK: 'price_1MQZmOHoteyJlbKj9qFK1qX5',
    eu: "price_1MQZyRHoteyJlbKjOQqGBbFU",
    wz: "price_1MQaxyHoteyJlbKjOg0OzrdW"
}

var shippingPrices = {
    standardUK: 5,
    eu: 20,
    wz: 30
}

async function checkout() {
    const ticked = document.getElementById("shippingInput");
    
    if (ticked.value.trim() == "") {
        alert("This field is required");
    } else {

        const ls = window.localStorage;
        const cart = JSON.parse(ls.getItem("cart"));

        var stripeFormat = [];

        cart.forEach((item, index) => {
            stripeFormat.push({
                price: item.price,
                quantity: item.quantity
            })
        })

        var shippingstat = "";

        console.log(ticked.value);
        if (Object.keys(zoneList).includes(ticked.value)) {
            if (zoneList[ticked.value] == "euz1") {
                stripeFormat.push({
                    price: shipping.eu,
                    quantity: 1
                })
            }
            if (zoneList[ticked.value] == "euz2") {
                stripeFormat.push({
                    price: shipping.eu,
                    quantity: 1
                })
            }

            if (zoneList[ticked.value] == "euz3") {
                stripeFormat.push({
                    price: shipping.eu,
                    quantity: 1
                })
            }

            if (zoneList[ticked.value] == "wz1") {
                stripeFormat.push({
                    price: shipping.wz,
                    quantity: 1
                })
            }

            if (zoneList[ticked.value] == "sz1") {
                stripeFormat.push({
                    price: shipping.standardUK,
                    quantity: 1
                })
            }

            var stripeOptions = {
                lineItems: stripeFormat,
                mode: 'payment',
                successUrl: 'https://noguidance.xyz/success',
                cancelUrl: 'https://noguidance.xyz/cart',
                shippingAddressCollection: {
                    allowedCountries: ['US', 'CA', 'GB'],
                }
            }

            if (await checkDiscount()) {
                stripeFormat.pop();

                if (zoneList[ticked.value] == "euz1") {
                    stripeFormat.push({
                        price: shipping.eu,
                        quantity: 1
                    })
                }
                if (zoneList[ticked.value] == "euz2") {
                    stripeFormat.push({
                        price: shipping.eu,
                        quantity: 1
                    })
                }

                if (zoneList[ticked.value] == "euz3") {
                    stripeFormat.push({
                        price: shipping.eu,
                        quantity: 1
                    })
                }

                if (zoneList[ticked.value] == "wz1") {
                    stripeFormat.push({
                        price: shipping.wz,
                        quantity: 1
                    })
                }

                if (zoneList[ticked.value] == "sz1") {
                    stripeFormat.push({
                        price: shipping.standardUK,
                        quantity: 1
                    })
                }
                alert("Your discount has been applied successfully.")
            } else {
                alert("Your discount code is invalid.")
            }



            console.log(stripeFormat);
            stripe.redirectToCheckout(stripeOptions).then(function (result) {
                // If `redirectToCheckout` fails due to a browser or network
                // error, display the localized error message to your customer
                // using `result.error.message`.
            });
        } else {
            alert("Enter a valid country.")
        }


        
    }
}


function dynamicDescriptor() {
    const country = document.getElementById("shippingInput").value;
    if (Object.keys(zoneList).includes(country)) {
        const descripter = document.getElementById("shippingPrice");

        document.getElementById("promoTitle").innerText = "Limited Discount"
        document.getElementById("promoDesc").innerText = "Use code NOGUIDANCE5 at checkout to get £5 off shipping."

        if (zoneList[country] == "euz1") {
            descripter.innerText = `Shipping £${shippingPrices.eu}}`;
        }
        if (zoneList[country] == "euz2") {
            descripter.innerText = `Shipping £${shippingPrices.eu}`;
        }
        if (zoneList[country] == "euz3") {
            descripter.innerText = `Shipping £${shippingPrices.eu}`;
        }
        if (zoneList[country] == "wz1") {
            descripter.innerText = `Shipping £${shippingPrices.wz}`;
        }
        if (zoneList[country] == "sz1") {
            descripter.innerText = `Shipping ${shippingPrices.standardUK ? "£" : "" }${shippingPrices.standardUK ? shippingPrices.standardUK : "FREE"}`;
            document.getElementById("promoTitle").innerText = "FREE UK DELIVERY"
            document.getElementById("promoDesc").innerText = "Your UK order is eligible for free delivery. Use Discount code: NOGUIDANCE5"
        }
    }

}

async function checkDiscount() {
    var ogShippingPrices = {
        standardUK: 5,
        eu: 20,
        wz: 30
    }
    
    const discountBox = document.getElementById("discountInput"); 

    if (discountBox.value.trim() != "") {
        const discount = await fetch(`/discounts/${discountBox.value.trim()}`);
        if (discount.status == 200) {
            const discountData = await discount.json();

            shipping = discountData


            shippingPrices = ogShippingPrices
            Object.keys(shippingPrices).forEach((item) => {
                // const curShippingPrice = ogShippingPrices[item]
                shippingPrices[item] = shippingPrices[item] - 5
            })

            dynamicDescriptor();
            return true;
        } else {
            shippingPrices = ogShippingPrices
            dynamicDescriptor();
            return false;
        }
    }
}

document.getElementById("shippingInput").addEventListener("keyup", checkDiscount);
document.getElementById("discountInput").addEventListener("keyup", checkDiscount);
setTimeout(checkDiscount, 3000)

