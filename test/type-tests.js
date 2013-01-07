/*global module, expect, start, ok, test, equal, asyncTest */
/*jshint strict: false */
module("core");

test("type", function() {
	expect(23);

	equal( window.type(null), "null", "null" );
	equal( window.type(undefined), "undefined", "undefined" );
	equal( window.type(true), "boolean", "Boolean" );
	equal( window.type(false), "boolean", "Boolean" );
	equal( window.type(Boolean(true)), "boolean", "Boolean" );
	equal( window.type(0), "number", "Number" );
	equal( window.type(1), "number", "Number" );
	equal( window.type(Number(1)), "number", "Number" );
	equal( window.type(""), "string", "String" );
	equal( window.type("a"), "string", "String" );
	equal( window.type(String("a")), "string", "String" );
	equal( window.type({}), "object", "Object" );
	equal( window.type(/foo/), "regexp", "RegExp" );
	equal( window.type(new RegExp("asdf")), "regexp", "RegExp" );
	equal( window.type([1]), "array", "Array" );
	equal( window.type(new Date()), "date", "Date" );
	equal( window.type(new Function("return;")), "function", "Function" );
	equal( window.type(function(){}), "function", "Function" );
	equal( window.type(window), "object", "Window" );
	equal( window.type(document), "object", "Document" );
	equal( window.type(document.body), "object", "Element" );
	equal( window.type(document.createTextNode("foo")), "object", "TextNode" );
	equal( window.type(document.getElementsByTagName("*")), "object", "NodeList" );
});

asyncTest("isPlainObject", function() {
	expect(15);

	var iframe;

	// The use case that we want to match
	ok(window.isPlainObject({}), "{}");

	// Not objects shouldn't be matched
	ok(!window.isPlainObject(""), "string");
	ok(!window.isPlainObject(0) && !window.isPlainObject(1), "number");
	ok(!window.isPlainObject(true) && !window.isPlainObject(false), "boolean");
	ok(!window.isPlainObject(null), "null");
	ok(!window.isPlainObject(undefined), "undefined");

	// Arrays shouldn't be matched
	ok(!window.isPlainObject([]), "array");

	// Instantiated objects shouldn't be matched
	ok(!window.isPlainObject(new Date()), "new Date");

	var fnplain = function(){};

	// Functions shouldn't be matched
	ok(!window.isPlainObject(fnplain), "fn");

	/** @constructor */
	var fn = function() {};

	// Again, instantiated objects shouldn't be matched
	ok(!window.isPlainObject(new fn()), "new fn (no methods)");

	// Makes the function a little more realistic
	// (and harder to detect, incidentally)
	fn.prototype["someMethod"] = function(){};

	// Again, instantiated objects shouldn't be matched
	ok(!window.isPlainObject(new fn()), "new fn");

	// DOM Element
	ok(!window.isPlainObject(document.createElement("div")), "DOM Element");

	// Window
	ok(!window.isPlainObject(window), "window");

	try {
		window.isPlainObject( window.location );
		ok( true, "Does not throw exceptions on host objects");
	} catch ( e ) {
		ok( false, "Does not throw exceptions on host objects -- FAIL");
	}

	try {
		iframe = document.createElement("iframe");
		document.body.appendChild(iframe);

		window.iframeDone = function(otherObject){
			// Objects from other windows should be matched
			ok(window.isPlainObject(new otherObject()), "new otherObject");
			document.body.removeChild( iframe );
			start();
		};

		var doc = iframe.contentDocument || iframe.contentWindow.document;
		doc.open();
		doc.write("<body onload='window.parent.iframeDone(Object);'>");
		doc.close();
	} catch(e) {
		document.body.removeChild( iframe );

		ok(true, "new otherObject - iframes not supported");
		start();
	}
});

test("isFunction", function() {
	expect(19);

	// Make sure that false values return false
	ok( !window.isFunction(), "No Value" );
	ok( !window.isFunction( null ), "null Value" );
	ok( !window.isFunction( undefined ), "undefined Value" );
	ok( !window.isFunction( "" ), "Empty String Value" );
	ok( !window.isFunction( 0 ), "0 Value" );

	// Check built-ins
	// Safari uses "(Internal Function)"
	ok( window.isFunction(String), "String Function("+String+")" );
	ok( window.isFunction(Array), "Array Function("+Array+")" );
	ok( window.isFunction(Object), "Object Function("+Object+")" );
	ok( window.isFunction(Function), "Function Function("+Function+")" );

	// When stringified, this could be misinterpreted
	var mystr = "function";
	ok( !window.isFunction(mystr), "Function String" );

	// When stringified, this could be misinterpreted
	var myarr = [ "function" ];
	ok( !window.isFunction(myarr), "Function Array" );

	// When stringified, this could be misinterpreted
	var myfunction = { "function": "test" };
	ok( !window.isFunction(myfunction), "Function Object" );

	// Make sure normal functions still work
	var fn = function(){};
	ok( window.isFunction(fn), "Normal Function" );

	var obj = document.createElement("object");

	// Firefox says this is a function
	ok( !window.isFunction(obj), "Object Element" );

	// IE says this is an object
	// Since 1.3, this isn't supported (#2968)
	//ok( jQuery.isFunction(obj.getAttribute), "getAttribute Function" );

	var nodes = document.body.childNodes;

	// Safari says this is a function
	ok( !window.isFunction(nodes), "childNodes Property" );

	var first = document.body.firstChild;

	// Normal elements are reported ok everywhere
	ok( !window.isFunction(first), "A normal DOM Element" );

	var input = document.createElement("input");
	input.type = "text";
	document.body.appendChild( input );

	// IE says this is an object
	// Since 1.3, this isn't supported (#2968)
	//ok( jQuery.isFunction(input.focus), "A default function property" );

	document.body.removeChild( input );

	var a = document.createElement("a");
	a.href = "some-function";
	document.body.appendChild( a );

	// This serializes with the word 'function' in it
	ok( !window.isFunction(a), "Anchor Element" );

	document.body.removeChild( a );

	// Recursive function calls have lengths and array-like properties
	function callme(callback){
		function fn(response){
			callback(response);
		}

		ok( window.isFunction(fn), "Recursive Function Call" );

		fn({ some: "data" });
	}

	callme(function(){
		callme(function(){});
	});
});

