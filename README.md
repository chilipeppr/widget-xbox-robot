# com-chilipeppr-widget-xbox-robot
This widget lets you control ChiliPeppr from an Xbox controller.

![alt text](screenshot.png "Screenshot")

## ChiliPeppr Widget / Xbox Robot

All ChiliPeppr widgets/elements are defined using cpdefine() which is a method
that mimics require.js. Each defined object must have a unique ID so it does
not conflict with other ChiliPeppr widgets.

| Item                  | Value           |
| -------------         | ------------- | 
| ID                    | com-chilipeppr-widget-xbox-robot |
| Name                  | Widget / Xbox Robot |
| Description           | This widget lets you control ChiliPeppr from an Xbox controller. |
| chilipeppr.load() URL | https://raw.githubusercontent.com/chilipeppr/widget-xbox-robot/master/auto-generated-widget.html |
| Edit URL              | (Local dev. No edit URL) |
| Github URL            | https://github.com/chilipeppr/widget-xbox-robot |
| Test URL              | http://localhost:9004/widget.html |

## Example Code for chilipeppr.load() Statement

You can use the code below as a starting point for instantiating this widget 
inside a workspace or from another widget. The key is that you need to load 
your widget inlined into a div so the DOM can parse your HTML, CSS, and 
Javascript. Then you use cprequire() to find your widget's Javascript and get 
back the instance of it.

```javascript
// Inject new div to contain widget or use an existing div with an ID
$("body").append('<' + 'div id="myDivWidgetXboxRobot"><' + '/div>');

chilipeppr.load(
  "#myDivWidgetXboxRobot",
  "https://raw.githubusercontent.com/chilipeppr/widget-xbox-robot/master/auto-generated-widget.html",
  function() {
    // Callback after widget loaded into #myDivWidgetXboxRobot
    // Now use require.js to get reference to instantiated widget
    cprequire(
      ["inline:com-chilipeppr-widget-xbox-robot"], // the id you gave your widget
      function(myObjWidgetXboxRobot) {
        // Callback that is passed reference to the newly loaded widget
        console.log("Widget / Xbox Robot just got loaded.", myObjWidgetXboxRobot);
        myObjWidgetXboxRobot.init();
      }
    );
  }
);

```

## Publish

This widget/element publishes the following signals. These signals are owned by this widget/element and are published to all objects inside the ChiliPeppr environment that listen to them via the 
chilipeppr.subscribe(signal, callback) method. 
To better understand how ChiliPeppr's subscribe() method works see amplify.js's documentation at http://amplifyjs.com/api/pubsub/

  <table id="com-chilipeppr-elem-pubsubviewer-pub" class="table table-bordered table-striped">
      <thead>
          <tr>
              <th style="">Signal</th>
              <th style="">Description</th>
          </tr>
      </thead>
      <tbody>
      <tr valign="top"><td>/com-chilipeppr-widget-xbox-robot/onXboxControllerConnected</td><td>This signal gets published when an XBox controller is found. Payload is the Gamepad() object.</td></tr><tr valign="top"><td>/com-chilipeppr-widget-xbox-robot/onXboxControllerDisconnected</td><td>This signal gets published when an XBox controller is disconnected. Payload is the Gamepad() object.</td></tr>    
      </tbody>
  </table>

## Subscribe

This widget/element subscribes to the following signals. These signals are owned by this widget/element. Other objects inside the ChiliPeppr environment can publish to these signals via the chilipeppr.publish(signal, data) method. 
To better understand how ChiliPeppr's publish() method works see amplify.js's documentation at http://amplifyjs.com/api/pubsub/

  <table id="com-chilipeppr-elem-pubsubviewer-sub" class="table table-bordered table-striped">
      <thead>
          <tr>
              <th style="">Signal</th>
              <th style="">Description</th>
          </tr>
      </thead>
      <tbody>
      <tr><td colspan="2">(No signals defined in this widget/element)</td></tr>    
      </tbody>
  </table>

## Foreign Publish

