var BASE_URL = 'https://burning-fire-4148.firebaseio.com';
var chatRef = new Firebase(BASE_URL);

define(function(require, exports, module) {
    var Surface = require("famous/core/Surface");
    var RenderNode = require("famous/core/RenderNode");
    var View = require('famous/core/View');
    var Modifier = require('famous/core/Modifier');
    var Transform = require('famous/core/Transform');
    var StateModifier = require('famous/modifiers/StateModifier');
    var HeaderFooter = require('famous/views/HeaderFooterLayout');
    var ContainerSurface = require('famous/surfaces/ContainerSurface');
    var Scrollview = require("famous/views/Scrollview");
    var Group = require('famous/core/Group');
    var ViewSequence = require('famous/core/ViewSequence');
    var Timer = require('famous/utilities/Timer');
    var GenericSync     = require('famous/inputs/GenericSync');
    var MouseSync       = require('famous/inputs/MouseSync');
    var TouchSync       = require('famous/inputs/TouchSync');
    GenericSync.register({'mouse': MouseSync, 'touch': TouchSync});
    var Transitionable  = require('famous/transitions/Transitionable');

    var PurchasedPassView = require('examples/views/Scrollview/PurchasedPassView');

    var FirebaseRef = require('examples/views/Scrollview/firebaseRef');

    function PassesView(options, data) {
      View.apply(this, arguments);
      _createLayout.call(this);
      _createHeader.call(this);
      _createBody.call(this);
      _setListeners.call(this);
      _setupEvents.call(this);

    }

    PassesView.prototype = Object.create(View.prototype);
    PassesView.prototype.constructor = PassesView;

    //######## -- MAIN LAYOUT -- ########

    function _createLayout() {

      this.layoutNode = new RenderNode();

      this.passesViewBackground = new Surface({
          size:[undefined,window.innerHeight],
          properties:{
              backgroundColor:'black'
          }
      });

      this.layout = new HeaderFooter({
        headerSize: 75,
        footerSize: 0
      });

      this.layoutModifier = new StateModifier({
//        transform: Transform.translate(0, window.innerHeight, 21)
        // transform: Transform.translate(0, 0, 0.1)
      });

      this.add(this.layoutModifier).add(this.layoutNode);
      this.layoutNode.add(this.layout);
      this.layoutNode.add(this.passesViewBackground)
    }

    //########### --- MAIN LAYOUT END --- ########

    //########### --- HEADER BEGIN --- ############

      function _createHeader() {
        this.headerBackgroundSurface = new ContainerSurface({
          classes: ["overview-header-passes"],
          size:[undefined,75],
          properties: {
            backgroundColor: "black",
            color: "white"
          }

        });

        this.headerBackgroundSurfaceMod = new Modifier({
            transform:Transform.translate(0,0,40)
        });

        //creates hamburger icon
        this.hamburgerSurface = new Surface({
          size: [true, true],
          content: '<img width="20" src="src/img/menu-icon.png"/>'
        });

        //creates hamburger icon modifier
        this.hamburgerModifier = new Modifier({
          origin: [0.1, 0.5]
        });

        //adds my passes text to header
        this.myPassesSurface = new Surface({
          size: [true, true],
          content: '<div class="city_name">My Passes</div>',
          properties: {
            color: "white",
            zIndex: 1000000
          }
        });

        this.myPassesModifier = new Modifier({
          origin: [0.5,0.5]
        });

        this.layout.header.add(this.headerBackgroundSurfaceMod).add(this.headerBackgroundSurface);
        this.headerBackgroundSurface.add(this.hamburgerModifier).add(this.hamburgerSurface);
        this.headerBackgroundSurface.add(this.myPassesModifier).add(this.myPassesSurface);
      }

      //##################-- END OF HEADER ---#################

      function _createBody() {
        this.passScrollView = new Scrollview();

        this.windowWidth = window.innerWidth;
        this.windowHeight = window.innerHeight;

        this.passScrollViewMod = new StateModifier({
          transform: Transform.translate(0,0,1)
        });

        var backModifier = new StateModifier({
          transform: Transform.behind
        });

        this.surfaces = [];

        this.passScrollView.sequenceFrom(this.surfaces);

        //push pass objects into an array
        FirebaseRef.chatRef.child('passes').child(FirebaseRef.user.id).limit(100).on('child_added', function(snapshot) {this.addPassesItem(snapshot.val())}.bind(this));

        //loop that calls each panel of passScrollView

        this.layout.content.add(this.passScrollViewMod).add(this.passScrollView);

      }

      function _setListeners() {

      }

      function _setupEvents(){
          this.hamburgerSurface.on('click',function(){
              this._eventOutput.emit('menuToggle');
          }.bind(this))
      }

    PassesView.prototype.addPassesItem = function(item){
        var passView = new PurchasedPassView({
            gymName: item.gymName,
            numDays: item.numDays,
            price: item.price,
            numPasses: item.numPasses,
            userID: item.userID
        });

        this._eventInput.pipe(passView);

        passView.pipe(this.passScrollView); // scrolling

        passView.pipe(this._eventOutput); // dragging

        this.surfaces.push(passView);
    };


  module.exports = PassesView;
});