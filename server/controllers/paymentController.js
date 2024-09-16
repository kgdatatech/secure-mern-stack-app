// server\controllers\paymentController.js
const mongoose = require('mongoose');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const User = require('../models/User');
const Analytics = require('../models/Analytics'); // Import the Analytics model
const { updateUserSubscription, cancelUserSubscription } = require('../utils/subscriptionUtils');
const { sendNotificationEmail } = require('../utils/emailUtils');

// Helper function to record analytics data
async function recordAnalytics(eventType, data) {
    try {
        // Ensure the userId is an ObjectId, or null if no user is associated
        const userId = mongoose.Types.ObjectId.isValid(data.userId) ? data.userId : null;

        const analyticsData = new Analytics({
            eventType,
            user: userId,  // Use the correct ObjectId here
            details: data.details || {},
            ip: data.ip || null,
            referrer: data.referrer || null,
            transactionId: data.transactionId || null, // Specific to payment events
            amount: data.amount || null, // In cents
            currency: data.currency || null, // e.g., 'USD'
            paymentStatus: data.paymentStatus || null, // e.g., 'succeeded'
            timestamp: new Date(),
        });
        await analyticsData.save();
        console.log(`Analytics recorded for event: ${eventType}`);
    } catch (error) {
        console.error('Error recording analytics:', error.message);
    }
}

// Helper function to find or create a Stripe customer
async function findOrCreateCustomer(user) {
    let customerId = user.stripeCustomerId;
    if (!customerId) {
        console.log('Creating new Stripe customer');
        const customer = await stripe.customers.create({
            email: user.email,
            name: user.name,
        });
        customerId = customer.id;
        user.stripeCustomerId = customerId;
        await user.save();
        console.log(`Saved new Stripe customer ID ${customerId} to user ${user.email}`);
    }
    return customerId;
}

// Create a one-off payment checkout session
exports.createPaymentIntent = async (req, res) => {
    try {
        const { userId, email, priceId } = req.body;
        let user;

        if (userId) {
            // If userId is provided, find the user by ID
            user = await User.findById(userId);
        } else if (email) {
            // If userId is not provided, find the user by email or create a new user
            user = await User.findOne({ email });
            if (!user) {
                user = new User({ email });
                await user.save();
                console.log(`Created new user with email ${email}`);
            }
        }

        if (!user) {
            return res.status(404).send({ message: 'User not found or created' });
        }

        const customerId = await findOrCreateCustomer(user);

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            // success_url: 'https://yourbusinessdomain.com/success?session_id={CHECKOUT_SESSION_ID}',
            // cancel_url: 'https://yourbusinessdomain.com/dashboard', // PRODUCTION -  Update to include custom cancel page with button that leads to dashboard
            // customer: customerId,
            success_url: 'https://localhost:5173/success?session_id={CHECKOUT_SESSION_ID}',
            cancel_url: 'https://localhost:5173/dashboard',
            customer: customerId,
        });

        // Send admin email notification
        await sendPaymentNotificationEmail(user, process.env.ADMIN_EMAIL, 'One-Time Payment');

        res.status(200).send({ url: session.url });
        console.log('One-off payment session created successfully, redirecting to Stripe Checkout.');
    } catch (error) {
        console.error('Error creating one-off payment session:', error.message);
        res.status(500).send({ error: error.message });
    }
};

// Create a subscription payment intent
exports.createSubscription = async (req, res) => {
    try {
        const { userId, email, priceId } = req.body;
        let user;

        if (userId) {
            // If userId is provided, find the user by ID
            user = await User.findById(userId);
        } else if (email) {
            // If userId is not provided, find the user by email or create a new user
            user = await User.findOne({ email });
            if (!user) {
                user = new User({ email });
                await user.save();
                console.log(`Created new user with email ${email}`);
            }
        }

        if (!user) {
            return res.status(404).send({ message: 'User not found or created' });
        }

        const customerId = await findOrCreateCustomer(user);

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'subscription',
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            // success_url: 'https://yourbusinessdomain.com/success?session_id={CHECKOUT_SESSION_ID}',
            // cancel_url: 'https://yourbusinessdomain.com/dashboard', // PRODUCTION -  Update to include custom cancel page with button that leads to dashboard
            // customer: customerId,
            success_url: 'https://localhost:5173/success?session_id={CHECKOUT_SESSION_ID}',
            cancel_url: 'https://localhost:5173/dashboard', // DEVELOPMENT - Update to include custom cancel page with button that leads to dashboard
            customer: customerId,
        });

        // Send admin email notification
        await sendPaymentNotificationEmail(user, process.env.ADMIN_EMAIL, 'Subscription');

        res.status(200).send({ url: session.url });
        console.log('Subscription created successfully, redirecting to Stripe Checkout.');
    } catch (error) {
        console.error('Error creating subscription:', error.message);
        res.status(500).send({ error: error.message });
    }
}