This widget/element publishes to the following signals that are owned by other objects. 
To better understand how ChiliPeppr's subscribe() method works see amplify.js's documentation at http://amplifyjs.com/api/pubsub/

  <table id="com-chilipeppr-elem-pubsubviewer-foreignpub" class="table table-bordered table-striped">
      <thead>
          <tr>
              <th style="">Signal</th>
              <th style="">Description</th>
          </tr>
      </thead>
      <tbody>
      <tr valign="top"><td>/com-chilipeppr-widget-xbox-robot/com-chilipeppr-elem-flashmsg/flashmsg</td><td>Used to notify the operator of certain events.</td></tr><tr valign="top"><td>/com-chilipeppr-widget-xbox-robot/com-chilipeppr-widget-serialport/jsonSend</td><td>Used to send Gcode to the controller.</td></tr><tr valign="top"><td>/com-chilipeppr-widget-xbox-robot/com-chilipeppr-widget-serialport/send</td><td>Used to send Gcode to the controller.</td></tr>    
      </tbody>
  </table>

## Foreign Subscribe

This widget/element publishes to the following signals that are owned by other objects.
To better understand how ChiliPeppr's publish() method works see amplify.js's documentation at http://amplifyjs.com/api/pubsub/

  <table id="com-chilipeppr-elem-pubsubviewer-foreignsub" class="table table-bordered table-striped">
      <thead>
          <tr>
              <th style="">Signal</th>
              <th style="">Description</th>
          </tr>
      </thead>
      <tbody>
      <tr valign="top"><td>/com-chilipeppr-widget-xbox-robot/com-chilipeppr-interface-cnccontroller/plannerpause</td><td>Subscribed to be notified when the planner buffer is fill so we can stop sending jog commands.</td></tr><tr valign="top"><td>/com-chilipeppr-widget-xbox-robot/com-chilipeppr-interface-cnccontroller/plannerresume</td><td>Subscribed to be notified when the planner buffer has room for more jog commands.</td></tr>    
      </tbody>
  </table>

## Methods / Properties

The table below shows, in order, the methods and properties inside the widget/element.

  <table id="com-chilipeppr-elem-methodsprops" class="table table-bordered table-striped">
      <thead>
          <tr>
              <th style="">Method / Property</th>
              <th>Type</th>
              <th style="">Description</th>
          </tr>
      </thead>
      <tbody>
      <tr valign="top"><td>id</td><td>string</td><td>"com-chilipeppr-widget-xbox-robot"<br><br>The ID of the widget. You must define this and make it unique.</td></tr><tr valign="top"><td>name</td><td>string</td><td>"Widget / Xbox Robot"</td></tr><tr valign="top"><td>desc</td><td>string</td><td>"This widget lets you control ChiliPeppr from an Xbox controller."</td></tr><tr valign="top"><td>url</td><td>string</td><td>"https://raw.githubusercontent.com/chilipeppr/widget-xbox-robot/master/auto-generated-widget.html"</td></tr><tr valign="top"><td>fiddleurl</td><td>string</td><td>"(Local dev. No edit URL)"</td></tr><tr valign="top"><td>githuburl</td><td>string</td><td>"https://github.com/chilipeppr/widget-xbox-robot"</td></tr><tr valign="top"><td>testurl</td><td>string</td><td>"http://localhost:9004/widget.html"</td></tr><tr valign="top"><td>publish</td><td>object</td><td>Please see docs above.<br><br>Define the publish signals that this widget/element owns or defines so that
