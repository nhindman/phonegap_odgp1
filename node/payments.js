// Load the http module to create an http server.
var http = require('http');
var qs = require('querystring');
var braintree = require('braintree');

function parseCookies (request) {
    var list = {},
        rc = request.headers.cookie;

    rc && rc.split(';').forEach(function( cookie ) {
        var parts = cookie.split('=');
        list[parts.shift().trim()] = unescape(parts.join('='));
    });

    return list;
}
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
      console.log(post);
      dataRef.auth(post.authToken, function (){
        var gateway = braintree.connect({
          environment: braintree.Environment.Sandbox,
          merchantId: 'qnjhrs6nt6kf5r25',
          publicKey: 'vwcz5c7tvy3mjhbm',
          privateKey: '87e422885aa2f5d79d1a9d2d49755b74'
        });
        // if(!post.ccNum && user.vault_number){
          //gateway.transaction.sale({customerId: user.vault_number, ....})
          //}else{/* do below */}
        //gateway.customer.create

        gateway.transaction.sale({
          amount: '5.00',
          creditCard: {
            number: post.ccNumber,
            expirationMonth: post.ccExpireMonth,
            expirationYear: post.ccExpireYear,
            cvv: post.ccCVV,
            cardholderName: post.ccName
          }
        }, function (err, result){
          if(err) throw err;
          if(result.success){
            console.log('Transaction ID: '+result.transaction.id);
          }else{
            console.log(result.message);
          }
        });
      }, function (){
        console.log('failed');
      });
    });
    var cookies = parseCookies(request);

    
    console.log('cookies: ');
    console.log(cookies);
    gym_id = parseInt(request.url.substring(1));
    console.log('Gym ID: '+gym_id);
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Content-Length', 0);
    response.end();
  }catch(e){}
});

// Listen on port 8000, IP defaults to 127.0.0.1
server.listen(8001);

// Put a friendly message on the terminal
console.log("Server running at http://127.0.0.1:8000/");