const { sendPaymentNotificationEmail } = require('../utils/emailUtils'); // Import the email utility

// Handle Stripe webhooks for updating the user's subscription status in the database
exports.handleStripeWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.NODE_ENV === 'production'
        ? process.env.STRIPE_WEBHOOK_SECRET_PROD
        : process.env.STRIPE_WEBHOOK_SECRET_DEV;

    try {
        const event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);

        // Handle the event
        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object;
                const customerId = session.customer;
                const productId = session?.line_items?.[0]?.price?.product;
        
                let user = await User.findOne({ stripeCustomerId: customerId });
        
                if (!user) {
                    // Create a new user logic here
                    user = new User({
                        email: session.customer_details.email,
                        stripeCustomerId: customerId,
                        isVerified: true,
                    });
                }
        
                // Ensure clear distinction between one-off and subscription
                if (productId === 'prod_ID') {
                    // One-off payment logic
                    user.oneOffPaymentStatus = 'completed';
                    user.subscriptionStatus = null; // This line ensures no conflict
                    user.subscriptionTier = 'one-off';
                } else if (productId === 'prod_ID') {
                    // Subscription logic
                    user.subscriptionStatus = 'active';
                    user.subscriptionTier = 'monthly';
                    user.oneOffPaymentStatus = null; // Clear the one-off status if subscribing
                }
        
                await user.save();
                console.log(`User ${user.email} updated/created successfully`);
        
                // Record analytics
                const eventType = productId === 'prod_ID' ? 'one_off_payment_completed' : 'subscription_completed';
                await recordAnalytics(eventType, {
                    userId: user._id,
                    transactionId: session.id,
                    amount: session.amount_total,
                    currency: session.currency,
                    paymentStatus: 'succeeded',
                    details: {
                        product: productId,
                        customerId: session.customer,
                    }
                });
        
                // Send success email
                const emailSubject = productId === 'prod_ID' ? 'Payment Successful' : 'Subscription Successful';
                const emailBody = `Dear ${user.name || 'Customer'},\n\nThank you for your ${productId === 'prod_ID' ? 'payment' : 'subscription'}. Your payment of $${(session.amount_total / 100).toFixed(2)} was successful.`;
        
                await sendNotificationEmail(user, emailSubject, emailBody);
                break;
            }
            case 'customer.subscription.created':
            case 'customer.subscription.updated': {
                const subscription = event.data.object;
                const user = await User.findOne({ stripeCustomerId: subscription.customer });
        
                if (user) {
                    // Updating the user's subscription details
                    user.subscriptionStatus = subscription.status === 'active' ? 'active' : 'inactive';
                    user.subscriptionTier = 'monthly';
                    user.oneOffPaymentStatus = null; // Clear one-off payment status if it's a subscription
                    await user.save();
        
                    // Record analytics for subscription creation or update
                    const eventType = event.type === 'customer.subscription.created' ? 'subscription_created' : 'subscription_updated';
                    await recordAnalytics(eventType, {
                        userId: user._id, // MongoDB ObjectId
                        transactionId: subscription.id, // Subscription ID
                        amount: subscription.plan.amount, // Amount in cents
                        currency: subscription.plan.currency,
                        paymentStatus: subscription.status,
                        details: {
                            productId: subscription.plan.product,
                            customerId: subscription.customer,
                            subscriptionId: subscription.id,
                        }
                    });
                } else {
                    console.log(`No user found with Stripe customer ID ${subscription.customer}`);
                }
                break;
            }
            case 'customer.subscription.deleted': {
                const subscription = event.data.object;
                const user = await User.findOne({ stripeCustomerId: subscription.customer });

                if (user) {
                    await cancelUserSubscription(subscription);

                    // Record analytics for subscription cancellation
                    await recordAnalytics('subscription_canceled', {
                        userId: user._id, // MongoDB ObjectId
                        transactionId: subscription.id, // Subscription ID
                        amount: 0, // Canceled, so no amount
                        currency: subscription.plan.currency,
                        paymentStatus: 'canceled',
                        details: {
                            productId: subscription.plan.product,
                            customerId: subscription.customer,
                            subscriptionId: subscription.id,
                        }
                    });
                } else {
                    console.log(`No user found with Stripe customer ID ${subscription.customer}`);
                }
                break;
            }
            case 'invoice.payment_succeeded': {
                const invoice = event.data.object;
                const user = await User.findOne({ stripeCustomerId: invoice.customer });
            
                if (user) {
                    console.log(`Handling invoice for ${invoice.subscription ? 'subscription' : 'one-off payment'}.`);
            
                    if (!invoice.subscription) {
                        // It's a one-off payment
                        user.oneOffPaymentStatus = 'completed';
                        user.subscriptionStatus = 'inactive'; // Ensure subscriptions are not mistakenly marked active
                    } else {
                        // It's a subscription payment
                        user.subscriptionStatus = 'active';
                        user.oneOffPaymentStatus = null; // Clear one-off payment status if it's a subscription
                    }
            
                    await user.save();
                    console.log(`User ${user.email}'s payment status updated to 'completed'.`);
            
                    await recordAnalytics('invoice_payment_succeeded', {
                        userId: user._id,
                        transactionId: invoice.id,
                        amount: invoice.amount_paid || invoice.total || 0,
                        currency: invoice.currency,
                        paymentStatus: 'succeeded',
                        details: {
                            customerId: invoice.customer,
                            subscriptionId: invoice.subscription,
                        }
                    });
                } else {
                    console.log(`No user found with Stripe customer ID ${invoice.customer}`);
                }
                break;
            }
            
            case 'invoice.payment_failed': {
                const invoice = event.data.object;
                const user = await User.findOne({ stripeCustomerId: invoice.customer });

                if (user) {
                    console.log('Invoice payment failed:', invoice);

                    // Record analytics for invoice payment failure
                    await recordAnalytics('invoice_payment_failed', {
                        userId: user._id, // MongoDB ObjectId
                        transactionId: invoice.id,
                        amount: invoice.amount_due,
                        currency: invoice.currency,
                        paymentStatus: 'failed',
                        details: {
                            customerId: invoice.customer,
                            subscriptionId: invoice.subscription,
                        }
                    });
                } else {
                    console.log(`No user found with Stripe customer ID ${invoice.customer}`);
                }
                break;
            }
            case 'payment_intent.succeeded': {
                const paymentIntent = event.data.object;
                const user = await User.findOne({ stripeCustomerId: paymentIntent.customer });
            
                if (user) {
                    console.log('Payment Intent succeeded:', paymentIntent);
            
                    // Check if it's a one-off payment or a subscription
                    const isOneOffPayment = paymentIntent.metadata && paymentIntent.metadata.type === 'one-off';
                    const isSubscriptionPayment = paymentIntent.metadata && paymentIntent.metadata.type === 'subscription';
                    
                    if (isOneOffPayment) {
                        user.oneOffPaymentStatus = 'completed';
                        user.subscriptionStatus = 'inactive'; // Keep subscription status inactive if it's a one-off payment
                        user.subscriptionTier = 'one-off';
                    } else if (isSubscriptionPayment) {
                        user.subscriptionStatus = 'active';
                        user.subscriptionTier = 'subscription';
                        user.oneOffPaymentStatus = null; // Clear one-off payment status if it's a subscription
                    }
            
                    await user.save();
            
                    // Record analytics for payment intent success
                    await recordAnalytics('payment_intent_succeeded', {
                        userId: user._id, // MongoDB ObjectId
                        transactionId: paymentIntent.id,
                        amount: paymentIntent.amount_received, // Stored in cents
                        currency: paymentIntent.currency,
                        paymentStatus: paymentIntent.status,
                        details: {
                            paymentMethod: paymentIntent.payment_method,
                            receiptEmail: paymentIntent.receipt_email,
                        }
                    });
                } else {
                    console.log(`No user found with Stripe customer ID ${paymentIntent.customer}`);
                }
                break;
            }
                          
            case 'payment_intent.payment_failed': {
                const paymentIntent = event.data.object;
                const user = await User.findOne({ stripeCustomerId: paymentIntent.customer });

                if (user) {
                    console.log('Payment Intent failed:', paymentIntent);

                    // Record analytics for payment intent failure
                    await recordAnalytics('payment_intent_failed', {
                        userId: user._id, // MongoDB ObjectId
                        transactionId: paymentIntent.id,
                        amount: paymentIntent.amount, // Attempted amount
                        currency: paymentIntent.currency,
                        paymentStatus: paymentIntent.status,
                        details: {
                            paymentMethod: paymentIntent.payment_method,
                            receiptEmail: paymentIntent.receipt_email,
                        }
                    });
                } else {
                    console.log(`No user found with Stripe customer ID ${paymentIntent.customer}`);
                }
                break;
            }
            case 'payment_intent.created': {
                const paymentIntent = event.data.object;
                console.log('Payment Intent created:', paymentIntent);

                // Record analytics for payment intent creation
                await recordAnalytics('payment_intent_created', {
                    userId: paymentIntent.customer,
                    transactionId: paymentIntent.id,
                    amount: paymentIntent.amount, // Stored in cents
                    currency: paymentIntent.currency,
                    paymentStatus: 'created',
                    details: {
                        paymentMethod: paymentIntent.payment_method,
                        receiptEmail: paymentIntent.receipt_email,
                    }
                });
                break;
            }
            case 'charge.succeeded': {
                const charge = event.data.object;
                console.log('Charge succeeded:', charge);

                // Record analytics for charge success
                await recordAnalytics('charge_succeeded', {
                    userId: charge.customer,
                    transactionId: charge.id,
                    amount: charge.amount, // Stored in cents
                    currency: charge.currency,
                    paymentStatus: 'succeeded',
                    details: {
                        paymentMethod: charge.payment_method,
                        receiptEmail: charge.receipt_email,
                        paymentIntentId: charge.payment_intent,
                    }
                });
                break;
            }
            case 'charge.updated': {
                const charge = event.data.object;
                console.log('Charge updated:', charge);

                // Record analytics for charge update
                await recordAnalytics('charge_updated', {
                    userId: charge.customer,
                    transactionId: charge.id,
                    amount: charge.amount, // Stored in cents
                    currency: charge.currency,
                    paymentStatus: charge.status,
                    details: {
                        paymentMethod: charge.payment_method,
                        receiptEmail: charge.receipt_email,
                        paymentIntentId: charge.payment_intent,
                    }
                });
                break;
            }
            case 'customer.created': {
                const customer = event.data.object;
                console.log('New Stripe customer created:', customer);

                // Optionally record analytics for the customer creation
                await recordAnalytics('customer_created', {
                    userId: null,  // No user associated yet
                    transactionId: customer.id,
                    amount: 0,
                    currency: null,
                    paymentStatus: 'created',
                    details: {
                        customerId: customer.id,
                        email: customer.email,
                        name: customer.name,
                    }
                });
                break;
            }
            case 'customer.deleted': {
                const customer = event.data.object;
                const stripeCustomerId = customer.id;
                const user = await User.findOne({ stripeCustomerId });

                if (user) {
                    user.subscriptionStatus = 'canceled';
                    user.stripeCustomerId = null; // Optionally remove the Stripe customer ID
                    await user.save();

                    console.log(`User with Stripe customer ID ${stripeCustomerId} has been updated after customer deletion.`);
                } else {
                    console.log(`No user found with Stripe customer ID ${stripeCustomerId}`);
                }

                // Optionally, record analytics for the customer deletion
                await recordAnalytics('customer_deleted', {
                    userId: user ? user._id : null,
                    transactionId: customer.id, // Use customer ID as a reference
                    amount: 0, // No amount is relevant for deletion
                    currency: null,
                    paymentStatus: 'canceled',
                    details: {
                        customerId: stripeCustomerId,
                    }
                });
                break;
            }
            default:
                console.log(`Unhandled event type ${event.type}`);
        }
        res.status(200).send({ received: true });
    } catch (err) {
        console.error(`Webhook Error: ${err.message}`);
        res.status(400).send(`Webhook Error: ${err.message}`);
    }
};
