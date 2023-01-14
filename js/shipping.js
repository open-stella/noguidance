var stripe = Stripe('pk_live_51MPsEIHoteyJlbKjvNlC9iMqnsFs8vmgwVqn6rkmGa88q18ydmzOpHL2EXDHJZgDMZkLuwgqOxodPS0PKaEtHKMk00SqZbPf0t')

const shipping = {
    standardUK: 'price_1MQFH0HoteyJlbKjljgEhN5m'
}



function checkout() {
    const ticked = document.querySelector(`input[name="shipping"]:checked`);
    
    if (ticked == null) {
        alert("This field is required");
    } else {
        const tickValue = document.querySelector(`input[name="shipping"]:checked`).value;

        const ls = window.localStorage;
        const cart = JSON.parse(ls.getItem("cart"));

        var stripeFormat = [];

        cart.forEach((item, index) => {
            stripeFormat.push({
                price: item.price,
                quantity: item.quantity
            })
        })

        var shipping = "";
        if (tickValue == "standardUK") {
            stripeFormat.push({
                price: shipping.standardUK,
                quantity: 1
            })
        }


        console.log(stripeFormat);
        stripe.redirectToCheckout({
            lineItems: stripeFormat,
            mode: 'payment',
            successUrl: 'https://noguidance.xyz/success',
            cancelUrl: 'https://noguidance.xyz/cart',
            shippingAddressCollection: {
                allowedCountries: ['US', 'CA', 'GB'],
            }
        }).then(function (result) {
            // If `redirectToCheckout` fails due to a browser or network
            // error, display the localized error message to your customer
            // using `result.error.message`.
        });
    }
}