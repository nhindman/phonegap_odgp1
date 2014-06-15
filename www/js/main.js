/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
// var app = {
//     // Application Constructor
//     initialize: function() {
//         this.bindEvents();
//     },
//     // Bind Event Listeners
//     //
//     // Bind any events that are required on startup. Common events are:
//     // 'load', 'deviceready', 'offline', and 'online'.
//     bindEvents: function() {
//         document.addEventListener('deviceready', this.onDeviceReady, false);
//     },
//     // deviceready Event Handler
//     //
//     // The scope of 'this' is the event. In order to call the 'receivedEvent'
//     // function, we must explicity call 'app.receivedEvent(...);'
//     onDeviceReady: function() {
//         app.receivedEvent('deviceready');
//     },
//     // Update DOM on a Received Event
//     receivedEvent: function(id) {
//         var parentElement = document.getElementById(id);
//         var listeningElement = parentElement.querySelector('.listening');
//         var receivedElement = parentElement.querySelector('.received');

//         listeningElement.setAttribute('style', 'display:none;');
//         receivedElement.setAttribute('style', 'display:block;');

//         console.log('Received Event: ' + id);
//     }
// };

// app.initialize();

define(function(require, exports, module) {
  var AppView = require('examples/views/Scrollview/AppView');
  var Engine = require('famous/core/Engine');
  var GymData = require('examples/data/GymData');
  var Modifier = require('famous/core/Modifier');
  var Surface = require('famous/core/Surface');
  var EventHandler = require('famous/core/EventHandler');
  var Transform = require('famous/core/Transform');

  var mainContext = Engine.createContext();

  initApp(GymData());

  function initApp(data) {
    data = GymData();

    var options = {
        transition:{duration:450}
    }

    this._eventInput = new EventHandler();
    this._eventOutput = new EventHandler();
    EventHandler.setInputHandler(this, this._eventInput);
    EventHandler.setOutputHandler(this, this._eventOutput);

    var appViewMod = new Modifier();

    var appView = new AppView({ 
      data: data
    });
    appView._eventInput.pipe(this._eventOutput);

    var appViewBackground = new Surface({
      // size: (undefined, undefined),
      properties: {
        backgroundColor: "black"
      }
    });

    //LoginPrompt page events
    this._eventOutput.on('closeLogin',function(transition){
      console.log('close login main')
      moveDown(transition)
    });
    this._eventOutput.on('userLogin',function(){
      console.log('user login main')
      moveUp()
    });
    this._eventOutput.on('ticketPurchased',function(){
      console.log('user login main')
      moveDown({duration:0})
    });
    this._eventOutput.on('pass closed',function(){
      console.log('pass closed')
      moveDown({duration:0})
    });

    //RegisterView events
//    this._eventOutput.on('RegisterClose',function(){
//      console.log('close register')
//      moveDown()
//    });
//    this._eventOutput.on('RegisterOpen',function(){
//      console.log('user login main')
//      moveUp()
//    });

    function moveUp(){
        console.log('moveup')
        appViewMod.setTransform(Transform.translate(0,-window.innerHeight,0), options.transition)
    }

    function moveDown(transition){
        console.log('movedown')
        appViewMod.setTransform(Transform.translate(0,0,0), transition || options.transition)
    }

    mainContext.add(appViewMod).add(appView).add(appViewBackground);
  }

});


