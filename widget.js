/* global requirejs cprequire cpdefine chilipeppr THREE */
// Defining the globals above helps Cloud9 not show warnings for those variables

// ChiliPeppr Widget/Element Javascript

requirejs.config({
    /*
    Dependencies can be defined here. ChiliPeppr uses require.js so
    please refer to http://requirejs.org/docs/api.html for info.
    
    Most widgets will not need to define Javascript dependencies.
    
    Make sure all URLs are https and http accessible. Try to use URLs
    that start with // rather than http:// or https:// so they simply
    use whatever method the main page uses.
    
    Also, please make sure you are not loading dependencies from different
    URLs that other widgets may already load like jquery, bootstrap,
    three.js, etc.
    
    You may slingshot content through ChiliPeppr's proxy URL if you desire
    to enable SSL for non-SSL URL's. ChiliPeppr's SSL URL is
    https://i2dcui.appspot.com which is the SSL equivalent for
    http://chilipeppr.com
    */
    paths: {
        // Example of how to define the key (you make up the key) and the URL
        // Make sure you DO NOT put the .js at the end of the URL
        // SmoothieCharts: '//smoothiecharts.org/smoothie',
    },
    shim: {
        // See require.js docs for how to define dependencies that
        // should be loaded before your script/widget.
    }
});

cprequire_test(["inline:com-chilipeppr-widget-xbox-robot"], function(myWidget) {

    // Test this element. This code is auto-removed by the chilipeppr.load()
    // when using this widget in production. So use the cpquire_test to do things
    // you only want to have happen during testing, like loading other widgets or
    // doing unit tests. Don't remove end_test at the end or auto-remove will fail.

    // Please note that if you are working on multiple widgets at the same time
    // you may need to use the ?forcerefresh=true technique in the URL of
    // your test widget to force the underlying chilipeppr.load() statements
    // to referesh the cache. For example, if you are working on an Add-On
    // widget to the Eagle BRD widget, but also working on the Eagle BRD widget
    // at the same time you will have to make ample use of this technique to
    // get changes to load correctly. If you keep wondering why you're not seeing
    // your changes, try ?forcerefresh=true as a get parameter in your URL.

    console.log("test running of " + myWidget.id);

    $('body').prepend('<div id="testDivForFlashMessageWidget"></div>');

    chilipeppr.load(
        "#testDivForFlashMessageWidget",
        "http://raw.githubusercontent.com/chilipeppr/element-flash/master/auto-generated-widget.html",
        function() {
            console.log("mycallback got called after loading flash msg module");
            cprequire(["inline:com-chilipeppr-elem-flashmsg"], function(fm) {
                //console.log("inside require of " + fm.id);
                fm.init();
            });
        }
    );

    // init my widget
    myWidget.init();
    $('#' + myWidget.id).css('margin', '20px');
    $('title').html(myWidget.name);

} /*end_test*/ );