test( "isNumeric", function() {
	expect( 36 );

	var t = window.isNumeric,
		Traditionalists = /** @constructor */ function(n) {
			this.value = n;
			this.toString = function(){
				return String(this.value);
			};
		},
		answer = new Traditionalists( "42" ),
		rong = new Traditionalists( "Devo" );

	ok( t("-10"), "Negative integer string");
	ok( t("0"), "Zero string");
	ok( t("5"), "Positive integer string");
	ok( t(-16), "Negative integer number");
	ok( t(0), "Zero integer number");
	ok( t(32), "Positive integer number");
	ok( t("040"), "Octal integer literal string");
	// OctalIntegerLiteral has been deprecated since ES3/1999
	// It doesn't pass lint, so disabling until a solution can be found
	//ok( t(0144), "Octal integer literal");
	ok( t("0xFF"), "Hexadecimal integer literal string");
	ok( t(0xFFF), "Hexadecimal integer literal");
	ok( t("-1.6"), "Negative floating point string");
	ok( t("4.536"), "Positive floating point string");
	ok( t(-2.6), "Negative floating point number");
	ok( t(3.1415), "Positive floating point number");
	ok( t(8e5), "Exponential notation");
	ok( t("123e-2"), "Exponential notation string");
	ok( t(answer), "Custom .toString returning number");
	equal( t(""), false, "Empty string");
	equal( t("        "), false, "Whitespace characters string");
	equal( t("\t\t"), false, "Tab characters string");
	equal( t("abcdefghijklm1234567890"), false, "Alphanumeric character string");
	equal( t("xabcdefx"), false, "Non-numeric character string");
	equal( t(true), false, "Boolean true literal");
	equal( t(false), false, "Boolean false literal");
	equal( t("bcfed5.2"), false, "Number with preceding non-numeric characters");
	equal( t("7.2acdgs"), false, "Number with trailling non-numeric characters");
	equal( t(undefined), false, "Undefined value");
	equal( t(null), false, "Null value");
	equal( t(NaN), false, "NaN value");
	equal( t(Infinity), false, "Infinity primitive");
	equal( t(Number.POSITIVE_INFINITY), false, "Positive Infinity");
	equal( t(Number.NEGATIVE_INFINITY), false, "Negative Infinity");
	equal( t(rong), false, "Custom .toString returning non-number");
	equal( t({}), false, "Empty object");
	equal( t(function(){} ), false, "Instance of a function");
	equal( t( new Date() ), false, "Instance of a Date");
	equal( t(function(){} ), false, "Instance of a function");
});

test("isWindow", function() {
	expect( 14 );

	ok( window.isWindow(window), "window" );
	ok( window.isWindow(document.getElementsByTagName("iframe")[0].contentWindow), "iframe.contentWindow" );
	ok( !window.isWindow(), "empty" );
	ok( !window.isWindow(null), "null" );
	ok( !window.isWindow(undefined), "undefined" );
	ok( !window.isWindow(document), "document" );
	ok( !window.isWindow(document.documentElement), "documentElement" );
	ok( !window.isWindow(""), "string" );
	ok( !window.isWindow(1), "number" );
	ok( !window.isWindow(true), "boolean" );
	ok( !window.isWindow({}), "object" );
	ok( !window.isWindow({ setInterval: function(){} }), "fake window" );
	ok( !window.isWindow(/window/), "regexp" );
	ok( !window.isWindow(function(){}), "function" );
});

test("jQuery.isEmptyObject", function(){
	expect(2);

	equal(true, window.isEmptyObject({}), "isEmptyObject on empty object literal" );
	equal(false, window.isEmptyObject({a:1}), "isEmptyObject on non-empty object literal" );

	// What about this ?
	// equal(true, jQuery.isEmptyObject(null), "isEmptyObject on null" );
});
