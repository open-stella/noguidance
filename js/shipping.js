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
        option.innerText = item;
        document.getElementById("shippingInput").appendChild(option);
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

const countryListAlpha2 = ["AC", "AD", "AE", "AF", "AG", "AI", "AL", "AM", "AO", "AQ", "AR", "AT", "AU", "AW", "AX", "AZ", "BA", "BB", "BD", "BE", "BF", "BG", "BH", "BI", "BJ", "BL", "BM", "BN", "BO", "BQ", "BR", "BS", "BT", "BV", "BW", "BY", "BZ", "CA", "CD", "CF", "CG", "CH", "CI", "CK", "CL", "CM", "CN", "CO", "CR", "CV", "CW", "CY", "CZ", "DE", "DJ", "DK", "DM", "DO", "DZ", "EC", "EE", "EG", "EH", "ER", "ES", "ET", "FI", "FJ", "FK", "FO", "FR", "GA", "GB", "GD", "GE", "GF", "GG", "GH", "GI", "GL", "GM", "GN", "GP", "GQ", "GR", "GS", "GT", "GU", "GW", "GY", "HK", "HN", "HR", "HT", "HU", "ID", "IE", "IL", "IM", "IN", "IO", "IQ", "IS", "IT", "JE", "JM", "JO", "JP", "KE", "KG", "KH", "KI", "KM", "KN", "KR", "KW", "KY", "KZ", "LA", "LB", "LC", "LI", "LK", "LR", "LS", "LT", "LU", "LV", "LY", "MA", "MC", "MD", "ME", "MF", "MG", "MK", "ML", "MM", "MN", "MO", "MQ", "MR", "MS", "MT", "MU", "MV", "MW", "MX", "MY", "MZ", "NA", "NC", "NE", "NG", "NI", "NL", "NO", "NP", "NR", "NU", "NZ", "OM", "PA", "PE", "PF", "PG", "PH", "PK", "PL", "PM", "PN", "PR", "PS", "PT", "PY", "QA", "RE", "RO", "RS", "RU", "RW", "SA", "SB", "SC", "SE", "SG", "SH", "SI", "SJ", "SK", "SL", "SM", "SN", "SO", "SR", "SS", "ST", "SV", "SX", "SZ", "TA", "TC", "TD", "TF", "TG", "TH", "TJ", "TK", "TL", "TM", "TN", "TO", "TR", "TT", "TV", "TW", "TZ", "UA", "UG", "US", "UY", "UZ", "VA", "VC", "VE", "VG", "VN", "VU", "WF", "WS", "XK", "YE", "YT", "ZA", "ZM", "ZW", "ZZ"]

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
            dynamicDescriptor();
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
                    allowedCountries: countryListAlpha2,
                }
            }

            if (document.getElementById("discountInput").value.trim() != "") {
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
            descripter.innerText = `Shipping £${shippingPrices.eu}`;
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
    dynamicDescriptor();
}

document.getElementById("shippingInput").addEventListener("change", checkDiscount);
// setInterval(() => {
//     dynamicDescriptor()
// }, 100);

document.getElementById("discountInput").addEventListener("keyup", checkDiscount);
setTimeout(checkDiscount, 3000)