// This is the main definition of your widget. Give it a unique name.
cpdefine("inline:com-chilipeppr-widget-xbox-robot", ["chilipeppr_ready", /* other dependencies here */ ], function() {
    return {
        /**
         * The ID of the widget. You must define this and make it unique.
         */
        id: "com-chilipeppr-widget-xbox-robot", // Make the id the same as the cpdefine id
        name: "Widget / Xbox Robot", // The descriptive name of your widget.
        desc: "This widget lets you control ChiliPeppr from an Xbox controller.", // A description of what your widget does
        url: "(auto fill by runme.js)",       // The final URL of the working widget as a single HTML file with CSS and Javascript inlined. You can let runme.js auto fill this if you are using Cloud9.
        fiddleurl: "(auto fill by runme.js)", // The edit URL. This can be auto-filled by runme.js in Cloud9 if you'd like, or just define it on your own to help people know where they can edit/fork your widget
        githuburl: "(auto fill by runme.js)", // The backing github repo
        testurl: "(auto fill by runme.js)",   // The standalone working widget so can view it working by itself
        /**
         * Define pubsub signals below. These are basically ChiliPeppr's event system.
         * ChiliPeppr uses amplify.js's pubsub system so please refer to docs at
         * http://amplifyjs.com/api/pubsub/
         */
        /**
         * Define the publish signals that this widget/element owns or defines so that
         * other widgets know how to subscribe to them and what they do.
         */
        publish: {
            // Define a key:value pair here as strings to document what signals you publish.
            '/onXboxControllerConnected': 'This signal gets published when an XBox controller is found. Payload is the Gamepad() object.',
            '/onXboxControllerDisconnected': 'This signal gets published when an XBox controller is disconnected. Payload is the Gamepad() object.',
        },
        /**
         * Define the subscribe signals that this widget/element owns or defines so that
         * other widgets know how to subscribe to them and what they do.
         */
        subscribe: {
            // Define a key:value pair here as strings to document what signals you subscribe to
            // so other widgets can publish to this widget to have it do something.
            // '/onExampleConsume': 'Example: This widget subscribe to this signal so other widgets can send to us and we'll do something with it.'
        },
        /**
         * Document the foreign publish signals, i.e. signals owned by other widgets
         * or elements, that this widget/element publishes to.
         */
        foreignPublish: {
            // Define a key:value pair here as strings to document what signals you publish to
            // that are owned by foreign/other widgets.
            // '/jsonSend': 'Example: We send Gcode to the serial port widget to do stuff with the CNC controller.'
            '/com-chilipeppr-elem-flashmsg/flashmsg': 'Used to notify the operator of certain events.',
            '/com-chilipeppr-widget-serialport/jsonSend': 'Used to send Gcode to the controller.',
            '/com-chilipeppr-widget-serialport/send': 'Used to send Gcode to the controller.'
            
        },
        /**
         * Document the foreign subscribe signals, i.e. signals owned by other widgets
         * or elements, that this widget/element subscribes to.
         */
        foreignSubscribe: {
            // Define a key:value pair here as strings to document what signals you subscribe to
            // that are owned by foreign/other widgets.
            // '/com-chilipeppr-elem-dragdrop/ondropped': 'Example: We subscribe to this signal at a higher priority to intercept the signal. We do not let it propagate by returning false.'
            '/com-chilipeppr-interface-cnccontroller/plannerpause': 'Subscribed to be notified when the planner buffer is fill so we can stop sending jog commands.',
            '/com-chilipeppr-interface-cnccontroller/plannerresume': 'Subscribed to be notified when the planner buffer has room for more jog commands.'
        },
        /**
         * All widgets should have an init method. It should be run by the
         * instantiating code like a workspace or a different widget.
         */
        init: function() {
            console.log("I am being initted. Thanks.");

            this.setupUiFromLocalStorage();
            this.btnSetup();
            this.forkSetup();
            
            this.setupRefreshBtn();
            this.setupGamepad();
            this.setupBody();
            
            chilipeppr.subscribe("/com-chilipeppr-interface-cnccontroller/plannerpause", this, this.onPlannerPause);
            chilipeppr.subscribe("/com-chilipeppr-interface-cnccontroller/plannerresume", this, this.onPlannerResume);

            console.log("I am done being initted.");
        },
        // Will contain button action element for easy referral
        elAction: null,
        // Setup the refresh capabilities
        setupRefreshBtn: function() {
            $(".xboxrefresh").click(this.onGamepadRefresh.bind(this)); 
            
            this.elAction = $("#" + this.id + " .actionname");

            chilipeppr.subscribe('/com-chilipeppr-xbox-robot/onXboxControllerConnected', this, this.onXboxConnect);
            chilipeppr.subscribe('/com-chilipeppr-xbox-robot/onXboxControllerDisconnected', this, this.onXboxDisconnect);
        },
        /**
         * This is called to rescan for Gamepad devices.
         */
        onGamepadRefresh: function() {
            this.setupGamepad();
            console.log("done refreshing. this.gamepad:", this.gamepad, "this.gamepad.gamepads:", this.gamepad.gamepads);
            
            // we will get a callback from /onXboxControllerConnected
        },
        onXboxConnect: function(device) {
            console.log("got onXboxConnect event. device:", device, "index:", device.index);
            this.gamepadDevice = device;
            this.gamepadIndex = device.index;
            $("#" + this.id + " .nodevice").addClass("hidden");
            var desc = device.id + " " + 
                " Index: " + device.index + 
                " Buttons: " + device.buttons.length +
                " Axes: " + device.axes.length;
            if (device.vibrationActuator && device.vibrationActuator.type) {
                desc + " Vibration: Yes";
            }
            $("#" + this.id + " .devicename").removeClass("hidden").text(desc);
            
            // do some stuff for the workspace to show this widget automatically
		    if ($('#com-chilipeppr-ws-xbox').hasClass("hidden")) {
		        console.log("trying to show XBox widget in workspace");
                $('#com-chilipeppr-ws-xbox').removeClass("hidden");
                $('#com-chilipeppr-ws-menu .xbox-button').addClass("active");
            }

        },
        onXboxDisconnect: function(device) {
            console.log("got onXboxDisconnect event. device:", device);
        },
        // Show the action
        showAction: function(txt) {
            this.elAction.text(txt);
            this.elAction.removeClass("hidden");
        },
        // map number range to another range
        scale: function(num, in_min, in_max, out_min, out_max) {
          return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
        },
        mapJoystickToHz: function(joystickVal) {
            
            // see if negative, if so take abs val, then make negative at end
            var isNegative = false;
            if (joystickVal < 0) {
                isNegative = true;
                joystickVal = joystickVal * -1;
            }
            
            var val = Math.round( this.scale(joystickVal, 0.2, 1.0, this.jogHzMin, this.jogHzMax) / 10 ) * 10;   
            
            if (isNegative) val = val * -1;
            
            return val;
        },
        // bool to keep track of whether jogging or not on wrist 3
        isJogStartedWrist3: false,
        // debounce counter to not start too fast after a stop
        jogTsWrist3: 0,
        // max Hz to jog
        jogHzMax: 500,
        // min Hz to jog
        jogHzMin: 2,
        // last freq we sent, so can debounce sending redundant freq
        jogLastFreqWrist3: 0,
        // Jog Wrist3
        jogAxisChangedWrist3: function(e) {
            
            // check for too fast on this call to debounce
            // cuz joystick seems to flick around and we can't pound the
            // ESP32
            if (Date.now() - this.jogTsWrist3 < 500) { // 0.5 sec 
                // console.log("debounced");
                return;
            }
            
            // drop anything inside of the deadzone
            var deadZone = this.options.Deadzone / 100;
                    
            var val = Math.abs(e.value);
            // console.log("val: ", val, "deadZone:", deadZone);
            if (val < deadZone) {
                console.log("dropped cuz in deadZone");
                return;
            }
            
            this.jogTsWrist3 = Date.now();

            // console.log("got jogWrist3. e:", e);
            
            var freq = this.mapJoystickToHz(e.value);
            
            if (this.isJogStartedWrist3) {
                // we would get here when we've already started jogging
                // but are changing frequency
                if (this.jogLastFreqWrist3 == freq) {
                    // console.log("freq same as last time: ", freq);
                    return;
                }
                this.jogLastFreqWrist3 = freq;
                this.showAction("Wrist3: Changed jog freq to " + freq);
                console.log("changing freq:", freq, "e:", e);
                
                // Send off to ESP32 device
                chilipeppr.publish("/com-chilipeppr-widget-cayenn/sendToDeviceNameViaTcp", "Wrist3", {Cmd:"JogFreq", Freq:freq} );

            } else {
                // jogging has not started. 
                
                // start it.
                // freq = 10;
                this.showAction("Wrist3: Started jog at freq " + freq);
                console.log("starting jog. freq:", freq, "e:", e);
                
                // Send off to ESP32 device
                chilipeppr.publish("/com-chilipeppr-widget-cayenn/sendToDeviceNameViaTcp", "Wrist3", {Cmd:"JogStart", Freq:freq} );
                
                this.isJogStartedWrist3 = true;
                this.jogLastFreqWrist3 = freq;
            }
            

        },
        // Start Wrist3 jog
        jogTickWrist3: function(gamepads) {
            
            // if jog isn't started, just ignore this function call
            // cuz we get it 60 times per second
            if (this.isJogStartedWrist3) {
                // console.log("wrist3 tick. gamepads:", gamepads);
                
                if (gamepads && gamepads.length > 0) {
                    // console.log("wrist3. got gamepads:", gamepads);
                    
                    var deadZone = this.options.Deadzone / 100;
                    
                    var val = Math.abs(gamepads[this.gamepadIndex].state['RIGHT_STICK_Y']);
                    // console.log("val: ", val, "deadZone:", deadZone);
                    if (val < deadZone) {
                        // joystick back to center, so stop jogging
                        console.log("stopping jog. val:", val, "deadZone:", deadZone);
                        this.showAction("Wrist3: Stopped jogging");
                        
                        // Send off to ESP32 device
                        chilipeppr.publish("/com-chilipeppr-widget-cayenn/sendToDeviceNameViaTcp", "Wrist3", {Cmd:"JogStop"} );
                        
                        this.isJogStartedWrist3 = false;
                        this.jogTsWrist3 = Date.now() + 500; // so we can debounce. add extra 500ms
                    }
                }
            }
            
        },
        // Stop Wrist3 jog
        jogStopWrist3: function() {
            
        },
        // Increment Wrist3 jog
        jogChangeWrist3: function(val) {
            
        },
        /**
         * Keep track of whether we sent flood/coolant on or off last time
         */
        lastCoolantCmd: "",
        lastSpindleCmd: "",
        /**
         * This object holds the Gamepad library from https://github.com/kallaspriit/HTML5-JavaScript-Gamepad-Controller-Library
         */
        Gamepad: null, // library
        /**
         * This object holds the instance of Gamepad library in a usable object.
         */
        gamepad: null, // instance
        isGamepadFail: false,
        gamepadDevice: null, // contains the 1 xbox controller we're using
        gamepadIndex: null, // contains index of gamepadDevice
        /**
         * This method sets up the events we bind to for receiving incoming actions from the 
         * Xbox controller.
         */
         
        joggingEnabled: true,
        jogStarted: false,
        zjogStarted: false,
        gpIndex: 0,
         
        setupGamepad: function() {
            
            // We used code from https://github.com/kallaspriit/HTML5-JavaScript-Gamepad-Controller-Library
            
            // This gets up the library object
            this.Gamepad = new this.initGamepadLibrary();
            console.log("Gamepad:", this.Gamepad);
            // This instantiates a usable object
            this.gamepad = new this.Gamepad();
            console.log("gamepad:", this.gamepad);
            
            // Create convenience variables
            var Gamepad = this.Gamepad;
            var gamepad = this.gamepad;
            
            // Keep reference to main "this" object so we can reference inside inner functions
            var that = this;
            
            // Attach to events
            var lastTimestamp = 0; // debounce this by timestamp length
            gamepad.bind(Gamepad.Event.CONNECTED, function(device) {
                // if we got this event too recently, just ignore
                if (lastTimestamp == 0 || device.timestamp > lastTimestamp + 1000 * 60 * 1) { // 1 minute
                    
                    lastTimestamp = Date.now();
                    
            		// a new gamepad connected
            		console.log("new gamepad connected. device:", device);
            		if (device.id.match(/xbox/i)) {
            		  //  console.log("found xbox controller;");
            		  //  chilipeppr.publish('/com-chilipeppr-elem-flashmsg/flashmsg', 
            		  //  "Xbox Controller Found", "Device: " + device.index, 500, false); 
                        chilipeppr.publish('/com-chilipeppr-xbox-robot/onXboxControllerConnected', device);
            		}
            		
                }
        	});
        
        	gamepad.bind(Gamepad.Event.DISCONNECTED, function(device) {
        	    
        	    if (lastTimestamp == 0 || device.timestamp > lastTimestamp + 1000 * 60 * 1) {
                    
                    lastTimestamp = Date.now()
                    
            		// gamepad disconnected, hide the widget
            		console.log("gamepad disconnected. device:", device);
        		    if (!$('#com-chilipeppr-ws-xbox').hasClass("hidden")) {
                        $('#com-chilipeppr-ws-xbox').addClass("hidden");
                        $('#com-chilipeppr-ws-menu .xbox-button').removeClass("active");
                    }
                    chilipeppr.publish('/com-chilipeppr-xbox-robot/onXboxControllerDisconnected', device);
        	
        	    }
        	        
    	    });
        
        	gamepad.bind(Gamepad.Event.UNSUPPORTED, function(device) {
        		// an unsupported gamepad connected (add new mapping)
        		console.log("an unsupported gamepad connected (add new mapping). device:", device);
        	});
        
        	gamepad.bind(Gamepad.Event.BUTTON_DOWN, function(e) {
        		// e.control of gamepad e.gamepad pressed down
        		console.log("e.control of gamepad e.gamepad pressed down. e:", e);
        		
        		that.showAction("Button " + e.control);
        		
        		switch (e.control) {
        		    case 'FACE_1':
        		        // Got A button for z probing
        		        if ($('#com-chilipeppr-ws-touchplate').hasClass('hidden')) {
        		            $('#com-chilipeppr-ws-menu .touchplate-button').click();
        		        } else {
        		            // chilipeppr.publish('/com-chilipeppr-widget-touchplate/probe', "");
        		            $('#com-chilipeppr-widget-touchplate .btn-touchplaterun').click();
        		        }
                        break;
        		    case 'FACE_2':
        		        // Got B button for Feedhold
        			    that.sendGcode("!");
        		        break;
        		    case 'FACE_3':
        		        // Got X button for spindle toggle
            			// See what we sent last time and send other cmd
            			if (that.lastSpindleCmd == "M5") {
            				that.sendGcode("M3 S" + that.options.RPM);
            				that.lastSpindleCmd = "M3";
            			} else {
            				that.sendGcode("M5");
            				that.lastSpindleCmd = "M5";
            			}
        		        break;
        		    case 'FACE_4':
        		        // Got Y button for coolant toggle
            			// See what we sent last time and send other cmd
            			if (that.lastCoolantCmd == "M7") {
            				that.sendGcode("M9");
            				that.lastCoolantCmd = "M9";
            			} else {
            				that.sendGcode("M7");
            				that.lastCoolantCmd = "M7";
            			}
        		        break;
        		    case 'DPAD_UP':
        			    that.sendGcode("G91 G1 F" + that.options.RateXY + " Y" + (that.options.IncJog * 0.1) );
        			    that.sendGcode("G90");
        		        break;
        		    case 'DPAD_DOWN':
        		        that.sendGcode("G91 G1 F" + that.options.RateXY + " Y" + (that.options.IncJog * -0.1) );
        			    that.sendGcode("G90");
        		        break;
        		    case 'DPAD_LEFT':
        		        that.sendGcode("G91 G1 F" + that.options.RateXY + " X" + (that.options.IncJog * -0.1) );
        			    that.sendGcode("G90");
        		        break;
        		    case 'DPAD_RIGHT':
        		        that.sendGcode("G91 G1 F" + that.options.RateXY + " X" + (that.options.IncJog * 0.1) );
        			    that.sendGcode("G90");
        		        break;
        		    case 'START_FORWARD':
        		        chilipeppr.publish('/com-chilipeppr-widget-gcode/play', "");
        		        break;
        		    case 'SELECT_BACK':
        		        // Got start button.  enable/disable stick jogging
        		        that.joggingEnabled = !that.joggingEnabled;
        		        chilipeppr.publish('/com-chilipeppr-elem-flashmsg/flashmsg', 
        		            "Xbox Controller Button Down", "Toggle Jog Enable: " + that.joggingEnabled, 500, true);
        		        break;
        		  //  default:
        		      //  chilipeppr.publish('/com-chilipeppr-elem-flashmsg/flashmsg', 
        		      //      "Xbox Controller Button Down", "Control: " + e.control, 500, true);
        		}    
        	});
        	
        	gamepad.bind(Gamepad.Event.BUTTON_UP, function(e) {
        		// e.control of gamepad e.gamepad released
        		//console.log(" e.control of gamepad e.gamepad released. e:", e);
        	});
        
        	gamepad.bind(Gamepad.Event.AXIS_CHANGED, function(e) {
        		// e.axis changed to value e.value for gamepad e.gamepad
        		var deadZone = that.options.Deadzone / 100;
        		
        		if (e.axis.includes('LEFT_STICK') && Math.abs(e.value) > (deadZone + 0.1) && that.joggingEnabled && !that.zjogStarted && !that.jogStarted) {
        		    console.log('Start Jog');
        		    that.jogStarted = true;
        		    that.gpIndex = e.gamepad.index;
        		} else if (e.axis == "RIGHT_STICK_Y") { // ( (e.axis = 'RIGHT_STICK_Y') && Math.abs(e.value) > (deadZone + 0.1) && that.joggingEnabled && !that.zjogStarted && !that.jogStarted) {
        		    that.jogAxisChangedWrist3(e);
        		  //  console.log('Start zJog');
        		  //  that.zjogStarted = true;
        		  //  that.gpIndex = e.gamepad.index;
        		}
        	});
        
            slowDown: 0;  //60hz is just too fast
	        gamepad.bind(Gamepad.Event.TICK, function(gamepads) {
	            
	            // console.log("got tick. gamepads:", gamepads);
	            that.jogTickWrist3(gamepads);
	            return;
	            
	        	// gamepads were updated (around 60 times a second)
	        	var deadZone = that.options.Deadzone / 100;
	        	
	        	if (that.jogStarted) {
	        	    if (Math.abs(gamepads[that.gpIndex].state['LEFT_STICK_X']) < deadZone && Math.abs(gamepads[that.gpIndex].state['LEFT_STICK_Y']) < deadZone) {
	        	        console.log('Stop Jog');
	        	        that.jogStarted = false;
	        	        this.slowDown = 0;
	        	        that.stickJogStop();
	        	    } else {
	        	        if (this.slowDown == 0) {
	        	            that.stickJog(gamepads[that.gpIndex].state['LEFT_STICK_X'], gamepads[that.gpIndex].state['LEFT_STICK_Y']);
	        	        }
	        	        this.slowDown = (this.slowDown > 5) ? 0 : this.slowDown + 1;
	        	    }
	        	} else if (that.zjogStarted) {
	        	    if (Math.abs(gamepads[that.gpIndex].state['RIGHT_STICK_Y']) < deadZone) {
	        	        console.log('Stop zJog');
	        	        that.zjogStarted = false;
	        	        this.slowDown = 0;
	        	        that.stickJogStop();
	        	    } else {
	        	        if (this.slowDown == 0) {
	        	            that.zstickJog(gamepads[that.gpIndex].state['RIGHT_STICK_Y']);
	        	        }
	        	        this.slowDown = (this.slowDown > 5) ? 0 : this.slowDown + 1;
	        	    }
	        	}
	        });
            
            if (!gamepad.init()) {
                this.isGamepadFail = true;
        		// Your browser does not support gamepads, get the latest Google Chrome or Firefox
        		console.log("Your browser does not support gamepads, get the latest Google Chrome or Firefox");
        	}
        },
        
        sendCtr: 0,
        isPausedByPlanner: false, // keeps track of whether we've been told to pause sending by the planner buffer
        stickJog: function(xVal, yVal) {
            //console.log(xVal + " " + yVal);
            var maxFeed = this.options.RateXY;
            var deadZone = this.options.Deadzone / 100;
            var maxDist = maxFeed / 400;
            
            if (!this.isPausedByPlanner) {
                var feedRt = Math.floor( Math.sqrt( Math.pow(xVal, 2) + Math.pow(yVal, 2) ) * maxFeed );
                var xJog = (Math.abs(xVal) > deadZone) ? ( xVal * maxDist ) : 0;
                var yJog = (Math.abs(yVal) > deadZone) ? (-1.0 * yVal * maxDist) : 0;
                
                var gcode = "G91 G1";
                gcode += " F" + feedRt;
                gcode += " X" + xJog.toFixed(3);
                gcode += " Y" + yJog.toFixed(3);
                gcode += "\nG90\n";
                var jsonSend = {
                    D: gcode,
                    Id: "jog" + this.sendCtr
                };
                
                //console.log(jsonSend);
                chilipeppr.publish("/com-chilipeppr-widget-serialport/jsonSend", jsonSend);
                this.sendCtr++;
                if (this.sendCtr > 999999) this.sendCtr = 0;
            } else {
                console.log("Skip jog send, paused by planner");
            }
        },
        zstickJog: function(zVal) {
            //console.log(xVal + " " + yVal);
            var maxFeed = this.options.RateZ;
            var maxDist = maxFeed / 400;
            
            if (!this.isPausedByPlanner) {
                var feedRt = Math.floor( Math.abs( zVal ) * maxFeed / 4 );
                var zJog = -1.0 * zVal * maxDist;  //this.maxDist / 4;
                
                var gcode = "G91 G1";
                gcode += " F" + feedRt;
                gcode += " Z" + zJog.toFixed(3);
                gcode += "\nG90\n";
                var jsonSend = {
                    D: gcode,
                    Id: "jog" + this.sendCtr
                };
                
                //console.log(jsonSend);
                chilipeppr.publish("/com-chilipeppr-widget-serialport/jsonSend", jsonSend);
                this.sendCtr++;
                if (this.sendCtr > 999999) this.sendCtr = 0;
            } else {
                console.log("Skip jog send, paused by planner");
            }
        },
        
        stickJogStop: function() {
            console.log("Send Gcode Feedhold and Flush");
            chilipeppr.publish("/com-chilipeppr-widget-serialport/send", "!\n%\n");
            setTimeout(function () {
                chilipeppr.publish("/com-chilipeppr-widget-serialport/send", "%\n");
            }, 200);
        },
        
        onPlannerPause: function () {
            console.log("xyz-onPlannerPause. being asked to pause.");
            if (!this.isPausedByPlanner) {
                this.isPausedByPlanner = true;
            } else {
                console.log("got planner pause, but we're already paused");
            }
        },
        onPlannerResume: function () {
            console.log("xyz-onPlannerResume. being asked to resume.");
            if (this.isPausedByPlanner) {
                this.isPausedByPlanner = false;
            } else {
                console.log("got planner resume, but we're already resumed which is weird.");
            }
        },
        
        /**
         * Send Gcode to the CNC controller using the awesome pubsub commands available
         * throughout the ChiliPeppr environment. Check any widget to see what pubsubs they
         * support for other widgets to publish to.
         */
        sendGcode: function(gcode) {
        	// make sure there is a newline
        	if (gcode.match(/\n$/)) {
        		// already a newline at end
        		// console.log("already has newline");
        	} else {
        		gcode += "\n";
        		// console.log("added newline");
        	}
        	chilipeppr.publish("/com-chilipeppr-widget-serialport/send", gcode);
        },
        /**
         * This method sets up the body of the widget, which at this time just allows you to
         * click the image to get a modal popup for a larger version of the image.
         */
        setupBody: function() {
        	// Make image clickable to show modal
        	var that = this;
        	
        	var mainImg = $('#' + this.id + " .panel-body img");
        	mainImg.on('click', this.onMainBodyImgClick.bind(this));
        	
            $("#com-chilipeppr-widget-xbox-robot-settings-container > .slider").each(function(){
                if ( this.id == 'com-chilipeppr-widget-xbox-robot-incjog' ) {
        	        $(this).prev('span').text( this.value / 10 )
        	    } else {
                    $(this).prev('span').text(this.value)
        	    }
            });
        	$('#com-chilipeppr-widget-xbox-robot-settings-container > .slider').on("input", function(e) {
        	    if ( e.target.id == 'com-chilipeppr-widget-xbox-robot-incjog' ) {
        	        $(e.target).prev('span').text( $(e.target).val() / 10 )
        	    } else {
                    $(e.target).prev('span').text( $(e.target).val() )
        	    }
            });
            $('#com-chilipeppr-widget-xbox-robot-settings-container > .slider').on("change", function(e) {
                that.options.Deadzone = $('#com-chilipeppr-widget-xbox-robot-deadzone').val();
                that.options.RateXY = $('#com-chilipeppr-widget-xbox-robot-ratexy').val();
                that.options.RateZ = $('#com-chilipeppr-widget-xbox-robot-ratez').val();
                that.options.IncJog = $('#com-chilipeppr-widget-xbox-robot-incjog').val();
                that.options.RPM = $('#com-chilipeppr-widget-xbox-robot-rpm').val();
                that.saveOptionsLocalStorage();
            });
			
        },
        onMainBodyImgClick: function(evt) {
        	console.log("got click on main image body. evt:", evt);
        	var modal = $('#com-chilipeppr-widget-xbox-robot-modal');
			modal.modal();
        },
        /**
         * Call this method from init to setup all the buttons when this widget
         * is first loaded. This basically attaches click events to your 
         * buttons. It also turns on all the bootstrap popovers by scanning
         * the entire DOM of the widget.
         */
        btnSetup: function() {

            // Chevron hide/show body
            var that = this;
            $('#' + this.id + ' .hidebody').click(function(evt) {
                console.log("hide/unhide body");
                if ($('#' + that.id + ' .panel-body').hasClass('hidden')) {
                    // it's hidden, unhide
                    that.showBody(evt);
                }
                else {
                    // hide
                    that.hideBody(evt);
                }
            });

            // Ask bootstrap to scan all the buttons in the widget to turn
            // on popover menus
            $('#' + this.id + ' .btn').popover({
                delay: 1000,
                animation: true,
                placement: "auto",
                trigger: "hover",
                container: 'body'
            });

            // Init Say Hello Button on Main Toolbar
            // We are inlining an anonymous method as the callback here
            // as opposed to a full callback method in the Hello Word 2
            // example further below. Notice we have to use "that" so 
            // that the this is set correctly inside the anonymous method
            $('#' + this.id + ' .btn-sayhello').click(function() {
                console.log("saying hello");
                // Make sure popover is immediately hidden
                $('#' + that.id + ' .btn-sayhello').popover("hide");
                // Show a flash msg
                chilipeppr.publish(
                    "/com-chilipeppr-elem-flashmsg/flashmsg",
                    "Hello Title",
                    "Hello World from widget " + that.id,
                    1000
                );
            });

            // Init Hello World 2 button on Tab 1. Notice the use
            // of the slick .bind(this) technique to correctly set "this"
            // when the callback is called
            $('#' + this.id + ' .btn-helloworld2').click(this.onHelloBtnClick.bind(this));

        },
        /**
         * onHelloBtnClick is an example of a button click event callback
         */
        onHelloBtnClick: function(evt) {
            console.log("saying hello 2 from btn in tab 1");
            chilipeppr.publish(
                '/com-chilipeppr-elem-flashmsg/flashmsg',
                "Hello 2 Title",
                "Hello World 2 from Tab 1 from widget " + this.id,
                2000 /* show for 2 second */
            );
        },
        /**
         * User options are available in this property for reference by your
         * methods. If any change is made on these options, please call
         * saveOptionsLocalStorage()
         */
        options: null,
        /**
         * Call this method on init to setup the UI by reading the user's
         * stored settings from localStorage and then adjust the UI to reflect
         * what the user wants.
         */
        setupUiFromLocalStorage: function() {

            // Read vals from localStorage. Make sure to use a unique
            // key specific to this widget so as not to overwrite other
            // widgets' options. By using this.id as the prefix of the
            // key we're safe that this will be unique.

            // Feel free to add your own keys inside the options 
            // object for your own items

            var options = localStorage.getItem(this.id + '-options');

            if (options) {
                options = $.parseJSON(options);
                console.log("just evaled options: ", options);
            }
            else {
                options = {
                    showBody: true,
                    tabShowing: 1,
                    
                    Deadzone: 20,
                    RateXY: 1000,
                    RateZ: 1000,
                    IncJog: 10,
                    RPM: 12000
                };
            }

            this.options = options;
            console.log("options:", options);

            // show/hide body
            if (options.showBody) {
                this.showBody();
            }
            else {
                this.hideBody();
            }
            
            $('#com-chilipeppr-widget-xbox-robot-deadzone').val(options.Deadzone);
            $('#com-chilipeppr-widget-xbox-robot-ratexy').val(options.RateXY);
            $('#com-chilipeppr-widget-xbox-robot-ratez').val(options.RateZ);
            $('#com-chilipeppr-widget-xbox-robot-incjog').val(options.IncJog);
            $('#com-chilipeppr-widget-xbox-robot-rpm').val(options.RPM);

        },
        /**
         * When a user changes a value that is stored as an option setting, you
         * should call this method immediately so that on next load the value
         * is correctly set.
         */
        saveOptionsLocalStorage: function() {
            // You can add your own values to this.options to store them
            // along with some of the normal stuff like showBody
            var options = this.options;

            var optionsStr = JSON.stringify(options);
            console.log("saving options:", options, "json.stringify:", optionsStr);
            // store settings to localStorage
            localStorage.setItem(this.id + '-options', optionsStr);
        },
        /**
         * Show the body of the panel.
         * @param {jquery_event} evt - If you pass the event parameter in, we 
         * know it was clicked by the user and thus we store it for the next 
         * load so we can reset the user's preference. If you don't pass this 
         * value in we don't store the preference because it was likely code 
         * that sent in the param.
         */
        showBody: function(evt) {
            $('#' + this.id + ' .panel-body').removeClass('hidden');
            $('#' + this.id + ' .panel-footer').removeClass('hidden');
            $('#' + this.id + ' .hidebody span').addClass('glyphicon-chevron-up');
            $('#' + this.id + ' .hidebody span').removeClass('glyphicon-chevron-down');
            if (!(evt == null)) {
                this.options.showBody = true;
                this.saveOptionsLocalStorage();
            }
            // this will send an artificial event letting other widgets know to resize
            // themselves since this widget is now taking up more room since it's showing
            $(window).trigger("resize");
        },
        /**
         * Hide the body of the panel.
         * @param {jquery_event} evt - If you pass the event parameter in, we 
         * know it was clicked by the user and thus we store it for the next 
         * load so we can reset the user's preference. If you don't pass this 
         * value in we don't store the preference because it was likely code 
         * that sent in the param.
         */
        hideBody: function(evt) {
            $('#' + this.id + ' .panel-body').addClass('hidden');
            $('#' + this.id + ' .panel-footer').addClass('hidden');
            $('#' + this.id + ' .hidebody span').removeClass('glyphicon-chevron-up');
            $('#' + this.id + ' .hidebody span').addClass('glyphicon-chevron-down');
            if (!(evt == null)) {
                this.options.showBody = false;
                this.saveOptionsLocalStorage();
            }
            // this will send an artificial event letting other widgets know to resize
            // themselves since this widget is now taking up less room since it's hiding
            $(window).trigger("resize");
        },
        /**
         * This method loads the pubsubviewer widget which attaches to our 
         * upper right corner triangle menu and generates 3 menu items like
         * Pubsub Viewer, View Standalone, and Fork Widget. It also enables
         * the modal dialog that shows the documentation for this widget.
         * 
         * By using chilipeppr.load() we can ensure that the pubsubviewer widget
         * is only loaded and inlined once into the final ChiliPeppr workspace.
         * We are given back a reference to the instantiated singleton so its
         * not instantiated more than once. Then we call it's attachTo method
         * which creates the full pulldown menu for us and attaches the click
         * events.
         */
        forkSetup: function() {
            var topCssSelector = '#' + this.id;

            $(topCssSelector + ' .panel-title').popover({
                title: this.name,
                content: this.desc,
                html: true,
                delay: 1000,
                animation: true,
                trigger: 'hover',
                placement: 'auto'
            });

            var that = this;
            chilipeppr.load("http://raw.githubusercontent.com/chilipeppr/widget-pubsubviewer/master/auto-generated-widget.html", function() {
                require(['inline:com-chilipeppr-elem-pubsubviewer'], function(pubsubviewer) {
                    pubsubviewer.attachTo($(topCssSelector + ' .panel-heading .dropdown-menu'), that);
                });
            });

        },
        /**
         * Load the Gamepad library from: https://github.com/kallaspriit/HTML5-JavaScript-Gamepad-Controller-Library
         */
        initGamepadLibrary: function() {
            
            // Trick this library into instantiating locally so we have a reference to it
            var module = {
                exports: {},
            };
            
/*
 * Copyright 2012 Priit Kallas <kallaspriit@gmail.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

(function(exports) {
	'use strict';

	/**
	 * A null function - does nothing, returns nothing
	 */
	var nullFunction = function() {};

	/**
	 * The null platform, which doesn't support anything
	 */
	var nullPlatform = {
		getType: function() {
			return 'null';
		},
		isSupported: function() {
			return false;
		},
		update: nullFunction
	};

	/**
	 * This strategy uses a timer function to call an update function.
	 * The timer (re)start function can be provided or the strategy reverts to
	 * one of the window.*requestAnimationFrame variants.
	 *
	 * @class AnimFrameUpdateStrategy
	 * @constructor
	 * @param {Function} [requestAnimationFrame] function to use for timer creation
	 * @module Gamepad
	 */
	var AnimFrameUpdateStrategy = function(requestAnimationFrame) {
		var that = this;
		var win = window;

		this.update = nullFunction;

		this.requestAnimationFrame = requestAnimationFrame || win.requestAnimationFrame ||
			win.webkitRequestAnimationFrame || win.mozRequestAnimationFrame;

		/**
		 * This method calls the (user) update and restarts itself
		 * @method tickFunction
		 */
		var debounceCnt = 0;
		this.tickFunction = function() {
		    debounceCnt++;
		    if (debounceCnt > 6) {
		        debounceCnt = 0;
    			that.update();
		    }
			that.startTicker();
		};

		/**
		 * (Re)Starts the ticker
		 * @method startTicker
		 */
		this.startTicker = function() {
			that.requestAnimationFrame.apply(win, [that.tickFunction]);
		};
	};

	/**
	 * Starts the update strategy using the given function
	 *
	 * @method start
	 * @param {Function} updateFunction the function to call at each update
	 */
	AnimFrameUpdateStrategy.prototype.start = function(updateFunction) {
		this.update = updateFunction || nullFunction;
		this.startTicker();
	};

	/**
	 * This strategy gives the user the ability to call the library internal
	 * update function on request. Use this strategy if you already have a
	 * timer function running by requestAnimationFrame and you need fine control
	 * over when the gamepads are updated.
	 *
	 * @class ManualUpdateStrategy
	 * @constructor
	 * @module Gamepad
	 */
	var ManualUpdateStrategy = function() {

	};

	/**
	 * Calls the update function in the started state. Does nothing otherwise.
	 * @method update
	 */
	ManualUpdateStrategy.prototype.update = nullFunction;

	/**
	 * Starts the update strategy using the given function
	 *
	 * @method start
	 * @param {Function} updateFunction the function to call at each update
	 */
	ManualUpdateStrategy.prototype.start = function(updateFunction) {
		this.update = updateFunction || nullFunction;
	};

	/**
	 * This platform is for webkit based environments that need to be polled
	 * for updates.
	 *
	 * @class WebKitPlatform
	 * @constructor
	 * @param {Object} listener the listener to provide _connect and _disconnect callbacks
	 * @param {Function} gamepadGetter the poll function to return an array of connected gamepads
	 * @module Gamepad
	 */
	var WebKitPlatform = function(listener, gamepadGetter) {
		this.listener = listener;
		this.gamepadGetter = gamepadGetter;
		this.knownGamepads = [];
	};

	/**
	 * Provides a platform object that returns true for isSupported() if valid.
	 * @method factory
	 * @static
	 * @param {Object} listener the listener to use
	 * @return {Object} a platform object
	 */
	WebKitPlatform.factory = function(listener) {
		var platform = nullPlatform;
		var navigator = window && window.navigator;

		if (navigator) {
			if (typeof(navigator.getGamepads) !== 'undefined') {
				platform = new WebKitPlatform(listener, function() {
					return navigator.getGamepads();
				});
			} else if (typeof(navigator.webkitGamepads) !== 'undefined') {
				platform = new WebKitPlatform(listener, function() {
					return navigator.webkitGamepads();
				});
			} else if (typeof(navigator.webkitGetGamepads) !== 'undefined') {
				platform = new WebKitPlatform(listener, function() {
					return navigator.webkitGetGamepads();
				});
			}
		}

		return platform;
	};

	/**
	 * @method getType()
	 * @static
	 * @return {String} 'WebKit'
	 */
	WebKitPlatform.getType = function() {
		return 'WebKit';
	},

	/**
	 * @method getType()
	 * @return {String} 'WebKit'
	 */
	WebKitPlatform.prototype.getType = function() {
		return WebKitPlatform.getType();
	},

	/**
	 * @method isSupported
	 * @return {Boolean} true
	 */
	WebKitPlatform.prototype.isSupported = function() {
		return true;
	};

	/**
	 * Queries the currently connected gamepads and reports any changes.
	 * @method update
	 */
	WebKitPlatform.prototype.update = function() {
		var that = this;
		var gamepads = Array.prototype.slice.call(this.gamepadGetter(), 0);
		var gamepad;
		var i;

		for (i = this.knownGamepads.length - 1; i >= 0; i--) {
			gamepad = this.knownGamepads[i];
			if (gamepads.indexOf(gamepad) < 0) {
				this.knownGamepads.splice(i, 1);
				this.listener._disconnect(gamepad);
			}
		}

		for (i = 0; i < gamepads.length; i++) {
			gamepad = gamepads[i];
			if (gamepad && (that.knownGamepads.indexOf(gamepad) < 0)) {
				that.knownGamepads.push(gamepad);
				that.listener._connect(gamepad);
			}
		}
	};

	/**
	 * This platform is for mozilla based environments that provide gamepad
	 * updates via events.
	 *
	 * @class FirefoxPlatform
	 * @constructor
	 * @module Gamepad
	 */
	var FirefoxPlatform = function(listener) {
		this.listener = listener;

		window.addEventListener('gamepadconnected', function(e) {
			listener._connect(e.gamepad);
		});
		window.addEventListener('gamepaddisconnected', function(e) {
			listener._disconnect(e.gamepad);
		});
	};

	/**
	 * Provides a platform object that returns true for isSupported() if valid.
	 * @method factory
	 * @static
	 * @param {Object} listener the listener to use
	 * @return {Object} a platform object
	 */
	FirefoxPlatform.factory = function(listener) {
		var platform = nullPlatform;

		if (window && (typeof(window.addEventListener) !== 'undefined')) {
			platform = new FirefoxPlatform(listener);
		}

		return platform;
	};

	/**
	 * @method getType()
	 * @static
	 * @return {String} 'Firefox'
	 */
	FirefoxPlatform.getType = function() {
		return 'Firefox';
	},

	/**
	 * @method getType()
	 * @return {String} 'Firefox'
	 */
	FirefoxPlatform.prototype.getType = function() {
		return FirefoxPlatform.getType();
	},

	/**
	 * @method isSupported
	 * @return {Boolean} true
	 */
	FirefoxPlatform.prototype.isSupported = function() {
		var navigator = window && window.navigator;
		return navigator.userAgent.indexOf('Firefox') !== -1;
	};

	/**
	 * Does nothing on the Firefox platform
	 * @method update
	 */
	FirefoxPlatform.prototype.update = nullFunction;

	/**
	 * Provides simple interface and multi-platform support for the gamepad API.
	 *
	 * You can change the deadzone and maximizeThreshold parameters to suit your
	 * taste but the defaults should generally work fine.
	 *
	 * @class Gamepad
	 * @constructor
	 * @param {Object} [updateStrategy] an update strategy, defaulting to
	 *		{{#crossLink "AnimFrameUpdateStrategy"}}{{/crossLink}}
	 * @module Gamepad
	 * @author Priit Kallas <kallaspriit@gmail.com>
	 */
	var Gamepad = function(updateStrategy) {
		this.updateStrategy = updateStrategy || new AnimFrameUpdateStrategy();
		this.gamepads = [];
		this.listeners = {};
		this.platform = nullPlatform;
		this.deadzone = 0.03;
		this.maximizeThreshold = 0.97;
	};

	/**
	 * The available update strategies
	 * @property UpdateStrategies
	 * @param {AnimFrameUpdateStrategy} AnimFrameUpdateStrategy
	 * @param {ManualUpdateStrategy} ManualUpdateStrategy
	 */
	Gamepad.UpdateStrategies = {
		AnimFrameUpdateStrategy: AnimFrameUpdateStrategy,
		ManualUpdateStrategy: ManualUpdateStrategy
	};

	/**
	 * List of factories of supported platforms. Currently available platforms:
	 * {{#crossLink "WebKitPlatform"}}{{/crossLink}},
	 * {{#crossLink "FirefoxPlatform"}}{{/crossLink}},
	 * @property PlatformFactories
	 * @type {Array}
	 */
	Gamepad.PlatformFactories = [FirefoxPlatform.factory, WebKitPlatform.factory];

	/**
	 * List of supported controller types.
	 *
	 * @property Type
	 * @param {String} Type.N64 Retrolink N64 controller
	 * @param {String} Type.PLAYSTATION Playstation controller
	 * @param {String} Type.LOGITECH Logitech controller
	 * @param {String} Type.XBOX XBOX controller
	 * @param {String} Type.UNKNOWN Unknown controller
	 */
	Gamepad.Type = {
		N64: 'n64',
		PLAYSTATION: 'playstation',
		LOGITECH: 'logitech',
		XBOX: 'xbox',
		UNKNOWN: 'unknown'
	};

	/*
	 * List of events you can expect from the library.
	 *
	 * CONNECTED, DISCONNECTED and UNSUPPORTED events include the gamepad in
	 * question and tick provides the list of all connected gamepads.
	 *
	 * BUTTON_DOWN and BUTTON_UP events provide an alternative to polling button states at each tick.
	 *
	 * AXIS_CHANGED is called if a value of some specific axis changes.
	 */
	Gamepad.Event = {
		/**
		 * Triggered when a new controller connects.
		 *
		 * @event connected
		 * @param {Object} device
		 */
		CONNECTED: 'connected',

		/**
		 * Called when an unsupported controller connects.
		 *
		 * @event unsupported
		 * @param {Object} device
		 * @deprecated not used anymore. Any controller is supported.
		 */
		UNSUPPORTED: 'unsupported',

		/**
		 * Triggered when a controller disconnects.
		 *
		 * @event disconnected
		 * @param {Object} device
		 */
		DISCONNECTED: 'disconnected',

		/**
		 * Called regularly with the latest controllers info.
		 *
		 * @event tick
		 * @param {Array} gamepads
		 */
		TICK: 'tick',

		/**
		 * Called when a gamepad button is pressed down.
		 *
		 * @event button-down
		 * @param {Object} event
		 * @param {Object} event.gamepad The gamepad object
		 * @param {String} event.control Control name
		 */
		BUTTON_DOWN: 'button-down',

		/**
		 * Called when a gamepad button is released.
		 *
		 * @event button-up
		 * @param {Object} event
		 * @param {Object} event.gamepad The gamepad object
		 * @param {String} event.control Control name
		 */
		BUTTON_UP: 'button-up',

		/**
		 * Called when gamepad axis value changed.
		 *
		 * @event axis-changed
		 * @param {Object} event
		 * @param {Object} event.gamepad The gamepad object
		 * @param {String} event.axis Axis name
		 * @param {Number} event.value New axis value
		 */
		AXIS_CHANGED: 'axis-changed'
	};

	/**
	 * List of standard button names. The index is the according standard button
	 * index as per standard.
	 *
	 * @property StandardButtons
	 */
	Gamepad.StandardButtons = [
		'FACE_1', 'FACE_2', 'FACE_3', 'FACE_4',
		'LEFT_TOP_SHOULDER', 'RIGHT_TOP_SHOULDER', 'LEFT_BOTTOM_SHOULDER', 'RIGHT_BOTTOM_SHOULDER',
		'SELECT_BACK', 'START_FORWARD', 'LEFT_STICK', 'RIGHT_STICK',
		'DPAD_UP', 'DPAD_DOWN', 'DPAD_LEFT', 'DPAD_RIGHT',
		'HOME'
	];

	/**
	 * List of standard axis names. The index is the according standard axis
	 * index as per standard.
	 *
	 * @property StandardAxes
	 */
	Gamepad.StandardAxes = ['LEFT_STICK_X', 'LEFT_STICK_Y', 'RIGHT_STICK_X', 'RIGHT_STICK_Y'];

	var getControlName = function(names, index, extraPrefix) {
		return (index < names.length) ? names[index] : extraPrefix + (index - names.length + 1);
	};

	/**
	 * The standard mapping that represents the mapping as per definition.
	 * Each button and axis map to the same index.
	 *
	 * @property StandardMapping
	 */
	Gamepad.StandardMapping = {
		env: {},
		buttons: {
			byButton: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]
		},
		axes: {
			byAxis: [0, 1, 2, 3]
		}
	};

	/**
	 * Mapping of various gamepads that differ from the standard mapping on
	 * different platforms too unify their buttons and axes.
	 *
	 * Each mapping should have an 'env' object, which describes the environment
	 * in which the mapping is active. The more entries such an environment has,
	 * the more specific it is.
	 *
	 * Mappings are expressed for both buttons and axes. Buttons might refer to
	 * axes if they are notified as such.
	 *
	 * @property Mappings
	 */
	Gamepad.Mappings = [
		// Retrolink N64 controller on Firefox
		{
			env: {
				platform: FirefoxPlatform.getType(),
				type: Gamepad.Type.N64
			},
			buttons: {
				byButton: [
					// TODO: Figure out which buttons to map A and Z buttons to.
					2, // FACE_1 -- C-down button
					1, // FACE_2 -- C-right button
					3, // FACE_3 -- C-left button
					0, // FACE_4 -- C-down button
					4, // LEFT_TOP_SHOULDER -- L button
					5, // RIGHT_TOP_SHOULDER -- R button
					-1, // LEFT_BOTTOM_SHOULDER -- missing on controller
					-1, // RIGHT_BOTTOM_SHOULDER -- missing on controller
					8, // SELECT_BACK -- B button (is this right?)
					9, // START_FORWARD -- START button
					-1, // LEFT_STICK -- missing on controller
					-1, // RIGHT_STICK -- missing on controller
					12, // DPAD_UP -- not supported by API (but may eventually)
					13, // DPAD_DOWN -- not supported by API (but may eventually)
					14, // DPAD_LEFT -- not supported by API (but may eventually)
					15, // DPAD_RIGHT -- not supported by API (but may eventually)
					-1 // HOME -- missing on controller (could be START/B?)
				]
			},
			axes: {
				byAxis: [
					1, // LEFT_STICK_X
					2, // LEFT_STICK_Y
					-1, // RIGHT_STICK_X
					-1 // RIGHT_STICK_Y
				]
			}
		},
		// Retrolink N64 controller on WebKit
		{
			env: {
				platform: WebKitPlatform.getType(),
				type: Gamepad.Type.N64
			},
			buttons: {
				byButton: [
					// TODO: Figure out which buttons to map A and Z buttons to.
					2, // FACE_1 -- C-down button
					1, // FACE_2 -- C-right button
					3, // FACE_3 -- C-left button
					0, // FACE_4 -- C-down button
					4, // LEFT_TOP_SHOULDER -- L button
					5, // RIGHT_TOP_SHOULDER -- R button
					-1, // LEFT_BOTTOM_SHOULDER -- missing on controller
					-1, // RIGHT_BOTTOM_SHOULDER -- missing on controller
					8, // SELECT_BACK -- B button (is this right?)
					9, // START_FORWARD -- START button
					-1, // LEFT_STICK -- missing on controller
					-1, // RIGHT_STICK -- missing on controller
					12, // DPAD_UP -- D-Pad-up button
					13, // DPAD_DOWN -- D-Pad-down button
					14, // DPAD_LEFT -- D-Pad-left button
					15, // DPAD_RIGHT -- D-Pad-right button
					-1 // HOME -- missing on controller (could be START/B?)
				]
			},
			axes: {
				byAxis: [
					0, // LEFT_STICK_X
					1, // LEFT_STICK_Y
					-1, // RIGHT_STICK_X
					-1 // RIGHT_STICK_Y
				]
			}
		},
		// XBOX360 controller on Firefox
		{
			env: {
				platform: FirefoxPlatform.getType(),
				type: Gamepad.Type.XBOX
			},
			buttons: {
				byButton: [0, 1, 2, 3, 4, 5, 15, 16, 9, 8, 6, 7, 11, 12, 13, 14, 10]
			},
			axes: {
				byAxis: [0, 1, 2, 3]
			}
		},
		// PS3 controller on Firefox
		{
			env: {
				platform: FirefoxPlatform.getType(),
				type: Gamepad.Type.PLAYSTATION
			},
			buttons: {
				byButton: [14, 13, 15, 12, 10, 11, 8, 9, 0, 3, 1, 2, 4, 6, 7, 5, 16]
			},
			axes: {
				byAxis: [0, 1, 2, 3]
			}
		},
		// Logitech gamepad on WebKit
		{
			env: {
				platform: WebKitPlatform.getType(),
				type: Gamepad.Type.LOGITECH
			},
			buttons: { // TODO: This can't be right - LEFT/RIGHT_STICK have same mappings as HOME/DPAD_UP
				byButton: [1, 2, 0, 3, 4, 5, 6, 7, 8, 9, 10, 11, 11, 12, 13, 14, 10]
			},
			axes: {
				byAxis: [0, 1, 2, 3]
			}
		},
		// Logitech gamepad on Firefox
		{
			env: {
				platform: FirefoxPlatform.getType(),
				type: Gamepad.Type.LOGITECH
			},
			buttons: {
				byButton: [0, 1, 2, 3, 4, 5, -1, -1, 6, 7, 8, 9, 11, 12, 13, 14, 10],
				byAxis: [-1, -1, -1, -1, -1, -1, [2, 0, 1],
					[2, 0, -1]
				]
			},
			axes: {
				byAxis: [0, 1, 3, 4]
			}
		}
	];

	/**
	 * Initializes the gamepad.
	 *
	 * You usually want to bind to the events first and then initialize it.
	 *
	 * @method init
	 * @return {Boolean} true if a supporting platform was detected, false otherwise.
	 */
	Gamepad.prototype.init = function() {
		var platform = Gamepad.resolvePlatform(this);
		var that = this;

		this.platform = platform;
		this.updateStrategy.start(function() {
			that._update();
		});

		return platform.isSupported();
	};

	/**
	 * Binds a listener to a gamepad event.
	 *
	 * @method bind
	 * @param {String} event Event to bind to, one of Gamepad.Event..
	 * @param {Function} listener Listener to call when given event occurs
	 * @return {Gamepad} Self
	 */
	Gamepad.prototype.bind = function(event, listener) {
		if (typeof(this.listeners[event]) === 'undefined') {
			this.listeners[event] = [];
		}

		this.listeners[event].push(listener);

		return this;
	};

	/**
	 * Removes listener of given type.
	 *
	 * If no type is given, all listeners are removed. If no listener is given, all
	 * listeners of given type are removed.
	 *
	 * @method unbind
	 * @param {String} [type] Type of listener to remove
	 * @param {Function} [listener] The listener function to remove
	 * @return {Boolean} Was unbinding the listener successful
	 */
	Gamepad.prototype.unbind = function(type, listener) {
		if (typeof(type) === 'undefined') {
			this.listeners = {};

			return;
		}

		if (typeof(listener) === 'undefined') {
			this.listeners[type] = [];

			return;
		}

		if (typeof(this.listeners[type]) === 'undefined') {
			return false;
		}

		for (var i = 0; i < this.listeners[type].length; i++) {
			if (this.listeners[type][i] === listener) {
				this.listeners[type].splice(i, 1);

				return true;
			}
		}

		return false;
	};

	/**
	 * Returns the number of connected gamepads.
	 *
	 * @method count
	 * @return {Number}
	 */
	Gamepad.prototype.count = function() {
		return this.gamepads.length;
	};

	/**
	 * Fires an internal event with given data.
	 *
	 * @method _fire
	 * @param {String} event Event to fire, one of Gamepad.Event..
	 * @param {*} data Data to pass to the listener
	 * @private
	 */
	Gamepad.prototype._fire = function(event, data) {
		if (typeof(this.listeners[event]) === 'undefined') {
			return;
		}

		for (var i = 0; i < this.listeners[event].length; i++) {
			this.listeners[event][i].apply(this.listeners[event][i], [data]);
		}
	};

	/**
	 * @method getNullPlatform
	 * @static
	 * @return {Object} a platform that does not support anything
	 */
	Gamepad.getNullPlatform = function() {
		return Object.create(nullPlatform);
	};

	/**
	 * Resolves platform.
	 *
	 * @method resolvePlatform
	 * @static
	 * @param listener {Object} the listener to handle _connect() or _disconnect() calls
	 * @return {Object} A platform instance
	 */
	Gamepad.resolvePlatform = function(listener) {
		var platform = nullPlatform;
		var i;

		for (i = 0; !platform.isSupported() && (i < Gamepad.PlatformFactories.length); i++) {
			platform = Gamepad.PlatformFactories[i](listener);
		}

		return platform;
	};

	/**
	 * Registers given gamepad.
	 *
	 * @method _connect
	 * @param {Object} gamepad Gamepad to connect to
	 * @private
	 */
	Gamepad.prototype._connect = function(gamepad) {
		var mapping = this._resolveMapping(gamepad);
		var count;
		var i;

		//gamepad.mapping = this._resolveMapping(gamepad);
		gamepad.state = {};
		gamepad.lastState = {};
		gamepad.updater = [];

		count = mapping.buttons.byButton.length;
		for (i = 0; i < count; i++) {
			this._addButtonUpdater(gamepad, mapping, i);
		}

		count = mapping.axes.byAxis.length;
		for (i = 0; i < count; i++) {
			this._addAxisUpdater(gamepad, mapping, i);
		}

		this.gamepads[gamepad.index] = gamepad;

		this._fire(Gamepad.Event.CONNECTED, gamepad);
	};

	/**
	 * Adds an updater for a button control
	 *
	 * @method _addButtonUpdater
	 * @private
	 * @param {Object} gamepad the gamepad for which to create the updater
	 * @param {Object} mapping the mapping on which to work on
	 * @param {Number} index button index
	 */
	Gamepad.prototype._addButtonUpdater = function(gamepad, mapping, index) {
		var updater = nullFunction;
		var controlName = getControlName(Gamepad.StandardButtons, index, 'EXTRA_BUTTON_');
		var getter = this._createButtonGetter(gamepad, mapping.buttons, index);
		var that = this;
		var buttonEventData = {
			gamepad: gamepad,
			control: controlName
		};

		gamepad.state[controlName] = 0;
		gamepad.lastState[controlName] = 0;

		updater = function() {
			var value = getter();
			var lastValue = gamepad.lastState[controlName];
			var isDown = value > 0.5;
			var wasDown = lastValue > 0.5;

			gamepad.state[controlName] = value;

			if (isDown && !wasDown) {
				that._fire(Gamepad.Event.BUTTON_DOWN, Object.create(buttonEventData));
			} else if (!isDown && wasDown) {
				that._fire(Gamepad.Event.BUTTON_UP, Object.create(buttonEventData));
			}

			if ((value !== 0) && (value !== 1) && (value !== lastValue)) {
				that._fireAxisChangedEvent(gamepad, controlName, value);
			}

			gamepad.lastState[controlName] = value;
		};

		gamepad.updater.push(updater);
	};

	/**
	 * Adds an updater for an axis control
	 *
	 * @method _addAxisUpdater
	 * @private
	 * @param {Object} gamepad the gamepad for which to create the updater
	 * @param {Object} mapping the mapping on which to work on
	 * @param {Number} index axis index
	 */
	Gamepad.prototype._addAxisUpdater = function(gamepad, mapping, index) {
		var updater = nullFunction;
		var controlName = getControlName(Gamepad.StandardAxes, index, 'EXTRA_AXIS_');
		var getter = this._createAxisGetter(gamepad, mapping.axes, index);
		var that = this;

		gamepad.state[controlName] = 0;
		gamepad.lastState[controlName] = 0;

		updater = function() {
			var value = getter();
			var lastValue = gamepad.lastState[controlName];

			gamepad.state[controlName] = value;

			if ((value !== lastValue)) {
				that._fireAxisChangedEvent(gamepad, controlName, value);
			}

			gamepad.lastState[controlName] = value;
		};

		gamepad.updater.push(updater);
	};

	/**
	 * Fires an AXIS_CHANGED event
	 * @method _fireAxisChangedEvent
	 * @private
	 * @param {Object} gamepad the gamepad to notify for
	 * @param {String} controlName name of the control that changes its value
	 * @param {Number} value the new value
	 */
	Gamepad.prototype._fireAxisChangedEvent = function(gamepad, controlName, value) {
		var eventData = {
			gamepad: gamepad,
			axis: controlName,
			value: value
		};

		this._fire(Gamepad.Event.AXIS_CHANGED, eventData);
	};

	/**
	 * Creates a getter according to the mapping entry for the specific index.
	 * Currently supported entries:
	 *
	 * buttons.byButton[index]: Number := Index into gamepad.buttons; -1 tests byAxis
	 * buttons.byAxis[index]: Array := [Index into gamepad.axes; Zero Value, One Value]
	 *
	 * @method _createButtonGetter
	 * @private
	 * @param {Object} gamepad the gamepad for which to create a getter
	 * @param {Object} buttons the mappings entry for the buttons
	 * @param {Number} index the specific button entry
	 * @return {Function} a getter returning the value for the requested button
	 */
	Gamepad.prototype._createButtonGetter = (function() {
		var nullGetter = function() {
			return 0;
		};

		var createRangeGetter = function(valueGetter, from, to) {
			var getter = nullGetter;

			if (from < to) {
				getter = function() {
					var range = to - from;
					var value = valueGetter();

					value = (value - from) / range;

					return (value < 0) ? 0 : value;
				};
			} else if (to < from) {
				getter = function() {
					var range = from - to;
					var value = valueGetter();

					value = (value - to) / range;

					return (value > 1) ? 0 : (1 - value);
				};
			}

			return getter;
		};

		var isArray = function(thing) {
			return Object.prototype.toString.call(thing) === '[object Array]';
		};

		return function(gamepad, buttons, index) {
			var getter = nullGetter;
			var entry;
			var that = this;

			entry = buttons.byButton[index];
			if (entry !== -1) {
				if ((typeof(entry) === 'number') && (entry < gamepad.buttons.length)) {
					getter = function() {
						var value = gamepad.buttons[entry];

						if (typeof value === 'number') {
							return value;
						}

						if (typeof value.value === 'number') {
							return value.value;
						}

						return 0;
					};
				}
			} else if (buttons.byAxis && (index < buttons.byAxis.length)) {
				entry = buttons.byAxis[index];
				if (isArray(entry) && (entry.length == 3) && (entry[0] < gamepad.axes.length)) {
					getter = function() {
						var value = gamepad.axes[entry[0]];

						return that._applyDeadzoneMaximize(value);
					};

					getter = createRangeGetter(getter, entry[1], entry[2]);
				}
			}

			return getter;
		};
	})();

	/**
	 * Creates a getter according to the mapping entry for the specific index.
	 * Currently supported entries:
	 *
	 * axes.byAxis[index]: Number := Index into gamepad.axes; -1 ignored
	 *
	 * @method _createAxisGetter
	 * @private
	 * @param {Object} gamepad the gamepad for which to create a getter
	 * @param {Object} axes the mappings entry for the axes
	 * @param {Number} index the specific axis entry
	 * @return {Function} a getter returning the value for the requested axis
	 */
	Gamepad.prototype._createAxisGetter = (function() {
		var nullGetter = function() {
			return 0;
		};

		return function(gamepad, axes, index) {
			var getter = nullGetter;
			var entry;
			var that = this;

			entry = axes.byAxis[index];
			if (entry !== -1) {
				if ((typeof(entry) === 'number') && (entry < gamepad.axes.length)) {
					getter = function() {
						var value = gamepad.axes[entry];

						return that._applyDeadzoneMaximize(value);
					};
				}
			}

			return getter;
		};
	})();

	/**
	 * Disconnects from given gamepad.
	 *
	 * @method _disconnect
	 * @param {Object} gamepad Gamepad to disconnect
	 * @private
	 */
	Gamepad.prototype._disconnect = function(gamepad) {
		var newGamepads = [],
			i;

		if (typeof(this.gamepads[gamepad.index]) !== 'undefined') {
			delete this.gamepads[gamepad.index];
		}

		for (i = 0; i < this.gamepads.length; i++) {
			if (typeof(this.gamepads[i]) !== 'undefined') {
				newGamepads[i] = this.gamepads[i];
			}
		}

		this.gamepads = newGamepads;

		this._fire(Gamepad.Event.DISCONNECTED, gamepad);
	};

	/**
	 * Resolves controller type from its id.
	 *
	 * @method _resolveControllerType
	 * @param {String} id Controller id
	 * @return {String} Controller type, one of Gamepad.Type
	 * @private
	 */
	Gamepad.prototype._resolveControllerType = function(id) {
		// Lowercase and strip all extra whitespace.
		id = id.toLowerCase().replace(/\s+/g, ' ').replace(/^\s+|\s+$/g, '');

		if (id.indexOf('playstation') !== -1) {
			return Gamepad.Type.PLAYSTATION;
		} else if (
			id.indexOf('logitech') !== -1 || id.indexOf('wireless gamepad') !== -1) {
			return Gamepad.Type.LOGITECH;
		} else if (id.indexOf('xbox') !== -1 || id.indexOf('360') !== -1) {
			return Gamepad.Type.XBOX;
		} else if ((id.indexOf('79-6-generic') !== -1 && id.indexOf('joystick') !== -1) ||
			(id.indexOf('vendor: 0079 product: 0006') !== -1 &&
				id.indexOf('generic usb joystick') !== -1)) {
			return Gamepad.Type.N64;
		} else {
			return Gamepad.Type.UNKNOWN;
		}
	};

	/**
	 * @method _resolveMapping
	 * @private
	 * @param {Object} gamepad the gamepad for which to resolve the mapping
	 * @return {Object} a mapping object for the given gamepad
	 */
	Gamepad.prototype._resolveMapping = function(gamepad) {
		var mappings = Gamepad.Mappings;
		var mapping = null;
		var env = {
			platform: this.platform.getType(),
			type: this._resolveControllerType(gamepad.id)
		};
		var i;
		var test;

		for (i = 0; !mapping && (i < mappings.length); i++) {
			test = mappings[i];
			if (Gamepad.envMatchesFilter(test.env, env)) {
				mapping = test;
			}
		}

		return mapping || Gamepad.StandardMapping;
	};

	/**
	 * @method envMatchesFilter
	 * @static
	 * @param {Object} filter the filter object describing properties to match
	 * @param {Object} env the environment object that is matched against filter
	 * @return {Boolean} true if env is covered by filter
	 */
	Gamepad.envMatchesFilter = function(filter, env) {
		var result = true;
		var field;

		for (field in filter) {
			if (filter[field] !== env[field]) {
				result = false;
			}
		}

		return result;
	};

	/**
	 * Updates the controllers, triggering TICK events.
	 *
	 * @method _update
	 * @private
	 */
	Gamepad.prototype._update = function() {
		this.platform.update();

		this.gamepads.forEach(function(gamepad) {
			if (gamepad) {
				gamepad.updater.forEach(function(updater) {
					updater();
				});
			}
		});

		if (this.gamepads.length > 0) {
			this._fire(Gamepad.Event.TICK, this.gamepads);
		}
	},

	/**
	 * Applies deadzone and maximization.
	 *
	 * You can change the thresholds via deadzone and maximizeThreshold members.
	 *
	 * @method _applyDeadzoneMaximize
	 * @param {Number} value Value to modify
	 * @param {Number} [deadzone] Deadzone to apply
	 * @param {Number} [maximizeThreshold] From which value to maximize value
	 * @private
	 */
	Gamepad.prototype._applyDeadzoneMaximize = function(
		value,
		deadzone,
		maximizeThreshold) {
		deadzone = typeof(deadzone) !== 'undefined' ? deadzone : this.deadzone;
		maximizeThreshold = typeof(maximizeThreshold) !== 'undefined' ? maximizeThreshold : this.maximizeThreshold;

		if (value >= 0) {
			if (value < deadzone) {
				value = 0;
			} else if (value > maximizeThreshold) {
				value = 1;
			}
		} else {
			if (value > -deadzone) {
				value = 0;
			} else if (value < -maximizeThreshold) {
				value = -1;
			}
		}

		return value;
	};

	exports.Gamepad = Gamepad;

})(((typeof(module) !== 'undefined') && module.exports) || window);    

            // Ok, now that we've tricked the library, we have a reference to it
            console.log("module:", module);
            return module.exports.Gamepad;
        },

    }
});