import React from 'react';

/**
 * Read first | how to configure this module.
 * 1- Go to stripe's settings and enable Client-only mode ==> https://dashboard.stripe.com/account/checkout/settings
 * 2-Go to  stripe's developers | api keys and get your Publishable key ==> https://dashboard.stripe.com/test/apikeys
 * 3- Go to stripe's products and create your own products and get the product ID. ==> //https://dashboard.stripe.com/test/products/
 * 4-Configure the following 4 strings with your stripe information.
 * 5-the function "LoadStripe" must be integrated in the root level to prevent re-rendering.
 */

let STRIPE_TEST = true; //set to false for live 
let STRIPE_PUBLIC_KEY = "";// Replace with your own publishable key
let DOMAIN = STRIPE_TEST ? "MYURL" : window.location.origin; //Note it must start with http
let SUCCESS_ROUTE = "/success"; //Route after payment is succeed
let CANCEL_ROUTE = "/canceled"; //Route after payment process has been canceled


/*
 * @method loadStripe
 * Note: before integrating the stripeSubscription you must load this function in the root of the app.
 * This function will append to the head of the document.
 */
export function loadStripe ()
{
    const js = document.createElement("script");

    js.type = "text/javascript";

    js.src = `https://js.stripe.com/v3/`;

    document.head.appendChild(js); //this will load in the head
}


/*
 * @method  StripeSubscription
 * @param {priceID, text, className, email} props string 
 * @return Button
 */
function StripeSubscription(props)
{
    const stripe = window.Stripe(STRIPE_PUBLIC_KEY);

    const redirectToCheckout = async (priceId) =>
    {
        let checkoutParams = {
            lineItems: [{ price: priceId, quantity: 1 }],
            successUrl: `${DOMAIN}${SUCCESS_ROUTE}?session_id={CHECKOUT_SESSION_ID}`,
            cancelUrl: DOMAIN + CANCEL_ROUTE,
            mode: 'subscription',
            billingAddressCollection: 'auto',
            customerEmail: props.email
        };

        try
        {
            await stripe.redirectToCheckout(checkoutParams);
        }
        catch(ex)
        {
            /**
             * If there are any error with your api or current settings you will get them here.
             */
            console.log(ex);
        }
    };

    return(

        <button 
            className={props.className} 
            onClick={()=> redirectToCheckout(props.priceID)}>
            {props.text}
        </button>
    )
}

export default StripeSubscription;


/**
 * Example of usage
 * <StripeSubscription  //Component
    priceID="price_1HHA0BAtG375sOjD44uqaLta"  //Price id from stripe
    email={userInfo.userInfo.email} //Email of the user to prevent them from having different email address
    className="btn btn-info btn-lg" //CSS class for button styles
    text="Checkout"/> //Text of the button
 * 
 */
