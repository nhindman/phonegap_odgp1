// Load the http module to create an http server.
var http = require('http');
var qs = require('querystring');
var braintree = require('braintree');
var rootSecret = "K1KMIk0GiLTA9iwXC1vh5zwAY6rxR5qj5V3KPquQ"

// Configure our HTTP server to respond with Hello World to all requests.
var server = http.createServer(function (request, response) {
  try{
    var Firebase = require('firebase');
    var dataRef = new Firebase('https://burning-fire-4148.firebaseio.com');

    var body = '';
    request.on('data', function (data){
      body += data;
      if(body.length > 0xFFFF){
        req.connection.destroy();
      }
    });
    request.on('end', function (){
      var post = qs.parse(body);
      var price;
      console.log(post);
      dataRef.auth(post.authToken, function (error, authResult){
        var gym;
        var gateway = braintree.connect({
          environment: braintree.Environment.Sandbox,
          merchantId: 'qnjhrs6nt6kf5r25',
          publicKey: 'vwcz5c7tvy3mjhbm',
          privateKey: '87e422885aa2f5d79d1a9d2d49755b74'
        });
        // save purchase info to DB (date m/d/y/h/m/s, last_4_card, vault_id, amount, gym, 1/4/1month)
         // finish filling in data from what's being posted
         // figure out what to do with error handling
         // interface needs to know how to handle success, listen for when pass was added and show pass to user
         // create the pass for user on credit card run

         //I. user creates pass when:
         //A. user not signed in:

       //      1. user not registered: 
       //           pass gets created on click of ok button in credit card view

       //      2. user is registered:
       //           pass gets created on click of sign-in button in welcome back view

       // B. user is signed in:
       //      1. pass gets created on click of buy now button from overview footer (buy now button)
         
         var runCard = function(vaultId, amount, cvv) {
           console.log("running card "+vaultId+' '+amount+' '+cvv);
           var transactionObject = {
             customerId: vaultId, 
             amount: amount
           };
           if (cvv) {
             transactionObject.creditCard = {cvv: cvv};
           }
           gateway.transaction.sale(transactionObject, function(error,result) {
             // Sale is good
             console.log("card succesfully ran");
             var rootDataRef = new Firebase('https://burning-fire-4148.firebaseio.com');
             rootDataRef.auth(rootSecret, function (error, authResult){
               console.log("Inserting pass into database");
               var passes = rootDataRef.child('passes').child(user.id);
               var dataFirebase = {
                 userID: user.id, 
                 gymName: gym.gym_name, 
                 price: price,
                 numDays: post.price, 
                 activated: false
               };
               var id = passes.push().name();
               // dataFirebase.id = id;
               passes.child(id).set(dataFirebase);
             });
             // console.log(result);
           })
         };
        dataRef.child('gyms1/'+gym_id).once("value",function(dataSnapshot) {
          console.log(gym_id);
          debugger;
          gym = dataSnapshot.val();
          console.log(gym);
          price = gym.gym_prices[post.price];
          dataRef.child('customers/'+user.id+'/vaultId').once("value",function(dataSnapshot) {
              var vaultId = dataSnapshot.val();
              // console.log(post.ccNumber);
              console.log("vaultId ",vaultId);
              if (!post.ccNumber && vaultId) {
                console.log("running card with vaultid "+vaultId);
                // run card based on vault id
                runCard(vaultId, price);
              } else if (post.ccNumber) {
                console.log("creating vaultid");
                var customerRequest = {
                  firstName: "Nate",
                  lastName: "Hindman",
                  creditCard: {
                    number: "4111111111111111",
                    cvv: "123",
                    expirationMonth: "06",
                    expirationYear: "2018",
                    billingAddress: {
                      postalCode: "90210"
                    }
                  }
                };
                gateway.customer.create(customerRequest, function (err, result) {
                  var vaultId = result.customer.id;
                  console.log("vaultid created "+vaultId);
                  if (result.success) {
                    dataRef.child('customers/'+user.id).update({vaultId: vaultId});
                    runCard(vaultId, price, customerRequest.creditCard.cvv);
                  } else {
                    //throw error message, figure out later
                    console.log("<h1>Error: " + result.message + "</h1>");
                  }
                }); 
              } else{
                //throw error 
              }
            });
        });
        console.log("SDD",authResult);
        var user = authResult.auth;

        

        // if(!post.ccNum && user.vault_number){
          //gateway.transaction.sale({customerId: user.vault_number, ....})
          //}else{/* do below */}
        //gateway.customer.create

        // gateway.transaction.sale({
        //   amount: '5.00',
        //   creditCard: {
        //     number: post.ccNumber,
        //     expirationMonth: post.ccExpireMonth,
        //     expirationYear: post.ccExpireYear,
        //     cvv: post.ccCVV,
        //     cardholderName: post.ccName
        //   }
        // }, function (err, result){
        //   if(err) throw err;
        //   if(result.success){
        //     console.log('Transaction ID: '+result.transaction.id);
        //   }else{
        //     console.log(result.message);
        //   }
        // });
      }, function (){
        console.log('failed');
      });
    });
    
    gym_id = request.url.substring(1).replace('%20', ' ');
    console.log('Gym ID: '+gym_id);
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Content-Length', 0);
    response.end();
  }catch(e){}
});

// Listen on port 8001, IP defaults to 127.0.0.1
server.listen(8001);

// Put a friendly message on the terminal
console.log("Server running at http://127.0.0.1:8001/");