other widgets know how to subscribe to them and what they do.</td></tr><tr valign="top"><td>subscribe</td><td>object</td><td>Please see docs above.<br><br>Define the subscribe signals that this widget/element owns or defines so that
other widgets know how to subscribe to them and what they do.</td></tr><tr valign="top"><td>foreignPublish</td><td>object</td><td>Please see docs above.<br><br>Document the foreign publish signals, i.e. signals owned by other widgets
or elements, that this widget/element publishes to.</td></tr><tr valign="top"><td>foreignSubscribe</td><td>object</td><td>Please see docs above.<br><br>Document the foreign subscribe signals, i.e. signals owned by other widgets
or elements, that this widget/element subscribes to.</td></tr><tr valign="top"><td>init</td><td>function</td><td>function () <br><br>All widgets should have an init method. It should be run by the
instantiating code like a workspace or a different widget.</td></tr><tr valign="top"><td>elAction</td><td>object</td><td></td></tr><tr valign="top"><td>setupRefreshBtn</td><td>function</td><td>function () </td></tr><tr valign="top"><td>onGamepadRefresh</td><td>function</td><td>function () <br><br>This is called to rescan for Gamepad devices.</td></tr><tr valign="top"><td>onXboxConnect</td><td>function</td><td>function (device) </td></tr><tr valign="top"><td>onXboxDisconnect</td><td>function</td><td>function (device) </td></tr><tr valign="top"><td>actuatorGridEls</td><td>object</td><td></td></tr><tr valign="top"><td>preCacheActuatorGridEls</td><td>function</td><td>function() </td></tr><tr valign="top"><td>showAction</td><td>function</td><td>function (txt, actuatorName) </td></tr><tr valign="top"><td>scale</td><td>function</td><td>function (num, in_min, in_max, out_min, out_max) </td></tr><tr valign="top"><td>mapJoystickToHz</td><td>function</td><td>function (joystickVal) </td></tr><tr valign="top"><td>isJogStarted</td><td>object</td><td></td></tr><tr valign="top"><td>isJogStartedWrist3</td><td>boolean</td><td></td></tr><tr valign="top"><td>jogTs</td><td>object</td><td></td></tr><tr valign="top"><td>jogTsWrist3</td><td>number</td><td></td></tr><tr valign="top"><td>jogHzMax</td><td>number</td><td></td></tr><tr valign="top"><td>jogHzMin</td><td>number</td><td></td></tr><tr valign="top"><td>jogDivideAmt</td><td>number</td><td></td></tr><tr valign="top"><td>isRtTopShoulderPressed</td><td>boolean</td><td></td></tr><tr valign="top"><td>jogLastFreq</td><td>object</td><td></td></tr><tr valign="top"><td>jogLastFreqWrist3</td><td>number</td><td></td></tr><tr valign="top"><td>actuatorNameToStick</td><td>object</td><td></td></tr><tr valign="top"><td>stickToActuatorName</td><td>object</td><td></td></tr><tr valign="top"><td>jogAxisChange</td><td>function</td><td>function (stick, e) </td></tr><tr valign="top"><td>jogTick</td><td>function</td><td>function (gamepads) </td></tr><tr valign="top"><td>jogStop</td><td>function</td><td>function (actuatorName) </td></tr><tr valign="top"><td>jogChangeWrist3</td><td>function</td><td>function (val) </td></tr><tr valign="top"><td>lastCoolantCmd</td><td>string</td><td>Keep track of whether we sent flood/coolant on or off last time</td></tr><tr valign="top"><td>lastSpindleCmd</td><td>string</td><td></td></tr><tr valign="top"><td>Gamepad</td><td>object</td><td>This object holds the Gamepad library from https://github.com/kallaspriit/HTML5-JavaScript-Gamepad-Controller-Library</td></tr><tr valign="top"><td>gamepad</td><td>object</td><td></td></tr><tr valign="top"><td>isGamepadFail</td><td>boolean</td><td></td></tr><tr valign="top"><td>gamepadDevice</td><td>object</td><td></td></tr><tr valign="top"><td>gamepadIndex</td><td>object</td><td></td></tr><tr valign="top"><td>joggingEnabled</td><td>boolean</td><td>This method sets up the events we bind to for receiving incoming actions from the 
Xbox controller.</td></tr><tr valign="top"><td>jogStarted</td><td>boolean</td><td></td></tr><tr valign="top"><td>zjogStarted</td><td>boolean</td><td></td></tr><tr valign="top"><td>gpIndex</td><td>number</td><td></td></tr><tr valign="top"><td>setupGamepad</td><td>function</td><td>function () </td></tr><tr valign="top"><td>sendCtr</td><td>number</td><td></td></tr><tr valign="top"><td>isPausedByPlanner</td><td>boolean</td><td></td></tr><tr valign="top"><td>stickJog</td><td>function</td><td>function (xVal, yVal) </td></tr><tr valign="top"><td>zstickJog</td><td>function</td><td>function (zVal) </td></tr><tr valign="top"><td>stickJogStop</td><td>function</td><td>function () </td></tr><tr valign="top"><td>onPlannerPause</td><td>function</td><td>function () </td></tr><tr valign="top"><td>onPlannerResume</td><td>function</td><td>function () </td></tr><tr valign="top"><td>sendGcode</td><td>function</td><td>function (gcode) <br><br>Send Gcode to the CNC controller using the awesome pubsub commands available
throughout the ChiliPeppr environment. Check any widget to see what pubsubs they
support for other widgets to publish to.</td></tr><tr valign="top"><td>setupBody</td><td>function</td><td>function () <br><br>This method sets up the body of the widget, which at this time just allows you to
click the image to get a modal popup for a larger version of the image.</td></tr><tr valign="top"><td>onMainBodyImgClick</td><td>function</td><td>function (evt) </td></tr><tr valign="top"><td>btnSetup</td><td>function</td><td>function () <br><br>Call this method from init to setup all the buttons when this widget
is first loaded. This basically attaches click events to your 
buttons. It also turns on all the bootstrap popovers by scanning
the entire DOM of the widget.</td></tr><tr valign="top"><td>onHelloBtnClick</td><td>function</td><td>function (evt) <br><br>onHelloBtnClick is an example of a button click event callback</td></tr><tr valign="top"><td>options</td><td>object</td><td>User options are available in this property for reference by your
methods. If any change is made on these options, please call
saveOptionsLocalStorage()</td></tr><tr valign="top"><td>setupUiFromLocalStorage</td><td>function</td><td>function () <br><br>Call this method on init to setup the UI by reading the user's
stored settings from localStorage and then adjust the UI to reflect
what the user wants.</td></tr><tr valign="top"><td>saveOptionsLocalStorage</td><td>function</td><td>function () <br><br>When a user changes a value that is stored as an option setting, you
should call this method immediately so that on next load the value
is correctly set.</td></tr><tr valign="top"><td>showBody</td><td>function</td><td>function (evt) <br><br>Show the body of the panel.
<br><br><b>evt</b> ({jquery_event})  - If you pass the event parameter in, we 
know it was clicked by the user and thus we store it for the next 
load so we can reset the user's preference. If you don't pass this 
value in we don't store the preference because it was likely code 
that sent in the param.</td></tr><tr valign="top"><td>hideBody</td><td>function</td><td>function (evt) <br><br>Hide the body of the panel.
<br><br><b>evt</b> ({jquery_event})  - If you pass the event parameter in, we 
know it was clicked by the user and thus we store it for the next 
load so we can reset the user's preference. If you don't pass this 
value in we don't store the preference because it was likely code 
that sent in the param.</td></tr><tr valign="top"><td>forkSetup</td><td>function</td><td>function () <br><br>This method loads the pubsubviewer widget which attaches to our 
upper right corner triangle menu and generates 3 menu items like
Pubsub Viewer, View Standalone, and Fork Widget. It also enables
the modal dialog that shows the documentation for this widget.<br><br>By using chilipeppr.load() we can ensure that the pubsubviewer widget
is only loaded and inlined once into the final ChiliPeppr workspace.
We are given back a reference to the instantiated singleton so its
not instantiated more than once. Then we call it's attachTo method
which creates the full pulldown menu for us and attaches the click
events.</td></tr><tr valign="top"><td>initGamepadLibrary</td><td>function</td><td>function () <br><br>Load the Gamepad library from: https://github.com/kallaspriit/HTML5-JavaScript-Gamepad-Controller-Library</td></tr>
      </tbody>
  </table>


