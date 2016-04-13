// Generated by CoffeeScript 1.8.0

/*
  Example 15 - How to create an on-demand recurring payment.
 */

(function() {
  var example, fs, mollie;

  mollie = require("./mollie");

  fs = require("fs");

  example = (function() {
    function example(request, response) {
      mollie.customers.all((function(_this) {
        return function(customers) {

          /*
          				Retrieve the last created customer for this example.
          				If no customers are created yet, run example 11.
           */
          var customer, orderId;
          customer = customers[0];

          /*
          			  Generate a unique order id for this example. It is important to include this unique attribute
          			  in the redirectUrl (below) so a proper return page can be shown to the customer.
           */
          orderId = new Date().getTime();

          /*
          				Customer Payment creation parameters:
          				See: https://www.mollie.com/en/docs/reference/customers/create-payment
           */
          return mollie.customers_payments.withParent(customer).create({
            amount: 10.00,
            description: "An on-demand recurring payment",
            recurringType: Mollie.API.Object.Payment.RECURRINGTYPE_FIRST
          }, function(payment) {
            if (payment.error) {
              console.error(payment.error);
              return response.end();
            }

            /*
            					  In this example we store the order with its payment status in a database.
             */
            _this.databaseWrite(orderId, payment.status);

            /*
            					  Send the customer off to complete the payment.
             */
            response.writeHead(200, {
              'Content-Type': "text/html; charset=utf-8"
            });
            response.write("<p>Your payment status is '" + (_.escape(payment.status)) + "'.</p>");
            return response.end();
          });
        };
      })(this));
    }


    /*
    	  NOTE: This example uses a text file as a database. Please use a real database like MySQL in production code.
     */

    example.prototype.databaseWrite = function(orderId, paymentStatus) {
      orderId = parseInt(orderId);
      return fs.writeFile(__dirname + ("/orders/order-" + orderId + ".txt"), paymentStatus);
    };

    return example;

  })();

  module.exports = example;

}).call(this);
