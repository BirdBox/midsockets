var Utils = require('./utils');

/**
  Methods for implementing backbone style inheritance.

  @class Inheritance
  @static
  @constructor
**/

var Inheritance = module.exports = {};

// base constructor
Inheritance.Inheritable = function(options) {
  this.initialize.apply(this, arguments);
};

// override this
Inheritance.Inheritable.prototype.initialize = function(){};

// extend function as seen in backbone.js
Inheritance.extend = function(protoProps, staticProps) {
  var parent = this;
  var child;

  // The constructor function for the new subclass is either defined by you
  // (the "constructor" property in your `extend` definition), or defaulted
  // by us to simply call the parent's constructor.
  if (protoProps && protoProps.hasOwnProperty('constructor')) {
    child = protoProps.constructor;
  } else {
    child = function(){ parent.apply(this, arguments); };
  }

  // Add static properties to the constructor function, if supplied.
  Utils.merge(child, parent, staticProps);

  // Set the prototype chain to inherit from `parent`, without calling
  // `parent`'s constructor function.
  var Surrogate = function(){ this.constructor = child; };
  Surrogate.prototype = parent.prototype;
  child.prototype = new Surrogate;

  // Add prototype properties (instance properties) to the subclass,
  // if supplied.
  if (protoProps) Utils.merge(child.prototype, protoProps);

  // Set a convenience property in case the parent's prototype is needed
  // later.
  child.__super__ = parent.prototype;

  return child;
};