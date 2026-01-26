// STRIPE LIBRARY TEMPORARILY DISABLED
// This file is commented out to prevent errors when Stripe keys are missing

export default null;

// ORIGINAL CODE COMMENTED OUT
/*
import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not defined");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-03-31.basil",
});

export default stripe;
*/
