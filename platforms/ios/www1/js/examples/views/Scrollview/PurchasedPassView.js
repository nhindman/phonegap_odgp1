define(function(require, exports, module) {
    var Surface = require("famous/core/Surface");
    var View = require('famous/core/View');
    var Modifier = require('famous/core/Modifier');
    var Transform = require('famous/core/Transform');
    var StateModifier = require('famous/modifiers/StateModifier');

    var ContainerSurface = require('famous/surfaces/ContainerSurface');

    function PurchasedPassView(options) {

        View.apply(this, arguments);

        this.container = new ContainerSurface({
            size: [undefined, 100], 
            properties: {
              backgroundColor: 'rgb(64, 179, 118)'
            }
        });
        this.add(this.container);

        //base panel surface with gym name 
        this.mainSurface = new Surface({
            size: [undefined, 100],
            properties: {
               backgroundColor: "#40B376",
               zIndex: 1,
               borderBottom: "1px solid #3F9165"
           }
        });
        this.mainSurfaceModifier = new Modifier();

        this.gymName = new Surface({
            size: [undefined, 100],
            content: '<div class="gym_name">' + this.options.gymName + '</div>',
          properties: {
            marginLeft: "14.7%",
            lineHeight: "100px",
            color: "white",
            fontSize: "20px",
            zIndex: 50000
          }
        });

        this.gymNameModifier = new Modifier();

        //surface containing the price of each pass
        this.price = new Surface({ 
             content:'<div class="gym_price">' + this.options.price + '</div>',
             size: [true, true],
             properties: {
                 color: "white",
                 // textAlign: "left",
                 marginLeft: "83.7%",
                 fontSize: "15px",
                 zIndex: 2
             }
        }); 

        //creates modifier on price surface for click function to use when animating new prices in
        this.priceModifier = new Modifier({
            origin:[0,0.5],
          transform: Transform.translate(0, 0, 0)
        });

        this.container.add(this.mainSurfaceModifier).add(this.mainSurface);
        this.container.add(this.gymNameModifier).add(this.gymName);
        this.container.add(this.priceModifier).add(this.price);
        
        _setListeners.call(this);

        this.isPiping = false;
        this.onPipeEventOutput();
    }

    PurchasedPassView.prototype = Object.create(View.prototype);
    PurchasedPassView.prototype.constructor = PurchasedPassView;

    PurchasedPassView.DEFAULT_OPTIONS = {
     
    };

    function _setListeners() {
      this.container.on('click', function() {
          console.log(this.options)
         this._eventOutput.emit('showMyPurchasedPass', this.options);
      }.bind(this));


      this._eventInput.on('pipeEventOutput',this.onPipeEventOutput.bind(this));
      this._eventInput.on('unPipeEventOutput',this.onUnPipeEventOutput.bind(this));

    }

    PurchasedPassView.prototype.onPipeEventOutput = function(){
        if (this.isPiping == true) return;
        this.container.pipe(this._eventOutput);
        this.isPiping = true;
    };

    PurchasedPassView.prototype.onUnPipeEventOutput = function(){
        if (this.isPiping == false) return;
        this.container.unpipe(this._eventOutput);
        this.isPiping = false;
    };


    module.exports = PurchasedPassView;

});    

