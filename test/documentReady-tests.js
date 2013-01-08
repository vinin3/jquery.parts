//	/*global module, expect, ok, test, equal */
//	module("event");

//	testIframeWithCallback( "jQuery.ready promise", "event/promiseReady.html", function( isOk ) {
//		expect(1);
//		ok( isOk, "$.when( $.ready ) works" );
//	});

//	// need PHP here to make the incepted IFRAME hang
//	if ( hasPHP ) {
//		testIframeWithCallback( "jQuery.ready synchronous load with long loading subresources", "event/syncReady.html", function( isOk ) {
//			expect(1);
//			ok( isOk, "jQuery loaded synchronously fires ready when the DOM can truly be interacted with" );
//		});
//	}

//	(function(){
//		// This code must be run before DOM ready!
//		var notYetReady, noEarlyExecution,
//			order = [],
//			args = {};

//		notYetReady = !jQuery.isReady;

//		test("jQuery.isReady", function() {
//			expect(2);

//			equal(notYetReady, true, "jQuery.isReady should not be true before DOM ready");
//			equal(jQuery.isReady, true, "jQuery.isReady should be true once DOM is ready");
//		});

//		// Create an event handler.
//		function makeHandler( testId ) {
//			// When returned function is executed, push testId onto `order` array
//			// to ensure execution order. Also, store event handler arg to ensure
//			// the correct arg is being passed into the event handler.
//			return function( arg ) {
//				order.push(testId);
//				args[testId] = arg;
//			};
//		}

//		// Bind to the ready event in every possible way.
//		jQuery(makeHandler("a"));
//		jQuery(document).ready(makeHandler("b"));
//		jQuery(document).bind("ready.readytest", makeHandler("c"));

//		// Do it twice, just to be sure.
//		jQuery(makeHandler("d"));
//		jQuery(document).ready(makeHandler("e"));
//		jQuery(document).bind("ready.readytest", makeHandler("f"));

//		noEarlyExecution = order.length === 0;

//		// This assumes that QUnit tests are run on DOM ready!
//		test("jQuery ready", function() {
//			expect(10);

//			ok(noEarlyExecution, "Handlers bound to DOM ready should not execute before DOM ready");

//			// Ensure execution order.
//			deepEqual(order, ["a", "b", "d", "e", "c", "f"], "Bound DOM ready handlers should execute in bind-order, but those bound with jQuery(document).bind( 'ready', fn ) will always execute last");

//			// Ensure handler argument is correct.
//			equal(args["a"], jQuery, "Argument passed to fn in jQuery( fn ) should be jQuery");
//			equal(args["b"], jQuery, "Argument passed to fn in jQuery(document).ready( fn ) should be jQuery");
//			ok(args["c"] instanceof jQuery.Event, "Argument passed to fn in jQuery(document).bind( 'ready', fn ) should be an event object");

//			order = [];

//			// Now that the ready event has fired, again bind to the ready event
//			// in every possible way. These event handlers should execute immediately.
//			jQuery(makeHandler("g"));
//			equal(order.pop(), "g", "Event handler should execute immediately");
//			equal(args["g"], jQuery, "Argument passed to fn in jQuery( fn ) should be jQuery");

//			jQuery(document).ready(makeHandler("h"));
//			equal(order.pop(), "h", "Event handler should execute immediately");
//			equal(args["h"], jQuery, "Argument passed to fn in jQuery(document).ready( fn ) should be jQuery");

//			jQuery(document).bind("ready.readytest", makeHandler("never"));
//			equal(order.length, 0, "Event handler should never execute since DOM ready has already passed");

//			// Cleanup.
//			jQuery(document).unbind("ready.readytest");
//		});

//	})();