## About ChiliPeppr

[ChiliPeppr](http://chilipeppr.com) is a hardware fiddle, meaning it is a 
website that lets you easily
create a workspace to fiddle with your hardware from software. ChiliPeppr provides
a [Serial Port JSON Server](https://github.com/johnlauer/serial-port-json-server) 
that you run locally on your computer, or remotely on another computer, to connect to 
the serial port of your hardware like an Arduino or other microcontroller.

You then create a workspace at ChiliPeppr.com that connects to your hardware 
by starting from scratch or forking somebody else's
workspace that is close to what you are after. Then you write widgets in
Javascript that interact with your hardware by forking the base template 
widget or forking another widget that
is similar to what you are trying to build.

ChiliPeppr is massively capable such that the workspaces for 
[TinyG](http://chilipeppr.com/tinyg) and [Grbl](http://chilipeppr.com/grbl) CNC 
controllers have become full-fledged CNC machine management software used by
tens of thousands.

ChiliPeppr has inspired many people in the hardware/software world to use the
browser and Javascript as the foundation for interacting with hardware. The
Arduino team in Italy caught wind of ChiliPeppr and now
ChiliPeppr's Serial Port JSON Server is the basis for the 
[Arduino's new web IDE](https://create.arduino.cc/). If the Arduino team is excited about building on top
of ChiliPeppr, what
will you build on top of it?

