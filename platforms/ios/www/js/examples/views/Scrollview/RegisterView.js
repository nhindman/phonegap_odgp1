var BASE_URL = 'https://burning-fire-4148.firebaseio.com';
var chatRef = new Firebase(BASE_URL);

define(function(require, exports, module) {
    var Surface = require("famous/core/Surface");
    var RenderNode = require("famous/core/RenderNode");
    var View = require('famous/core/View');
    var Modifier = require('famous/core/Modifier');
    var Transform = require('famous/core/Transform');
    var StateModifier = require('famous/modifiers/StateModifier');
    var Easing = require('famous/transitions/Easing');
    var HeaderFooterLayout = require('famous/views/HeaderFooterLayout');
    var ContainerSurface = require('famous/surfaces/ContainerSurface');
    var InputSurface = require('famous/surfaces/InputSurface');

    var FirebaseRef = require('examples/views/Scrollview/firebaseRef');

    function RegisterView(options, data) {
        View.apply(this, arguments);

        _createLayout.call(this);
        _createHeader.call(this);
        _createBody.call(this);
        _createListeners.call(this);
    }

    RegisterView.prototype = Object.create(View.prototype);
    RegisterView.prototype.constructor = RegisterView;

    var windowWidth = window.innerWidth;

    RegisterView.DEFAULT_OPTIONS = {
        size: [windowWidth, undefined],
        data: undefined, 
        headerSize: 75,
        posThreshold: window.innerHeight/2.2,
        velThreshold: 0.75,
        transition: {
          duration: 270
        }
    };

    function _createLayout(){
        this.layoutNode = new RenderNode();

        this.layout = new HeaderFooterLayout({
          headerSize: this.options.headerSize
        });

        this.layoutModifier = new StateModifier({
            transform: Transform.translate(0, window.innerHeight-75, 21),
            size:[window.innerWidth, window.innerHeight]
        });

        this.add(this.layoutModifier).add(this.layoutNode);
        this.layoutNode.add(this.layout);
    }

    //########### --- HEADER --- ############

    function _createHeader(){
        this.headerBackground = new ContainerSurface({
            classes: ["register-header"],
            size: [undefined, 75], 
            properties: {
                backgroundColor: 'black',
                color: 'white'
            }
        });

        this.arrowSurface = new Surface({
          size: [50, 30],
          properties: { 
            textAlign: "center",
            zIndex: 23
          },
          content: '<img width="22.5" src="src/img/best-arrow.png"/>'
        });

        this.arrowModifier = new Modifier({
          origin: [0, 0.6]
        });

        this.arrowSensor = new Surface({
          size: [50, true],
          properties: { 
            textAlign: "center",
            zIndex: "5"
          }
        });

        this.arrowSensorModifier = new Modifier({
          origin: [0.07, 0.65]
          // align: [0.5, 0.50]
        });

        this.register = new Surface({
            classes: ["join-text"],
            content: '<div>Register</div>',
            size: [true, true], 
            properties: {
                fontColor: "white",
            }
        });

        this.registerMod = new StateModifier({
            origin: [0.5,0.5]
        });

        this.closeIcon = new Surface({
            content: '<img width="33" src="src/img/white-x.png"/>',
            size: [true, true]
        });

        this.closeIconModifier = new StateModifier({
            origin: [0.937,0.66]
        });

        this.headerBackground.add(this.arrowModifier).add(this.arrowSurface);
        this.headerBackground.add(this.closeIconModifier).add(this.closeIcon);
        this.headerBackground.add(this.registerMod).add(this.register);
        this.layout.header.add(this.headerMod).add(this.headerBackground);
        
        //click on closeIcon closes the register page
        this.closeIcon.on('click', function(e){
            if(e.detail != null) return false;
            this._eventOutput.emit('RegisterClose')
        }.bind(this));    

    };

    //##################-- END OF HEADER ---#################

    //###################------BODY-----#####################
    function _createBody() {
        this.bodyBackground = new ContainerSurface({
            classes: ["register-body"],
            size: [undefined, undefined], 
            properties: {
                backgroundColor: 'black',
                color: 'white'
            }
        });

        this.bodyBackgroundMod = new Modifier({
            transform: Transform.translate(0,0,60)
        })

        var circleWidth = window.innerWidth/5;
        var circleHeight = window.innerHeight/10;

        this.circle = new ContainerSurface({
            classes: ["register-circle"], 
            size: [circleWidth, circleWidth], 
            properties: {
                backgroundColor: "white", 
                borderRadius: "30px"
            }
        })

        this.circleMod = new Modifier({
            transform: Transform.translate(0,0,61), 
            origin: [0.5, 0]
        })

        var rectangleHeight = window.innerHeight/5.7;
        this.rectangle = new ContainerSurface({
            classes: ["register-rectangle"], 
            size: [undefined, rectangleHeight], 
            properties: {
                backgroundColor: "white"
            }
        })

        this.rectangleMod = new Modifier({
            transform: Transform.translate(0,0,61), 
            origin: [0.5, 0.3]
        })
        var emailandpwwidth = window.innerWidth/1.2
        this.email = new InputSurface({
            classes: ["email", "email-input"],
            content: "",
            size: [emailandpwwidth, rectangleHeight/2.8],
            placeholder:"Email",
            properties: {
                backgroundColor: "white", 
                color: "black", 
                textAlign: "left"
            }
        });


        this.emailMod = new Modifier({
            transform: Transform.translate(0,0,100000), 
            origin: [0.35, 0.168]
        })

        this.firstX = new Surface({
            classes: ['email-validation-ind'],
            content: '<img width="33" src="src/img/red-x.png"/>', 
            properties: {
                backgroundColor: 'white'
            }, 
            size: [50,50]
        })

        this.firstXMod = new Modifier({
            transform: Transform.translate(0,0,110001),
            origin: [0.99,0.1]
        })

        this.secondX = new Surface({
            classes: ['password-validation-ind'],
            content: '<img width="33" src="src/img/red-x.png"/>', 
            properties: {
                backgroundColor: 'white'
            },
            size: [50,41.5]
        })

        this.secondXMod = new Modifier({
            transform: Transform.translate(0,0,110001),
            origin:[0.99,1]
        })

        this.password = new InputSurface({
            classes: ["password", "password-input"],
            content: "",
            size: [emailandpwwidth, rectangleHeight/2.8],
            placeholder:"Password",
            type:"password",
            properties: {
                backgroundColor: "white", 
                color: "black", 
                textAlign: "left"
            }
        });

        this.passwordMod = new Modifier({
            transform: Transform.translate(0,0,100000), 
            origin: [0.362, .836]
        })

        this.separator = new Surface({
            classes: ["input-separator"], 
            size: [emailandpwwidth, .5], 
            properties: {
                backgroundColor: "rgb(201,201,201)" 
            }
        })

        this.separatorMod = new Modifier({
            transform: Transform.translate(0,0,110001),
            origin: [0.5, 0.5]
        })

        //#######-- sign up button --#######
        this.buttonWidth = window.innerWidth - (window.innerWidth/6.5);
        this.buttonHeight = window.innerHeight/12;

        this.buttonSurface = new Surface({
            size: [this.buttonWidth, this.buttonHeight],
            classes: ["signup-button-surface"],
            content: '<div>Sign Up</div>',
            properties: {
                border: "solid 1px white", 
                borderRadius: "5px", 
                color: "white", 
                textAlign: "center",
                lineHeight: this.buttonHeight +'px',
            }
        });

        this.buttonMod = new Modifier({
            origin: [0.5, 0.52],
            transform: Transform.translate(0, 0, 110001)
        });

        //click on sign up button
        this.buttonSurface.on('click', function(e){
            if(e.detail != null) return false;
            

            var email = $('.email-input').val();
            var password = $('.password-input').val();

            FirebaseRef.auth.createUser(email, password, function(error, user) {  
              console.log("logging new registered user");
              if(error){
                console.log('error creating user', error);
              } else if (user){
                var users = chatRef.child('users');
                users.set({
                    email: email,
                    password: password,
                    createdAt: new Date().toString()
                });
                doLogin(email, password);
              }
                
            });

            var self = this;
            function doLogin(email, password){
                console.log("DO LOGIN")
                FirebaseRef.auth.login('password', {
                    email: email, 
                    password: password    
                });
                self._eventOutput.emit('validated user from register');
            };

        }.bind(this));

        //TERMS AND CONDITIONS
        this.TCMessage = new Surface({
            classes: ["TC-message"], 
            size: [true, true], 
            content: '<div class="T-and-C"><span class="register_using">Find our</span> <span class="">T&Cs</span> <span class="register_using">and</span> <span class="">Privacy Policy</span> <span class="register_using">here</span></div>',
            properties: {
                backgroundColor: "black", 
                color: "white", 
                textAlign: "center", 
                fontSize: "81%"
            }
        });

        this.TCMessageMod = new StateModifier({
            origin: [0.5, 0.63], 
            transform: Transform.translate(0, 0, 110001)
        });

        this.arrowSurface.on('click', function() {
            console.log('arrow surface clicked')
            this._eventOutput.emit('RegisterBack');
        }.bind(this));

        this.rectangle.add(this.emailMod).add(this.email);
        this.rectangle.add(this.firstXMod).add(this.firstX);
        this.rectangle.add(this.separatorMod).add(this.separator);
        this.rectangle.add(this.passwordMod).add(this.password);
        this.rectangle.add(this.secondXMod).add(this.secondX);
        this.bodyBackground.add(this.buttonMod).add(this.buttonSurface);
        this.bodyBackground.add(this.circleMod).add(this.circle);
        this.bodyBackground.add(this.rectangleMod).add(this.rectangle);
        this.bodyBackground.add(this.TCMessageMod).add(this.TCMessage);
        this.layout.content.add(this.bodyBackgroundMod).add(this.bodyBackground);
        
        // email and password validation
        this.email.on('keyup', function(e){
            if(/^[a-zA-Z_][a-zA-Z0-9._\-+]*@([a-zA-Z0-9_\-]+.)+[a-zA-Z]+$/.test(this.getValue())){
                $('.email-validation-ind img').attr('src', 'src/img/check-mark.png');
            }else{
                $('.email-validation-ind img').attr('src', 'src/img/red-x.png');
            }
        });

        this.password.on('keyup', function(e){
            if(this.getValue().length>5){
                $('.password-validation-ind img').attr('src', 'src/img/check-mark.png');
            }else{
                $('.password-validation-ind img').attr('src', 'src/img/red-x.png');
            }
        });
    };

    //############## -- END OF BODY -- #######################


    function _createListeners() {

    }

   RegisterView.prototype.moveUp = function(){
        this.layoutModifier.setTransform(
            Transform.translate(0, -75, 21),
            this.options.transition
        )
    };

    RegisterView.prototype.moveDown = function(){
        this.layoutModifier.setTransform(
            Transform.translate(0, window.innerHeight - 75, 21),
            this.options.transition
        )
    };

    module.exports = RegisterView;
});