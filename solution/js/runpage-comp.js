/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by liam.dickson on 5/21/15.
	 */

	var $ = __webpack_require__(9)
	var ParentView = __webpack_require__(2);
	var Enumerations = __webpack_require__(3);
	var Item = __webpack_require__(4);

	var Router = Backbone.Router.extend({
	    routes: {
	        '' : 'home'
	    }
	});

	var enumerationModel = new Enumerations();
	var itemModel = new Item();

	var parentView = new ParentView({itemModel: itemModel, enumerationModel: enumerationModel});

	var router = new Router();
	router.on('route:home', function () {
	    $.when(itemModel.fetch(), enumerationModel.fetch()).done(function () {
	        parentView.render();
	    });
	});

	Backbone.history.start();

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by liam.dickson on 5/21/15.
	 */

	var _ = __webpack_require__(12);
	var $ = __webpack_require__(9)
	var Backbone = __webpack_require__(13);

	module.exports = Backbone.BaseView.extend({
	    template: _.template($('#measurements-template').html()),
	    templateVars: function () {
	        return {itemEnums: this.enumerationModel.toJSON(), item: this.itemModel.toJSON()};
	    },
	    initialize: function (options) {
	        this.itemModel = options.itemModel;
	        this.enumerationModel = options.enumerationModel;
	    },
	    events: {
	        'change input[type=radio]': 'changedRadio'
	    },
	    changedRadio: function () {
	        this.$('.input-group-addon').text(this.$('input[name=measurement-unit]:checked').val()+'.');
	        if(this.$('input[name=measurement-shape]:checked').val() === 'Circular'){
	            this.$('.measurement-input').attr('disabled','');
	            this.$('#inputDiameter').removeAttr('disabled');
	        }
	        if(this.$('input[name=measurement-shape]:checked').val() === 'Rectangular'){
	            this.$('.measurement-input').removeAttr('disabled');
	            this.$('#inputDiameter').attr('disabled','');
	        }
	    }
	});

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by liam.dickson on 5/21/15.
	 */

	var _ = __webpack_require__(12);
	var $ = __webpack_require__(9)
	var Backbone = __webpack_require__(13);
	var ButtonView = __webpack_require__(6);
	var ConditionView = __webpack_require__(7);
	var DescriptionView = __webpack_require__(5);
	var MaterialsView = __webpack_require__(8);
	var MeasurementsView = __webpack_require__(1);
	var NotesView = __webpack_require__(10);
	var TitleView = __webpack_require__(11);

	module.exports = Backbone.BaseView.extend({
	    el: '#form',
	    template: _.template($('#parent-template').html()),
	    events: {
	        'click #save': 'save'
	    },
	    subViewConfig: {
	        titleView: {
	            construct: TitleView,
	            location: '#title',
	            singleton: true
	        },
	        descriptionView: {
	            construct: DescriptionView,
	            location: '#description',
	            singleton: true
	        },
	        notesView: {
	            construct: NotesView,
	            location: '#notes',
	            singleton: true
	        },
	        materialsView: {
	            construct: MaterialsView,
	            location: '#materials',
	            singleton: true
	        },
	        measurementsView: {
	            construct: MeasurementsView,
	            location: '#measurements',
	            singleton: true
	        },
	        conditionView: {
	            construct: ConditionView,
	            location: '#condition',
	            singleton: true
	        },
	        buttonView: {
	            construct: ButtonView,
	            location: '#button',
	            singleton: true
	        }
	    },
	    initialize: function (options) {
	        this.itemModel = options.itemModel;
	        this.enumerationModel = options.enumerationModel;
	        this.subs.add({
	            'titleView': {model: this.itemModel},
	            'descriptionView': {model: this.itemModel},
	            'notesView': {model: this.itemModel},
	            'materialsView': {
	                itemModel: this.itemModel,
	                enumerationModel: this.enumerationModel
	            },
	            'measurementsView' : {
	                itemModel: this.itemModel,
	                enumerationModel: this.enumerationModel
	            },
	            'conditionView' : {
	                itemModel: this.itemModel,
	                enumerationModel: this.enumerationModel
	            },
	            'buttonView' : {}
	        });
	    },
	    save: function () {
	        var shape = this.subs.get('measurementsView').$('input[name="measurement-shape"]:checked').val();
	        this.itemModel.set({
	            'id': this.subs.get('titleView').$('#id').val(),
	            'title': this.subs.get('titleView').$('#inputTitle').val(),
	            'description': this.subs.get('descriptionView').$('#inputDescription').val(),
	            'dealerInternalNotes': this.subs.get('notesView').$('#inputNotes').val(),
	            'material': {
	                'description': this.subs.get('materialsView').$('#selectMaterials').val(),
	                'restricted': this.subs.get('materialsView').$('input[name="material-restricted"]:checked').val() ? 'Y' : 'N'
	            },
	            'measurement': {
	                'unit': this.subs.get('measurementsView').$('input[name="measurement-unit"]:checked').val(),
	                'shape': shape
	            },
	            'condition': {
	                'description': this.subs.get('conditionView').$('input[name="condition-description"]:checked').val()
	            }
	        });
	        if(shape === 'Rectangular') {
	            this.itemModel.get('measurement').length = this.subs.get('measurementsView').$('#inputLength').val();
	            this.itemModel.get('measurement').depth = this.subs.get('measurementsView').$('#inputDepth').val();
	            this.itemModel.get('measurement').height = this.subs.get('measurementsView').$('#inputHeight').val();
	            delete this.itemModel.get('measurement').diameter;
	        }
	        if(shape === 'Circular'){
	            this.itemModel.get('measurement').diameter = this.subs.get('measurementsView').$('#inputDiameter').val();
	            delete this.itemModel.get('measurement').length;
	            delete this.itemModel.get('measurement').depth;
	            delete this.itemModel.get('measurement').height;
	        }
	        console.log(this.itemModel.toJSON());
	    }
	});


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by liam.dickson on 5/21/15.
	 */

	var Backbone = __webpack_require__(14);

	module.exports = Backbone.Model.extend({
	    urlRoot: '../enums.json',
	    parse: function(response) {
	        return response.itemEnums;
	    }
	});


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by liam.dickson on 5/21/15.
	 */

	var Backbone = __webpack_require__(14);

	module.exports = Backbone.Model.extend({
	    urlRoot: '../item.json',
	    parse: function(response) {
	        return response.result.item;
	    }
	});

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by liam.dickson on 5/21/15.
	 */

	var _ = __webpack_require__(12);
	var $ = __webpack_require__(9)
	var Backbone = __webpack_require__(13);

	module.exports = Backbone.BaseView.extend({
	    template: _.template($('#description-template').html()),
	    templateVars: function () {
	        return this.model.toJSON();
	    }
	});

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by liam.dickson on 5/21/15.
	 */

	var _ = __webpack_require__(12);
	var $ = __webpack_require__(9)
	var Backbone = __webpack_require__(13);

	module.exports = Backbone.BaseView.extend({
	    template: _.template($('#button-template').html())
	});

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by liam.dickson on 5/21/15.
	 */

	var _ = __webpack_require__(12);
	var $ = __webpack_require__(9)
	var Backbone = __webpack_require__(13);

	module.exports = Backbone.BaseView.extend({
	    template: _.template($('#condition-template').html()),
	    templateVars: function () {
	        return {itemEnums: this.enumerationModel.toJSON(), item: this.itemModel.toJSON()};
	    },
	    initialize: function (options) {
	        this.itemModel = options.itemModel;
	        this.enumerationModel = options.enumerationModel;
	    }
	});

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by liam.dickson on 5/21/15.
	 */

	var _ = __webpack_require__(12);
	var $ = __webpack_require__(9)
	var Backbone = __webpack_require__(13);

	module.exports = Backbone.BaseView.extend({
	    template: _.template($('#materials-template').html()),
	    templateVars: function () {
	        return {itemEnums: this.enumerationModel.toJSON(), item: this.itemModel.toJSON()};
	    },
	    initialize: function (options) {
	        this.itemModel = options.itemModel;
	        this.enumerationModel = options.enumerationModel;
	    }
	});

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = window.jQuery;

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by liam.dickson on 5/21/15.
	 */

	var _ = __webpack_require__(12);
	var $ = __webpack_require__(9)
	var Backbone = __webpack_require__(13);

	module.exports = Backbone.BaseView.extend({
	    template: template = _.template($('#notes-template').html()),
	    templateVars: function () {
	        return this.model.toJSON();
	    }
	});

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by liam.dickson on 5/21/15.
	 */

	var _ = __webpack_require__(12);
	var $ = __webpack_require__(9)
	var Backbone = __webpack_require__(13);

	module.exports = Backbone.BaseView.extend({
	    template: _.template($('#title-template').html()),
	    templateVars: function () {
	        return this.model.toJSON();
	    }
	});

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;//     Underscore.js 1.8.3
	//     http://underscorejs.org
	//     (c) 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
	//     Underscore may be freely distributed under the MIT license.

	(function() {

	  // Baseline setup
	  // --------------

	  // Establish the root object, `window` in the browser, or `exports` on the server.
	  var root = this;

	  // Save the previous value of the `_` variable.
	  var previousUnderscore = root._;

	  // Save bytes in the minified (but not gzipped) version:
	  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

	  // Create quick reference variables for speed access to core prototypes.
	  var
	    push             = ArrayProto.push,
	    slice            = ArrayProto.slice,
	    toString         = ObjProto.toString,
	    hasOwnProperty   = ObjProto.hasOwnProperty;

	  // All **ECMAScript 5** native function implementations that we hope to use
	  // are declared here.
	  var
	    nativeIsArray      = Array.isArray,
	    nativeKeys         = Object.keys,
	    nativeBind         = FuncProto.bind,
	    nativeCreate       = Object.create;

	  // Naked function reference for surrogate-prototype-swapping.
	  var Ctor = function(){};

	  // Create a safe reference to the Underscore object for use below.
	  var _ = function(obj) {
	    if (obj instanceof _) return obj;
	    if (!(this instanceof _)) return new _(obj);
	    this._wrapped = obj;
	  };

	  // Export the Underscore object for **Node.js**, with
	  // backwards-compatibility for the old `require()` API. If we're in
	  // the browser, add `_` as a global object.
	  if (true) {
	    if (typeof module !== 'undefined' && module.exports) {
	      exports = module.exports = _;
	    }
	    exports._ = _;
	  } else {
	    root._ = _;
	  }

	  // Current version.
	  _.VERSION = '1.8.3';

	  // Internal function that returns an efficient (for current engines) version
	  // of the passed-in callback, to be repeatedly applied in other Underscore
	  // functions.
	  var optimizeCb = function(func, context, argCount) {
	    if (context === void 0) return func;
	    switch (argCount == null ? 3 : argCount) {
	      case 1: return function(value) {
	        return func.call(context, value);
	      };
	      case 2: return function(value, other) {
	        return func.call(context, value, other);
	      };
	      case 3: return function(value, index, collection) {
	        return func.call(context, value, index, collection);
	      };
	      case 4: return function(accumulator, value, index, collection) {
	        return func.call(context, accumulator, value, index, collection);
	      };
	    }
	    return function() {
	      return func.apply(context, arguments);
	    };
	  };

	  // A mostly-internal function to generate callbacks that can be applied
	  // to each element in a collection, returning the desired result — either
	  // identity, an arbitrary callback, a property matcher, or a property accessor.
	  var cb = function(value, context, argCount) {
	    if (value == null) return _.identity;
	    if (_.isFunction(value)) return optimizeCb(value, context, argCount);
	    if (_.isObject(value)) return _.matcher(value);
	    return _.property(value);
	  };
	  _.iteratee = function(value, context) {
	    return cb(value, context, Infinity);
	  };

	  // An internal function for creating assigner functions.
	  var createAssigner = function(keysFunc, undefinedOnly) {
	    return function(obj) {
	      var length = arguments.length;
	      if (length < 2 || obj == null) return obj;
	      for (var index = 1; index < length; index++) {
	        var source = arguments[index],
	            keys = keysFunc(source),
	            l = keys.length;
	        for (var i = 0; i < l; i++) {
	          var key = keys[i];
	          if (!undefinedOnly || obj[key] === void 0) obj[key] = source[key];
	        }
	      }
	      return obj;
	    };
	  };

	  // An internal function for creating a new object that inherits from another.
	  var baseCreate = function(prototype) {
	    if (!_.isObject(prototype)) return {};
	    if (nativeCreate) return nativeCreate(prototype);
	    Ctor.prototype = prototype;
	    var result = new Ctor;
	    Ctor.prototype = null;
	    return result;
	  };

	  var property = function(key) {
	    return function(obj) {
	      return obj == null ? void 0 : obj[key];
	    };
	  };

	  // Helper for collection methods to determine whether a collection
	  // should be iterated as an array or as an object
	  // Related: http://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength
	  // Avoids a very nasty iOS 8 JIT bug on ARM-64. #2094
	  var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
	  var getLength = property('length');
	  var isArrayLike = function(collection) {
	    var length = getLength(collection);
	    return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
	  };

	  // Collection Functions
	  // --------------------

	  // The cornerstone, an `each` implementation, aka `forEach`.
	  // Handles raw objects in addition to array-likes. Treats all
	  // sparse array-likes as if they were dense.
	  _.each = _.forEach = function(obj, iteratee, context) {
	    iteratee = optimizeCb(iteratee, context);
	    var i, length;
	    if (isArrayLike(obj)) {
	      for (i = 0, length = obj.length; i < length; i++) {
	        iteratee(obj[i], i, obj);
	      }
	    } else {
	      var keys = _.keys(obj);
	      for (i = 0, length = keys.length; i < length; i++) {
	        iteratee(obj[keys[i]], keys[i], obj);
	      }
	    }
	    return obj;
	  };

	  // Return the results of applying the iteratee to each element.
	  _.map = _.collect = function(obj, iteratee, context) {
	    iteratee = cb(iteratee, context);
	    var keys = !isArrayLike(obj) && _.keys(obj),
	        length = (keys || obj).length,
	        results = Array(length);
	    for (var index = 0; index < length; index++) {
	      var currentKey = keys ? keys[index] : index;
	      results[index] = iteratee(obj[currentKey], currentKey, obj);
	    }
	    return results;
	  };

	  // Create a reducing function iterating left or right.
	  function createReduce(dir) {
	    // Optimized iterator function as using arguments.length
	    // in the main function will deoptimize the, see #1991.
	    function iterator(obj, iteratee, memo, keys, index, length) {
	      for (; index >= 0 && index < length; index += dir) {
	        var currentKey = keys ? keys[index] : index;
	        memo = iteratee(memo, obj[currentKey], currentKey, obj);
	      }
	      return memo;
	    }

	    return function(obj, iteratee, memo, context) {
	      iteratee = optimizeCb(iteratee, context, 4);
	      var keys = !isArrayLike(obj) && _.keys(obj),
	          length = (keys || obj).length,
	          index = dir > 0 ? 0 : length - 1;
	      // Determine the initial value if none is provided.
	      if (arguments.length < 3) {
	        memo = obj[keys ? keys[index] : index];
	        index += dir;
	      }
	      return iterator(obj, iteratee, memo, keys, index, length);
	    };
	  }

	  // **Reduce** builds up a single result from a list of values, aka `inject`,
	  // or `foldl`.
	  _.reduce = _.foldl = _.inject = createReduce(1);

	  // The right-associative version of reduce, also known as `foldr`.
	  _.reduceRight = _.foldr = createReduce(-1);

	  // Return the first value which passes a truth test. Aliased as `detect`.
	  _.find = _.detect = function(obj, predicate, context) {
	    var key;
	    if (isArrayLike(obj)) {
	      key = _.findIndex(obj, predicate, context);
	    } else {
	      key = _.findKey(obj, predicate, context);
	    }
	    if (key !== void 0 && key !== -1) return obj[key];
	  };

	  // Return all the elements that pass a truth test.
	  // Aliased as `select`.
	  _.filter = _.select = function(obj, predicate, context) {
	    var results = [];
	    predicate = cb(predicate, context);
	    _.each(obj, function(value, index, list) {
	      if (predicate(value, index, list)) results.push(value);
	    });
	    return results;
	  };

	  // Return all the elements for which a truth test fails.
	  _.reject = function(obj, predicate, context) {
	    return _.filter(obj, _.negate(cb(predicate)), context);
	  };

	  // Determine whether all of the elements match a truth test.
	  // Aliased as `all`.
	  _.every = _.all = function(obj, predicate, context) {
	    predicate = cb(predicate, context);
	    var keys = !isArrayLike(obj) && _.keys(obj),
	        length = (keys || obj).length;
	    for (var index = 0; index < length; index++) {
	      var currentKey = keys ? keys[index] : index;
	      if (!predicate(obj[currentKey], currentKey, obj)) return false;
	    }
	    return true;
	  };

	  // Determine if at least one element in the object matches a truth test.
	  // Aliased as `any`.
	  _.some = _.any = function(obj, predicate, context) {
	    predicate = cb(predicate, context);
	    var keys = !isArrayLike(obj) && _.keys(obj),
	        length = (keys || obj).length;
	    for (var index = 0; index < length; index++) {
	      var currentKey = keys ? keys[index] : index;
	      if (predicate(obj[currentKey], currentKey, obj)) return true;
	    }
	    return false;
	  };

	  // Determine if the array or object contains a given item (using `===`).
	  // Aliased as `includes` and `include`.
	  _.contains = _.includes = _.include = function(obj, item, fromIndex, guard) {
	    if (!isArrayLike(obj)) obj = _.values(obj);
	    if (typeof fromIndex != 'number' || guard) fromIndex = 0;
	    return _.indexOf(obj, item, fromIndex) >= 0;
	  };

	  // Invoke a method (with arguments) on every item in a collection.
	  _.invoke = function(obj, method) {
	    var args = slice.call(arguments, 2);
	    var isFunc = _.isFunction(method);
	    return _.map(obj, function(value) {
	      var func = isFunc ? method : value[method];
	      return func == null ? func : func.apply(value, args);
	    });
	  };

	  // Convenience version of a common use case of `map`: fetching a property.
	  _.pluck = function(obj, key) {
	    return _.map(obj, _.property(key));
	  };

	  // Convenience version of a common use case of `filter`: selecting only objects
	  // containing specific `key:value` pairs.
	  _.where = function(obj, attrs) {
	    return _.filter(obj, _.matcher(attrs));
	  };

	  // Convenience version of a common use case of `find`: getting the first object
	  // containing specific `key:value` pairs.
	  _.findWhere = function(obj, attrs) {
	    return _.find(obj, _.matcher(attrs));
	  };

	  // Return the maximum element (or element-based computation).
	  _.max = function(obj, iteratee, context) {
	    var result = -Infinity, lastComputed = -Infinity,
	        value, computed;
	    if (iteratee == null && obj != null) {
	      obj = isArrayLike(obj) ? obj : _.values(obj);
	      for (var i = 0, length = obj.length; i < length; i++) {
	        value = obj[i];
	        if (value > result) {
	          result = value;
	        }
	      }
	    } else {
	      iteratee = cb(iteratee, context);
	      _.each(obj, function(value, index, list) {
	        computed = iteratee(value, index, list);
	        if (computed > lastComputed || computed === -Infinity && result === -Infinity) {
	          result = value;
	          lastComputed = computed;
	        }
	      });
	    }
	    return result;
	  };

	  // Return the minimum element (or element-based computation).
	  _.min = function(obj, iteratee, context) {
	    var result = Infinity, lastComputed = Infinity,
	        value, computed;
	    if (iteratee == null && obj != null) {
	      obj = isArrayLike(obj) ? obj : _.values(obj);
	      for (var i = 0, length = obj.length; i < length; i++) {
	        value = obj[i];
	        if (value < result) {
	          result = value;
	        }
	      }
	    } else {
	      iteratee = cb(iteratee, context);
	      _.each(obj, function(value, index, list) {
	        computed = iteratee(value, index, list);
	        if (computed < lastComputed || computed === Infinity && result === Infinity) {
	          result = value;
	          lastComputed = computed;
	        }
	      });
	    }
	    return result;
	  };

	  // Shuffle a collection, using the modern version of the
	  // [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
	  _.shuffle = function(obj) {
	    var set = isArrayLike(obj) ? obj : _.values(obj);
	    var length = set.length;
	    var shuffled = Array(length);
	    for (var index = 0, rand; index < length; index++) {
	      rand = _.random(0, index);
	      if (rand !== index) shuffled[index] = shuffled[rand];
	      shuffled[rand] = set[index];
	    }
	    return shuffled;
	  };

	  // Sample **n** random values from a collection.
	  // If **n** is not specified, returns a single random element.
	  // The internal `guard` argument allows it to work with `map`.
	  _.sample = function(obj, n, guard) {
	    if (n == null || guard) {
	      if (!isArrayLike(obj)) obj = _.values(obj);
	      return obj[_.random(obj.length - 1)];
	    }
	    return _.shuffle(obj).slice(0, Math.max(0, n));
	  };

	  // Sort the object's values by a criterion produced by an iteratee.
	  _.sortBy = function(obj, iteratee, context) {
	    iteratee = cb(iteratee, context);
	    return _.pluck(_.map(obj, function(value, index, list) {
	      return {
	        value: value,
	        index: index,
	        criteria: iteratee(value, index, list)
	      };
	    }).sort(function(left, right) {
	      var a = left.criteria;
	      var b = right.criteria;
	      if (a !== b) {
	        if (a > b || a === void 0) return 1;
	        if (a < b || b === void 0) return -1;
	      }
	      return left.index - right.index;
	    }), 'value');
	  };

	  // An internal function used for aggregate "group by" operations.
	  var group = function(behavior) {
	    return function(obj, iteratee, context) {
	      var result = {};
	      iteratee = cb(iteratee, context);
	      _.each(obj, function(value, index) {
	        var key = iteratee(value, index, obj);
	        behavior(result, value, key);
	      });
	      return result;
	    };
	  };

	  // Groups the object's values by a criterion. Pass either a string attribute
	  // to group by, or a function that returns the criterion.
	  _.groupBy = group(function(result, value, key) {
	    if (_.has(result, key)) result[key].push(value); else result[key] = [value];
	  });

	  // Indexes the object's values by a criterion, similar to `groupBy`, but for
	  // when you know that your index values will be unique.
	  _.indexBy = group(function(result, value, key) {
	    result[key] = value;
	  });

	  // Counts instances of an object that group by a certain criterion. Pass
	  // either a string attribute to count by, or a function that returns the
	  // criterion.
	  _.countBy = group(function(result, value, key) {
	    if (_.has(result, key)) result[key]++; else result[key] = 1;
	  });

	  // Safely create a real, live array from anything iterable.
	  _.toArray = function(obj) {
	    if (!obj) return [];
	    if (_.isArray(obj)) return slice.call(obj);
	    if (isArrayLike(obj)) return _.map(obj, _.identity);
	    return _.values(obj);
	  };

	  // Return the number of elements in an object.
	  _.size = function(obj) {
	    if (obj == null) return 0;
	    return isArrayLike(obj) ? obj.length : _.keys(obj).length;
	  };

	  // Split a collection into two arrays: one whose elements all satisfy the given
	  // predicate, and one whose elements all do not satisfy the predicate.
	  _.partition = function(obj, predicate, context) {
	    predicate = cb(predicate, context);
	    var pass = [], fail = [];
	    _.each(obj, function(value, key, obj) {
	      (predicate(value, key, obj) ? pass : fail).push(value);
	    });
	    return [pass, fail];
	  };

	  // Array Functions
	  // ---------------

	  // Get the first element of an array. Passing **n** will return the first N
	  // values in the array. Aliased as `head` and `take`. The **guard** check
	  // allows it to work with `_.map`.
	  _.first = _.head = _.take = function(array, n, guard) {
	    if (array == null) return void 0;
	    if (n == null || guard) return array[0];
	    return _.initial(array, array.length - n);
	  };

	  // Returns everything but the last entry of the array. Especially useful on
	  // the arguments object. Passing **n** will return all the values in
	  // the array, excluding the last N.
	  _.initial = function(array, n, guard) {
	    return slice.call(array, 0, Math.max(0, array.length - (n == null || guard ? 1 : n)));
	  };

	  // Get the last element of an array. Passing **n** will return the last N
	  // values in the array.
	  _.last = function(array, n, guard) {
	    if (array == null) return void 0;
	    if (n == null || guard) return array[array.length - 1];
	    return _.rest(array, Math.max(0, array.length - n));
	  };

	  // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
	  // Especially useful on the arguments object. Passing an **n** will return
	  // the rest N values in the array.
	  _.rest = _.tail = _.drop = function(array, n, guard) {
	    return slice.call(array, n == null || guard ? 1 : n);
	  };

	  // Trim out all falsy values from an array.
	  _.compact = function(array) {
	    return _.filter(array, _.identity);
	  };

	  // Internal implementation of a recursive `flatten` function.
	  var flatten = function(input, shallow, strict, startIndex) {
	    var output = [], idx = 0;
	    for (var i = startIndex || 0, length = getLength(input); i < length; i++) {
	      var value = input[i];
	      if (isArrayLike(value) && (_.isArray(value) || _.isArguments(value))) {
	        //flatten current level of array or arguments object
	        if (!shallow) value = flatten(value, shallow, strict);
	        var j = 0, len = value.length;
	        output.length += len;
	        while (j < len) {
	          output[idx++] = value[j++];
	        }
	      } else if (!strict) {
	        output[idx++] = value;
	      }
	    }
	    return output;
	  };

	  // Flatten out an array, either recursively (by default), or just one level.
	  _.flatten = function(array, shallow) {
	    return flatten(array, shallow, false);
	  };

	  // Return a version of the array that does not contain the specified value(s).
	  _.without = function(array) {
	    return _.difference(array, slice.call(arguments, 1));
	  };

	  // Produce a duplicate-free version of the array. If the array has already
	  // been sorted, you have the option of using a faster algorithm.
	  // Aliased as `unique`.
	  _.uniq = _.unique = function(array, isSorted, iteratee, context) {
	    if (!_.isBoolean(isSorted)) {
	      context = iteratee;
	      iteratee = isSorted;
	      isSorted = false;
	    }
	    if (iteratee != null) iteratee = cb(iteratee, context);
	    var result = [];
	    var seen = [];
	    for (var i = 0, length = getLength(array); i < length; i++) {
	      var value = array[i],
	          computed = iteratee ? iteratee(value, i, array) : value;
	      if (isSorted) {
	        if (!i || seen !== computed) result.push(value);
	        seen = computed;
	      } else if (iteratee) {
	        if (!_.contains(seen, computed)) {
	          seen.push(computed);
	          result.push(value);
	        }
	      } else if (!_.contains(result, value)) {
	        result.push(value);
	      }
	    }
	    return result;
	  };

	  // Produce an array that contains the union: each distinct element from all of
	  // the passed-in arrays.
	  _.union = function() {
	    return _.uniq(flatten(arguments, true, true));
	  };

	  // Produce an array that contains every item shared between all the
	  // passed-in arrays.
	  _.intersection = function(array) {
	    var result = [];
	    var argsLength = arguments.length;
	    for (var i = 0, length = getLength(array); i < length; i++) {
	      var item = array[i];
	      if (_.contains(result, item)) continue;
	      for (var j = 1; j < argsLength; j++) {
	        if (!_.contains(arguments[j], item)) break;
	      }
	      if (j === argsLength) result.push(item);
	    }
	    return result;
	  };

	  // Take the difference between one array and a number of other arrays.
	  // Only the elements present in just the first array will remain.
	  _.difference = function(array) {
	    var rest = flatten(arguments, true, true, 1);
	    return _.filter(array, function(value){
	      return !_.contains(rest, value);
	    });
	  };

	  // Zip together multiple lists into a single array -- elements that share
	  // an index go together.
	  _.zip = function() {
	    return _.unzip(arguments);
	  };

	  // Complement of _.zip. Unzip accepts an array of arrays and groups
	  // each array's elements on shared indices
	  _.unzip = function(array) {
	    var length = array && _.max(array, getLength).length || 0;
	    var result = Array(length);

	    for (var index = 0; index < length; index++) {
	      result[index] = _.pluck(array, index);
	    }
	    return result;
	  };

	  // Converts lists into objects. Pass either a single array of `[key, value]`
	  // pairs, or two parallel arrays of the same length -- one of keys, and one of
	  // the corresponding values.
	  _.object = function(list, values) {
	    var result = {};
	    for (var i = 0, length = getLength(list); i < length; i++) {
	      if (values) {
	        result[list[i]] = values[i];
	      } else {
	        result[list[i][0]] = list[i][1];
	      }
	    }
	    return result;
	  };

	  // Generator function to create the findIndex and findLastIndex functions
	  function createPredicateIndexFinder(dir) {
	    return function(array, predicate, context) {
	      predicate = cb(predicate, context);
	      var length = getLength(array);
	      var index = dir > 0 ? 0 : length - 1;
	      for (; index >= 0 && index < length; index += dir) {
	        if (predicate(array[index], index, array)) return index;
	      }
	      return -1;
	    };
	  }

	  // Returns the first index on an array-like that passes a predicate test
	  _.findIndex = createPredicateIndexFinder(1);
	  _.findLastIndex = createPredicateIndexFinder(-1);

	  // Use a comparator function to figure out the smallest index at which
	  // an object should be inserted so as to maintain order. Uses binary search.
	  _.sortedIndex = function(array, obj, iteratee, context) {
	    iteratee = cb(iteratee, context, 1);
	    var value = iteratee(obj);
	    var low = 0, high = getLength(array);
	    while (low < high) {
	      var mid = Math.floor((low + high) / 2);
	      if (iteratee(array[mid]) < value) low = mid + 1; else high = mid;
	    }
	    return low;
	  };

	  // Generator function to create the indexOf and lastIndexOf functions
	  function createIndexFinder(dir, predicateFind, sortedIndex) {
	    return function(array, item, idx) {
	      var i = 0, length = getLength(array);
	      if (typeof idx == 'number') {
	        if (dir > 0) {
	            i = idx >= 0 ? idx : Math.max(idx + length, i);
	        } else {
	            length = idx >= 0 ? Math.min(idx + 1, length) : idx + length + 1;
	        }
	      } else if (sortedIndex && idx && length) {
	        idx = sortedIndex(array, item);
	        return array[idx] === item ? idx : -1;
	      }
	      if (item !== item) {
	        idx = predicateFind(slice.call(array, i, length), _.isNaN);
	        return idx >= 0 ? idx + i : -1;
	      }
	      for (idx = dir > 0 ? i : length - 1; idx >= 0 && idx < length; idx += dir) {
	        if (array[idx] === item) return idx;
	      }
	      return -1;
	    };
	  }

	  // Return the position of the first occurrence of an item in an array,
	  // or -1 if the item is not included in the array.
	  // If the array is large and already in sort order, pass `true`
	  // for **isSorted** to use binary search.
	  _.indexOf = createIndexFinder(1, _.findIndex, _.sortedIndex);
	  _.lastIndexOf = createIndexFinder(-1, _.findLastIndex);

	  // Generate an integer Array containing an arithmetic progression. A port of
	  // the native Python `range()` function. See
	  // [the Python documentation](http://docs.python.org/library/functions.html#range).
	  _.range = function(start, stop, step) {
	    if (stop == null) {
	      stop = start || 0;
	      start = 0;
	    }
	    step = step || 1;

	    var length = Math.max(Math.ceil((stop - start) / step), 0);
	    var range = Array(length);

	    for (var idx = 0; idx < length; idx++, start += step) {
	      range[idx] = start;
	    }

	    return range;
	  };

	  // Function (ahem) Functions
	  // ------------------

	  // Determines whether to execute a function as a constructor
	  // or a normal function with the provided arguments
	  var executeBound = function(sourceFunc, boundFunc, context, callingContext, args) {
	    if (!(callingContext instanceof boundFunc)) return sourceFunc.apply(context, args);
	    var self = baseCreate(sourceFunc.prototype);
	    var result = sourceFunc.apply(self, args);
	    if (_.isObject(result)) return result;
	    return self;
	  };

	  // Create a function bound to a given object (assigning `this`, and arguments,
	  // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
	  // available.
	  _.bind = function(func, context) {
	    if (nativeBind && func.bind === nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
	    if (!_.isFunction(func)) throw new TypeError('Bind must be called on a function');
	    var args = slice.call(arguments, 2);
	    var bound = function() {
	      return executeBound(func, bound, context, this, args.concat(slice.call(arguments)));
	    };
	    return bound;
	  };

	  // Partially apply a function by creating a version that has had some of its
	  // arguments pre-filled, without changing its dynamic `this` context. _ acts
	  // as a placeholder, allowing any combination of arguments to be pre-filled.
	  _.partial = function(func) {
	    var boundArgs = slice.call(arguments, 1);
	    var bound = function() {
	      var position = 0, length = boundArgs.length;
	      var args = Array(length);
	      for (var i = 0; i < length; i++) {
	        args[i] = boundArgs[i] === _ ? arguments[position++] : boundArgs[i];
	      }
	      while (position < arguments.length) args.push(arguments[position++]);
	      return executeBound(func, bound, this, this, args);
	    };
	    return bound;
	  };

	  // Bind a number of an object's methods to that object. Remaining arguments
	  // are the method names to be bound. Useful for ensuring that all callbacks
	  // defined on an object belong to it.
	  _.bindAll = function(obj) {
	    var i, length = arguments.length, key;
	    if (length <= 1) throw new Error('bindAll must be passed function names');
	    for (i = 1; i < length; i++) {
	      key = arguments[i];
	      obj[key] = _.bind(obj[key], obj);
	    }
	    return obj;
	  };

	  // Memoize an expensive function by storing its results.
	  _.memoize = function(func, hasher) {
	    var memoize = function(key) {
	      var cache = memoize.cache;
	      var address = '' + (hasher ? hasher.apply(this, arguments) : key);
	      if (!_.has(cache, address)) cache[address] = func.apply(this, arguments);
	      return cache[address];
	    };
	    memoize.cache = {};
	    return memoize;
	  };

	  // Delays a function for the given number of milliseconds, and then calls
	  // it with the arguments supplied.
	  _.delay = function(func, wait) {
	    var args = slice.call(arguments, 2);
	    return setTimeout(function(){
	      return func.apply(null, args);
	    }, wait);
	  };

	  // Defers a function, scheduling it to run after the current call stack has
	  // cleared.
	  _.defer = _.partial(_.delay, _, 1);

	  // Returns a function, that, when invoked, will only be triggered at most once
	  // during a given window of time. Normally, the throttled function will run
	  // as much as it can, without ever going more than once per `wait` duration;
	  // but if you'd like to disable the execution on the leading edge, pass
	  // `{leading: false}`. To disable execution on the trailing edge, ditto.
	  _.throttle = function(func, wait, options) {
	    var context, args, result;
	    var timeout = null;
	    var previous = 0;
	    if (!options) options = {};
	    var later = function() {
	      previous = options.leading === false ? 0 : _.now();
	      timeout = null;
	      result = func.apply(context, args);
	      if (!timeout) context = args = null;
	    };
	    return function() {
	      var now = _.now();
	      if (!previous && options.leading === false) previous = now;
	      var remaining = wait - (now - previous);
	      context = this;
	      args = arguments;
	      if (remaining <= 0 || remaining > wait) {
	        if (timeout) {
	          clearTimeout(timeout);
	          timeout = null;
	        }
	        previous = now;
	        result = func.apply(context, args);
	        if (!timeout) context = args = null;
	      } else if (!timeout && options.trailing !== false) {
	        timeout = setTimeout(later, remaining);
	      }
	      return result;
	    };
	  };

	  // Returns a function, that, as long as it continues to be invoked, will not
	  // be triggered. The function will be called after it stops being called for
	  // N milliseconds. If `immediate` is passed, trigger the function on the
	  // leading edge, instead of the trailing.
	  _.debounce = function(func, wait, immediate) {
	    var timeout, args, context, timestamp, result;

	    var later = function() {
	      var last = _.now() - timestamp;

	      if (last < wait && last >= 0) {
	        timeout = setTimeout(later, wait - last);
	      } else {
	        timeout = null;
	        if (!immediate) {
	          result = func.apply(context, args);
	          if (!timeout) context = args = null;
	        }
	      }
	    };

	    return function() {
	      context = this;
	      args = arguments;
	      timestamp = _.now();
	      var callNow = immediate && !timeout;
	      if (!timeout) timeout = setTimeout(later, wait);
	      if (callNow) {
	        result = func.apply(context, args);
	        context = args = null;
	      }

	      return result;
	    };
	  };

	  // Returns the first function passed as an argument to the second,
	  // allowing you to adjust arguments, run code before and after, and
	  // conditionally execute the original function.
	  _.wrap = function(func, wrapper) {
	    return _.partial(wrapper, func);
	  };

	  // Returns a negated version of the passed-in predicate.
	  _.negate = function(predicate) {
	    return function() {
	      return !predicate.apply(this, arguments);
	    };
	  };

	  // Returns a function that is the composition of a list of functions, each
	  // consuming the return value of the function that follows.
	  _.compose = function() {
	    var args = arguments;
	    var start = args.length - 1;
	    return function() {
	      var i = start;
	      var result = args[start].apply(this, arguments);
	      while (i--) result = args[i].call(this, result);
	      return result;
	    };
	  };

	  // Returns a function that will only be executed on and after the Nth call.
	  _.after = function(times, func) {
	    return function() {
	      if (--times < 1) {
	        return func.apply(this, arguments);
	      }
	    };
	  };

	  // Returns a function that will only be executed up to (but not including) the Nth call.
	  _.before = function(times, func) {
	    var memo;
	    return function() {
	      if (--times > 0) {
	        memo = func.apply(this, arguments);
	      }
	      if (times <= 1) func = null;
	      return memo;
	    };
	  };

	  // Returns a function that will be executed at most one time, no matter how
	  // often you call it. Useful for lazy initialization.
	  _.once = _.partial(_.before, 2);

	  // Object Functions
	  // ----------------

	  // Keys in IE < 9 that won't be iterated by `for key in ...` and thus missed.
	  var hasEnumBug = !{toString: null}.propertyIsEnumerable('toString');
	  var nonEnumerableProps = ['valueOf', 'isPrototypeOf', 'toString',
	                      'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'];

	  function collectNonEnumProps(obj, keys) {
	    var nonEnumIdx = nonEnumerableProps.length;
	    var constructor = obj.constructor;
	    var proto = (_.isFunction(constructor) && constructor.prototype) || ObjProto;

	    // Constructor is a special case.
	    var prop = 'constructor';
	    if (_.has(obj, prop) && !_.contains(keys, prop)) keys.push(prop);

	    while (nonEnumIdx--) {
	      prop = nonEnumerableProps[nonEnumIdx];
	      if (prop in obj && obj[prop] !== proto[prop] && !_.contains(keys, prop)) {
	        keys.push(prop);
	      }
	    }
	  }

	  // Retrieve the names of an object's own properties.
	  // Delegates to **ECMAScript 5**'s native `Object.keys`
	  _.keys = function(obj) {
	    if (!_.isObject(obj)) return [];
	    if (nativeKeys) return nativeKeys(obj);
	    var keys = [];
	    for (var key in obj) if (_.has(obj, key)) keys.push(key);
	    // Ahem, IE < 9.
	    if (hasEnumBug) collectNonEnumProps(obj, keys);
	    return keys;
	  };

	  // Retrieve all the property names of an object.
	  _.allKeys = function(obj) {
	    if (!_.isObject(obj)) return [];
	    var keys = [];
	    for (var key in obj) keys.push(key);
	    // Ahem, IE < 9.
	    if (hasEnumBug) collectNonEnumProps(obj, keys);
	    return keys;
	  };

	  // Retrieve the values of an object's properties.
	  _.values = function(obj) {
	    var keys = _.keys(obj);
	    var length = keys.length;
	    var values = Array(length);
	    for (var i = 0; i < length; i++) {
	      values[i] = obj[keys[i]];
	    }
	    return values;
	  };

	  // Returns the results of applying the iteratee to each element of the object
	  // In contrast to _.map it returns an object
	  _.mapObject = function(obj, iteratee, context) {
	    iteratee = cb(iteratee, context);
	    var keys =  _.keys(obj),
	          length = keys.length,
	          results = {},
	          currentKey;
	      for (var index = 0; index < length; index++) {
	        currentKey = keys[index];
	        results[currentKey] = iteratee(obj[currentKey], currentKey, obj);
	      }
	      return results;
	  };

	  // Convert an object into a list of `[key, value]` pairs.
	  _.pairs = function(obj) {
	    var keys = _.keys(obj);
	    var length = keys.length;
	    var pairs = Array(length);
	    for (var i = 0; i < length; i++) {
	      pairs[i] = [keys[i], obj[keys[i]]];
	    }
	    return pairs;
	  };

	  // Invert the keys and values of an object. The values must be serializable.
	  _.invert = function(obj) {
	    var result = {};
	    var keys = _.keys(obj);
	    for (var i = 0, length = keys.length; i < length; i++) {
	      result[obj[keys[i]]] = keys[i];
	    }
	    return result;
	  };

	  // Return a sorted list of the function names available on the object.
	  // Aliased as `methods`
	  _.functions = _.methods = function(obj) {
	    var names = [];
	    for (var key in obj) {
	      if (_.isFunction(obj[key])) names.push(key);
	    }
	    return names.sort();
	  };

	  // Extend a given object with all the properties in passed-in object(s).
	  _.extend = createAssigner(_.allKeys);

	  // Assigns a given object with all the own properties in the passed-in object(s)
	  // (https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
	  _.extendOwn = _.assign = createAssigner(_.keys);

	  // Returns the first key on an object that passes a predicate test
	  _.findKey = function(obj, predicate, context) {
	    predicate = cb(predicate, context);
	    var keys = _.keys(obj), key;
	    for (var i = 0, length = keys.length; i < length; i++) {
	      key = keys[i];
	      if (predicate(obj[key], key, obj)) return key;
	    }
	  };

	  // Return a copy of the object only containing the whitelisted properties.
	  _.pick = function(object, oiteratee, context) {
	    var result = {}, obj = object, iteratee, keys;
	    if (obj == null) return result;
	    if (_.isFunction(oiteratee)) {
	      keys = _.allKeys(obj);
	      iteratee = optimizeCb(oiteratee, context);
	    } else {
	      keys = flatten(arguments, false, false, 1);
	      iteratee = function(value, key, obj) { return key in obj; };
	      obj = Object(obj);
	    }
	    for (var i = 0, length = keys.length; i < length; i++) {
	      var key = keys[i];
	      var value = obj[key];
	      if (iteratee(value, key, obj)) result[key] = value;
	    }
	    return result;
	  };

	   // Return a copy of the object without the blacklisted properties.
	  _.omit = function(obj, iteratee, context) {
	    if (_.isFunction(iteratee)) {
	      iteratee = _.negate(iteratee);
	    } else {
	      var keys = _.map(flatten(arguments, false, false, 1), String);
	      iteratee = function(value, key) {
	        return !_.contains(keys, key);
	      };
	    }
	    return _.pick(obj, iteratee, context);
	  };

	  // Fill in a given object with default properties.
	  _.defaults = createAssigner(_.allKeys, true);

	  // Creates an object that inherits from the given prototype object.
	  // If additional properties are provided then they will be added to the
	  // created object.
	  _.create = function(prototype, props) {
	    var result = baseCreate(prototype);
	    if (props) _.extendOwn(result, props);
	    return result;
	  };

	  // Create a (shallow-cloned) duplicate of an object.
	  _.clone = function(obj) {
	    if (!_.isObject(obj)) return obj;
	    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
	  };

	  // Invokes interceptor with the obj, and then returns obj.
	  // The primary purpose of this method is to "tap into" a method chain, in
	  // order to perform operations on intermediate results within the chain.
	  _.tap = function(obj, interceptor) {
	    interceptor(obj);
	    return obj;
	  };

	  // Returns whether an object has a given set of `key:value` pairs.
	  _.isMatch = function(object, attrs) {
	    var keys = _.keys(attrs), length = keys.length;
	    if (object == null) return !length;
	    var obj = Object(object);
	    for (var i = 0; i < length; i++) {
	      var key = keys[i];
	      if (attrs[key] !== obj[key] || !(key in obj)) return false;
	    }
	    return true;
	  };


	  // Internal recursive comparison function for `isEqual`.
	  var eq = function(a, b, aStack, bStack) {
	    // Identical objects are equal. `0 === -0`, but they aren't identical.
	    // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
	    if (a === b) return a !== 0 || 1 / a === 1 / b;
	    // A strict comparison is necessary because `null == undefined`.
	    if (a == null || b == null) return a === b;
	    // Unwrap any wrapped objects.
	    if (a instanceof _) a = a._wrapped;
	    if (b instanceof _) b = b._wrapped;
	    // Compare `[[Class]]` names.
	    var className = toString.call(a);
	    if (className !== toString.call(b)) return false;
	    switch (className) {
	      // Strings, numbers, regular expressions, dates, and booleans are compared by value.
	      case '[object RegExp]':
	      // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
	      case '[object String]':
	        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
	        // equivalent to `new String("5")`.
	        return '' + a === '' + b;
	      case '[object Number]':
	        // `NaN`s are equivalent, but non-reflexive.
	        // Object(NaN) is equivalent to NaN
	        if (+a !== +a) return +b !== +b;
	        // An `egal` comparison is performed for other numeric values.
	        return +a === 0 ? 1 / +a === 1 / b : +a === +b;
	      case '[object Date]':
	      case '[object Boolean]':
	        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
	        // millisecond representations. Note that invalid dates with millisecond representations
	        // of `NaN` are not equivalent.
	        return +a === +b;
	    }

	    var areArrays = className === '[object Array]';
	    if (!areArrays) {
	      if (typeof a != 'object' || typeof b != 'object') return false;

	      // Objects with different constructors are not equivalent, but `Object`s or `Array`s
	      // from different frames are.
	      var aCtor = a.constructor, bCtor = b.constructor;
	      if (aCtor !== bCtor && !(_.isFunction(aCtor) && aCtor instanceof aCtor &&
	                               _.isFunction(bCtor) && bCtor instanceof bCtor)
	                          && ('constructor' in a && 'constructor' in b)) {
	        return false;
	      }
	    }
	    // Assume equality for cyclic structures. The algorithm for detecting cyclic
	    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.

	    // Initializing stack of traversed objects.
	    // It's done here since we only need them for objects and arrays comparison.
	    aStack = aStack || [];
	    bStack = bStack || [];
	    var length = aStack.length;
	    while (length--) {
	      // Linear search. Performance is inversely proportional to the number of
	      // unique nested structures.
	      if (aStack[length] === a) return bStack[length] === b;
	    }

	    // Add the first object to the stack of traversed objects.
	    aStack.push(a);
	    bStack.push(b);

	    // Recursively compare objects and arrays.
	    if (areArrays) {
	      // Compare array lengths to determine if a deep comparison is necessary.
	      length = a.length;
	      if (length !== b.length) return false;
	      // Deep compare the contents, ignoring non-numeric properties.
	      while (length--) {
	        if (!eq(a[length], b[length], aStack, bStack)) return false;
	      }
	    } else {
	      // Deep compare objects.
	      var keys = _.keys(a), key;
	      length = keys.length;
	      // Ensure that both objects contain the same number of properties before comparing deep equality.
	      if (_.keys(b).length !== length) return false;
	      while (length--) {
	        // Deep compare each member
	        key = keys[length];
	        if (!(_.has(b, key) && eq(a[key], b[key], aStack, bStack))) return false;
	      }
	    }
	    // Remove the first object from the stack of traversed objects.
	    aStack.pop();
	    bStack.pop();
	    return true;
	  };

	  // Perform a deep comparison to check if two objects are equal.
	  _.isEqual = function(a, b) {
	    return eq(a, b);
	  };

	  // Is a given array, string, or object empty?
	  // An "empty" object has no enumerable own-properties.
	  _.isEmpty = function(obj) {
	    if (obj == null) return true;
	    if (isArrayLike(obj) && (_.isArray(obj) || _.isString(obj) || _.isArguments(obj))) return obj.length === 0;
	    return _.keys(obj).length === 0;
	  };

	  // Is a given value a DOM element?
	  _.isElement = function(obj) {
	    return !!(obj && obj.nodeType === 1);
	  };

	  // Is a given value an array?
	  // Delegates to ECMA5's native Array.isArray
	  _.isArray = nativeIsArray || function(obj) {
	    return toString.call(obj) === '[object Array]';
	  };

	  // Is a given variable an object?
	  _.isObject = function(obj) {
	    var type = typeof obj;
	    return type === 'function' || type === 'object' && !!obj;
	  };

	  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp, isError.
	  _.each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error'], function(name) {
	    _['is' + name] = function(obj) {
	      return toString.call(obj) === '[object ' + name + ']';
	    };
	  });

	  // Define a fallback version of the method in browsers (ahem, IE < 9), where
	  // there isn't any inspectable "Arguments" type.
	  if (!_.isArguments(arguments)) {
	    _.isArguments = function(obj) {
	      return _.has(obj, 'callee');
	    };
	  }

	  // Optimize `isFunction` if appropriate. Work around some typeof bugs in old v8,
	  // IE 11 (#1621), and in Safari 8 (#1929).
	  if (typeof /./ != 'function' && typeof Int8Array != 'object') {
	    _.isFunction = function(obj) {
	      return typeof obj == 'function' || false;
	    };
	  }

	  // Is a given object a finite number?
	  _.isFinite = function(obj) {
	    return isFinite(obj) && !isNaN(parseFloat(obj));
	  };

	  // Is the given value `NaN`? (NaN is the only number which does not equal itself).
	  _.isNaN = function(obj) {
	    return _.isNumber(obj) && obj !== +obj;
	  };

	  // Is a given value a boolean?
	  _.isBoolean = function(obj) {
	    return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
	  };

	  // Is a given value equal to null?
	  _.isNull = function(obj) {
	    return obj === null;
	  };

	  // Is a given variable undefined?
	  _.isUndefined = function(obj) {
	    return obj === void 0;
	  };

	  // Shortcut function for checking if an object has a given property directly
	  // on itself (in other words, not on a prototype).
	  _.has = function(obj, key) {
	    return obj != null && hasOwnProperty.call(obj, key);
	  };

	  // Utility Functions
	  // -----------------

	  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
	  // previous owner. Returns a reference to the Underscore object.
	  _.noConflict = function() {
	    root._ = previousUnderscore;
	    return this;
	  };

	  // Keep the identity function around for default iteratees.
	  _.identity = function(value) {
	    return value;
	  };

	  // Predicate-generating functions. Often useful outside of Underscore.
	  _.constant = function(value) {
	    return function() {
	      return value;
	    };
	  };

	  _.noop = function(){};

	  _.property = property;

	  // Generates a function for a given object that returns a given property.
	  _.propertyOf = function(obj) {
	    return obj == null ? function(){} : function(key) {
	      return obj[key];
	    };
	  };

	  // Returns a predicate for checking whether an object has a given set of
	  // `key:value` pairs.
	  _.matcher = _.matches = function(attrs) {
	    attrs = _.extendOwn({}, attrs);
	    return function(obj) {
	      return _.isMatch(obj, attrs);
	    };
	  };

	  // Run a function **n** times.
	  _.times = function(n, iteratee, context) {
	    var accum = Array(Math.max(0, n));
	    iteratee = optimizeCb(iteratee, context, 1);
	    for (var i = 0; i < n; i++) accum[i] = iteratee(i);
	    return accum;
	  };

	  // Return a random integer between min and max (inclusive).
	  _.random = function(min, max) {
	    if (max == null) {
	      max = min;
	      min = 0;
	    }
	    return min + Math.floor(Math.random() * (max - min + 1));
	  };

	  // A (possibly faster) way to get the current timestamp as an integer.
	  _.now = Date.now || function() {
	    return new Date().getTime();
	  };

	   // List of HTML entities for escaping.
	  var escapeMap = {
	    '&': '&amp;',
	    '<': '&lt;',
	    '>': '&gt;',
	    '"': '&quot;',
	    "'": '&#x27;',
	    '`': '&#x60;'
	  };
	  var unescapeMap = _.invert(escapeMap);

	  // Functions for escaping and unescaping strings to/from HTML interpolation.
	  var createEscaper = function(map) {
	    var escaper = function(match) {
	      return map[match];
	    };
	    // Regexes for identifying a key that needs to be escaped
	    var source = '(?:' + _.keys(map).join('|') + ')';
	    var testRegexp = RegExp(source);
	    var replaceRegexp = RegExp(source, 'g');
	    return function(string) {
	      string = string == null ? '' : '' + string;
	      return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
	    };
	  };
	  _.escape = createEscaper(escapeMap);
	  _.unescape = createEscaper(unescapeMap);

	  // If the value of the named `property` is a function then invoke it with the
	  // `object` as context; otherwise, return it.
	  _.result = function(object, property, fallback) {
	    var value = object == null ? void 0 : object[property];
	    if (value === void 0) {
	      value = fallback;
	    }
	    return _.isFunction(value) ? value.call(object) : value;
	  };

	  // Generate a unique integer id (unique within the entire client session).
	  // Useful for temporary DOM ids.
	  var idCounter = 0;
	  _.uniqueId = function(prefix) {
	    var id = ++idCounter + '';
	    return prefix ? prefix + id : id;
	  };

	  // By default, Underscore uses ERB-style template delimiters, change the
	  // following template settings to use alternative delimiters.
	  _.templateSettings = {
	    evaluate    : /<%([\s\S]+?)%>/g,
	    interpolate : /<%=([\s\S]+?)%>/g,
	    escape      : /<%-([\s\S]+?)%>/g
	  };

	  // When customizing `templateSettings`, if you don't want to define an
	  // interpolation, evaluation or escaping regex, we need one that is
	  // guaranteed not to match.
	  var noMatch = /(.)^/;

	  // Certain characters need to be escaped so that they can be put into a
	  // string literal.
	  var escapes = {
	    "'":      "'",
	    '\\':     '\\',
	    '\r':     'r',
	    '\n':     'n',
	    '\u2028': 'u2028',
	    '\u2029': 'u2029'
	  };

	  var escaper = /\\|'|\r|\n|\u2028|\u2029/g;

	  var escapeChar = function(match) {
	    return '\\' + escapes[match];
	  };

	  // JavaScript micro-templating, similar to John Resig's implementation.
	  // Underscore templating handles arbitrary delimiters, preserves whitespace,
	  // and correctly escapes quotes within interpolated code.
	  // NB: `oldSettings` only exists for backwards compatibility.
	  _.template = function(text, settings, oldSettings) {
	    if (!settings && oldSettings) settings = oldSettings;
	    settings = _.defaults({}, settings, _.templateSettings);

	    // Combine delimiters into one regular expression via alternation.
	    var matcher = RegExp([
	      (settings.escape || noMatch).source,
	      (settings.interpolate || noMatch).source,
	      (settings.evaluate || noMatch).source
	    ].join('|') + '|$', 'g');

	    // Compile the template source, escaping string literals appropriately.
	    var index = 0;
	    var source = "__p+='";
	    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
	      source += text.slice(index, offset).replace(escaper, escapeChar);
	      index = offset + match.length;

	      if (escape) {
	        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
	      } else if (interpolate) {
	        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
	      } else if (evaluate) {
	        source += "';\n" + evaluate + "\n__p+='";
	      }

	      // Adobe VMs need the match returned to produce the correct offest.
	      return match;
	    });
	    source += "';\n";

	    // If a variable is not specified, place data values in local scope.
	    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

	    source = "var __t,__p='',__j=Array.prototype.join," +
	      "print=function(){__p+=__j.call(arguments,'');};\n" +
	      source + 'return __p;\n';

	    try {
	      var render = new Function(settings.variable || 'obj', '_', source);
	    } catch (e) {
	      e.source = source;
	      throw e;
	    }

	    var template = function(data) {
	      return render.call(this, data, _);
	    };

	    // Provide the compiled source as a convenience for precompilation.
	    var argument = settings.variable || 'obj';
	    template.source = 'function(' + argument + '){\n' + source + '}';

	    return template;
	  };

	  // Add a "chain" function. Start chaining a wrapped Underscore object.
	  _.chain = function(obj) {
	    var instance = _(obj);
	    instance._chain = true;
	    return instance;
	  };

	  // OOP
	  // ---------------
	  // If Underscore is called as a function, it returns a wrapped object that
	  // can be used OO-style. This wrapper holds altered versions of all the
	  // underscore functions. Wrapped objects may be chained.

	  // Helper function to continue chaining intermediate results.
	  var result = function(instance, obj) {
	    return instance._chain ? _(obj).chain() : obj;
	  };

	  // Add your own custom functions to the Underscore object.
	  _.mixin = function(obj) {
	    _.each(_.functions(obj), function(name) {
	      var func = _[name] = obj[name];
	      _.prototype[name] = function() {
	        var args = [this._wrapped];
	        push.apply(args, arguments);
	        return result(this, func.apply(_, args));
	      };
	    });
	  };

	  // Add all of the Underscore functions to the wrapper object.
	  _.mixin(_);

	  // Add all mutator Array functions to the wrapper.
	  _.each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
	    var method = ArrayProto[name];
	    _.prototype[name] = function() {
	      var obj = this._wrapped;
	      method.apply(obj, arguments);
	      if ((name === 'shift' || name === 'splice') && obj.length === 0) delete obj[0];
	      return result(this, obj);
	    };
	  });

	  // Add all accessor Array functions to the wrapper.
	  _.each(['concat', 'join', 'slice'], function(name) {
	    var method = ArrayProto[name];
	    _.prototype[name] = function() {
	      return result(this, method.apply(this._wrapped, arguments));
	    };
	  });

	  // Extracts the result from a wrapped and chained object.
	  _.prototype.value = function() {
	    return this._wrapped;
	  };

	  // Provide unwrapping proxy for some methods used in engine operations
	  // such as arithmetic and JSON stringification.
	  _.prototype.valueOf = _.prototype.toJSON = _.prototype.value;

	  _.prototype.toString = function() {
	    return '' + this._wrapped;
	  };

	  // AMD registration happens at the end for compatibility with AMD loaders
	  // that may not enforce next-turn semantics on modules. Even though general
	  // practice for AMD registration is to be anonymous, underscore registers
	  // as a named module because, like jQuery, it is a base library that is
	  // popular enough to be bundled in a third party lib, but not be part of
	  // an AMD load request. Those cases could generate an error when an
	  // anonymous define() is called outside of a loader request.
	  if (true) {
	    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function() {
	      return _;
	    }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	  }
	}.call(this));


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	//     Backbone.FormView 0.8.3

	//     (c) 2014 James Ballantine, 1stdibs.com Inc.
	//     Backbone.FormView may be freely distributed under the MIT license.
	//     For all details and documentation:
	//     https://github.com/1stdibs/backbone-base-and-form-view

	/*global Backbone, jQuery, _, window, exports, module, jQuery, require */
	(function (root) {
	    "use strict";

	    var Backbone = root.Backbone,
	        _ = root._;

	    if (true) {
	        _ = __webpack_require__(17);
	        Backbone = __webpack_require__(15);
	        module.exports = Backbone;
	    }

	    if (!Backbone || !Backbone.BaseView) {
	        throw new Error('Backbone and Backbone.BaseView required');
	    }

	    var
	        FieldView,
	        RadioListView,
	        SelectListView,
	        CheckListView,
	        CheckBoxView,
	        FieldSetView,
	        CollectionFormRowView,
	        CollectionFieldSetView,
	        // Local copies
	        Model = Backbone.Model,
	        Collection = Backbone.Collection,
	        each = _.each,
	        extend = _.extend,
	        defaults = _.defaults,
	        clone = _.clone,
	        isUndefined = _.isUndefined,
	        isFunction = _.isFunction,
	        isArray = _.isArray,
	        isString = _.isString,
	        result = _.result,
	        toStr = String,

	        // Form Disable Mixin -- added to FormView prototype's
	        // in order to allow disabling and enabling fields.
	        formViewDisableMixin = {
	            /**
	             * Disables the form by invoking the disable method
	             * on all fields that implement it. If a field doesn't
	             * implement this method, it will not be disabled.
	             * @memberOf Backbone.FormView#
	             * @return {Backbone.FormView}
	             */
	            disable: function () {
	                this.subs.each(function (field) {
	                    if (isFunction(field.disable)) { field.disable(); }
	                });
	                return this;
	            },
	            /**
	             * The reverse of disable, naturally. Invokes enable method
	             * on all fields and field sets.
	             * @memberOf Backbone.FormView#
	             * @return {Backbone.FormView}
	             */
	            enable: function () {
	                this.subs.each(function (field) {
	                    if (isFunction(field.enable)) { field.enable(); }
	                });
	                return this;
	            }
	        },

	        /**
	         * Used by the FieldSet and CollectionFieldSet function
	         * @return {string} A prefix for a field name/id
	         */
	        getFieldPrefix = function () {
	            var prefPref = (this.parentView && this.parentView.getFieldPrefix) ? this.parentView.getFieldPrefix() : '';
	            return prefPref + this.fieldSetName + '-';
	        },

	        /** 
	         * Function used by FormView, CollectionFormView, FieldSet,
	         * CollectionFieldSet, and the FieldViews to generate
	         * template variables in the 'render' methods
	         * @return {object}
	         */
	        getTemplateVars = function () {
	            return extend({}, this._defaultTemplateVars, result(this, 'templateVars'));
	        },

	        // ------------------------
	        // Local utility functions

	        // Utility function to help find submodels and sub collections in _setupSubViewConfig
	        strTo = function (string, obj, instOf) {
	            if (string instanceof instOf) {
	                return string;
	            }
	            if (string === true && obj instanceof instOf) {
	                return obj;
	            }
	            if (!obj) { return null; }
	            obj = obj.get(string);
	            if (obj instanceof instOf) {
	                return obj;
	            }
	            return null;
	        },
	        // Utility function used by FormView to determine what model the options object should use.
	        // Looks to see if options.model is already a Backbone Model, but if its a string, tries to find
	        // sub model of the parent model. If that doesn't work, uses the parent model. If the options
	        // doesn't specify a model to use, then we do the same thing with the schema key (the field key)
	        getSubModel = function (optionModel, key, model) {
	            return optionModel ? (strTo(optionModel, model, Model) || model) : strTo(key, model, Model) || model;
	        },
	        // Similar to getSubModel except for collections and does not pass the parent collection if no option
	        // collection is specified and the schema key cannot locate a sub collection, then null is returned
	        getSubCollection = function (optionCollection, key, model, collection) {
	            if (optionCollection) {
	                return strTo(optionCollection, model, Collection) || collection;
	            }
	            return strTo(key, model, Collection) || null;
	        };


	    // ======================================================================================
	    // FORM VIEW
	    // ======================================================================================

	    /**
	     * An extension of {@link Backbone.BaseView} that lets you set up a form easily by making 
	     * subviews automatically using a 'schema' and defining a framework to let you create elaborate 
	     * forms with less code. You can define a schema by extending this view and specifying a 'schema'
	     * prototype property, or by passing a 'schema' option when you initialize the view.
	     * @constructor Backbone.FormView
	     * @class Backbone.FormView
	     * @extends Backbone.BaseView
	     *
	     * @property {Object} [options] - Options that you can pass to init or add as properties on extended view
	     * @property {Function|String} [options.template]
	     *       An underscore template function or a string that serves as the source
	     *       of an underscore template function. In order for the FormView's "render"
	     *       method to work, the template requires a data-fields attribute to be set
	     *       on an element in the template. This element will serve as a wrapper
	     *       for all the subViews that will be generated on render.
	     * @property {Object} [options.schema] 
	     *       Schema to use to create form fields automatically on render (or initialization
	     *       if setupOnInit is true)
	     * @property {Boolean} [options.setupOnInit]
	     *      The schema will be used to set up all subView (the fields) instances by
	     *      default when the FormView's render method is invoked, but unless setupOnInit
	     *      is true, and instead the instances are created when initialize is called. If
	     *      this is false, you can still setup the subViews anytime by invoking the
	     *      setupFields method.
	     * @property {String[]} [options.fieldOrder]
	     *      Should represent the order that you want the fields to be rendered in,
	     *      otherwise they will be rendered in the order they appear in the schema.
	     *      Each index should match a key defined in your schema.
	     * @property {Object} [options.templateVars]
	     *      an object of variables that will be passed to the template
	     * @property {Boolean} [options.autoUpdateModel]
	     *      The FormView is designed to work with nested model and collection
	     *      paradigms seen in frameworks like BackboneRelational. Some of
	     *      these frameworks will recreate models and collections when the top
	     *      level model syncs with the server or the user sets a new model
	     *      on the property manually, so passing 'true' here will have the
	     *      form view try to automatically change the model properties of
	     *      the fields and fieldsets to use the correct model based on 
	     *      the top level form model.
	     * @property {Boolean} [options.twoWay] 
	     *      If the fields support it (which the default fields do), then when
	     *      a model is updated, and not by the field, then the field will
	     *      automatically re-render the input to display the updated value
	     *      to the user.
	     *
	     * @example
	     * // schema object that can be a property on the view or an option passed to the form
	     * schema : {
	     *      // The schema key
	     *      fieldname: {
	     *         type: 'Text',
	     *
	     *         // The options object is passed to the Field View on init.
	     *         // Some options are added automatically.
	     *         options: {
	     *             // If you don't specify a model, the parent's model (ie the form views model)
	     *             // will be passed automatically, or if a submodel is found that matches
	     *             // 'fieldname', that will be retrieved automatically
	     *             model: subModelName
	     *
	     *             // Works in a similar way as the model property does, except that if
	     *             // no collection string/instance is provided, and no sub collection
	     *             // matching 'fieldname' attached to the parent model, then no collection
	     *             // will be attached to the subView
	     *             collection: subCollectionName
	     *
	     *             // if the 'type' is view that is an instance FormView (e.g. FieldSet)
	     *             // then you can pass a schema as an option and then the formView will
	     *             // recursively setup the schema for that FormView fieldset as well
	     *             schema: {
	     *                 // Fieldset fields
	     *             }
	     *
	     *             ... // Other options you would like to pass to the type upon init
	     *         }
	     *     },
	     *     ... // Other field schemas
	     * }
	     * 
	     */
	    Backbone.FormView = Backbone.BaseView.extend({
	        tagName: 'form',
	        className: 'form-horizontal',
	        fieldAlias: {
	            'Text' : 'Backbone.fields.FieldView',
	            'RadioList' : 'Backbone.fields.RadioListView',
	            'CheckList' : 'Backbone.fields.CheckListView',
	            'Select' : 'Backbone.fields.SelectListView',
	            'FieldSet' : 'Backbone.FieldSetView',
	            'Checkbox' : 'Backbone.fields.CheckBoxView',
	            'CollectionField' : 'Backbone.CollectionFieldSetView'
	        },
	        template: _.template('<div data-fields=""></div>'),
	        fieldsWrapper: '[data-fields]:first',
	        initialize: function (options) {
	            options = this.options = defaults(options || {}, this.options);
	            var schema = options.schema || this.schema,
	                setUpOnInit = !isUndefined(options.setupOnInit) ? options.setupOnInit : this.setupOnInit;
	            // this.subs.autoInitSingletons = true;
	            extend(this, {
	                templateVars : options.templateVars || this.templateVars || {},
	                setupOnInit : options.setupOnInit || this.setupOnInit,
	                validateOnSet : (!isUndefined(options.validateOnSet)) ? options.validateOnSet : this.validateOnSet,
	                twoWay: (!isUndefined(options.twoWay)) ? options.twoWay : this.twoWay,
	                autoUpdateModel: (!isUndefined(options.autoUpdateModel)) ? options.autoUpdateModel : this.autoUpdateModel,
	                fieldsWrapper: options.fieldsWrapper || this.fieldsWrapper
	            });
	            this._defaultTemplateVars = this._defaultTemplateVars || { label: options.label };
	            this.template = options.template || (isString(this.template) ? _.template(this.template) : this.template);
	            this.subViewConfig = options.subViewConfig || null;
	            if (schema) {
	                this.setSchema(schema);
	                if (setUpOnInit) { this.setupFields(); }
	            }
	        },
	        /**
	         * Set a new schema for the form.
	         * @memberOf Backbone.FormView#
	         * @param {Object} schema
	         * @return {Backbone.FormView}
	         */
	        setSchema: function (schema) {
	            this.schema = schema || this.schema;
	            return this;
	        },
	        /**
	         * The subViewConfig is the schema fleshed by the 
	         * _setupSubViewConfig method. Set the subViewConfig
	         * property and register the config with the subview
	         * manager. The property autoInitSingletons on the
	         * SubViewManager is true by default with a FormView
	         * and that will instantiate the SubViews when the
	         * config is added.
	         * @memberOf Backbone.FormView#
	         * @param {object} config
	         * @return {Backbone.FormView}
	         */
	        setSubViewConfig: function (config) {
	            this.subViewConfig = config;
	            this.subs.addConfig(config);
	            return this;
	        },
	        /**
	         * Should return true if fields have been
	         * set up at least once.
	         * @memberOf Backbone.FormView#
	         * @return {Boolean}
	         */
	        hasSetupFields: function () {
	            return this._hasSetupFields;
	        },
	        /**
	         * Creates the subViewConfig property, derived from the
	         * form's schema. The subViewConfig is like the schema
	         * but fleshed out for the baseView's subView manager.
	         * @memberOf Backbone.FormView#
	         * @return {Backbone.FormView}
	         */
	        setupFields: function () {
	            var config = this._setupSubViewConfig(result(this, 'schema'));
	            this.setSubViewConfig(config);
	            this.subs.createSingletons(); // Instantiate the fields from the config
	            this._setHasSetupFields(true);
	            return this;
	        },
	        /**
	         * If your form is not automatically setting model
	         * properties when the user exits a field, you can
	         * use this method to set the values on the model
	         * from the inputs all at once.
	         * @memberOf Backbone.FormView#
	         * @return {Backbone.FormView}
	         */
	        setModelAttrs: function () {
	            this.subs.each(function (field) {
	                if (isFunction(field.setModelAttrs)) {
	                    field.setModelAttrs();
	                }
	            });
	            return this;
	        },
	        /**
	         * Get the wrapper for the field subView elements
	         * @memberOf Backbone.FormView#
	         * @return {$} 
	         */
	        getFieldsWrapper: function () {
	            var $wrapper = this.$(this.fieldsWrapper);
	            if (!$wrapper.length) {
	                return this.$el;
	            }
	            return $wrapper.first();
	        },
	        /**
	         * If your subviews (aka the fields) set in the schema aren't setup yet, then this method
	         * does that. Regardless, this method renders the shell template, and then renders all
	         * subViews. If your template has an element with data-fields defined, the fields will be
	         * appended to that. Otherwise they will be directly appended to the template.
	         * @memberOf Backbone.FormView#
	         * @return {Backbone.FormView}
	         */
	        render : function () {
	            var order = this.options.fieldOrder || this.fieldOrder;

	            this.subs.detachElems();
	            if (!this.hasSetupFields()) {
	                this.setupFields();
	            }
	            this.$el.html(this.template(this._getTemplateVars()));

	            if (order && order.length) {
	                order = order.slice(0);
	                while (order.length) {
	                    this.subs.renderByKey(order.shift(), { useLocation: true });
	                }
	            } else {
	                this.subs.renderAppend();
	            }

	            return this;
	        },
	        _setHasSetupFields: function (hasSetupFields) {
	            this._hasSetupFields = hasSetupFields;
	            return this;
	        },
	        _setupSubViewConfig: function (baseSchema, model, collection) {
	            var options,
	                collec,
	                schema,
	                self = this,
	                subViewConfig = {};

	            model = model || this.model;
	            collection = collection || this.collection;

	            each(baseSchema, function (origSchema, key) {
	                schema = subViewConfig[key] = clone(origSchema);
	                schema.options = (isFunction(origSchema.options)) ? origSchema.options.call(this) : clone(origSchema.options || {});
	                options = schema.options = schema.options || {};
	                schema.singleton = (schema.singleton === undefined) ? true : schema.singleton;
	                schema.construct = self.fieldAlias[schema.type || schema.construct] || schema.type || schema.construct;
	                schema.location = schema.location || self.fieldsWrapper;
	                options.model = getSubModel(options.model, key, model);
	                if (this.validateOnSet) { options.setOpts = defaults(options.setOpts || {}, { validate: true }); }
	                if (this.twoWay) { options.twoWay = (!isUndefined(options.twoWay)) ? options.twoWay : this.twoWay; }
	                collec = getSubCollection(options.collection, key, model, collection);
	                if (collec) { options.collection = collec; }
	                if (options.schema) {
	                    options.subViewConfig = self._setupSubViewConfig(options.schema, options.model);
	                }
	                options.schemaKey = key;
	            }, this);
	            return subViewConfig;
	        },
	        /**
	         * A reference to the template vars function
	         * @type {function}
	         */
	        _getTemplateVars: getTemplateVars
	    }, {
	        /**
	         * Add a Field Alias to the list of field aliases. For example
	         * You have a view constructor DateFieldView and you want to 
	         * make it easy to put that field in a schema, you can use this
	         * static function to add an allias 'Date' for that constructor
	         * @memberOf Backbone.FormView
	         * @param {String} alias     Name of the alias
	         * @param {String|Function} construct Constructor used for the field
	         */
	        addFieldAlias: function (alias, construct) {
	            var aliases = {}, currAliases = Backbone.FormView.prototype.fieldAlias;
	            if (construct) {
	                aliases[alias] = construct;
	            } else { aliases = alias; }
	            defaults(currAliases, aliases);
	        }
	    });

	    // Add disable/enable functionality
	    extend(Backbone.FormView.prototype, formViewDisableMixin);

	    // ====================================================
	    // CollectionFormView

	    // CollectionFormRowView - used by CollectionFormView for each row
	    CollectionFormRowView = Backbone.CollectionFormRowView = Backbone.FormView.extend({
	        className: 'form-field-row controls-row',
	        tagName: 'div',
	        getFieldPrefix: function () {
	            var parentPref = '',
	                index = this.rowIndex();
	            if (this.parentView && this.parentView.getFieldPrefix) {
	                parentPref = this.parentView.getFieldPrefix(this) || '';
	            }
	            return parentPref + ((_.isNumber(index) && index > -1) ? index + '-' : '');
	        },
	        /**
	         * Asks the parent collection form view to delete this row
	         * @memberOf Backbone.CollectionFormRowView#
	         * @return {Backbone.CollectionFormRowView}
	         */
	        deleteSelf: function () {
	            this.parentView.deleteRow(this);
	            return this;
	        },
	        /**
	         * @memberOf Backbone.CollectionFormRowView#
	         * @return {number}
	         *         The index of the row
	         */
	        rowIndex: function () {
	            if (this.parentView && this.parentView.subs) {
	                var rows = this.parentView.subs.get('row');
	                if (rows) {
	                    return rows.indexOf(this);
	                }
	            }
	            return null;
	        }
	    });


	    /**
	     * Similar to Backbone.FormView, except that this form view will iterate
	     * over a collection and will produce a row for each model in the collection.
	     * Each field in your schema will get a subView for each model in the collection.
	     * @constructor Backbone.CollectionFormView
	     * @extends Backbone.BaseView
	     * @class Backbone.CollectionFormView
	     * @property {Backbone.Collection} collection A Backbone.Collection used to create rows
	     * @property {object} [options] 
	     *        Options that can either be set as properties on directly on the view or
	     *        passed in an object to the constructor.
	     * @property {function|string} [options.template]
	     *        The underscore template to use that wraps the rows. Should contain an
	     *        empty element that matches the selector for 'rowWrapper' property. By
	     *        default, this would mean just adding a 'data-rows' attribute to that 
	     *        element.
	     * @property {object} [options.rowOptions]
	     *        Options to pass to each row when they are initialized
	     * @property {object} [options.rowSchema]
	     *        The form schema to use for each row
	     * @property {object} [options.rowConfig] 
	     *        Instead of using the rowOptions and rowSchema option,
	     *        you can define a rowConfig object which works like a BaseView
	     *        {@link SubViewManager} config. Here you can define a constructor
	     *        as well to use for the row views, in addition to the schema and 
	     *        options.
	     * @property {object} [options.templateVars] 
	     *        Object to use for template variables for the template that
	     *        wraps each of the collection form rows. To pass a template
	     *        that is used for each row, use rowOptions.templateSrc
	     * @property {boolean} [options.setupOnInit]
	     *        True will initialize the row views for each model in the 
	     *        collection. False means the view will wait until render 
	     *        or setupRows is called.
	     * 
	     */
	    Backbone.CollectionFormView = Backbone.BaseView.extend({
	        tagName: 'form',
	        className: 'form',
	        rowWrapper : '[data-rows]:first',
	        template: _.template('<div data-rows=""></div>'),
	        initialize: function (options) {
	            var self = this,
	                rowOpts;
	            options = self.options = defaults(options || {}, self.options);
	            self.template = options.template || (isString(self.template) ? _.template(self.template) : self.template);
	            self.setupOnInit = !isUndefined(options.setupOnInit) ? options.setupOnInit : self.setupOnInit;
	            self.rowOptions = options.rowOptions || self.rowOptions;
	            self.templateVars = options.templateVars || self.templateVars || {};
	            self._defaultTemplateVars = { label: options.label };
	            self.rowWrapper = options.rowWrapper || self.rowWrapper;
	            if (options.rowConfig) {
	                self.rowConfig = options.rowConfig;
	                self.rowConfig = clone(result(self, 'rowConfig')) || {};
	                self.rowConfig.options = self.rowConfig.options ? clone(self.rowConfig.options) : {};
	            } else {
	                self.rowConfig = clone(result(self, 'rowConfig')) || {
	                    singleton: false,
	                    construct: Backbone.CollectionFormRowView
	                };
	                rowOpts = clone(result(self, 'rowOptions'));
	                self.rowConfig.options = rowOpts || self.rowConfig.options || {};
	                self.setRowSchema(options.rowSchema || self.rowSchema || self.rowConfig.options.schema);
	            }
	            self.rowConfig.location = self.rowWrapper;
	            self.subs.addConfig('row', self.rowConfig);
	            if (self.setupOnInit) {
	                self.setupRows();
	            }
	        },
	        /**
	         * Set the schema used for each row.
	         * @memberOf Backbone.CollectionFormView#
	         * @param {object} [schema]
	         * @return {Backbone.CollectionFormView}
	         */
	        setRowSchema: function (schema) {
	            if (!this.rowConfig.options) { this.rowConfig.options = {}; }
	            this.rowConfig.options.schema = schema || this.options.rowSchema || this.rowSchema;
	            return this;
	        },
	        /**
	         * Like Backbone.FormView.render, except that each a subView will be rendered
	         * for each field in the schema and for each model in the collection.
	         * Each model in the collection will have a 'row' associated with it,
	         * and each row will contain each of the fields in the schema.
	         * @memberOf Backbone.CollectionFormView#
	         * @return {Backbone.CollectionFormView}
	         */
	        render: function () {
	            this.subs.detachElems();
	            this.$el.html(this.template(this._getTemplateVars()));
	            if (!this.getRows() || !this.getRows().length) {
	                this.setupRows();
	            }
	            this.subs.renderByKey('row', { appendTo: this.getRowWrapper() });
	            return this;
	        },
	        /**
	         * Get the wrapper element that the rows will be appended to
	         * @memberOf Backbone.CollectionFormView#
	         * @return {$} 
	         */
	        getRowWrapper: function () {
	            var $wrapper = this.$(this.subs.config.row.location);
	            if (!$wrapper.length) {
	                return this.$el;
	            }
	            return $wrapper.first();
	        },
	        /**
	         * Add a row to the CollectionFormView. If you do not
	         * pass a model, one will be created from the collection.model
	         * property constructor. The model(s) will then be tied
	         * to the new row(s).
	         * @memberOf Backbone.CollectionFormView#
	         * @param  {Backbone.Model} model
	         *         model A model to add a row for
	         * @return {Backbone.CollectionFormView}
	         */
	        addRow: function (model) {
	            var added;
	            model = model || new this.collection.model();
	            added = this.collection.add(model);
	            // Backbone 1.0.0 does not return the added models,
	            // so we will not set the models var to the return val
	            if (!(added instanceof Backbone.Collection)) {
	                model = added;
	            }
	            this._addRow(model).subs.newest.render().$el
	                .appendTo(this.getRowWrapper());
	            return this;
	        },
	        /**
	         * Removes a row or rows from the CollectionFormView and 
	         * corresponding collection.
	         * @memberOf Backbone.CollectionFormView#
	         * @param  {Backbone.Model|Backbone.View|Backbone.View[]|Backbone.Model[]} obj
	         *         Used to find models in the collection and views in the subViewManager
	         *         and remove them.
	         * @return {Backbone.CollectionFormView}
	         */
	        deleteRow : function (obj) {
	            var model = (obj instanceof Model) ? obj : null,
	                view = (!model && obj instanceof Backbone.View) ? obj : null,
	                arr = (!model && !view && isArray(obj)) ? obj : null;

	            if (arr) {
	                each(arr, this.deleteRow, this);
	                return this;
	            }

	            if (!view) {
	                view = this.subs.get(model);
	            } else if (!model) {
	                model = view.model;
	            }

	            this.subs.remove(view);
	            this.collection.remove(model);
	            return this;
	        },
	        /**
	         * Shortcut method to remove all rows and then
	         * set them up again, render them, and place
	         * them in the row wrapper
	         * @memberOf Backbone.CollectionFormView#
	         * @return {Backbone.CollectionFormView}
	         */
	        reset: function () {
	            this.setupRows().subs.renderByKey('row', { appendTo: this.getRowWrapper() });
	            return this;
	        },
	        /**
	         * @return {Backbone.View[]} An array of the row subviews 
	         */
	        getRows: function () {
	            return this.subs.get('row');
	        },
	        /**
	         * When you are ready to set up your rows (ie initialize
	         * each Row view instance based on the collection
	         * @memberOf Backbone.CollectionFormView#
	         * @return {Backbone.CollectionFormView}
	         */
	        setupRows: function () {
	            this.subs.remove('row');
	            this.collection.each(this._addRow, this);
	            return this;
	        },
	        _addRow: function (model) {
	            var opts = this._getRowOptions(model),
	                row = this.subs.create('row', opts);
	            row.setSchema(this.rowSchema).setupFields();
	            return this;
	        },
	        _getRowOptions: function (model) {
	            var rows = this.subs.get('row') || [];
	            return { model: model, index: rows.length };
	        },
	        _getTemplateVars: getTemplateVars
	    });

	    // Add disable/enable functionality
	    extend(Backbone.CollectionFormView.prototype, formViewDisableMixin);

	    // =====================================================================
	    // FIELD SUBVIEWS
	    // =====================================================================

	    // Below are field sub views that are used for common form
	    // field types (e.g. text input, radio button, dropdown list)

	    // ===================================================
	    // Field Template

	    Backbone.formTemplates = Backbone.formTemplates || {};

	    // This is shell form template used for most of the standard form fields.
	    // You can easily substitute your own by doing the following after loading
	    // this file: Backbone.formTemplates.Field = $('#template-id').html();
	    // Note that it uses bootstrap.css classes by default.
	    Backbone.formTemplates.Field =
	        '<% if (obj.label) { %><label class="control-label" ' +
	            '<% if (obj.inputId) { %> for="<%= obj.inputId %>" <% } %> >' +
	            '<%= obj.label %></label><% } %>' +
	            '<div class="<%= obj.inputWrapperClass || \'controls\' %>" data-input="">' +
	            '</div>' +
	            '<div class="controls">' +
	            '<div class="<%= obj.errorClass || \'text-error\' %>" data-error=""></div>' +
	            '<% if (obj.help) { %><span class="help-block"><%= obj.help %></span><% } %>' +
	            '</div>';

	    Backbone.fields = Backbone.fields || {};

	    // ===================================================
	    // fields.FieldView

	    /**
	     * The base form field type, can be used to create a basic text input/textarea
	     * Form field. By default it automatically set's the value of the form field
	     * on the model when the blur event occurs. Use 'Text' alias in schema
	     * to create fields with this contsructor.
	     * 
	     * @constructor Backbone.fields.FieldView
	     * @extends Backbone.BaseView
	     * @class Backbone.fields.FieldView
	     * @property {object} [options]
	     *           Options that can either be set as properties on directly on the view or
	     *           passed in an object to the constructor.
	     * @property {string} [options.fieldName]
	     *           The attribute on the model that this field is linked to. If not provided, this
	     *           will default to the schemaKey.
	     * @property {boolean} [options.addId]
	     *           Add an id to the input element. This is taken from the inputId property or autoGenerated
	     *           based on the schemaKey of this field.
	     * @property {string} [options.elementType] 'input' or 'textarea' (Defaults to 'input')
	     * @property {function|string} [options.template]
	     *           Underscore template function or a string template source. This gets used as the
	     *           wrapper around the input/control. Your template should have an empty element
	     *           that matches the selector defined in the 'inputWrapper' property. By default,
	     *           this would mean defining a 'data-input' attribute
	     * @property {object|function} [options.templateVars] Variables to pass to the template on render
	     * @property {string} [options.inputId] The id of the field to use (if undefined, one is created automatically)
	     * @property {string} [options.inputClass] The class attribute you would like to set on the field input
	     * @property {object} [options.inputAttrs] Object with attributes to set on the input element
	     * @property {object} [options.setOpts] Options you would like to pass when model.set is called (e.g. silent, validate)
	     * @property {string} [options.placeholder] Placeholder text for the input
	     * @property {boolean} [options.twoWay]
	     *      If you would like this field to re-render the input when model is updated by something other
	     *      than this view, in addition to the normal behavior of the view updating the model
	     */
	    FieldView = Backbone.fields.FieldView = Backbone.BaseView.extend({
	        tagName: 'div',
	        classDefaults: 'control-group form-field',
	        inputPrefix: 'field-input-',
	        fieldPrefix: 'form-field-',
	        template: _.template(Backbone.formTemplates.Field),
	        addId: true,
	        elementType: 'input',
	        inputWrapper: '[data-input]:first',
	        disabledDataKey: 'formViewDisabled',
	        events: function () {
	            var events = {};
	            events['blur ' + this.elementType] = 'onUserUpdate';
	            return events;
	        },
	        initialize: function (options) {
	            options = this.options = defaults(options || {}, this.options);
	            extend(this, {
	                templateVars : options.templateVars || this.templateVars || {},
	                fieldName : options.fieldName || this.fieldName || options.schemaKey,
	                elementType : options.elementType || this.elementType,
	                template : options.template || this.template,
	                setOpts : defaults(options.setOpts || {}, this.setOpts),
	                twoWay : !isUndefined(options.twoWay) ? options.twoWay : this.twoWay,
	                inputAttrs: options.inputAttrs || this.inputAttrs,
	                placeholder: options.placeholder || this.placeholder,
	                inputClass: options.inputClass || this.inputClass,
	                addId: !isUndefined(options.addId) ? options.addId : this.addId,
	                label: !isUndefined(options.label) ? options.label : this.label,
	                inputWrapper: options.inputWrapper || this.inputWrapper,
	                inputId: options.inputId || this.inputId
	            });
	            this.inputId = this.addId ? this._getInputId() : false;
	            this.template = isString(this.template) ? _.template(this.template) : this.template;
	            this._defaultTemplateVars = this._defaultTemplateVars || {
	                inputId : this.inputId,
	                help : options.help,
	                fieldName : this.fieldName,
	                label : this.label
	            };

	            // If there is no class name specified, then we create one with the 'classDefaults' property
	            // and another class based on the fieldPrefix and fieldName properties
	            if (isUndefined(this.className)) {
	                this.$el.addClass(this.fieldPrefix + this.fieldName);
	                this.$el.addClass(this.classDefaults);
	            }

	            // Add data attribute to view element to indicate that it's a FormView field
	            this.$el.attr('data-field', '');

	            // If the twoWay option is true, then setup the events to make the field/model-attribute changes twoWay
	            if (this.twoWay && this.setupTwoWay) {  this.setupTwoWay(); }
	        },
	        /**
	         * Sets up two way updating. The view updates the model by default, and this
	         * function will update the view on a model change (unless it was done by the view)
	         * @memberOf Backbone.fields.FieldView#
	         * @return {Backbone.fields.FieldView}
	         */
	        setupTwoWay: function () {
	            this.listenTo(this.model, 'change:' + this.fieldName, function () {
	                if (!this._viewChangedModel) { this.renderInput(); }
	                this._viewChangedModel = false;
	            });
	            return this;
	        },
	        /**
	         * Return an object of attributes as they should appear in the model
	         * @memberOf Backbone.fields.FieldView#
	         * @return {Object}
	         */
	        getAttrs: function () {
	            var attrs = {};
	            attrs[this.fieldName] = this.getValueForSet();
	            return attrs;
	        },
	        /**
	         * This method should get the value or values of the form
	         * field and then set that value/values on the model
	         * in the corresponding attribute(s)/field name(s). If
	         * there is a setOpts object on the fieldView instance,
	         * then use that as the options passed to Backbone.Model's
	         * 'set' method.
	         * @memberOf Backbone.fields.FieldView#
	         * @return {Backbone.fields.FieldView}
	         */
	        setModelAttrs: function () {
	            this._viewChangedModel = true;
	            if (!this.model.set(this.getAttrs(), this.setOpts)) { this._viewChangedModel = false; }
	            return this;
	        },
	        /**
	         * Get the value of the form field input.
	         * @memberOf Backbone.fields.FieldView
	         * @memberOf Backbone.fields.FieldView#
	         * @return {String|Boolean|Array|Number|Object}
	         */
	        getValue: function () {
	            return Backbone.$.trim(this.getInputEl().val());
	        },
	        /**
	         * Override this function if additional
	         * logic needs to be performed to convert
	         * the value of the input into what is
	         * set on the model.
	         * @memberOf Backbone.fields.FieldView#
	         * @return {String|Boolean|Array|Number|Object}
	         */
	        getValueForSet: function () {
	            return this.getValue();
	        },
	        /**
	         * Gets the value of the field as it appears in the model
	         * @memberOf Backbone.fields.FieldView#
	         * @return {String|Boolean|Array|Number|Object}
	         */
	        getModelVal: function () {
	            return this.model.get(this.fieldName);
	        },
	        /**
	         * Gets the value from the model as it should be
	         * set on the input. By default it's the same
	         * as produced by getModelValue. Override this
	         * function if you want to convert the model 
	         * value to something that should be set on the 
	         * input.
	         * @memberOf Backbone.fields.FieldView#
	         * @return {String|Boolean|Array|Number|Object}
	         */
	        getValueForInput: function () {
	            return this.getModelVal();
	        },
	        /**
	         * Renders the basic shell template for the form field and then
	         * creates the input or textarea element, which gets appended
	         * to the elem in the shell template found through the
	         * {@link Backbone.fields.FieldView#getInputWrapper} method
	         * @memberOf Backbone.fields.FieldView#
	         * @return {Backbone.fields.FieldView}
	         */
	        render: function () {
	            return this.renderWrapper().renderInput();
	        },
	        /**
	         * Renders the wrapper that contains the field input
	         * @param {object} [vars] Variables to pass to wrapper template
	         * @memberOf Backbone.fields.FieldView#
	         * @return {Backbone.fields.FieldView}
	         */
	        renderWrapper: function (vars) {
	            this.isDisabled = null;
	            this.$el.html(this.template(vars || this._getTemplateVars()));
	            return this;
	        },
	        /**
	         * Renders the field input and places it in the wrapper in
	         * the element with the 'data-input' attribute
	         * @memberOf Backbone.fields.FieldView#
	         * @return {Backbone.fields.FieldView}
	         */
	        renderInput: function () {
	            var $input,
	                id = this.inputId,
	                attrs =  this.addId ? { id : id, name: id } : {},
	                valForInput = this.getValueForInput();
	            $input = Backbone.$('<' + this.elementType + '>');
	            if (this.elementType === 'input') { attrs.type = 'text'; }
	            if (this.placeholder) { attrs.placeholder = this.placeholder; }
	            $input.attr(extend(attrs, this.inputAttrs));
	            if (this.inputClass) { $input.attr('class', this.inputClass); }
	            this.getInputWrapper().html($input);
	            if (this._shouldSetValueOnInput(valForInput)) { $input.val(valForInput); }
	            this.isDisabled = null;
	            return this;
	        },
	        /**
	         * Get the element that wraps the input. Looks for element
	         * with data-input attribute. If not found, it will return this.$el
	         * @memberOf Backbone.fields.FieldView#
	         * @return {$}
	         */
	        getInputWrapper: function () {
	            var $wrapper = this.$(this.inputWrapper);
	            if (!$wrapper.length) {
	                return this.$el;
	            }
	            return $wrapper.first();
	        },
	        /**
	         * Get the element that takes user input.
	         * @memberOf Backbone.fields.FieldView#
	         * @return {$} 
	         */
	        getInputEl: function () {
	            return this.$(this.elementType);
	        },
	        /**
	         * Disable the input if not already disabled
	         * @memberOf Backbone.fields.FieldView#
	         * @return {Backbone.fields.FieldView}
	         */
	        disable: function () {
	            this.getInputEl().prop('disabled', true);
	            this.isDisabled = true;
	            return this;
	        },
	        /**
	         * Enable the input if disabled by the 'disable' method
	         * @memberOf Backbone.fields.FieldView#
	         * @return {Backbone.fields.FieldView}
	         */
	        enable: function () {
	            this.getInputEl().prop('disabled', false);
	            this.isDisabled = false;
	            return this;
	        },
	        /**
	         * Handle updates from a user interaction
	         * @memberOf Backbone.fields.FieldView#
	         * @protected
	         */
	        onUserUpdate: function () {
	            this.setModelAttrs();
	        },
	        /**
	         * Generate the string to use for the id attribute of 
	         * the input element.
	         * @memberOf Backbone.fields.FieldView#
	         * @return {string}
	         * @protected
	         */
	        _getInputId: function () {
	            return this.inputId ||
	                this.inputPrefix + this._getParentPrefix() + this.fieldName;
	        },
	        /**
	         * Get the template vars used for the wrapper template
	         * @memberOf Backbone.fields.FieldView#
	         * @return {object}
	         * @protected
	         */
	        _getTemplateVars: getTemplateVars,
	        /**
	         * If the parent FormView/FieldSetView defines a 'getFieldPrefix'
	         * function, it can be used to construct the input id, name
	         * attribute, and class attributes
	         * @memberOf Backbone.fields.FieldView#
	         * @return {string}
	         * @private
	         */
	        _getParentPrefix: function () {
	            if (this.parentView && this.parentView.getFieldPrefix) {
	                return this.parentView.getFieldPrefix(this) || '';
	            }
	            return '';
	        },
	        /**
	         * @param {string|number} valueForInput
	         * @returns {boolean}
	         * @memberOf Backbone.fields.FieldView#
	         * @private
	         */
	        _shouldSetValueOnInput: function (valueForInput) {
	            return !!valueForInput || valueForInput === 0;
	        }
	    }, {
	        /**
	         * Set the default template for all fields that don't override
	         * the 'template' property of the Backbone.fields.FieldView
	         * @memberOf Backbone.fields.FieldView
	         * @param {function} template An underscore template
	         * @static
	         */
	        setDefaultFieldTemplate: function (template) {
	            FieldView.prototype.template = template;
	        }
	    });

	    // ====================================================
	    // RadioListView

	    /**
	     * Like Backbone.fields.FieldView, except it creates a list of radio buttons. Designed to
	     * work with model fields that have only one value out of a fixed set of values. Use
	     * 'RadioList' alias in form schema to create a field with this constructor.
	     *
	     * @augments {Backbone.fields.FieldView}
	     * @constructor Backbone.fields.RadioListView
	     * @class Backbone.fields.RadioListView
	     * @property {object} [options] 
	     *           Options that can either be set as properties on directly on the view or
	     *           passed in an object to the constructor.
	     * @property {string} [options.fieldName] inherited from Backbone.fields.FieldView
	     * @property {string} [options.templateSrc] inherited from Backbone.fields.FieldView
	     * @property {function} [options.template] inherited from Backbone.fields.FieldView
	     * @property {object} [options.templateVars] inherited from Backbone.fields.FieldView
	     * @property {string} [options.inputId] inherited from Backbone.fields.FieldView
	     * @property {string} [options.inputClass] inherited from Backbone.fields.FieldView
	     * @property {boolean} [options.twoWay] inherited from Backbone.fields.FieldView
	     * @property {object} [options.inputAttrs] inherited from Backbone.fields.FieldView
	     * @property {object} [options.labelAttrs] Attributes for the label elements that wrap radio inputs
	     * @property {object|function} [options.possibleVals]
	     *      An object with the set of possible choices to display to the user. Each key will be
	     *      what is set in the model when the user selects the radio, and each value is what
	     *      will be used as the label text to display to the user.
	     *
	     */
	    RadioListView = Backbone.fields.RadioListView = Backbone.fields.FieldView.extend({
	        tagName: 'div',
	        events : function () {
	            var events = {};
	            events['click ' + this.elementType] = 'onUserUpdate';
	            return events;
	        },
	        type: 'radio-list',
	        initialize: function (options) {
	            options = this.options = defaults(options || {}, this.options);
	            this.possibleVals = options.possibleVals || this.possibleVals || {};
	            this.labelAttrs = options.labelAttrs || this.labelAttrs;
	            RadioListView.__super__.initialize.call(this, options);
	        },
	        /**
	         * Get the value of the radio list. Looks for a checked radio input
	         * and gets the value attribute of that input.
	         * @memberOf Backbone.fields.RadioListView#
	         * @return {string}
	         */
	        getValue: function () {
	            return this.$(this.elementType + ':checked').val();
	        },
	        /**
	         * Returns true or false if the input should be selected.
	         * @param {string} key The key of the possibleVal that is being tested
	         * @return {boolean}
	         */
	        isSelected: function (key) {
	            return (toStr(this.getValueForInput()) === toStr(key));
	        },
	        /**
	         * Renders the radio inputs and appends them to the input wrapper.
	         * @memberOf Backbone.fields.RadioListView#
	         * @return {Backbone.fields.RadioListView}
	         */
	        renderInput: function () {
	            var possibleVals = result(this, 'possibleVals'),
	                key,
	                i = 0,
	                possibleVal,
	                $checkbox,
	                isSelected,
	                $inputWrapper = this.getInputWrapper().empty();

	            for (key in possibleVals) {
	                if (possibleVals.hasOwnProperty(key)) {
	                    possibleVal = this._parsePossibleVal(possibleVals, key);
	                    isSelected = this.isSelected(possibleVal.value);
	                    $checkbox = this._renderInput(possibleVal, isSelected, i);
	                    $inputWrapper.append($checkbox);
	                    i++;
	                }
	            }
	            return this;
	        },
	        _renderInput: function (possibleVal, isChecked, index) {
	            var $listItem, $label,
	                id = this.inputId,
	                attributes = { type: 'radio' },
	                labelAttrs = defaults(this.labelAttrs || {}, { 'class': 'radio' });
	            if (this.addId) { extend(attributes, { name: id, id: (id + '-' + index) }); }
	            if (isChecked) { attributes.checked = 'checked'; }
	            extend(attributes, this.inputAttrs, { value: possibleVal.value });
	            if (this.inputClass) { attributes['class'] = this.inputClass; }
	            $listItem = Backbone.$('<' + this.elementType + '>').attr(attributes);
	            $label = Backbone.$('<label>').attr(labelAttrs);
	            $label.append($listItem).append(possibleVal.display);
	            return $label;
	        },
	        _parsePossibleVal: function (possibleVals, key) {
	            var val = possibleVals[key];
	            if (val && !isUndefined(val.value) && val.display) {
	                return val;
	            }
	            if (possibleVals.slice && isArray(possibleVals)) {
	                return { value: val, display: val };
	            }
	            if (key && !isNaN(Number(key))) {
	                key = Number(key);
	            }
	            return { value: key, display: val };
	        }
	    });

	    // ====================================================
	    // SelectListView

	    /**
	     * Like Backbone.fields.RadioListView, except that it creates a select drop down. Designed to
	     * work with model fields that have one or several values out of a fixed set of values.
	     * If you allow multi-select, the value will be an array. For single selects, the value
	     * will be whatever the value of that one option is. Use type alias 'Select' to create
	     * in the form schema to create a field with the select type.
	     *
	     * @constructor Backbone.fields.SelectListView
	     * @augments {Backbone.fields.RadioListView}
	     * @class Backbone.fields.SelectListView
	     * @property {object} [options] 
	     *           Options that can either be set as properties on directly on the view or
	     *           passed in an object to the constructor.
	     * @property {string} [options.fieldName] inherited from Backbone.fields.RadioListView
	     * @property {string} [options.templateSrc] inherited from Backbone.fields.RadioListView
	     * @property {function} [options.template] inherited from Backbone.fields.RadioListView
	     * @property {object} [options.templateVars] inherited from Backbone.fields.RadioListView
	     * @property {string} [options.inputId] inherited from Backbone.fields.RadioListView
	     * @property {string} [options.inputClass] inherited from Backbone.fields.RadioListView
	     * @property {boolean} [options.inputAttrs] inherited from Backbone.fields.RadioListView
	     * @property {object} [options.twoWay] inherited from Backbone.fields.RadioListView
	     * @property {string} [options.placeholder] 
	     *           Placeholder text for the select. If the user selects this value, the
	     *           model will be set to a blank string.
	     * @property {Boolean} [options.multiple] If select should have multiple attribute or not
	     * @property {object|string[]} [options.possibleVals]
	     *      An object with the set of possible choices to display to the user. Each key will be
	     *      what is set in the model when the user selects the option, and each value is what
	     *      will be used as the label text to display to the user. You can create optgroups by
	     *      making a value a nested object of with the same format. You can also just pass an
	     *      array of values. These values will serve as the display value and the value that
	     *      is set on the model.
	     *
	     */
	    SelectListView = Backbone.fields.SelectListView = Backbone.fields.RadioListView.extend({
	        type: 'select-list',
	        elementType: 'select',
	        events : function () {
	            var events = {};
	            events['change ' + this.elementType] = 'onUserUpdate';
	            return events;
	        },
	        initialize: function (options) {
	            options = this.options = defaults(options || {}, this.options);
	            this.multiple = !isUndefined(options.multiple) ? options.multiple : this.multiple;
	            SelectListView.__super__.initialize.call(this, options);
	        },
	        getValue: function () {
	            return this.getInputEl().val();
	        },
	        /**
	         * Returns true or false if the option should be selected
	         * @memberOf Backbone.fields.SelectListView#
	         * @param {string} key The key of the possibleVal that is being tested
	         * @return {boolean}
	         */
	        isSelected: function (key) {
	            var modelVal = this.getModelVal();
	            modelVal = this.multiple ? modelVal : [modelVal];
	            return (_.indexOf(_.map(modelVal, toStr), toStr(key)) > -1);
	        },
	        /**
	         * Renders the select element and the options
	         * @memberOf Backbone.fields.SelectListView#
	         * @return {Backbone.fields.SelectListView}
	         */
	        renderInput: function () {
	            var possibleVals = result(this, 'possibleVals'),
	                id = this.inputId,
	                $select = Backbone.$('<' + this.elementType + '>')
	                    .attr(extend((this.addId ? { id: id, name: id } : {}), this.inputAttrs));

	            this.getInputWrapper().html($select);
	            if (this.multiple) { $select.attr('multiple', 'multiple'); }
	            if (this.inputClass) { $select.addClass(this.inputClass); }
	            if (this.placeholder) {
	                $select.append('<option value="">' + this.placeholder + '</option>');
	            }
	            return this._renderInput($select, possibleVals);
	        },
	        _renderInput: function ($wrapper, vals) {
	            var key, val, $optgroup, $option;
	            for (key in vals) {
	                if (vals.hasOwnProperty(key)) {
	                    val = this._parsePossibleVal(vals, key);
	                    if (val.group) {
	                        $optgroup = Backbone.$('<optgroup label="' + key + '"></optgroup>').appendTo($wrapper);
	                        this._renderInput($optgroup, val.group);
	                    } else {
	                        $option = Backbone.$('<option>').text(val.display).attr('value', val.value);
	                        if (this.isSelected(val.value)) {
	                            $option.prop('selected', true);
	                        }
	                        $option.appendTo($wrapper);
	                    }
	                }
	            }
	            return this;
	        },
	        _parsePossibleVal: function (possibleVals, key) {
	            var val = possibleVals[key];
	            if (val && val.group && val.display) {
	                return val;
	            }
	            if (_.isObject(val) && !isArray(possibleVals)) {
	                return { group: val, display: key };
	            }
	            return SelectListView.__super__._parsePossibleVal.call(this, possibleVals, key);
	        }
	    });


	    // ====================================================
	    // CheckListView

	    /**
	     * Like Backbone.fields.SelectListView, but instead of a select, it's a list of checkboxes.
	     * Additionally, instead of setting one value on the model, each checkbox represents
	     * one attribute on the model assigned to it. Each of these attributes should expect
	     * a boolean or one of a set of 2 possible values. You can set what these values 
	     * are using the 'checkedVal' and 'unCheckedVal' options. Use the 'CheckList' alias
	     * in your schema to create these views.
	     * @constructor Backbone.fields.CheckListView
	     * @augments {Backbone.fields.FieldView}
	     * @class Backbone.fields.CheckListView
	     * @property {object} [options] 
	     *           Options that can either be set as properties on directly on the view or
	     *           passed in an object to the constructor.
	     * @property {string} [options.fieldName] inherited from Backbone.fields.FieldView
	     * @property {string} [options.templateSrc] inherited from Backbone.fields.FieldView
	     * @property {function} [options.template] inherited from Backbone.fields.FieldView
	     * @property {object} [options.templateVars] inherited from Backbone.fields.FieldView
	     * @property {string} [options.inputId] inherited from Backbone.fields.FieldView
	     * @property {string} [options.inputClass] inherited from Backbone.fields.FieldView
	     * @property {boolean} [options.twoWay] inherited from Backbone.fields.FieldView
	     * @property {object} [options.inputAttrs] inherited from Backbone.fields.FieldView
	     * @property {object} [options.labelAttrs] inherited from Backbone.fields.RadioListView
	     * @property {object|function} [options.possibleVals]
	     *      An object with the set of possible choices to display to the user. Unlike the other
	     *      list views, the key should be what field the choice corresponds to on the model.
	     * @property [options.checkedVal] - the value to set on the model when a checkbox is checked
	     * @property [options.unCheckedVal] - the value to set on the model when a checkbox is unchecked
	     */
	    CheckListView = Backbone.fields.CheckListView = Backbone.fields.RadioListView.extend({
	        tagName: 'div',
	        type: 'check-list',
	        checkedVal: true,
	        unCheckedVal: false,
	        initialize: function (options) {
	            options = this.options = defaults(options || {}, this.options);
	            this.checkedVal = !isUndefined(options.checkedVal) ? options.checkedVal : this.checkedVal;
	            this.unCheckedVal = !isUndefined(options.unCheckedVal) ? options.unCheckedVal : this.unCheckedVal;
	            CheckListView.__super__.initialize.call(this, options);
	        },
	        setupTwoWay: function () {
	            var possibleVals = result(this, 'possibleVals');
	            each(possibleVals, function (val, key) {
	                var possibleVal = this._parsePossibleVal(possibleVals, key);
	                this.listenTo(this.model, 'change:' + possibleVal.value, function () {
	                    if (!this._viewChangedModel) { this.renderInput(); }
	                    this._viewChangedModel = false;
	                });
	            }, this);
	        },
	        getAttrs: function () {
	            var attrs = {}, self = this;
	            this.getInputEl().each(function (index, input) {
	                var $input = Backbone.$(input),
	                    key = $input.val(),
	                    val = ($input.prop('checked')) ? self.checkedVal : self.unCheckedVal;
	                if (val === self.checkedVal || self.isSelected(key)) {
	                    attrs[key] = val;
	                }
	            });
	            return attrs;
	        },
	        /**
	         * Return the model value for a particular
	         * possibleVals key.
	         * @param  {string} key
	         * @return {*}
	         */
	        getModelVal: function (key) {
	            return this.model.get(key);
	        },
	        /**
	         * Renders and returns a single checkbox in a CheckList
	         * @memberOf Backbone.fields.CheckListView#
	         * @param {string} possibleVal the key from possibleVals
	         * @param {boolean} isChecked if the box should be checked or not
	         * @param {number} index the index of the checkbox
	         * @return {$}
	         */
	        renderSingleCheckbox: function (possibleVal, isChecked, index) {
	            var $listItem,
	                $label,
	                id = this.inputId,
	                attributes = { type: 'checkbox', value: possibleVal.value};

	            if (this.addId) { extend(attributes, { name: id, id: (id + '-' + index) }); }
	            attributes = extend(attributes, this.inputAttrs);
	            if (this.inputClass) { attributes['class'] = this.inputClass; }
	            if (isChecked) { attributes.checked = 'checked'; }
	            $listItem = Backbone.$('<input>').attr(attributes);
	            $label = Backbone.$('<label>').attr(defaults(this.labelAttrs || {}, { 'class': 'checkbox' }));
	            return $label.append($listItem).append(possibleVal.display);
	        },
	        /**
	         * Returns true or false if the checkbox should be selected.
	         * @memberOf Backbone.fields.CheckListView#
	         * @param {string} key the key of the possibleVal that is being tested
	         * @return {boolean}
	         */
	        isSelected: function (key) {
	            return this.getModelVal(key) === this.checkedVal;
	        },
	        renderInput: function () {
	            var key,
	                possibleVals = result(this, 'possibleVals'),
	                possibleVal,
	                $checkbox,
	                isSelected,
	                i = 0,
	                $inputWrapper = this.getInputWrapper().empty();

	            for (key in possibleVals) {
	                if (possibleVals.hasOwnProperty(key)) {
	                    possibleVal = this._parsePossibleVal(possibleVals, key);
	                    isSelected = this.isSelected(possibleVal.value);
	                    $checkbox = this.renderSingleCheckbox(possibleVal, isSelected, i);
	                    $inputWrapper.append($checkbox);
	                    i++;
	                }
	            }
	            return this;
	        }
	    });

	    // ====================================================
	    // CheckBoxView

	    /**
	     * Creates a single checkbox that corresponds to one attribute in the model
	     * @constructor Backbone.fields.CheckBoxView
	     * @class Backbone.fields.CheckBoxView
	     * @augments {Backbone.fields.FieldView}
	     * @property {object} [options] 
	     *           Options that can either be set as properties on directly on the view or
	     *           passed in an object to the constructor.
	     * @property {string} [options.fieldName] inherited from Backbone.fields.FieldView
	     * @property {string} [options.templateSrc] inherited from Backbone.fields.FieldView
	     * @property {function} [options.template] inherited from Backbone.fields.FieldView
	     * @property {object} [options.templateVars] inherited from Backbone.fields.FieldView
	     * @property {string} [options.inputId] inherited from Backbone.fields.FieldView
	     * @property {string} [options.inputClass] inherited from Backbone.fields.FieldView
	     * @property {boolean} [options.twoWay] inherited from Backbone.fields.FieldView
	     * @property {object} [options.addId] inherited from Backbone.fields.FieldView
	     * @property {object} [options.labelAttrs] inherited from Backbone.fields.RadioListView
	     * @property {string} [options.displayText] 
	     *           Templates can have a label and/or display text for checkboxes. Display text is
	     *           intended for longer desciptions of the textbox's purpose.
	     * @property [options.checkedVal] - the value to set on the model when a checkbox is checked
	     * @property [options.unCheckedVal] - the value to set on the model when a checkbox is unchecked
	     */
	    CheckBoxView = Backbone.fields.CheckBoxView = Backbone.fields.FieldView.extend({
	        checkedVal: true,
	        unCheckedVal: false,
	        events: function () {
	            var events = {};
	            events['click ' + this.elementType] = 'onUserUpdate';
	            return events;
	        },
	        initialize: function (options) {
	            options = this.options = defaults(options || {}, this.options);
	            this.checkedVal = !isUndefined(options.checkedVal) ? options.checkedVal : this.checkedVal;
	            this.unCheckedVal = !isUndefined(options.unCheckedVal) ? options.unCheckedVal : this.unCheckedVal;
	            this.displayText = options.displayText || this.displayText;
	            this.labelAttrs = options.labelAttrs || this.labelAttrs;
	            CheckBoxView.__super__.initialize.call(this, options);
	        },
	        getValue: function () {
	            return this.getInputEl().prop('checked');
	        },
	        getValueForSet: function () {
	            if (this.getValue()) {
	                return this.checkedVal;
	            }
	            return this.unCheckedVal;
	        },
	        /**
	         * Returns true or false if the checkbox should be selected
	         * @memberOf Backbone.fields.CheckBoxView#
	         * @return {boolean}
	         */
	        isSelected: function () {
	            return this.getModelVal() === this.checkedVal;
	        },
	        renderInput: function () {
	            var $label = Backbone.$('<label>').attr(defaults(this.labelAttrs || {}, { 'class': 'checkbox' })),
	                $input = Backbone.$('<' + this.elementType + '>'),
	                attributes = { type: 'checkbox' },
	                id = this.inputId;

	            if (this.addId) { extend(attributes, { id: id, name: id, value: this.checkedVal }); }
	            extend(attributes, this.inputAttrs);
	            if (this.inputClass) { attributes['class'] = this.inputClass; }
	            $input.attr(attributes);
	            if (this.isSelected()) {
	                $input.prop('checked', true);
	            }
	            $label.append($input);
	            if (this.displayText) {
	                $label.append(this.displayText);
	            }
	            this.getInputWrapper().html($label);

	            return this;
	        }
	    });

	    // ====================================================
	    // FieldSetView

	    /**
	     * Essentially a subform, an extension of {@link Backbone.FormView} 
	     * but simply uses a 'fieldset' tag instead. Can be used an a FormView's
	     * schema to group fields. FieldSets also default to setup their 
	     * fields on initialization so that that the top level FormView only 
	     * has to call setupFields once.
	     * @constructor Backbone.FieldSetView
	     * @extends {Backbone.FormView}
	     * @class Backbone.FieldSetView
	     * @property {Object} [options] 
	     *     Options that you can pass to init or add as properties on extended view
	     * @property {String} [options.templateSrc] Inherited from Backbone.FormView
	     * @property {String} [options.template] Inherited from Backbone.FormView
	     * @property {Object} [options.schema] Inherited from Backbone.FormView
	     * @property {Boolean} [options.setupOnInit] Inherited from Backbone.FormView
	     * @property {String[]} [options.fieldOrder] Inherited from Backbone.FormView
	     * @property {Object} [options.templateVars] Inherited from Backbone.FormView
	     * @property {Boolean} [options.autoUpdateModel] Inherited from Backbone.FormView
	     * @property {Boolean} [options.twoWay] Inherited from Backbone.FormView
	     */
	    FieldSetView = Backbone.FieldSetView = Backbone.FormView.extend({
	        tagName: 'div',
	        setupOnInit: true,
	        className: '',
	        initialize: function (options) {
	            options = this.options = defaults(options || {}, this.options);
	            this.fieldSetName = options.fieldSetName || this.fieldSetName || options.schemaKey;
	            FieldSetView.__super__.initialize.call(this, options);
	            this.$el.addClass(this.className || ('fieldset fieldset-' + this.fieldSetName));
	        },
	        /**
	         * Returns a prefix that the fieldset fields can use to create
	         * their unique names and ids
	         * @memberOf Backbone.FieldSetView#
	         * @return {string}
	         */
	        getFieldPrefix: getFieldPrefix,
	        template: _.template('<% if(obj && obj.label) { %><label class="fieldset-label">' +
	            '<strong><%= obj.label %></strong></label><% } %><fieldset data-fields=""></fieldset>')
	    });

	    /**
	     * Like a FieldSet view, except that it's linked to a collection and will add subviews for
	     * each model in the collection based on the 'schema' option provided
	     * @constructor Backbone.CollectionFieldSetView
	     * @extends {Backbone.CollectionFormView}
	     * @class Backbone.CollectionFieldSetView
	     */
	    CollectionFieldSetView = Backbone.CollectionFieldSetView = Backbone.CollectionFormView.extend({
	        tagName: 'div',
	        template: _.template('<% if(obj && obj.label) { %><p><strong><%= obj.label %></strong></p><% } %>' +
	            '<fieldset class="fieldset" data-rows=""></fieldset>'),
	        setupOnInit: true,
	        className: '',
	        initialize: function (options) {
	            options = this.options = defaults(options || {}, this.options);
	            this.fieldSetName = options.fieldSetName || this.fieldSetName || options.schemaKey;
	            CollectionFieldSetView.__super__.initialize.call(this, options);
	            this.$el.addClass(this.className || ('fieldset fieldset-' + this.fieldSetName));
	            return this;
	        },
	        /**
	         * Returns a prefix that the fieldset fields can use to create
	         * their unique names and ids
	         * @memberOf Backbone.CollectionFieldSetView#
	         * @return {string}
	         */
	        getFieldPrefix: getFieldPrefix
	    });

	}(this));

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(global) {//     Backbone.js 1.2.0

	//     (c) 2010-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
	//     Backbone may be freely distributed under the MIT license.
	//     For all details and documentation:
	//     http://backbonejs.org

	(function(factory) {

	  // Establish the root object, `window` (`self`) in the browser, or `global` on the server.
	  // We use `self` instead of `window` for `WebWorker` support.
	  var root = (typeof self == 'object' && self.self == self && self) ||
	            (typeof global == 'object' && global.global == global && global);

	  // Set up Backbone appropriately for the environment. Start with AMD.
	  if (true) {
	    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(16), __webpack_require__(9), exports], __WEBPACK_AMD_DEFINE_RESULT__ = function(_, $, exports) {
	      // Export global even in AMD case in case this script is loaded with
	      // others that may still expect a global Backbone.
	      root.Backbone = factory(root, exports, _, $);
	    }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

	  // Next for Node.js or CommonJS. jQuery may not be needed as a module.
	  } else if (typeof exports !== 'undefined') {
	    var _ = require('underscore'), $;
	    try { $ = require('jquery'); } catch(e) {}
	    factory(root, exports, _, $);

	  // Finally, as a browser global.
	  } else {
	    root.Backbone = factory(root, {}, root._, (root.jQuery || root.Zepto || root.ender || root.$));
	  }

	}(function(root, Backbone, _, $) {

	  // Initial Setup
	  // -------------

	  // Save the previous value of the `Backbone` variable, so that it can be
	  // restored later on, if `noConflict` is used.
	  var previousBackbone = root.Backbone;

	  // Create local references to array methods we'll want to use later.
	  var array = [];
	  var slice = array.slice;

	  // Current version of the library. Keep in sync with `package.json`.
	  Backbone.VERSION = '1.2.0';

	  // For Backbone's purposes, jQuery, Zepto, Ender, or My Library (kidding) owns
	  // the `$` variable.
	  Backbone.$ = $;

	  // Runs Backbone.js in *noConflict* mode, returning the `Backbone` variable
	  // to its previous owner. Returns a reference to this Backbone object.
	  Backbone.noConflict = function() {
	    root.Backbone = previousBackbone;
	    return this;
	  };

	  // Turn on `emulateHTTP` to support legacy HTTP servers. Setting this option
	  // will fake `"PATCH"`, `"PUT"` and `"DELETE"` requests via the `_method` parameter and
	  // set a `X-Http-Method-Override` header.
	  Backbone.emulateHTTP = false;

	  // Turn on `emulateJSON` to support legacy servers that can't deal with direct
	  // `application/json` requests ... this will encode the body as
	  // `application/x-www-form-urlencoded` instead and will send the model in a
	  // form param named `model`.
	  Backbone.emulateJSON = false;

	  // Backbone.Events
	  // ---------------

	  // A module that can be mixed in to *any object* in order to provide it with
	  // custom events. You may bind with `on` or remove with `off` callback
	  // functions to an event; `trigger`-ing an event fires all callbacks in
	  // succession.
	  //
	  //     var object = {};
	  //     _.extend(object, Backbone.Events);
	  //     object.on('expand', function(){ alert('expanded'); });
	  //     object.trigger('expand');
	  //
	  var Events = Backbone.Events = {};

	  // Regular expression used to split event strings.
	  var eventSplitter = /\s+/;

	  // Iterates over the standard `event, callback` (as well as the fancy multiple
	  // space-separated events `"change blur", callback` and jQuery-style event
	  // maps `{event: callback}`), reducing them by manipulating `memo`.
	  // Passes a normalized single event name and callback, as well as any
	  // optional `opts`.
	  var eventsApi = function(iteratee, memo, name, callback, opts) {
	    var i = 0, names;
	    if (name && typeof name === 'object') {
	      // Handle event maps.
	      for (names = _.keys(name); i < names.length ; i++) {
	        memo = iteratee(memo, names[i], name[names[i]], opts);
	      }
	    } else if (name && eventSplitter.test(name)) {
	      // Handle space separated event names.
	      for (names = name.split(eventSplitter); i < names.length; i++) {
	        memo = iteratee(memo, names[i], callback, opts);
	      }
	    } else {
	      memo = iteratee(memo, name, callback, opts);
	    }
	    return memo;
	  };

	  // Bind an event to a `callback` function. Passing `"all"` will bind
	  // the callback to all events fired.
	  Events.on = function(name, callback, context) {
	    return internalOn(this, name, callback, context);
	  };

	  // An internal use `on` function, used to guard the `listening` argument from
	  // the public API.
	  var internalOn = function(obj, name, callback, context, listening) {
	    obj._events = eventsApi(onApi, obj._events || {}, name, callback, {
	        context: context,
	        ctx: obj,
	        listening: listening
	    });

	    if (listening) {
	      var listeners = obj._listeners || (obj._listeners = {});
	      listeners[listening.id] = listening;
	    }

	    return obj;
	  };

	  // Inversion-of-control versions of `on`. Tell *this* object to listen to
	  // an event in another object... keeping track of what it's listening to.
	  Events.listenTo =  function(obj, name, callback) {
	    if (!obj) return this;
	    var id = obj._listenId || (obj._listenId = _.uniqueId('l'));
	    var listeningTo = this._listeningTo || (this._listeningTo = {});
	    var listening = listeningTo[id];

	    // This object is not listening to any other events on `obj` yet.
	    // Setup the necessary references to track the listening callbacks.
	    if (!listening) {
	      var thisId = this._listenId || (this._listenId = _.uniqueId('l'));
	      listening = listeningTo[id] = {obj: obj, objId: id, id: thisId, listeningTo: listeningTo, count: 0};
	    }

	    // Bind callbacks on obj, and keep track of them on listening.
	    internalOn(obj, name, callback, this, listening);
	    return this;
	  };

	  // The reducing API that adds a callback to the `events` object.
	  var onApi = function(events, name, callback, options) {
	    if (callback) {
	      var handlers = events[name] || (events[name] = []);
	      var context = options.context, ctx = options.ctx, listening = options.listening;
	      if (listening) listening.count++;

	      handlers.push({ callback: callback, context: context, ctx: context || ctx, listening: listening });
	    }
	    return events;
	  };

	  // Remove one or many callbacks. If `context` is null, removes all
	  // callbacks with that function. If `callback` is null, removes all
	  // callbacks for the event. If `name` is null, removes all bound
	  // callbacks for all events.
	  Events.off =  function(name, callback, context) {
	    if (!this._events) return this;
	    this._events = eventsApi(offApi, this._events, name, callback, {
	        context: context,
	        listeners: this._listeners
	    });
	    return this;
	  };

	  // Tell this object to stop listening to either specific events ... or
	  // to every object it's currently listening to.
	  Events.stopListening =  function(obj, name, callback) {
	    var listeningTo = this._listeningTo;
	    if (!listeningTo) return this;

	    var ids = obj ? [obj._listenId] : _.keys(listeningTo);

	    for (var i = 0; i < ids.length; i++) {
	      var listening = listeningTo[ids[i]];

	      // If listening doesn't exist, this object is not currently
	      // listening to obj. Break out early.
	      if (!listening) break;

	      listening.obj.off(name, callback, this);
	    }
	    if (_.isEmpty(listeningTo)) this._listeningTo = void 0;

	    return this;
	  };

	  // The reducing API that removes a callback from the `events` object.
	  var offApi = function(events, name, callback, options) {
	    // No events to consider.
	    if (!events) return;

	    var i = 0, length, listening;
	    var context = options.context, listeners = options.listeners;

	    // Delete all events listeners and "drop" events.
	    if (!name && !callback && !context) {
	      var ids = _.keys(listeners);
	      for (; i < ids.length; i++) {
	        listening = listeners[ids[i]];
	        delete listeners[listening.id];
	        delete listening.listeningTo[listening.objId];
	      }
	      return;
	    }

	    var names = name ? [name] : _.keys(events);
	    for (; i < names.length; i++) {
	      name = names[i];
	      var handlers = events[name];

	      // Bail out if there are no events stored.
	      if (!handlers) break;

	      // Replace events if there are any remaining.  Otherwise, clean up.
	      var remaining = [];
	      for (var j = 0; j < handlers.length; j++) {
	        var handler = handlers[j];
	        if (
	          callback && callback !== handler.callback &&
	            callback !== handler.callback._callback ||
	              context && context !== handler.context
	        ) {
	          remaining.push(handler);
	        } else {
	          listening = handler.listening;
	          if (listening && --listening.count === 0) {
	            delete listeners[listening.id];
	            delete listening.listeningTo[listening.objId];
	          }
	        }
	      }

	      // Update tail event if the list has any events.  Otherwise, clean up.
	      if (remaining.length) {
	        events[name] = remaining;
	      } else {
	        delete events[name];
	      }
	    }
	    if (_.size(events)) return events;
	  };

	  // Bind an event to only be triggered a single time. After the first time
	  // the callback is invoked, it will be removed. When multiple events are
	  // passed in using the space-separated syntax, the event will fire once for every
	  // event you passed in, not once for a combination of all events
	  Events.once =  function(name, callback, context) {
	    // Map the event into a `{event: once}` object.
	    var events = eventsApi(onceMap, {}, name, callback, _.bind(this.off, this));
	    return this.on(events, void 0, context);
	  };

	  // Inversion-of-control versions of `once`.
	  Events.listenToOnce =  function(obj, name, callback) {
	    // Map the event into a `{event: once}` object.
	    var events = eventsApi(onceMap, {}, name, callback, _.bind(this.stopListening, this, obj));
	    return this.listenTo(obj, events);
	  };

	  // Reduces the event callbacks into a map of `{event: onceWrapper}`.
	  // `offer` unbinds the `onceWrapper` after it as been called.
	  var onceMap = function(map, name, callback, offer) {
	    if (callback) {
	      var once = map[name] = _.once(function() {
	        offer(name, once);
	        callback.apply(this, arguments);
	      });
	      once._callback = callback;
	    }
	    return map;
	  };

	  // Trigger one or many events, firing all bound callbacks. Callbacks are
	  // passed the same arguments as `trigger` is, apart from the event name
	  // (unless you're listening on `"all"`, which will cause your callback to
	  // receive the true name of the event as the first argument).
	  Events.trigger =  function(name) {
	    if (!this._events) return this;

	    var length = Math.max(0, arguments.length - 1);
	    var args = Array(length);
	    for (var i = 0; i < length; i++) args[i] = arguments[i + 1];

	    eventsApi(triggerApi, this._events, name, void 0, args);
	    return this;
	  };

	  // Handles triggering the appropriate event callbacks.
	  var triggerApi = function(objEvents, name, cb, args) {
	    if (objEvents) {
	      var events = objEvents[name];
	      var allEvents = objEvents.all;
	      if (events && allEvents) allEvents = allEvents.slice();
	      if (events) triggerEvents(events, args);
	      if (allEvents) triggerEvents(allEvents, [name].concat(args));
	    }
	    return objEvents;
	  };

	  // A difficult-to-believe, but optimized internal dispatch function for
	  // triggering events. Tries to keep the usual cases speedy (most internal
	  // Backbone events have 3 arguments).
	  var triggerEvents = function(events, args) {
	    var ev, i = -1, l = events.length, a1 = args[0], a2 = args[1], a3 = args[2];
	    switch (args.length) {
	      case 0: while (++i < l) (ev = events[i]).callback.call(ev.ctx); return;
	      case 1: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1); return;
	      case 2: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1, a2); return;
	      case 3: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1, a2, a3); return;
	      default: while (++i < l) (ev = events[i]).callback.apply(ev.ctx, args); return;
	    }
	  };

	  // Proxy Underscore methods to a Backbone class' prototype using a
	  // particular attribute as the data argument
	  var addMethod = function(length, method, attribute) {
	    switch (length) {
	      case 1: return function() {
	        return _[method](this[attribute]);
	      };
	      case 2: return function(value) {
	        return _[method](this[attribute], value);
	      };
	      case 3: return function(iteratee, context) {
	        return _[method](this[attribute], iteratee, context);
	      };
	      case 4: return function(iteratee, defaultVal, context) {
	        return _[method](this[attribute], iteratee, defaultVal, context);
	      };
	      default: return function() {
	        var args = slice.call(arguments);
	        args.unshift(this[attribute]);
	        return _[method].apply(_, args);
	      };
	    }
	  };
	  var addUnderscoreMethods = function(Class, methods, attribute) {
	    _.each(methods, function(length, method) {
	      if (_[method]) Class.prototype[method] = addMethod(length, method, attribute);
	    });
	  };

	  // Aliases for backwards compatibility.
	  Events.bind   = Events.on;
	  Events.unbind = Events.off;

	  // Allow the `Backbone` object to serve as a global event bus, for folks who
	  // want global "pubsub" in a convenient place.
	  _.extend(Backbone, Events);

	  // Backbone.Model
	  // --------------

	  // Backbone **Models** are the basic data object in the framework --
	  // frequently representing a row in a table in a database on your server.
	  // A discrete chunk of data and a bunch of useful, related methods for
	  // performing computations and transformations on that data.

	  // Create a new model with the specified attributes. A client id (`cid`)
	  // is automatically generated and assigned for you.
	  var Model = Backbone.Model = function(attributes, options) {
	    var attrs = attributes || {};
	    options || (options = {});
	    this.cid = _.uniqueId(this.cidPrefix);
	    this.attributes = {};
	    if (options.collection) this.collection = options.collection;
	    if (options.parse) attrs = this.parse(attrs, options) || {};
	    attrs = _.defaults({}, attrs, _.result(this, 'defaults'));
	    this.set(attrs, options);
	    this.changed = {};
	    this.initialize.apply(this, arguments);
	  };

	  // Attach all inheritable methods to the Model prototype.
	  _.extend(Model.prototype, Events, {

	    // A hash of attributes whose current and previous value differ.
	    changed: null,

	    // The value returned during the last failed validation.
	    validationError: null,

	    // The default name for the JSON `id` attribute is `"id"`. MongoDB and
	    // CouchDB users may want to set this to `"_id"`.
	    idAttribute: 'id',

	    // The prefix is used to create the client id which is used to identify models locally.
	    // You may want to override this if you're experiencing name clashes with model ids.
	    cidPrefix: 'c',

	    // Initialize is an empty function by default. Override it with your own
	    // initialization logic.
	    initialize: function(){},

	    // Return a copy of the model's `attributes` object.
	    toJSON: function(options) {
	      return _.clone(this.attributes);
	    },

	    // Proxy `Backbone.sync` by default -- but override this if you need
	    // custom syncing semantics for *this* particular model.
	    sync: function() {
	      return Backbone.sync.apply(this, arguments);
	    },

	    // Get the value of an attribute.
	    get: function(attr) {
	      return this.attributes[attr];
	    },

	    // Get the HTML-escaped value of an attribute.
	    escape: function(attr) {
	      return _.escape(this.get(attr));
	    },

	    // Returns `true` if the attribute contains a value that is not null
	    // or undefined.
	    has: function(attr) {
	      return this.get(attr) != null;
	    },

	    // Special-cased proxy to underscore's `_.matches` method.
	    matches: function(attrs) {
	      return !!_.iteratee(attrs, this)(this.attributes);
	    },

	    // Set a hash of model attributes on the object, firing `"change"`. This is
	    // the core primitive operation of a model, updating the data and notifying
	    // anyone who needs to know about the change in state. The heart of the beast.
	    set: function(key, val, options) {
	      var attr, attrs, unset, changes, silent, changing, prev, current;
	      if (key == null) return this;

	      // Handle both `"key", value` and `{key: value}` -style arguments.
	      if (typeof key === 'object') {
	        attrs = key;
	        options = val;
	      } else {
	        (attrs = {})[key] = val;
	      }

	      options || (options = {});

	      // Run validation.
	      if (!this._validate(attrs, options)) return false;

	      // Extract attributes and options.
	      unset           = options.unset;
	      silent          = options.silent;
	      changes         = [];
	      changing        = this._changing;
	      this._changing  = true;

	      if (!changing) {
	        this._previousAttributes = _.clone(this.attributes);
	        this.changed = {};
	      }
	      current = this.attributes, prev = this._previousAttributes;

	      // Check for changes of `id`.
	      if (this.idAttribute in attrs) this.id = attrs[this.idAttribute];

	      // For each `set` attribute, update or delete the current value.
	      for (attr in attrs) {
	        val = attrs[attr];
	        if (!_.isEqual(current[attr], val)) changes.push(attr);
	        if (!_.isEqual(prev[attr], val)) {
	          this.changed[attr] = val;
	        } else {
	          delete this.changed[attr];
	        }
	        unset ? delete current[attr] : current[attr] = val;
	      }

	      // Trigger all relevant attribute changes.
	      if (!silent) {
	        if (changes.length) this._pending = options;
	        for (var i = 0; i < changes.length; i++) {
	          this.trigger('change:' + changes[i], this, current[changes[i]], options);
	        }
	      }

	      // You might be wondering why there's a `while` loop here. Changes can
	      // be recursively nested within `"change"` events.
	      if (changing) return this;
	      if (!silent) {
	        while (this._pending) {
	          options = this._pending;
	          this._pending = false;
	          this.trigger('change', this, options);
	        }
	      }
	      this._pending = false;
	      this._changing = false;
	      return this;
	    },

	    // Remove an attribute from the model, firing `"change"`. `unset` is a noop
	    // if the attribute doesn't exist.
	    unset: function(attr, options) {
	      return this.set(attr, void 0, _.extend({}, options, {unset: true}));
	    },

	    // Clear all attributes on the model, firing `"change"`.
	    clear: function(options) {
	      var attrs = {};
	      for (var key in this.attributes) attrs[key] = void 0;
	      return this.set(attrs, _.extend({}, options, {unset: true}));
	    },

	    // Determine if the model has changed since the last `"change"` event.
	    // If you specify an attribute name, determine if that attribute has changed.
	    hasChanged: function(attr) {
	      if (attr == null) return !_.isEmpty(this.changed);
	      return _.has(this.changed, attr);
	    },

	    // Return an object containing all the attributes that have changed, or
	    // false if there are no changed attributes. Useful for determining what
	    // parts of a view need to be updated and/or what attributes need to be
	    // persisted to the server. Unset attributes will be set to undefined.
	    // You can also pass an attributes object to diff against the model,
	    // determining if there *would be* a change.
	    changedAttributes: function(diff) {
	      if (!diff) return this.hasChanged() ? _.clone(this.changed) : false;
	      var val, changed = false;
	      var old = this._changing ? this._previousAttributes : this.attributes;
	      for (var attr in diff) {
	        if (_.isEqual(old[attr], (val = diff[attr]))) continue;
	        (changed || (changed = {}))[attr] = val;
	      }
	      return changed;
	    },

	    // Get the previous value of an attribute, recorded at the time the last
	    // `"change"` event was fired.
	    previous: function(attr) {
	      if (attr == null || !this._previousAttributes) return null;
	      return this._previousAttributes[attr];
	    },

	    // Get all of the attributes of the model at the time of the previous
	    // `"change"` event.
	    previousAttributes: function() {
	      return _.clone(this._previousAttributes);
	    },

	    // Fetch the model from the server, merging the response with the model's
	    // local attributes. Any changed attributes will trigger a "change" event.
	    fetch: function(options) {
	      options = options ? _.clone(options) : {};
	      if (options.parse === void 0) options.parse = true;
	      var model = this;
	      var success = options.success;
	      options.success = function(resp) {
	        if (!model.set(model.parse(resp, options), options)) return false;
	        if (success) success.call(options.context, model, resp, options);
	        model.trigger('sync', model, resp, options);
	      };
	      wrapError(this, options);
	      return this.sync('read', this, options);
	    },

	    // Set a hash of model attributes, and sync the model to the server.
	    // If the server returns an attributes hash that differs, the model's
	    // state will be `set` again.
	    save: function(key, val, options) {
	      var attrs, method, xhr, attributes = this.attributes, wait;

	      // Handle both `"key", value` and `{key: value}` -style arguments.
	      if (key == null || typeof key === 'object') {
	        attrs = key;
	        options = val;
	      } else {
	        (attrs = {})[key] = val;
	      }

	      options = _.extend({validate: true}, options);
	      wait = options.wait;

	      // If we're not waiting and attributes exist, save acts as
	      // `set(attr).save(null, opts)` with validation. Otherwise, check if
	      // the model will be valid when the attributes, if any, are set.
	      if (attrs && !wait) {
	        if (!this.set(attrs, options)) return false;
	      } else {
	        if (!this._validate(attrs, options)) return false;
	      }

	      // Set temporary attributes if `{wait: true}`.
	      if (attrs && wait) {
	        this.attributes = _.extend({}, attributes, attrs);
	      }

	      // After a successful server-side save, the client is (optionally)
	      // updated with the server-side state.
	      if (options.parse === void 0) options.parse = true;
	      var model = this;
	      var success = options.success;
	      options.success = function(resp) {
	        // Ensure attributes are restored during synchronous saves.
	        model.attributes = attributes;
	        var serverAttrs = options.parse ? model.parse(resp, options) : resp;
	        if (wait) serverAttrs = _.extend(attrs || {}, serverAttrs);
	        if (_.isObject(serverAttrs) && !model.set(serverAttrs, options)) {
	          return false;
	        }
	        if (success) success.call(options.context, model, resp, options);
	        model.trigger('sync', model, resp, options);
	      };
	      wrapError(this, options);

	      method = this.isNew() ? 'create' : (options.patch ? 'patch' : 'update');
	      if (method === 'patch' && !options.attrs) options.attrs = attrs;
	      xhr = this.sync(method, this, options);

	      // Restore attributes.
	      if (attrs && wait) this.attributes = attributes;

	      return xhr;
	    },

	    // Destroy this model on the server if it was already persisted.
	    // Optimistically removes the model from its collection, if it has one.
	    // If `wait: true` is passed, waits for the server to respond before removal.
	    destroy: function(options) {
	      options = options ? _.clone(options) : {};
	      var model = this;
	      var success = options.success;
	      var wait = options.wait;

	      var destroy = function() {
	        model.stopListening();
	        model.trigger('destroy', model, model.collection, options);
	      };

	      options.success = function(resp) {
	        if (wait) destroy();
	        if (success) success.call(options.context, model, resp, options);
	        if (!model.isNew()) model.trigger('sync', model, resp, options);
	      };

	      var xhr = false;
	      if (this.isNew()) {
	        _.defer(options.success);
	      } else {
	        wrapError(this, options);
	        xhr = this.sync('delete', this, options);
	      }
	      if (!wait) destroy();
	      return xhr;
	    },

	    // Default URL for the model's representation on the server -- if you're
	    // using Backbone's restful methods, override this to change the endpoint
	    // that will be called.
	    url: function() {
	      var base =
	        _.result(this, 'urlRoot') ||
	        _.result(this.collection, 'url') ||
	        urlError();
	      if (this.isNew()) return base;
	      var id = this.id || this.attributes[this.idAttribute];
	      return base.replace(/([^\/])$/, '$1/') + encodeURIComponent(id);
	    },

	    // **parse** converts a response into the hash of attributes to be `set` on
	    // the model. The default implementation is just to pass the response along.
	    parse: function(resp, options) {
	      return resp;
	    },

	    // Create a new model with identical attributes to this one.
	    clone: function() {
	      return new this.constructor(this.attributes);
	    },

	    // A model is new if it has never been saved to the server, and lacks an id.
	    isNew: function() {
	      return !this.has(this.idAttribute);
	    },

	    // Check if the model is currently in a valid state.
	    isValid: function(options) {
	      return this._validate({}, _.extend(options || {}, { validate: true }));
	    },

	    // Run validation against the next complete set of model attributes,
	    // returning `true` if all is well. Otherwise, fire an `"invalid"` event.
	    _validate: function(attrs, options) {
	      if (!options.validate || !this.validate) return true;
	      attrs = _.extend({}, this.attributes, attrs);
	      var error = this.validationError = this.validate(attrs, options) || null;
	      if (!error) return true;
	      this.trigger('invalid', this, error, _.extend(options, {validationError: error}));
	      return false;
	    }

	  });

	  // Underscore methods that we want to implement on the Model.
	  var modelMethods = { keys: 1, values: 1, pairs: 1, invert: 1, pick: 0,
	      omit: 0, chain: 1, isEmpty: 1 };

	  // Mix in each Underscore method as a proxy to `Model#attributes`.
	  addUnderscoreMethods(Model, modelMethods, 'attributes');

	  // Backbone.Collection
	  // -------------------

	  // If models tend to represent a single row of data, a Backbone Collection is
	  // more analogous to a table full of data ... or a small slice or page of that
	  // table, or a collection of rows that belong together for a particular reason
	  // -- all of the messages in this particular folder, all of the documents
	  // belonging to this particular author, and so on. Collections maintain
	  // indexes of their models, both in order, and for lookup by `id`.

	  // Create a new **Collection**, perhaps to contain a specific type of `model`.
	  // If a `comparator` is specified, the Collection will maintain
	  // its models in sort order, as they're added and removed.
	  var Collection = Backbone.Collection = function(models, options) {
	    options || (options = {});
	    if (options.model) this.model = options.model;
	    if (options.comparator !== void 0) this.comparator = options.comparator;
	    this._reset();
	    this.initialize.apply(this, arguments);
	    if (models) this.reset(models, _.extend({silent: true}, options));
	  };

	  // Default options for `Collection#set`.
	  var setOptions = {add: true, remove: true, merge: true};
	  var addOptions = {add: true, remove: false};

	  // Define the Collection's inheritable methods.
	  _.extend(Collection.prototype, Events, {

	    // The default model for a collection is just a **Backbone.Model**.
	    // This should be overridden in most cases.
	    model: Model,

	    // Initialize is an empty function by default. Override it with your own
	    // initialization logic.
	    initialize: function(){},

	    // The JSON representation of a Collection is an array of the
	    // models' attributes.
	    toJSON: function(options) {
	      return this.map(function(model){ return model.toJSON(options); });
	    },

	    // Proxy `Backbone.sync` by default.
	    sync: function() {
	      return Backbone.sync.apply(this, arguments);
	    },

	    // Add a model, or list of models to the set.
	    add: function(models, options) {
	      return this.set(models, _.extend({merge: false}, options, addOptions));
	    },

	    // Remove a model, or a list of models from the set.
	    remove: function(models, options) {
	      var singular = !_.isArray(models), removed;
	      models = singular ? [models] : _.clone(models);
	      options || (options = {});
	      removed = this._removeModels(models, options);
	      if (!options.silent && removed) this.trigger('update', this, options);
	      return singular ? models[0] : models;
	    },

	    // Update a collection by `set`-ing a new list of models, adding new ones,
	    // removing models that are no longer present, and merging models that
	    // already exist in the collection, as necessary. Similar to **Model#set**,
	    // the core operation for updating the data contained by the collection.
	    set: function(models, options) {
	      options = _.defaults({}, options, setOptions);
	      if (options.parse) models = this.parse(models, options);
	      var singular = !_.isArray(models);
	      models = singular ? (models ? [models] : []) : models.slice();
	      var id, model, attrs, existing, sort;
	      var at = options.at;
	      if (at != null) at = +at;
	      if (at < 0) at += this.length + 1;
	      var sortable = this.comparator && (at == null) && options.sort !== false;
	      var sortAttr = _.isString(this.comparator) ? this.comparator : null;
	      var toAdd = [], toRemove = [], modelMap = {};
	      var add = options.add, merge = options.merge, remove = options.remove;
	      var order = !sortable && add && remove ? [] : false;
	      var orderChanged = false;

	      // Turn bare objects into model references, and prevent invalid models
	      // from being added.
	      for (var i = 0; i < models.length; i++) {
	        attrs = models[i];

	        // If a duplicate is found, prevent it from being added and
	        // optionally merge it into the existing model.
	        if (existing = this.get(attrs)) {
	          if (remove) modelMap[existing.cid] = true;
	          if (merge && attrs !== existing) {
	            attrs = this._isModel(attrs) ? attrs.attributes : attrs;
	            if (options.parse) attrs = existing.parse(attrs, options);
	            existing.set(attrs, options);
	            if (sortable && !sort && existing.hasChanged(sortAttr)) sort = true;
	          }
	          models[i] = existing;

	        // If this is a new, valid model, push it to the `toAdd` list.
	        } else if (add) {
	          model = models[i] = this._prepareModel(attrs, options);
	          if (!model) continue;
	          toAdd.push(model);
	          this._addReference(model, options);
	        }

	        // Do not add multiple models with the same `id`.
	        model = existing || model;
	        if (!model) continue;
	        id = this.modelId(model.attributes);
	        if (order && (model.isNew() || !modelMap[id])) {
	          order.push(model);

	          // Check to see if this is actually a new model at this index.
	          orderChanged = orderChanged || !this.models[i] || model.cid !== this.models[i].cid;
	        }

	        modelMap[id] = true;
	      }

	      // Remove nonexistent models if appropriate.
	      if (remove) {
	        for (var i = 0; i < this.length; i++) {
	          if (!modelMap[(model = this.models[i]).cid]) toRemove.push(model);
	        }
	        if (toRemove.length) this._removeModels(toRemove, options);
	      }

	      // See if sorting is needed, update `length` and splice in new models.
	      if (toAdd.length || orderChanged) {
	        if (sortable) sort = true;
	        this.length += toAdd.length;
	        if (at != null) {
	          for (var i = 0; i < toAdd.length; i++) {
	            this.models.splice(at + i, 0, toAdd[i]);
	          }
	        } else {
	          if (order) this.models.length = 0;
	          var orderedModels = order || toAdd;
	          for (var i = 0; i < orderedModels.length; i++) {
	            this.models.push(orderedModels[i]);
	          }
	        }
	      }

	      // Silently sort the collection if appropriate.
	      if (sort) this.sort({silent: true});

	      // Unless silenced, it's time to fire all appropriate add/sort events.
	      if (!options.silent) {
	        var addOpts = at != null ? _.clone(options) : options;
	        for (var i = 0; i < toAdd.length; i++) {
	          if (at != null) addOpts.index = at + i;
	          (model = toAdd[i]).trigger('add', model, this, addOpts);
	        }
	        if (sort || orderChanged) this.trigger('sort', this, options);
	        if (toAdd.length || toRemove.length) this.trigger('update', this, options);
	      }

	      // Return the added (or merged) model (or models).
	      return singular ? models[0] : models;
	    },

	    // When you have more items than you want to add or remove individually,
	    // you can reset the entire set with a new list of models, without firing
	    // any granular `add` or `remove` events. Fires `reset` when finished.
	    // Useful for bulk operations and optimizations.
	    reset: function(models, options) {
	      options = options ? _.clone(options) : {};
	      for (var i = 0; i < this.models.length; i++) {
	        this._removeReference(this.models[i], options);
	      }
	      options.previousModels = this.models;
	      this._reset();
	      models = this.add(models, _.extend({silent: true}, options));
	      if (!options.silent) this.trigger('reset', this, options);
	      return models;
	    },

	    // Add a model to the end of the collection.
	    push: function(model, options) {
	      return this.add(model, _.extend({at: this.length}, options));
	    },

	    // Remove a model from the end of the collection.
	    pop: function(options) {
	      var model = this.at(this.length - 1);
	      this.remove(model, options);
	      return model;
	    },

	    // Add a model to the beginning of the collection.
	    unshift: function(model, options) {
	      return this.add(model, _.extend({at: 0}, options));
	    },

	    // Remove a model from the beginning of the collection.
	    shift: function(options) {
	      var model = this.at(0);
	      this.remove(model, options);
	      return model;
	    },

	    // Slice out a sub-array of models from the collection.
	    slice: function() {
	      return slice.apply(this.models, arguments);
	    },

	    // Get a model from the set by id.
	    get: function(obj) {
	      if (obj == null) return void 0;
	      var id = this.modelId(this._isModel(obj) ? obj.attributes : obj);
	      return this._byId[obj] || this._byId[id] || this._byId[obj.cid];
	    },

	    // Get the model at the given index.
	    at: function(index) {
	      if (index < 0) index += this.length;
	      return this.models[index];
	    },

	    // Return models with matching attributes. Useful for simple cases of
	    // `filter`.
	    where: function(attrs, first) {
	      var matches = _.matches(attrs);
	      return this[first ? 'find' : 'filter'](function(model) {
	        return matches(model.attributes);
	      });
	    },

	    // Return the first model with matching attributes. Useful for simple cases
	    // of `find`.
	    findWhere: function(attrs) {
	      return this.where(attrs, true);
	    },

	    // Force the collection to re-sort itself. You don't need to call this under
	    // normal circumstances, as the set will maintain sort order as each item
	    // is added.
	    sort: function(options) {
	      if (!this.comparator) throw new Error('Cannot sort a set without a comparator');
	      options || (options = {});

	      // Run sort based on type of `comparator`.
	      if (_.isString(this.comparator) || this.comparator.length === 1) {
	        this.models = this.sortBy(this.comparator, this);
	      } else {
	        this.models.sort(_.bind(this.comparator, this));
	      }

	      if (!options.silent) this.trigger('sort', this, options);
	      return this;
	    },

	    // Pluck an attribute from each model in the collection.
	    pluck: function(attr) {
	      return _.invoke(this.models, 'get', attr);
	    },

	    // Fetch the default set of models for this collection, resetting the
	    // collection when they arrive. If `reset: true` is passed, the response
	    // data will be passed through the `reset` method instead of `set`.
	    fetch: function(options) {
	      options = options ? _.clone(options) : {};
	      if (options.parse === void 0) options.parse = true;
	      var success = options.success;
	      var collection = this;
	      options.success = function(resp) {
	        var method = options.reset ? 'reset' : 'set';
	        collection[method](resp, options);
	        if (success) success.call(options.context, collection, resp, options);
	        collection.trigger('sync', collection, resp, options);
	      };
	      wrapError(this, options);
	      return this.sync('read', this, options);
	    },

	    // Create a new instance of a model in this collection. Add the model to the
	    // collection immediately, unless `wait: true` is passed, in which case we
	    // wait for the server to agree.
	    create: function(model, options) {
	      options = options ? _.clone(options) : {};
	      var wait = options.wait;
	      if (!(model = this._prepareModel(model, options))) return false;
	      if (!wait) this.add(model, options);
	      var collection = this;
	      var success = options.success;
	      options.success = function(model, resp, callbackOpts) {
	        if (wait) collection.add(model, callbackOpts);
	        if (success) success.call(callbackOpts.context, model, resp, callbackOpts);
	      };
	      model.save(null, options);
	      return model;
	    },

	    // **parse** converts a response into a list of models to be added to the
	    // collection. The default implementation is just to pass it through.
	    parse: function(resp, options) {
	      return resp;
	    },

	    // Create a new collection with an identical list of models as this one.
	    clone: function() {
	      return new this.constructor(this.models, {
	        model: this.model,
	        comparator: this.comparator
	      });
	    },

	    // Define how to uniquely identify models in the collection.
	    modelId: function (attrs) {
	      return attrs[this.model.prototype.idAttribute || 'id'];
	    },

	    // Private method to reset all internal state. Called when the collection
	    // is first initialized or reset.
	    _reset: function() {
	      this.length = 0;
	      this.models = [];
	      this._byId  = {};
	    },

	    // Prepare a hash of attributes (or other model) to be added to this
	    // collection.
	    _prepareModel: function(attrs, options) {
	      if (this._isModel(attrs)) {
	        if (!attrs.collection) attrs.collection = this;
	        return attrs;
	      }
	      options = options ? _.clone(options) : {};
	      options.collection = this;
	      var model = new this.model(attrs, options);
	      if (!model.validationError) return model;
	      this.trigger('invalid', this, model.validationError, options);
	      return false;
	    },

	    // Internal method called by both remove and set. Does not trigger any
	    // additional events. Returns true if anything was actually removed.
	    _removeModels: function(models, options) {
	      var i, l, index, model, removed = false;
	      for (var i = 0, j = 0; i < models.length; i++) {
	        var model = models[i] = this.get(models[i]);
	        if (!model) continue;
	        var id = this.modelId(model.attributes);
	        if (id != null) delete this._byId[id];
	        delete this._byId[model.cid];
	        var index = this.indexOf(model);
	        this.models.splice(index, 1);
	        this.length--;
	        if (!options.silent) {
	          options.index = index;
	          model.trigger('remove', model, this, options);
	        }
	        models[j++] = model;
	        this._removeReference(model, options);
	        removed = true;
	      }
	      // We only need to slice if models array should be smaller, which is
	      // caused by some models not actually getting removed.
	      if (models.length !== j) models = models.slice(0, j);
	      return removed;
	    },

	    // Method for checking whether an object should be considered a model for
	    // the purposes of adding to the collection.
	    _isModel: function (model) {
	      return model instanceof Model;
	    },

	    // Internal method to create a model's ties to a collection.
	    _addReference: function(model, options) {
	      this._byId[model.cid] = model;
	      var id = this.modelId(model.attributes);
	      if (id != null) this._byId[id] = model;
	      model.on('all', this._onModelEvent, this);
	    },

	    // Internal method to sever a model's ties to a collection.
	    _removeReference: function(model, options) {
	      if (this === model.collection) delete model.collection;
	      model.off('all', this._onModelEvent, this);
	    },

	    // Internal method called every time a model in the set fires an event.
	    // Sets need to update their indexes when models change ids. All other
	    // events simply proxy through. "add" and "remove" events that originate
	    // in other collections are ignored.
	    _onModelEvent: function(event, model, collection, options) {
	      if ((event === 'add' || event === 'remove') && collection !== this) return;
	      if (event === 'destroy') this.remove(model, options);
	      if (event === 'change') {
	        var prevId = this.modelId(model.previousAttributes());
	        var id = this.modelId(model.attributes);
	        if (prevId !== id) {
	          if (prevId != null) delete this._byId[prevId];
	          if (id != null) this._byId[id] = model;
	        }
	      }
	      this.trigger.apply(this, arguments);
	    }

	  });

	  // Underscore methods that we want to implement on the Collection.
	  // 90% of the core usefulness of Backbone Collections is actually implemented
	  // right here:
	  var collectionMethods = { forEach: 3, each: 3, map: 3, collect: 3, reduce: 4,
	      foldl: 4, inject: 4, reduceRight: 4, foldr: 4, find: 3, detect: 3, filter: 3,
	      select: 3, reject: 3, every: 3, all: 3, some: 3, any: 3, include: 2,
	      contains: 2, invoke: 2, max: 3, min: 3, toArray: 1, size: 1, first: 3,
	      head: 3, take: 3, initial: 3, rest: 3, tail: 3, drop: 3, last: 3,
	      without: 0, difference: 0, indexOf: 3, shuffle: 1, lastIndexOf: 3,
	      isEmpty: 1, chain: 1, sample: 3, partition: 3 };

	  // Mix in each Underscore method as a proxy to `Collection#models`.
	  addUnderscoreMethods(Collection, collectionMethods, 'models');

	  // Underscore methods that take a property name as an argument.
	  var attributeMethods = ['groupBy', 'countBy', 'sortBy', 'indexBy'];

	  // Use attributes instead of properties.
	  _.each(attributeMethods, function(method) {
	    if (!_[method]) return;
	    Collection.prototype[method] = function(value, context) {
	      var iterator = _.isFunction(value) ? value : function(model) {
	        return model.get(value);
	      };
	      return _[method](this.models, iterator, context);
	    };
	  });

	  // Backbone.View
	  // -------------

	  // Backbone Views are almost more convention than they are actual code. A View
	  // is simply a JavaScript object that represents a logical chunk of UI in the
	  // DOM. This might be a single item, an entire list, a sidebar or panel, or
	  // even the surrounding frame which wraps your whole app. Defining a chunk of
	  // UI as a **View** allows you to define your DOM events declaratively, without
	  // having to worry about render order ... and makes it easy for the view to
	  // react to specific changes in the state of your models.

	  // Creating a Backbone.View creates its initial element outside of the DOM,
	  // if an existing element is not provided...
	  var View = Backbone.View = function(options) {
	    this.cid = _.uniqueId('view');
	    options || (options = {});
	    _.extend(this, _.pick(options, viewOptions));
	    this._ensureElement();
	    this.initialize.apply(this, arguments);
	  };

	  // Cached regex to split keys for `delegate`.
	  var delegateEventSplitter = /^(\S+)\s*(.*)$/;

	  // List of view options to be merged as properties.
	  var viewOptions = ['model', 'collection', 'el', 'id', 'attributes', 'className', 'tagName', 'events'];

	  // Set up all inheritable **Backbone.View** properties and methods.
	  _.extend(View.prototype, Events, {

	    // The default `tagName` of a View's element is `"div"`.
	    tagName: 'div',

	    // jQuery delegate for element lookup, scoped to DOM elements within the
	    // current view. This should be preferred to global lookups where possible.
	    $: function(selector) {
	      return this.$el.find(selector);
	    },

	    // Initialize is an empty function by default. Override it with your own
	    // initialization logic.
	    initialize: function(){},

	    // **render** is the core function that your view should override, in order
	    // to populate its element (`this.el`), with the appropriate HTML. The
	    // convention is for **render** to always return `this`.
	    render: function() {
	      return this;
	    },

	    // Remove this view by taking the element out of the DOM, and removing any
	    // applicable Backbone.Events listeners.
	    remove: function() {
	      this._removeElement();
	      this.stopListening();
	      return this;
	    },

	    // Remove this view's element from the document and all event listeners
	    // attached to it. Exposed for subclasses using an alternative DOM
	    // manipulation API.
	    _removeElement: function() {
	      this.$el.remove();
	    },

	    // Change the view's element (`this.el` property) and re-delegate the
	    // view's events on the new element.
	    setElement: function(element) {
	      this.undelegateEvents();
	      this._setElement(element);
	      this.delegateEvents();
	      return this;
	    },

	    // Creates the `this.el` and `this.$el` references for this view using the
	    // given `el`. `el` can be a CSS selector or an HTML string, a jQuery
	    // context or an element. Subclasses can override this to utilize an
	    // alternative DOM manipulation API and are only required to set the
	    // `this.el` property.
	    _setElement: function(el) {
	      this.$el = el instanceof Backbone.$ ? el : Backbone.$(el);
	      this.el = this.$el[0];
	    },

	    // Set callbacks, where `this.events` is a hash of
	    //
	    // *{"event selector": "callback"}*
	    //
	    //     {
	    //       'mousedown .title':  'edit',
	    //       'click .button':     'save',
	    //       'click .open':       function(e) { ... }
	    //     }
	    //
	    // pairs. Callbacks will be bound to the view, with `this` set properly.
	    // Uses event delegation for efficiency.
	    // Omitting the selector binds the event to `this.el`.
	    delegateEvents: function(events) {
	      if (!(events || (events = _.result(this, 'events')))) return this;
	      this.undelegateEvents();
	      for (var key in events) {
	        var method = events[key];
	        if (!_.isFunction(method)) method = this[events[key]];
	        if (!method) continue;
	        var match = key.match(delegateEventSplitter);
	        this.delegate(match[1], match[2], _.bind(method, this));
	      }
	      return this;
	    },

	    // Add a single event listener to the view's element (or a child element
	    // using `selector`). This only works for delegate-able events: not `focus`,
	    // `blur`, and not `change`, `submit`, and `reset` in Internet Explorer.
	    delegate: function(eventName, selector, listener) {
	      this.$el.on(eventName + '.delegateEvents' + this.cid, selector, listener);
	    },

	    // Clears all callbacks previously bound to the view by `delegateEvents`.
	    // You usually don't need to use this, but may wish to if you have multiple
	    // Backbone views attached to the same DOM element.
	    undelegateEvents: function() {
	      if (this.$el) this.$el.off('.delegateEvents' + this.cid);
	      return this;
	    },

	    // A finer-grained `undelegateEvents` for removing a single delegated event.
	    // `selector` and `listener` are both optional.
	    undelegate: function(eventName, selector, listener) {
	      this.$el.off(eventName + '.delegateEvents' + this.cid, selector, listener);
	    },

	    // Produces a DOM element to be assigned to your view. Exposed for
	    // subclasses using an alternative DOM manipulation API.
	    _createElement: function(tagName) {
	      return document.createElement(tagName);
	    },

	    // Ensure that the View has a DOM element to render into.
	    // If `this.el` is a string, pass it through `$()`, take the first
	    // matching element, and re-assign it to `el`. Otherwise, create
	    // an element from the `id`, `className` and `tagName` properties.
	    _ensureElement: function() {
	      if (!this.el) {
	        var attrs = _.extend({}, _.result(this, 'attributes'));
	        if (this.id) attrs.id = _.result(this, 'id');
	        if (this.className) attrs['class'] = _.result(this, 'className');
	        this.setElement(this._createElement(_.result(this, 'tagName')));
	        this._setAttributes(attrs);
	      } else {
	        this.setElement(_.result(this, 'el'));
	      }
	    },

	    // Set attributes from a hash on this view's element.  Exposed for
	    // subclasses using an alternative DOM manipulation API.
	    _setAttributes: function(attributes) {
	      this.$el.attr(attributes);
	    }

	  });

	  // Backbone.sync
	  // -------------

	  // Override this function to change the manner in which Backbone persists
	  // models to the server. You will be passed the type of request, and the
	  // model in question. By default, makes a RESTful Ajax request
	  // to the model's `url()`. Some possible customizations could be:
	  //
	  // * Use `setTimeout` to batch rapid-fire updates into a single request.
	  // * Send up the models as XML instead of JSON.
	  // * Persist models via WebSockets instead of Ajax.
	  //
	  // Turn on `Backbone.emulateHTTP` in order to send `PUT` and `DELETE` requests
	  // as `POST`, with a `_method` parameter containing the true HTTP method,
	  // as well as all requests with the body as `application/x-www-form-urlencoded`
	  // instead of `application/json` with the model in a param named `model`.
	  // Useful when interfacing with server-side languages like **PHP** that make
	  // it difficult to read the body of `PUT` requests.
	  Backbone.sync = function(method, model, options) {
	    var type = methodMap[method];

	    // Default options, unless specified.
	    _.defaults(options || (options = {}), {
	      emulateHTTP: Backbone.emulateHTTP,
	      emulateJSON: Backbone.emulateJSON
	    });

	    // Default JSON-request options.
	    var params = {type: type, dataType: 'json'};

	    // Ensure that we have a URL.
	    if (!options.url) {
	      params.url = _.result(model, 'url') || urlError();
	    }

	    // Ensure that we have the appropriate request data.
	    if (options.data == null && model && (method === 'create' || method === 'update' || method === 'patch')) {
	      params.contentType = 'application/json';
	      params.data = JSON.stringify(options.attrs || model.toJSON(options));
	    }

	    // For older servers, emulate JSON by encoding the request into an HTML-form.
	    if (options.emulateJSON) {
	      params.contentType = 'application/x-www-form-urlencoded';
	      params.data = params.data ? {model: params.data} : {};
	    }

	    // For older servers, emulate HTTP by mimicking the HTTP method with `_method`
	    // And an `X-HTTP-Method-Override` header.
	    if (options.emulateHTTP && (type === 'PUT' || type === 'DELETE' || type === 'PATCH')) {
	      params.type = 'POST';
	      if (options.emulateJSON) params.data._method = type;
	      var beforeSend = options.beforeSend;
	      options.beforeSend = function(xhr) {
	        xhr.setRequestHeader('X-HTTP-Method-Override', type);
	        if (beforeSend) return beforeSend.apply(this, arguments);
	      };
	    }

	    // Don't process data on a non-GET request.
	    if (params.type !== 'GET' && !options.emulateJSON) {
	      params.processData = false;
	    }

	    // Pass along `textStatus` and `errorThrown` from jQuery.
	    var error = options.error;
	    options.error = function(xhr, textStatus, errorThrown) {
	      options.textStatus = textStatus;
	      options.errorThrown = errorThrown;
	      if (error) error.call(options.context, xhr, textStatus, errorThrown);
	    };

	    // Make the request, allowing the user to override any Ajax options.
	    var xhr = options.xhr = Backbone.ajax(_.extend(params, options));
	    model.trigger('request', model, xhr, options);
	    return xhr;
	  };

	  // Map from CRUD to HTTP for our default `Backbone.sync` implementation.
	  var methodMap = {
	    'create': 'POST',
	    'update': 'PUT',
	    'patch':  'PATCH',
	    'delete': 'DELETE',
	    'read':   'GET'
	  };

	  // Set the default implementation of `Backbone.ajax` to proxy through to `$`.
	  // Override this if you'd like to use a different library.
	  Backbone.ajax = function() {
	    return Backbone.$.ajax.apply(Backbone.$, arguments);
	  };

	  // Backbone.Router
	  // ---------------

	  // Routers map faux-URLs to actions, and fire events when routes are
	  // matched. Creating a new one sets its `routes` hash, if not set statically.
	  var Router = Backbone.Router = function(options) {
	    options || (options = {});
	    if (options.routes) this.routes = options.routes;
	    this._bindRoutes();
	    this.initialize.apply(this, arguments);
	  };

	  // Cached regular expressions for matching named param parts and splatted
	  // parts of route strings.
	  var optionalParam = /\((.*?)\)/g;
	  var namedParam    = /(\(\?)?:\w+/g;
	  var splatParam    = /\*\w+/g;
	  var escapeRegExp  = /[\-{}\[\]+?.,\\\^$|#\s]/g;

	  // Set up all inheritable **Backbone.Router** properties and methods.
	  _.extend(Router.prototype, Events, {

	    // Initialize is an empty function by default. Override it with your own
	    // initialization logic.
	    initialize: function(){},

	    // Manually bind a single named route to a callback. For example:
	    //
	    //     this.route('search/:query/p:num', 'search', function(query, num) {
	    //       ...
	    //     });
	    //
	    route: function(route, name, callback) {
	      if (!_.isRegExp(route)) route = this._routeToRegExp(route);
	      if (_.isFunction(name)) {
	        callback = name;
	        name = '';
	      }
	      if (!callback) callback = this[name];
	      var router = this;
	      Backbone.history.route(route, function(fragment) {
	        var args = router._extractParameters(route, fragment);
	        if (router.execute(callback, args, name) !== false) {
	          router.trigger.apply(router, ['route:' + name].concat(args));
	          router.trigger('route', name, args);
	          Backbone.history.trigger('route', router, name, args);
	        }
	      });
	      return this;
	    },

	    // Execute a route handler with the provided parameters.  This is an
	    // excellent place to do pre-route setup or post-route cleanup.
	    execute: function(callback, args, name) {
	      if (callback) callback.apply(this, args);
	    },

	    // Simple proxy to `Backbone.history` to save a fragment into the history.
	    navigate: function(fragment, options) {
	      Backbone.history.navigate(fragment, options);
	      return this;
	    },

	    // Bind all defined routes to `Backbone.history`. We have to reverse the
	    // order of the routes here to support behavior where the most general
	    // routes can be defined at the bottom of the route map.
	    _bindRoutes: function() {
	      if (!this.routes) return;
	      this.routes = _.result(this, 'routes');
	      var route, routes = _.keys(this.routes);
	      while ((route = routes.pop()) != null) {
	        this.route(route, this.routes[route]);
	      }
	    },

	    // Convert a route string into a regular expression, suitable for matching
	    // against the current location hash.
	    _routeToRegExp: function(route) {
	      route = route.replace(escapeRegExp, '\\$&')
	                   .replace(optionalParam, '(?:$1)?')
	                   .replace(namedParam, function(match, optional) {
	                     return optional ? match : '([^/?]+)';
	                   })
	                   .replace(splatParam, '([^?]*?)');
	      return new RegExp('^' + route + '(?:\\?([\\s\\S]*))?$');
	    },

	    // Given a route, and a URL fragment that it matches, return the array of
	    // extracted decoded parameters. Empty or unmatched parameters will be
	    // treated as `null` to normalize cross-browser behavior.
	    _extractParameters: function(route, fragment) {
	      var params = route.exec(fragment).slice(1);
	      return _.map(params, function(param, i) {
	        // Don't decode the search params.
	        if (i === params.length - 1) return param || null;
	        return param ? decodeURIComponent(param) : null;
	      });
	    }

	  });

	  // Backbone.History
	  // ----------------

	  // Handles cross-browser history management, based on either
	  // [pushState](http://diveintohtml5.info/history.html) and real URLs, or
	  // [onhashchange](https://developer.mozilla.org/en-US/docs/DOM/window.onhashchange)
	  // and URL fragments. If the browser supports neither (old IE, natch),
	  // falls back to polling.
	  var History = Backbone.History = function() {
	    this.handlers = [];
	    _.bindAll(this, 'checkUrl');

	    // Ensure that `History` can be used outside of the browser.
	    if (typeof window !== 'undefined') {
	      this.location = window.location;
	      this.history = window.history;
	    }
	  };

	  // Cached regex for stripping a leading hash/slash and trailing space.
	  var routeStripper = /^[#\/]|\s+$/g;

	  // Cached regex for stripping leading and trailing slashes.
	  var rootStripper = /^\/+|\/+$/g;

	  // Cached regex for stripping urls of hash.
	  var pathStripper = /#.*$/;

	  // Has the history handling already been started?
	  History.started = false;

	  // Set up all inheritable **Backbone.History** properties and methods.
	  _.extend(History.prototype, Events, {

	    // The default interval to poll for hash changes, if necessary, is
	    // twenty times a second.
	    interval: 50,

	    // Are we at the app root?
	    atRoot: function() {
	      var path = this.location.pathname.replace(/[^\/]$/, '$&/');
	      return path === this.root && !this.getSearch();
	    },

	    // Does the pathname match the root?
	    matchRoot: function() {
	      var path = this.decodeFragment(this.location.pathname);
	      var root = path.slice(0, this.root.length - 1) + '/';
	      return root === this.root;
	    },

	    // Unicode characters in `location.pathname` are percent encoded so they're
	    // decoded for comparison. `%25` should not be decoded since it may be part
	    // of an encoded parameter.
	    decodeFragment: function(fragment) {
	      return decodeURI(fragment.replace(/%25/g, '%2525'));
	    },

	    // In IE6, the hash fragment and search params are incorrect if the
	    // fragment contains `?`.
	    getSearch: function() {
	      var match = this.location.href.replace(/#.*/, '').match(/\?.+/);
	      return match ? match[0] : '';
	    },

	    // Gets the true hash value. Cannot use location.hash directly due to bug
	    // in Firefox where location.hash will always be decoded.
	    getHash: function(window) {
	      var match = (window || this).location.href.match(/#(.*)$/);
	      return match ? match[1] : '';
	    },

	    // Get the pathname and search params, without the root.
	    getPath: function() {
	      var path = this.decodeFragment(
	        this.location.pathname + this.getSearch()
	      ).slice(this.root.length - 1);
	      return path.charAt(0) === '/' ? path.slice(1) : path;
	    },

	    // Get the cross-browser normalized URL fragment from the path or hash.
	    getFragment: function(fragment) {
	      if (fragment == null) {
	        if (this._usePushState || !this._wantsHashChange) {
	          fragment = this.getPath();
	        } else {
	          fragment = this.getHash();
	        }
	      }
	      return fragment.replace(routeStripper, '');
	    },

	    // Start the hash change handling, returning `true` if the current URL matches
	    // an existing route, and `false` otherwise.
	    start: function(options) {
	      if (History.started) throw new Error('Backbone.history has already been started');
	      History.started = true;

	      // Figure out the initial configuration. Do we need an iframe?
	      // Is pushState desired ... is it available?
	      this.options          = _.extend({root: '/'}, this.options, options);
	      this.root             = this.options.root;
	      this._wantsHashChange = this.options.hashChange !== false;
	      this._hasHashChange   = 'onhashchange' in window;
	      this._useHashChange   = this._wantsHashChange && this._hasHashChange;
	      this._wantsPushState  = !!this.options.pushState;
	      this._hasPushState    = !!(this.history && this.history.pushState);
	      this._usePushState    = this._wantsPushState && this._hasPushState;
	      this.fragment         = this.getFragment();

	      // Normalize root to always include a leading and trailing slash.
	      this.root = ('/' + this.root + '/').replace(rootStripper, '/');

	      // Transition from hashChange to pushState or vice versa if both are
	      // requested.
	      if (this._wantsHashChange && this._wantsPushState) {

	        // If we've started off with a route from a `pushState`-enabled
	        // browser, but we're currently in a browser that doesn't support it...
	        if (!this._hasPushState && !this.atRoot()) {
	          var root = this.root.slice(0, -1) || '/';
	          this.location.replace(root + '#' + this.getPath());
	          // Return immediately as browser will do redirect to new url
	          return true;

	        // Or if we've started out with a hash-based route, but we're currently
	        // in a browser where it could be `pushState`-based instead...
	        } else if (this._hasPushState && this.atRoot()) {
	          this.navigate(this.getHash(), {replace: true});
	        }

	      }

	      // Proxy an iframe to handle location events if the browser doesn't
	      // support the `hashchange` event, HTML5 history, or the user wants
	      // `hashChange` but not `pushState`.
	      if (!this._hasHashChange && this._wantsHashChange && !this._usePushState) {
	        var iframe = document.createElement('iframe');
	        iframe.src = 'javascript:0';
	        iframe.style.display = 'none';
	        iframe.tabIndex = -1;
	        var body = document.body;
	        // Using `appendChild` will throw on IE < 9 if the document is not ready.
	        this.iframe = body.insertBefore(iframe, body.firstChild).contentWindow;
	        this.iframe.document.open().close();
	        this.iframe.location.hash = '#' + this.fragment;
	      }

	      // Add a cross-platform `addEventListener` shim for older browsers.
	      var addEventListener = window.addEventListener || function (eventName, listener) {
	        return attachEvent('on' + eventName, listener);
	      };

	      // Depending on whether we're using pushState or hashes, and whether
	      // 'onhashchange' is supported, determine how we check the URL state.
	      if (this._usePushState) {
	        addEventListener('popstate', this.checkUrl, false);
	      } else if (this._useHashChange && !this.iframe) {
	        addEventListener('hashchange', this.checkUrl, false);
	      } else if (this._wantsHashChange) {
	        this._checkUrlInterval = setInterval(this.checkUrl, this.interval);
	      }

	      if (!this.options.silent) return this.loadUrl();
	    },

	    // Disable Backbone.history, perhaps temporarily. Not useful in a real app,
	    // but possibly useful for unit testing Routers.
	    stop: function() {
	      // Add a cross-platform `removeEventListener` shim for older browsers.
	      var removeEventListener = window.removeEventListener || function (eventName, listener) {
	        return detachEvent('on' + eventName, listener);
	      };

	      // Remove window listeners.
	      if (this._usePushState) {
	        removeEventListener('popstate', this.checkUrl, false);
	      } else if (this._useHashChange && !this.iframe) {
	        removeEventListener('hashchange', this.checkUrl, false);
	      }

	      // Clean up the iframe if necessary.
	      if (this.iframe) {
	        document.body.removeChild(this.iframe.frameElement);
	        this.iframe = null;
	      }

	      // Some environments will throw when clearing an undefined interval.
	      if (this._checkUrlInterval) clearInterval(this._checkUrlInterval);
	      History.started = false;
	    },

	    // Add a route to be tested when the fragment changes. Routes added later
	    // may override previous routes.
	    route: function(route, callback) {
	      this.handlers.unshift({route: route, callback: callback});
	    },

	    // Checks the current URL to see if it has changed, and if it has,
	    // calls `loadUrl`, normalizing across the hidden iframe.
	    checkUrl: function(e) {
	      var current = this.getFragment();

	      // If the user pressed the back button, the iframe's hash will have
	      // changed and we should use that for comparison.
	      if (current === this.fragment && this.iframe) {
	        current = this.getHash(this.iframe);
	      }

	      if (current === this.fragment) return false;
	      if (this.iframe) this.navigate(current);
	      this.loadUrl();
	    },

	    // Attempt to load the current URL fragment. If a route succeeds with a
	    // match, returns `true`. If no defined routes matches the fragment,
	    // returns `false`.
	    loadUrl: function(fragment) {
	      // If the root doesn't match, no routes can match either.
	      if (!this.matchRoot()) return false;
	      fragment = this.fragment = this.getFragment(fragment);
	      return _.any(this.handlers, function(handler) {
	        if (handler.route.test(fragment)) {
	          handler.callback(fragment);
	          return true;
	        }
	      });
	    },

	    // Save a fragment into the hash history, or replace the URL state if the
	    // 'replace' option is passed. You are responsible for properly URL-encoding
	    // the fragment in advance.
	    //
	    // The options object can contain `trigger: true` if you wish to have the
	    // route callback be fired (not usually desirable), or `replace: true`, if
	    // you wish to modify the current URL without adding an entry to the history.
	    navigate: function(fragment, options) {
	      if (!History.started) return false;
	      if (!options || options === true) options = {trigger: !!options};

	      // Normalize the fragment.
	      fragment = this.getFragment(fragment || '');

	      // Don't include a trailing slash on the root.
	      var root = this.root;
	      if (fragment === '' || fragment.charAt(0) === '?') {
	        root = root.slice(0, -1) || '/';
	      }
	      var url = root + fragment;

	      // Strip the hash and decode for matching.
	      fragment = this.decodeFragment(fragment.replace(pathStripper, ''));

	      if (this.fragment === fragment) return;
	      this.fragment = fragment;

	      // If pushState is available, we use it to set the fragment as a real URL.
	      if (this._usePushState) {
	        this.history[options.replace ? 'replaceState' : 'pushState']({}, document.title, url);

	      // If hash changes haven't been explicitly disabled, update the hash
	      // fragment to store history.
	      } else if (this._wantsHashChange) {
	        this._updateHash(this.location, fragment, options.replace);
	        if (this.iframe && (fragment !== this.getHash(this.iframe))) {
	          // Opening and closing the iframe tricks IE7 and earlier to push a
	          // history entry on hash-tag change.  When replace is true, we don't
	          // want this.
	          if (!options.replace) this.iframe.document.open().close();
	          this._updateHash(this.iframe.location, fragment, options.replace);
	        }

	      // If you've told us that you explicitly don't want fallback hashchange-
	      // based history, then `navigate` becomes a page refresh.
	      } else {
	        return this.location.assign(url);
	      }
	      if (options.trigger) return this.loadUrl(fragment);
	    },

	    // Update the hash location, either replacing the current entry, or adding
	    // a new one to the browser history.
	    _updateHash: function(location, fragment, replace) {
	      if (replace) {
	        var href = location.href.replace(/(javascript:|#).*$/, '');
	        location.replace(href + '#' + fragment);
	      } else {
	        // Some browsers require that `hash` contains a leading #.
	        location.hash = '#' + fragment;
	      }
	    }

	  });

	  // Create the default Backbone.history.
	  Backbone.history = new History;

	  // Helpers
	  // -------

	  // Helper function to correctly set up the prototype chain for subclasses.
	  // Similar to `goog.inherits`, but uses a hash of prototype properties and
	  // class properties to be extended.
	  var extend = function(protoProps, staticProps) {
	    var parent = this;
	    var child;

	    // The constructor function for the new subclass is either defined by you
	    // (the "constructor" property in your `extend` definition), or defaulted
	    // by us to simply call the parent constructor.
	    if (protoProps && _.has(protoProps, 'constructor')) {
	      child = protoProps.constructor;
	    } else {
	      child = function(){ return parent.apply(this, arguments); };
	    }

	    // Add static properties to the constructor function, if supplied.
	    _.extend(child, parent, staticProps);

	    // Set the prototype chain to inherit from `parent`, without calling
	    // `parent` constructor function.
	    var Surrogate = function(){ this.constructor = child; };
	    Surrogate.prototype = parent.prototype;
	    child.prototype = new Surrogate;

	    // Add prototype properties (instance properties) to the subclass,
	    // if supplied.
	    if (protoProps) _.extend(child.prototype, protoProps);

	    // Set a convenience property in case the parent's prototype is needed
	    // later.
	    child.__super__ = parent.prototype;

	    return child;
	  };

	  // Set up inheritance for the model, collection, router, view and history.
	  Model.extend = Collection.extend = Router.extend = View.extend = History.extend = extend;

	  // Throw an error when a URL is needed, and none is supplied.
	  var urlError = function() {
	    throw new Error('A "url" property or function must be specified');
	  };

	  // Wrap an optional error callback with a fallback error event.
	  var wrapError = function(model, options) {
	    var error = options.error;
	    options.error = function(resp) {
	      if (error) error.call(options.context, model, resp, options);
	      model.trigger('error', model, resp, options);
	    };
	  };

	  return Backbone;

	}));

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	//     Backbone.BaseView 0.8.3

	//     (c) 2014 James Ballantine, 1stdibs.com Inc.
	//     Backbone.BaseView may be freely distributed under the MIT license.
	//     For all details and documentation:
	//     https://github.com/1stdibs/backbone-base-and-form-view

	/*global Backbone, window, jQuery, _, exports, module, require, console */
	(function (root) {
	    "use strict";

	    var Backbone = root.Backbone,
	        _ = root._;

	    if (true) {
	        _ = __webpack_require__(17);
	        root = root || {};
	        root.Backbone = Backbone = __webpack_require__(14);
	        module.exports = Backbone;
	    }

	    var
	        // Finds globally dot noted namespaced objects from a string
	        _stringToObj = function (str) {
	            var arr = str.split('.'),
	                obj = root[arr.shift()];

	            while (arr.length && obj) {
	                obj = obj[arr.shift()];
	            }
	            return obj;
	        },
	        slice = Array.prototype.slice,
	        result = _.result,
	        each = _.each,
	        isFunction = _.isFunction,
	        isObject = _.isObject,
	        isArray = _.isArray,
	        View = Backbone.View,
	        BaseView,
	        /**
	         * Local constructor intended for use by {@link Backbone.BaseView}. Creates an object specifically
	         * for manipulating subviews. Is created automatically by the BaseView instance and accessed through the
	         * '.subs' property of the the instance.
	         * @constructor SubViewManager
	         * @class SubViewManager
	         * @type {SubViewManager}
	         * @param {object} subViewCfg An object with a configuration to add for subviews (see addConfig(map))
	         * @param {Backbone.BaseView} parent The parent BaseView instance
	         * @param [options]
	         */
	        SubViewManager = function (subViewCfg, parent, options) {
	            this.config = {}; // Refers to configuration (construct, options)
	            this.clear(true);
	            this.parent = parent; // Should refer to parent BaseView instance

	            // Set the options
	            this.options = options || {};
	            // Auto initialize a subview when config added
	            this.autoInitSingletons = !!this.options.autoInitSingletons;
	            // If true, then new subview configs and types will default to being singletons
	            this.defaultToSingletons = this.options.defaultToSingletons;
	            // Allow dot notation in 'get' method (if your config keys have dots, then set this to false)
	            this.dotNotation = (this.options.dotNotation !== undefined) ? this.options.dotNotation : true;

	            if (subViewCfg) {
	                this.addConfig(subViewCfg);
	            }
	        };

	    SubViewManager.prototype = {
	       /**
	         * Adds a subView or subViews to the View's list of subViews. Calling
	         * function must provide instances of views or configurations.
	         * @memberOf SubViewManager#
	         * @class SubViewManager
	         * @type {SubViewManager}
	         * @method add
	         * @param {Object} map
	         *      An object with key's to refer to subViews and values that
	         *      are View instances, options to pass to the constructor, or
	         *      an array of either the previous two to add multiple subViews.
	         *      If you pass options or an array of options, the SubViewManager
	         *      will look for a configuration matching the key for these options
	         *      and will initialize subviews based on the config, passing options
	         *      to the constructor.
	         * @param {Boolean} [singleton]
	         *      True if the instances mapped to the keys should be singletons.
	         *      If you pass options, the singleton param will be ignored.
	         * @return {SubViewManager}
	         */
	        /**
	         * Adds a subView or subViews to the View's list of subViews. Calling
	         * function must provide instances of views or configurations.
	         * @memberOf SubViewManager#
	         * @type {SubViewManager}
	         * @method add
	         * @param {String} name
	         *      A string key to refer to the subViews with. Should match
	         *      a key in the subView configuration. If not, a configuration
	         *      will be set up with default values based on the instance
	         *      passed.
	         * @param {Backbone.View[]|object[]} arr
	         *      An array of View instances or options. Instances will be
	         *      appropriately associated with the key, options will be
	         *      used to instantiate a subView based on the configuration
	         *      matching the key
	         * @param {Boolean} [singleton]
	         *      True if the added views should be singletons
	         * @return {SubViewManager}
	         */
	        /**
	         * Adds a subView or subViews to the View's list of subViews. Calling
	         * function must provide instances of views or configurations.
	         * @memberOf SubViewManager#
	         * @type {SubViewManager}
	         * @method add
	         * @param {Backbone.View[]} arr
	         *      An array of View instances. These will not be accessible
	         *      by a type or key
	         * @return {SubViewManager}
	         */
	        /**
	         * Adds a subView or subViews to the View's list of subViews. Calling
	         * function must provide instances of views or configurations.
	         * @memberOf SubViewManager#
	         * @type {SubViewManager}
	         * @method add
	         * @param {String} name
	         *      A string key to refer to the subView with
	         * @param {Backbone.View} instance
	         *      A View instance
	         * @param {Object} [singleton]
	         *      If you want the view matching this key to be a singleton
	         * @return {SubViewManager}
	         */
	        /**
	         * Adds a subView or subViews to the View's list of subViews. Calling
	         * function must provide instances of views or configurations.
	         * @memberOf SubViewManager#
	         * @type {SubViewManager}
	         * @method add
	         * @param {String} name
	         *      A string key to refer to the subView with. Without an instance
	         *      as the second param, this variant requires that a configuration
	         *      to have been specified matching the 'name' with a constructor to
	         *      initialize.
	         * @param {Object} [options]
	         *      An object that will be passed as the options parameter to the
	         *      view on initialization.
	         * @return {SubViewManager}
	         */
	        /**
	         * Adds a subView or subViews to the View's list of subViews. Calling
	         * function must provide instances of views or configurations.
	         * @memberOf SubViewManager#
	         * @type {SubViewManager}
	         * @method add
	         * @param {Backbone.View} instance
	         *      A Backbone.View instance to add as the subview
	         * @return {SubViewManager}
	         */
	        add: function (name, instance, singleton) {
	            var arr = (isArray(name)) ? name : (isArray(instance)) ? instance : undefined, // If its a simple array of subviews or configs
	                map = (!arr && isObject(name) && name instanceof View === false) ? name : undefined, // If its a mapping of subviews
	                viewOptions = (!arr && instance instanceof View === false) ? instance : undefined,
	                key,
	                i,
	                len;

	            if (map) {
	                singleton = (typeof instance === 'boolean') ? instance : undefined;
	                for (key in map) {
	                    if (map.hasOwnProperty(key)) {
	                        map[key] = (isArray(map[key])) ? map[key] : [map[key]];
	                        len = map[key].length;
	                        if (len && map[key][0] instanceof View) {
	                            this._addInstance(key, map[key], singleton);
	                        } else {
	                            i = -1;
	                            while (++i < len) {
	                                this._init(key, map[key][i], singleton);
	                            }
	                        }
	                    }
	                }
	                return this;
	            }

	            instance = (name instanceof View) ? name : instance;
	            name = (typeof name === 'string' || typeof name === "number") ? name : undefined;
	            singleton = (typeof singleton === 'boolean') ? singleton :
	                    (!name && typeof instance === 'boolean') ? instance : undefined;

	            if (viewOptions) {
	                this._init(name, viewOptions, singleton);
	                return this;
	            }

	            if (arr && (len = arr.length)) {
	                if (arr[0] instanceof View) {
	                    this._addInstance(name, arr, singleton);
	                } else {
	                    i = -1;
	                    while (++i < len) {
	                        this._init(name, arr[i], singleton);
	                    }
	                }

	                return this;
	            }

	            if (instance) {
	                this._addInstance(name, instance, singleton);
	            } else if (name) {
	                this._init(name, singleton);
	            }
	            return this;
	        },
	        /**
	         * Add a subview instance. If is has a config,
	         * the instance will be associated with that
	         * config. If the config specifies that the
	         * view is a singleton an a view for that
	         * key already exists, it will not be added.
	         * @param {string|number} key
	         * @param {Backbone.View} instance
	         */
	        /**
	         * Add a subview instance, without a key.
	         * Since it doesn't have a key, it will
	         * simply be added to the subViews array.
	         * @param {Backbone.View} instance
	         */
	        addInstance: function (key, instance) {
	            if (key instanceof View) {
	                instance = key;
	                key = undefined;
	            }
	            this._addInstance(key, instance);
	            return this;
	        },
	        /**
	         * Add a subview for each view instance in
	         * an array for a particular key
	         * @memberOf SubViewManager#
	         * @param {string} key
	         * @param {Backbone.View[]} instances
	         * @return {SubViewManager}
	         */
	        /**
	         * Add a subview for each view instance in
	         * an array. They will not be associated 
	         * with a key and will be only accessible
	         * through the subViews array.
	         * @memberOf SubViewManager#
	         * @param {Backbone.View[]} instances
	         * @return {SubViewManager}
	         */
	        addInstances: function (key, instances) {
	            if (isArray(key)) {
	                instances = key;
	                key = undefined;
	            }
	            var i = -1,
	                len = instances.length;
	            while (++i < len) {
	                this._addInstance(key, instances[i]);
	            }
	            return this;
	        },
	        /**
	         * Add instances using an object that
	         * maps subview keys to the instances
	         * @param {object} map
	         * @return {SubViewManager}
	         */
	        addInstancesWithMap: function (map) {
	            var key;
	            for (key in map) {
	                if (map.hasOwnProperty(key)) {
	                    this.addInstance(key, map[key]);
	                }
	            }
	            return this;
	        },
	        /**
	         * Instantiates a view from it's config
	         * and adds additional options.
	         * @memberOf SubViewManager#
	         * @param  {String} key
	         * @param  {object} options
	         * @return {Backbone.View}
	         *         The new view instance
	         */
	        create: function (key, options) {
	            return this._init(key, options);
	        },
	        /**
	         * Given an array of keys, a subview
	         * will be instantiated for each key
	         * based on the configuration for that
	         * key. The options param will be 
	         * passed to each view on instantiation
	         * as additional options.
	         * 
	         * @memberOf SubViewManager#
	         * @param {String[]} keys
	         * @param {Object} options
	         *        Additional options to pass
	         *        to each view on init
	         * @return {Backbone.View[]}
	         *        Array of newly created subviews
	         */
	        createFromKeys: function (keys, options) {
	            var views = [],
	                len = keys.length,
	                i = -1;
	            while (++i < len) {
	                views.push(this._init(keys[i], options));
	            }
	            return views;
	        },
	        /**
	         * Instantiate all singletons defined in the
	         * config.
	         * @param  {object} options Additional options
	         * @return {SubViewManager}
	         */
	        createSingletons: function (options) {
	            var key;
	            for (key in this.config) {
	                if (this.config.hasOwnProperty(key) && this.config[key].singleton) {
	                    this._init(key, options);
	                }
	            }
	            return this;
	        },
	        /**
	         * Create subviews with a map of configured 
	         * subview keys to additional options.
	         * @param  {object} map
	         * @return {SubViewManager}
	         */
	        createWithMap: function (map) {
	            var key;
	            for (key in map) {
	                if (map.hasOwnProperty(key)) {
	                    this._init(key, map[key]);
	                }
	            }
	            return this;
	        },
	        /**
	         * Set a singleton instance if a singleton
	         * for that instance has not already been
	         * set. Remove the singleton first if you
	         * want to set a new instance.
	         * @param {String} key
	         * @param {Backbone.View} instance
	         * @return {SubViewManager}
	         */
	        setSingleton: function (key, instance) {
	            this._addInstance(key, instance, true);
	            return this;
	        },
	        /**
	         * Remove a singleton if it exists and then
	         * set a new instnce in it's place.
	         * @param  {String} key
	         * @param  {Backbone.View} instance 
	         * @return {SubViewManager}
	         */
	        overrideSingleton: function (key, instance) {
	            this.remove(key);
	            return this.setSingleton(key, instance);
	        },
	        /**
	         * Add an configuration for a subview to the SubViewManager.
	         * It can be instantiated later with the add function.
	         * @memberOf SubViewManager#
	         * @type {SubViewManager}
	         * @class
	         * @method addConfig
	         * @param {String} name
	         *      The name or type that you would like use to refer to subViews
	         *      created with this config
	         * @param {String|Function} construct
	         *      The constructor function for this subView. If its a string, the
	         *      string must resolve to a global name-spaced function in dot notation.
	         *      (e.g. 'Backbone.imageUpload.View')
	         * @param {String} [options]
	         *      The options or base options you would like to pass to the constructor
	         *      whenever it is initialized.
	         * @param {String|HTMLElement} [location]
	         *      If you want to be able to automatically place a subView's DOM element
	         *      somewhere in the parent view, pass a selector or DOM element or $ instance
	         *      here that can be used by jquery as a wrapper to append the subView $el
	         * @param {Boolean} [singleton]
	         *      If you want this view to be a singleton subView. A singleton subView
	         *      will only allow one instance of it to be created.
	         * @return {SubViewManager}
	         */
	        /**
	         * Add an configuration for a subview to the SubViewManager.
	         * It can be instantiated later with the add function.
	         * @memberOf SubViewManager#
	         * @type {SubViewManager}
	         * @method addConfig
	         * @param {Object} map
	         *      A object of key names/types to config objects, so you can add multiple configs
	         * @example
	         * // A config object should have the following format:
	         *      {
	         *          construct:  // Constructor function or string version (i.e. "Backbone.BaseView")
	         *          options:    // Any options you want to pass to the initialize function
	         *          singleton:  // if the object should be configured as a singleton or not
	         *          location:   // A string or jQuery instance in the parent view element. Or
	         *                      // a function that returns one of these. The subview el will 
	         *                      // be appended to that location
	         *      }
	         * @return {SubViewManager}
	         */
	        /**
	         * Add an configuration for a subview to the SubViewManager.
	         * It can be instantiated later with the add function.
	         * @memberOf SubViewManager#
	         * @type {SubViewManager}
	         * @method addConfig
	         * @param {String} name
	         *      The name or type that you would like use to refer to subViews
	         *      created with this config
	         * @param {Object} config
	         *      The configuration object (uses the format described above)
	         * @return {SubViewManager}
	         */
	        addConfig : function (name, config) {
	            var map = (isObject(name) && !isArray(name)) ? name : false;
	            if (map) {
	                each(map, this._addConfig, this);
	                return this;
	            }

	            return this._addConfig(config, name);
	        },
	        /**
	         * Render all Subviews.
	         * @memberOf SubViewManager#
	         * @type {SubViewManager}
	         * @param {object} [options]
	         *      [options.appendTo] A selector, HTMLElement, or $ instance to append the subViews to
	         *      [options.useLocation=false]
	         *          True if you want to append the subviews to the locations in their config if they 
	         *          have one.
	         *      [options.clearLocations=false]
	         *          True if you want to use empty on the configured locations
	         *
	         * @return {SubViewManager}
	         */
	        render: function (options) {
	            options = options || {};
	            var location = options.appendTo || options.useLocation;
	            return this._render(this.subViews, location, options.clearLocations);
	        },
	        /**
	         * Renders subviews and appends them to their 'locations' if they have one.
	         * If you pass a appendTo param, views are appended to that location instead.
	         * This is just a shortcut version of renderAppend({})
	         * @memberOf SubViewManager#
	         * @type {SubViewManager}
	         * @param {string|HTMLElement|$} [appendTo]
	         *        Location to append the rendered subiews to
	         * @param {object} [options]
	         * @param {boolean} [options.clearLocations=false] Clear configured locations of subviews before rendering
	         * @return {SubViewManager}
	         */
	        renderAppend: function (appendTo, options) {
	            options = options || {};
	            if (isObject(appendTo) && appendTo instanceof Backbone.$ === false && !_.isElement(appendTo)) {
	                options = appendTo;
	                appendTo = options.appendTo;
	            }
	            return this._render(this.subViews, appendTo || true, options.clearLocations);
	        },
	        /**
	         * Render a subView specified by a key (from their configuration key). The key will
	         * retrieve subViews by looking for a type and then looking for singletons or
	         * specific instance using the Model/View cid
	         * 
	         * @memberOf SubViewManager#
	         * @type {SubViewManager}
	         * 
	         * @param {String|Backbone.Model|Backbone.View} key
	         *      A key, type, View/Model cid, Model, or View to refer to a specific subView
	         *      or subViews. For example, passing the view cid 'view4' will render only
	         *      the view with that cid, and passing the type 'creatorNames' will render
	         *      views matching the type 'creatorNames'.
	         * @param {object} [options]
	         * @param {string|$|HTMLElement} [options.appendTo] Element or selector to append subview(s) to
	         * @param {boolean} [options.useLocation=false] Append subviews to locations specified in config
	         * @param {boolean} [options.clearLocations=false] Clear configured locations of subviews before rendering
	         *
	         * @return {SubViewManager}
	         */
	        renderByKey: function (key, options) {
	            var subViews = this.getByType(key) || this.get(key);
	            if (!isArray(subViews)) { subViews = [subViews]; }
	            options = options || {};
	            return this._render(subViews, options.appendTo || options.useLocation, options.clearLocations);
	        },
	        /**
	         * Returns a new SubViewManager instance with filtered list of subviews.
	         * @memberOf SubViewManager#
	         * @type {SubViewManager}
	         * @param {string|Backbone.View[]|function} key
	         *      The key or type used to refer to a subview or subviews, or a list
	         *      of subViews with a type found in this SubViewManager config, or a function
	         *      that will iterate over the subviews and return true if a subview
	         *      should be included in the filtered SubViewManager instance.
	         * @return {SubViewManager}
	         */
	        filteredSubs: function (key) {
	            var i = -1, len, subViews,
	                subMgr = new SubViewManager(null, this.parent, this.options);
	            subMgr.config = this.config;
	            subViews = (isArray(key)) ? key : (isFunction(key)) ? this.filter(key) : this.getByType(key);
	            len = subViews.length;
	            while (++i < len) {
	                subMgr.add(subViews[i]._subviewtype, subViews[i]);
	            }
	            return subMgr;
	        },
	        /**
	         * Iterate through every subView, calling a function or invoking a method on
	         * each of them. If a subView has it's own subViews, then it will recursively
	         * iterate over those as well. The context is switched to the subView calling
	         * the function/method.
	         * @memberOf SubViewManager#
	         * @type {SubViewManager}
	         * @param {String|Function} func 
	         *        A string name of a method to call in the subviews or a function that
	         *        will be called for each view
	         * @param {Array} [args] An array of arguments to pass to the method/function
	         * @return {SubViewManager}
	         */
	        descend: function (func, args) {
	            var isFunc = isFunction(func),
	                desc = function (subViews) {
	                    var i = -1, len = subViews.length, subView, _func;
	                    while (++i < len) {
	                        subView = subViews[i];
	                        _func = isFunc ? func : subView[func];
	                        if (_func) {
	                            if (args) { _func.apply(subView, args);
	                            } else { _func.call(subViews[i]); }
	                        }
	                        if (subView.subViews && subView.subViews.length) {
	                            desc(subView.subViews);
	                        }
	                    }
	                };
	            desc(this.subViews);
	            return this;
	        },
	        /**
	         * Clears all subViews and subView data off of the SubViewManager instance
	         * @memberOf SubViewManager#
	         * @type {SubViewManager}
	         * @param {Boolean} [preserveElems] If true, view $els are left on the DOM
	         * @param {Boolean} [clearConfigs] If true, resets the subView configs as well
	         * @return {SubViewManager}
	         */
	        clear: function (preserveElems, clearConfigs) {
	            if (!preserveElems) {
	                this.removeElems();
	            }
	            this.subViews = [];
	            if (this.parent && this.parent.subViews) {
	                this.parent.subViews = this.subViews;
	            }
	            this._subViewsByType = {};
	            this._subViewSingletons = {};
	            this._subViewsByCid = {};
	            this._subViewsByModelCid = {};
	            if (clearConfigs) {
	                this.config = {};
	            }
	            return this;
	        },
	        /**
	         * Remove a subView
	         * @memberOf SubViewManager#
	         * @type {SubViewManager}
	         * @param {String|Backbone.View|Backbone.Model} key
	         * @param {Boolean} [preserveElems] If true, the View's element will not be removed from the DOM
	         * @return {SubViewManager}
	         */
	        remove: function (key, preserveElems) {
	            var subViews = (key && (typeof key === "string" || key.cid)) ? this.get(key) : key,
	                len;
	            if (!subViews) { return this; }
	            if (!isArray(subViews)) {
	                subViews = [subViews];
	            }
	            len = subViews ? subViews.length : 0;
	            if (!preserveElems) {
	                this.removeElems(subViews);
	            }
	            if (len) {
	                this.trigger('remove', subViews);
	            }
	            while (subViews && subViews.length) {
	                this._remove(subViews.shift());
	            }
	            return this;
	        },
	        /**
	         * Remove's all subviews matching any
	         * key in a list of keys
	         * @memberOf SubViewManager#
	         * @param  {String[]} keys
	         * @param {Boolean} [preserveElems=false] 
	         *        If true, the views' elements will not
	         *        be removed from the DOM
	         * @return {SubViewManager}
	         */
	        removeByKeys: function (keys, preserveElems) {
	            var i = 0, len = keys ? keys.length : 0;
	            for (i; i < len; i++) {
	                this.remove(keys[i], preserveElems);
	            }
	            return this;
	        },
	        /**
	         * Removes all subView '.el' element from the dom, or if passed a
	         * list of subViews, removes only the elements in those.
	         * @memberOf SubViewManager#
	         * @type {SubViewManager}
	         * @param {Backbone.View[]} subViews
	         * @return {SubViewManager}
	         */
	        removeElems: function (subViews) {
	            subViews = subViews || this.subViews;

	            var i = -1,
	                len = subViews.length;
	            while (++i < len) {
	                subViews[i].remove();
	            }
	            return this;
	        },
	        /**
	         * Shortcut method to invoke jQuery's detach function
	         * on each of the '.$el' elements for each of the 
	         * subviews, or if an array of subViews is passed,
	         * on each of those. Useful if you want to re-render
	         * a parent view and want to prevent subviews from
	         * losing their events and other data that is removed
	         * when jQuery 'remove' is called on that element.
	         * @memberOf SubViewManager#
	         * @type {SubViewManager}
	         * @param {Backbone.View[]} subViews
	         * @return {SubViewManager}
	         */
	        detachElems: function (subViews) {
	            subViews = subViews || this.subViews;

	            var i = -1,
	                len = subViews.length;
	            while (++i < len) {
	                subViews[i].$el.detach();
	            }
	            return this;
	        },
	        /**
	         * Get a subView instance or an array if multiple instances
	         * match your key.
	         * @memberOf SubViewManager#
	         * @type {SubViewManager}
	         * @param {Object|String} [key]
	         *      The key to a subView singleton, the view's cid
	         *      the associated model cid, the associated model itself,
	         *      or the associated view itself. If your key is a
	         *      string, you can use
	         * @return {Backbone.View|Backbone.View[]}
	         */
	        get : function (key) {
	            if (key.cid) {
	                return this._subViewsByCid[key.cid] || this._subViewsByModelCid[key.cid];
	            }
	            if (key.indexOf('.') > -1 && this.dotNotation) {
	                var segs = key.split('.'), view = this.parent;
	                while (segs.length && view) { view = view.subs.get(segs.shift()); }
	                return view;
	            }

	            return this._subViewSingletons[key] || this._subViewsByCid[key] ||
	                this._subViewsByModelCid[key] || this._subViewsByType[key];
	        },
	        /**
	         * Returns all views that match a type key, guarantees an array.
	         * @memberOf SubViewManager#
	         * @type {SubViewManager}
	         * @param {String} type
	         * @return {Backbone.View[]}
	         */
	        getByType : function (type) {
	            if (this._subViewsByType[type]) {
	                return this._subViewsByType[type];
	            }
	            return (this._subViewSingletons[type]) ? [this._subViewSingletons[type]] : [];
	        },
	        /**
	         * Get the subviews type or key
	         * @memberOf SubViewManager#
	         * @type {SubViewManager}
	         * @param subview
	         * @return {String|Number}
	         */
	        getSubViewType : function (subview) {
	            subview = (subview instanceof View === true) ? subview : this.get(subview);
	            return subview._subviewtype;
	        },
	        /**
	         * Get the subview at a specific index, based on the order
	         * that the subViews were added or a custom sorted order.
	         * @memberOf SubViewManager#
	         * @type {SubViewManager}
	         * @param  {Number} index The index of the sub view
	         * @return {Backbone.View}
	         */
	        at: function (index) {
	            return this.subViews[index];
	        },
	        /**
	         * Clears the html in all locations specified in the subview configs
	         * @memberOf SubViewManager#
	         * @type {SubViewManager}
	         * @return {SubViewManager}
	         */
	        clearLocations : function (type) {
	            var confs = type ? _.pick(this.config, type) : this.config;
	            each(confs, function (config) {
	                this.parent.$(config.location).html('');
	            }, this);
	            return this;
	        },
	        /**
	         * Set a location for a subview type
	         * @memberOf SubViewManager#
	         * @param {string} type The subview type
	         * @param {$|HTMLElement|String} location
	         *        A location within the parent view
	         *        to place the subview in
	         * @return {SubViewManager}
	         */
	        setLocationForType: function (type, location) {
	            this._addConfig({ location: location }, type);
	            return this;
	        },
	        /**
	         * Generate a location selector for each configured
	         * subview type. Each subview type will have a
	         * location set based on the subview type. For 
	         * example,the subview type 'header' would get the
	         * type '.header-container' (using the default
	         * suffix). 
	         * @memberOf SubViewManager#
	         * @param  {string} [suffix=-container]
	         *         The suffix to use for each location
	         *         selector.
	         * @return {SubViewManager}
	         */
	        useDefaultLocationSelectors: function (suffix) {
	            var type;
	            suffix = _.isString(suffix) ? suffix : '-container';
	            for (type in this.config) {
	                if (this.config.hasOwnProperty(type) && !this.config[type].location) {
	                    this.setLocationForType(type, '.' + type + suffix);
	                }
	            }
	            return this;
	        },
	        _render : function (subViews, place, clearLocations) {
	            var $appendTo,
	                i = -1,
	                location,
	                $locations = {};
	            if (place !== true) {
	                $appendTo = place;
	            }
	            if (clearLocations) {
	                this.clearLocations();
	            }

	            while (++i < subViews.length) {
	                subViews[i].render();
	                if ($appendTo) {
	                    subViews[i].$el.appendTo((typeof $appendTo === 'string') ? this.parent.$($appendTo).first() : $appendTo);
	                } else if (place && (location = this.config[this.getSubViewType(subViews[i])].location)) {
	                    if (typeof location === 'string') {
	                        if (!$locations[location]) {
	                            $locations[location] = this.parent.$(location).first();
	                        }
	                        location = $locations[location];
	                    } else if (typeof location === 'function') {
	                        location = location.call(subViews[i]);
	                        if (!(location instanceof Backbone.$)) { throw new Error('location function must return instance of jQuery'); }
	                    }
	                    location.append(subViews[i].$el);
	                }
	            }
	            return this;
	        },
	        _addInstance : function (key, subViews, singleton) {
	            var i = -1, len, self = this;

	            key = key || '_svid_' + _.size(this.config);

	            if (self._subViewSingletons[key]) { return self; }

	            if (!isArray(subViews)) {
	                subViews = [subViews];
	            }

	            len = subViews.length;

	            if (!self.config[key]) {
	                self.config[key] = { singleton: singleton };
	            }

	            if (!self.config[key].construct && subViews[0].constructor) {
	                self.config[key].construct = subViews[0].constructor;
	            }

	            singleton = (singleton === undefined) ? self.config[key].singleton : singleton;

	            while (++i < len) {
	                self._setInst(key, subViews[i], singleton);
	            }
	            return self;
	        },
	        _addConfig : function (config, name) {
	            if (!config || !name) {
	                return this;
	            }
	            this.config[name] = _.extend(this.config[name] || {}, config);
	            if (typeof this.config[name].singleton !== "boolean") {
	                this.config[name].singleton = this.defaultToSingletons;
	            }
	            if (this.autoInitSingletons && this.config[name].singleton) {
	                return this._init(name);
	            }
	            return this;
	        },
	        _remove : function (subView, silent) {
	            var i = -1,
	                len = this.subViews.length,
	                key = this.getSubViewType(subView),
	                typeList = this.getByType(key);

	            while (++i < len) {
	                if (this.subViews[i].cid === subView.cid) {
	                    this.subViews.splice(i, 1);
	                    break;
	                }
	            }
	            len = typeList ? typeList.length : 0;
	            if (!this._subViewSingletons[key] && len) {
	                for (i = 0; i < len; i++) {
	                    if (typeList[i].cid === subView.cid) {
	                        typeList.splice(i, 1);
	                        break;
	                    }
	                }
	            }

	            delete this._subViewsByCid[subView.cid];
	            if (subView.model && subView.model.cid && this._subViewsByModelCid[subView.model.cid]) {
	                delete this._subViewsByModelCid[subView.model.cid];
	            }

	            if (this._subViewSingletons[key]) {
	                delete this._subViewSingletons[key];
	            }
	            if (!silent) {
	                this.trigger('remove:' + key, subView);
	            }
	        },
	        _setInst: function (key, instance, singleton, silent) {
	            var modCid = (instance.model) ? instance.model.cid : null,
	                viewsByModel = this._subViewsByModelCid;

	            this.subViews.push(instance);
	            this._subViewsByCid[instance.cid] = instance;
	            if (!instance.parentView) { instance.parentView = this.parent; }
	            instance._subviewtype = key;
	            if (modCid) {
	                if (viewsByModel[modCid]) {
	                    if (!isArray(viewsByModel[modCid])) { viewsByModel[modCid] = [viewsByModel[modCid]]; }
	                    viewsByModel[modCid].push(instance);
	                } else {
	                    this._subViewsByModelCid[modCid] = instance;
	                }
	            }

	            singleton = (typeof singleton === 'boolean') ? singleton : this.defaultToSingletons;
	            if (singleton) {
	                this._subViewSingletons[key] = instance;
	            } else {
	                if (!this._subViewsByType[key]) { this._subViewsByType[key] = []; }
	                this._subViewsByType[key].push(instance);
	            }
	            this.newest = instance;
	            if (!silent) {
	                return this.trigger('add', instance).trigger('add:' + key, instance);
	            }
	            return this;
	        },
	        _init: function (key, options, singleton) {
	            var instance,
	                config = this.config[key],
	                Construct = (config && config.construct) ? config.construct : null;

	            if (this._subViewSingletons[key]) {
	                return undefined;
	            }

	            options = _.extend({}, config.options || {}, options || {});

	            Construct = (typeof Construct === 'string') ? _stringToObj(Construct) : Construct;
	            if (!Construct) {
	                console.error('Construct for key "' + key + '" was not found:', config ? config.construct : '');
	                return undefined;
	            }
	            instance = new Construct(options, this.parent);
	            this._setInst(key, instance, (singleton !== undefined) ? singleton : config.singleton);
	            return instance;
	        }
	    };

	    // Add underscore methods to SubViewManager (e.g. myView.subs.each(function (subView) { console.log(subView.cid); });)
	    each(['each', 'map', 'initial', 'rest', 'last', 'first', 'find', 'filter', 'sortBy',
	        'groupBy', 'where', 'findWhere', 'some', 'every', 'invoke', 'contains', 'max', 'min',
	        'size', 'without', 'indexOf', 'lastIndexOf', 'isEmpty', 'reject'], function (funcName) {
	        /**
	         * Partial applications of underscore (or lodash if you use that instead) functions 
	         * of the same name (operates on the subViews array).
	         * List of available underscore methods:
	         * 'each', 'map', 'initial', 'rest', 'last', 'first', 'find', 'filter', 'sortBy',
	         * 'groupBy', 'where', 'findWhere', 'some', 'every', 'invoke', 'contains', 'max', 'min',
	         * 'size', 'without', 'indexOf', 'lastIndexOf', 'isEmpty', 'reject'
	         * @method underscore_methods
	         * @memberOf SubViewManager#
	         * @see http://underscorejs.org
	         * @example
	         * myBaseView.subs.each(function (subView) {
	         *     console.log('A subView of myBaseView', subView);
	         * });
	         * @example
	         * var view = myBaseView.subs.findWhere({ collection : testCollection });
	         * view.collection === test.collection // returns true
	         */
	        SubViewManager.prototype[funcName] = function () {
	            return _[funcName].apply(this, [this.subViews].concat(slice.call(arguments)));
	        };
	    });

	    // Add Backbone.Events functionality to SubView manager instances
	    _.extend(SubViewManager.prototype, Backbone.Events);

	    // =====================================================
	    // Backbone.BaseView

	    /**
	     * Adds some additional functionality to Backbone Views. Namely,
	     * in the form of subView management. Access info and methods
	     * to manipulate the '.subs' property.
	     * @constructor Backbone.BaseView
	     * @augments {Backbone.View}
	     * @class Backbone.BaseView
	     * @property subViews {Backbone.View[]} - Reference array of subViews generated by the '.subs' {@link SubViewManager}
	     * @property subs {SubViewManager} - object specifically for manipulating subviews
	     * @property subViewConfig      - A config map that can be automatically passed to the SubViewManager
	     * @property autoInitSubViews   - any subviews that are singletons will be autoinitilized if true
	     * @property singletonSubViews  - If subviews should default to being singletons when created
	     * @property parentView         - if this is a subView of another dibLibs.BaseView, this will be a ref to that view instance
	     */
	    BaseView = View.extend({
	        subViews: null,
	        subs: null,
	        // SubView Configuration Object
	        // <key> : {
	        //      construct: // Constructor function or string version (i.e. "Backbone.BaseView")
	        //      options: // Any options you want to pass to the initialize function
	        //      singleton: // if the object should be configured as a singleton or not
	        //      location: // Useful for automatically placing the subviews element in it's parent
	        //  }
	        subViewConfig: null,
	        // Any subviews that are singletons will be auto initialized if the below is true
	        autoInitSubViews: false,
	        // True if your subviews should default to singleton or not
	        singletonSubViews: false,
	        // If this is a subView of another Backbone.BaseView, this will be a ref to that view instance
	        parentView: null,
	        constructor: function (options, parentView) {
	            var subViewCfg = (options && options.subViewConfig) ? options.subViewConfig : this.subViewConfig;
	            subViewCfg = (isFunction(subViewCfg)) ? subViewCfg.call(this) : subViewCfg;
	            // Assign a parentView if second param is a Backbone View
	            this.parentView = (parentView instanceof View) ? parentView : null;
	            this.subs = new SubViewManager(null, this, {
	                autoInitSingletons: this.autoInitSubViews,
	                defaultToSingletons: this.singletonSubViews
	            });
	            if (subViewCfg) {
	                this.subs.addConfig(subViewCfg);
	            }
	            this.subViews = this.subs.subViews;
	            // Add events that will not bubble events up app the view's ancestor tree
	            this._stopPropogation = {};
	            BaseView.__super__.constructor.call(this, options);
	            // To maintain parity with how Backbone handles the 'events'
	            // property on a view, we will overwrite the 'viewEvents'
	            // property on the prototype with options.viewEvents if it
	            // exists
	            this.viewEvents = options && options.viewEvents ? options.viewEvents : this.viewEvents;
	            if (this.viewEvents) {
	                this.bindViewEvents();
	            }
	        },
	        /**
	         * A basic render function that looks for a template
	         * function, calls the template with the result of 
	         * the 'templateVars' property, and then set the html
	         * to the result. Then, subviews are rendered and then
	         * appended to their locations.
	         * @memberOf Backbone.BaseView#
	         * @return {Backbone.BaseView}
	         */
	        render: function () {
	            var html = '',
	                template = this.template;
	            if (isFunction(template)) {
	                html = template(result(this, 'templateVars')) || '';
	            }
	            this.$el.html(html);
	            this.subs.renderAppend();
	            return this;
	        },
	        /**
	         * Place the view DOM element ('.el') in a specified location. By
	         * default it is appended to the location.
	         * @memberOf Backbone.BaseView#
	         * @param {jQuery} $location jQuery DOM element
	         * @param {boolean} [replace] 
	         *        True if you want to replace existing html
	         *        of the location with this view
	         * @return {Backbone.BaseView}
	         */
	        place: function ($location, replace) {
	            if (typeof $location === "string") {
	                var $parent = (this.parentView) ? this.parentView.$el : Backbone.$('body');
	                $location = $parent.find($location);
	            }

	            if (replace) {
	                $location.html(this.el);
	                return this;
	            }
	            $location.append(this.el);
	            return this;
	        },
	        /**
	         * Overrides Backbone.View#remove in order
	         * to remove SubViews as well, in order to
	         * prevent memory leaks.
	         * @memberOf Backbone.BaseView#
	         * @return {Backbone.BaseView}
	         */
	        remove: function () {
	            BaseView.__super__.remove.call(this);
	            this.subs.removeElems();
	            return this;
	        },
	        /**
	         * Stops the current event from propagating up or down the 
	         * ancestor tree of BaseView instances. Resets immediately
	         * after stopping the event, and has to be callled every 
	         * time you want an event to be stopped.
	         * @memberOf Backbone.BaseView#
	         * @param {String} event The name of the event
	         * @return {Backbone.BaseView}
	         */
	        stopEvent: function (event) {
	            console.assert(!!event, "event parameter is required");
	            this._stopPropogation[event] = true;
	            return this;
	        },
	        /**
	         * Like Backbone.trigger, except that this will not only use trigger
	         * on the instance this method is invoked on, but also the instance's
	         * 'parentView', and the parentView's parentView, and so on.
	         * Additional arguments beyond the event name will be passed
	         * as arguments to the event handler functions. The view that
	         * originated the bubbling event will automatically be tacked
	         * on to the end of the arguments, so you can access it if needed.
	         * @memberOf Backbone.BaseView#
	         * @param {String} event The name of the event
	         * @param {...Mixed} [arg] Argument be passed to event callbacks
	         * @return {Backbone.BaseView}
	         */
	        triggerBubble: function (event) {
	            var args = slice.call(arguments, 1),
	                stopPropogation,
	                anscestor;
	            args.unshift(event);
	            args.push(this);
	            anscestor = this;
	            while (anscestor) {
	                anscestor.trigger.apply(anscestor, args);
	                stopPropogation = anscestor._stopPropogation;
	                if (stopPropogation && stopPropogation[event]) {
	                    stopPropogation[event] = false;
	                    return this;
	                }
	                anscestor = anscestor.parentView;
	            }
	            return this;
	        },
	        /**
	         * Triggers an event that will trigger on each of the instances
	         * subViews, and then if a subView has subViews, will trigger the
	         * event on that subViews' subViews, and so on. If a subView
	         * calls stopEvent and passes the event name, then the event
	         * will not trigger on that subViews' subViews. Arguments
	         * work in the same manner as they do with triggerBubble.
	         * @memberOf Backbone.BaseView#
	         * @param {String} event The event name
	         * @param {...Mixed} [arg] Argument be passed to event callbacks
	         * @return {Backbone.BaseView}
	         */
	        triggerDescend: function (event) {
	            var args = slice.call(arguments, 1),
	                _trigger = function (subViews) {
	                    var i = -1,
	                        len = subViews.length,
	                        subSubs,
	                        stopPropogation,
	                        descend;
	                    while (++i < len) {
	                        descend = true;
	                        subViews[i].trigger.apply(subViews[i], args);
	                        stopPropogation = subViews[i]._stopPropogation;
	                        if (stopPropogation && stopPropogation[event]) {
	                            stopPropogation[event] = false;
	                            descend = false;
	                        }
	                        subSubs = subViews[i].subViews;
	                        if (descend && subSubs && subSubs.length) {
	                            _trigger(subSubs);
	                        }
	                    }
	                };
	            args.unshift(event);
	            args.push(this);
	            _trigger([this]);
	            return this;
	        },
	        /**
	         * Invoke a function or method on ancestors
	         * @memberOf Backbone.BaseView#
	         * @param {Function|String} fnName
	         * @param {mixed[]} [args]
	         *        An array of arguments to pass to
	         *        the invocation
	         * @return {Backbone.BaseView}
	         */
	        ascend: function (fnName, args) {
	            var func,
	                ancestor = this,
	                isFunc = isFunction(fnName);
	            while (ancestor.parentView) {
	                ancestor = ancestor.parentView;
	                if (ancestor) {
	                    func = isFunc ? fnName : ancestor[fnName];
	                    func.apply(ancestor, args);
	                }
	            }
	            return this;
	        },
	        /**
	         * Ascends up the ancestor line until an
	         * a test function returns true
	         * @param  {Function} testFn
	         *         A function that returns a truthy
	         *         value if the current ancestor should be 
	         *         returned
	         * @return {Backbone.BaseView|null}
	         */
	        findAncestor: function (testFn) {
	            var ancestor = this;
	            while (ancestor.parentView) {
	                ancestor = ancestor.parentView;
	                if (ancestor && testFn(ancestor)) {
	                    return ancestor;
	                }
	            }
	            return null;
	        },
	        /**
	         * Returns the first ancestor to be an instance
	         * of the Construct argument
	         * @param  {Function} Construct 
	         *         A Backbone.BaseView constructor function
	         * @return {Backbone.BaseView|null}
	         */
	        findAncestorByConstruct: function (Construct) {
	            return this.findAncestor(function (ancestor) {
	                return ancestor instanceof Construct;
	            });
	        },
	        /**
	         * Get the first ancestor that matches a type.
	         * @memberOf Backbone.BaseView#
	         * @param {String} type 
	         *        The subView 'type' the ancestor should match. The
	         *        first ancestor with this type will be returned
	         * @return {null|Backbone.BaseView}
	         */
	        findAncestorByType: function (type) {
	            return this.findAncestor(function (ancestor) {
	                return type && ancestor._subviewtype === type;
	            });
	        },
	        /**
	         * Return the subview type if this view a subview and was a assigned a
	         * type.
	         * @memberOf Backbone.BaseView#
	         * @return {string|number} The subview type
	         */
	        getSubViewType: function () {
	            return this._subviewtype;
	        },
	        /**
	         * Returns the top of the subView hierarchy.
	         * @memberOf Backbone.BaseView#
	         * @return {Backbone.View}
	         */
	        getTopView : function () {
	            var ancestor = this;
	            while (ancestor.parentView) {
	                ancestor = ancestor.parentView;
	            }
	            return ancestor;
	        },
	        /**
	         * Returns true if this view has no ancestors
	         * @memberOf Backbone.BaseView#
	         * @return {boolean}
	         */
	        isTopView : function () {
	            return !this.parentView;
	        },
	        /**
	         * Like delegateEvents, except that instead of events being bound to el, the
	         * events are backbone events bound to the view object itself. You can create
	         * a 'viewEvents' object literal property on a View's prototype, and when it's
	         * instantiated, the view will listen for events on a Backone object based on
	         * the key.
	         *
	         * For example { 'change model': 'render' } would listen for a 'change'
	         * event on the view's model property and then call view's render method.
	         * If you only specify an event name and leave the property out of the key,
	         * then the event will be bound to the view instance directly. For example,
	         * { 'submit' : 'render' } would call the render method of the view when
	         * a 'submit' event occurs on the view.
	         * @memberOf Backbone.BaseView#
	         * return {Backbone.BaseView}
	         */
	        bindViewEvents: function (events) {
	            events = events || result(this, 'viewEvents');
	            each(events, function (func, event) {
	                var segs = event.split(' '),
	                    listenTo = (segs.length > 1) ? this[segs[1]] : this;
	                func = isFunction(func) ? func : this[func];
	                if (listenTo) {
	                    this.stopListening(listenTo, segs[0], func);
	                    this.listenTo(listenTo, segs[0], func);
	                }
	            }, this);
	            return this;
	        }

	    });

	    Backbone.BaseView = BaseView;

	}(this));


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;//     Underscore.js 1.8.3
	//     http://underscorejs.org
	//     (c) 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
	//     Underscore may be freely distributed under the MIT license.

	(function() {

	  // Baseline setup
	  // --------------

	  // Establish the root object, `window` in the browser, or `exports` on the server.
	  var root = this;

	  // Save the previous value of the `_` variable.
	  var previousUnderscore = root._;

	  // Save bytes in the minified (but not gzipped) version:
	  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

	  // Create quick reference variables for speed access to core prototypes.
	  var
	    push             = ArrayProto.push,
	    slice            = ArrayProto.slice,
	    toString         = ObjProto.toString,
	    hasOwnProperty   = ObjProto.hasOwnProperty;

	  // All **ECMAScript 5** native function implementations that we hope to use
	  // are declared here.
	  var
	    nativeIsArray      = Array.isArray,
	    nativeKeys         = Object.keys,
	    nativeBind         = FuncProto.bind,
	    nativeCreate       = Object.create;

	  // Naked function reference for surrogate-prototype-swapping.
	  var Ctor = function(){};

	  // Create a safe reference to the Underscore object for use below.
	  var _ = function(obj) {
	    if (obj instanceof _) return obj;
	    if (!(this instanceof _)) return new _(obj);
	    this._wrapped = obj;
	  };

	  // Export the Underscore object for **Node.js**, with
	  // backwards-compatibility for the old `require()` API. If we're in
	  // the browser, add `_` as a global object.
	  if (true) {
	    if (typeof module !== 'undefined' && module.exports) {
	      exports = module.exports = _;
	    }
	    exports._ = _;
	  } else {
	    root._ = _;
	  }

	  // Current version.
	  _.VERSION = '1.8.3';

	  // Internal function that returns an efficient (for current engines) version
	  // of the passed-in callback, to be repeatedly applied in other Underscore
	  // functions.
	  var optimizeCb = function(func, context, argCount) {
	    if (context === void 0) return func;
	    switch (argCount == null ? 3 : argCount) {
	      case 1: return function(value) {
	        return func.call(context, value);
	      };
	      case 2: return function(value, other) {
	        return func.call(context, value, other);
	      };
	      case 3: return function(value, index, collection) {
	        return func.call(context, value, index, collection);
	      };
	      case 4: return function(accumulator, value, index, collection) {
	        return func.call(context, accumulator, value, index, collection);
	      };
	    }
	    return function() {
	      return func.apply(context, arguments);
	    };
	  };

	  // A mostly-internal function to generate callbacks that can be applied
	  // to each element in a collection, returning the desired result — either
	  // identity, an arbitrary callback, a property matcher, or a property accessor.
	  var cb = function(value, context, argCount) {
	    if (value == null) return _.identity;
	    if (_.isFunction(value)) return optimizeCb(value, context, argCount);
	    if (_.isObject(value)) return _.matcher(value);
	    return _.property(value);
	  };
	  _.iteratee = function(value, context) {
	    return cb(value, context, Infinity);
	  };

	  // An internal function for creating assigner functions.
	  var createAssigner = function(keysFunc, undefinedOnly) {
	    return function(obj) {
	      var length = arguments.length;
	      if (length < 2 || obj == null) return obj;
	      for (var index = 1; index < length; index++) {
	        var source = arguments[index],
	            keys = keysFunc(source),
	            l = keys.length;
	        for (var i = 0; i < l; i++) {
	          var key = keys[i];
	          if (!undefinedOnly || obj[key] === void 0) obj[key] = source[key];
	        }
	      }
	      return obj;
	    };
	  };

	  // An internal function for creating a new object that inherits from another.
	  var baseCreate = function(prototype) {
	    if (!_.isObject(prototype)) return {};
	    if (nativeCreate) return nativeCreate(prototype);
	    Ctor.prototype = prototype;
	    var result = new Ctor;
	    Ctor.prototype = null;
	    return result;
	  };

	  var property = function(key) {
	    return function(obj) {
	      return obj == null ? void 0 : obj[key];
	    };
	  };

	  // Helper for collection methods to determine whether a collection
	  // should be iterated as an array or as an object
	  // Related: http://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength
	  // Avoids a very nasty iOS 8 JIT bug on ARM-64. #2094
	  var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
	  var getLength = property('length');
	  var isArrayLike = function(collection) {
	    var length = getLength(collection);
	    return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
	  };

	  // Collection Functions
	  // --------------------

	  // The cornerstone, an `each` implementation, aka `forEach`.
	  // Handles raw objects in addition to array-likes. Treats all
	  // sparse array-likes as if they were dense.
	  _.each = _.forEach = function(obj, iteratee, context) {
	    iteratee = optimizeCb(iteratee, context);
	    var i, length;
	    if (isArrayLike(obj)) {
	      for (i = 0, length = obj.length; i < length; i++) {
	        iteratee(obj[i], i, obj);
	      }
	    } else {
	      var keys = _.keys(obj);
	      for (i = 0, length = keys.length; i < length; i++) {
	        iteratee(obj[keys[i]], keys[i], obj);
	      }
	    }
	    return obj;
	  };

	  // Return the results of applying the iteratee to each element.
	  _.map = _.collect = function(obj, iteratee, context) {
	    iteratee = cb(iteratee, context);
	    var keys = !isArrayLike(obj) && _.keys(obj),
	        length = (keys || obj).length,
	        results = Array(length);
	    for (var index = 0; index < length; index++) {
	      var currentKey = keys ? keys[index] : index;
	      results[index] = iteratee(obj[currentKey], currentKey, obj);
	    }
	    return results;
	  };

	  // Create a reducing function iterating left or right.
	  function createReduce(dir) {
	    // Optimized iterator function as using arguments.length
	    // in the main function will deoptimize the, see #1991.
	    function iterator(obj, iteratee, memo, keys, index, length) {
	      for (; index >= 0 && index < length; index += dir) {
	        var currentKey = keys ? keys[index] : index;
	        memo = iteratee(memo, obj[currentKey], currentKey, obj);
	      }
	      return memo;
	    }

	    return function(obj, iteratee, memo, context) {
	      iteratee = optimizeCb(iteratee, context, 4);
	      var keys = !isArrayLike(obj) && _.keys(obj),
	          length = (keys || obj).length,
	          index = dir > 0 ? 0 : length - 1;
	      // Determine the initial value if none is provided.
	      if (arguments.length < 3) {
	        memo = obj[keys ? keys[index] : index];
	        index += dir;
	      }
	      return iterator(obj, iteratee, memo, keys, index, length);
	    };
	  }

	  // **Reduce** builds up a single result from a list of values, aka `inject`,
	  // or `foldl`.
	  _.reduce = _.foldl = _.inject = createReduce(1);

	  // The right-associative version of reduce, also known as `foldr`.
	  _.reduceRight = _.foldr = createReduce(-1);

	  // Return the first value which passes a truth test. Aliased as `detect`.
	  _.find = _.detect = function(obj, predicate, context) {
	    var key;
	    if (isArrayLike(obj)) {
	      key = _.findIndex(obj, predicate, context);
	    } else {
	      key = _.findKey(obj, predicate, context);
	    }
	    if (key !== void 0 && key !== -1) return obj[key];
	  };

	  // Return all the elements that pass a truth test.
	  // Aliased as `select`.
	  _.filter = _.select = function(obj, predicate, context) {
	    var results = [];
	    predicate = cb(predicate, context);
	    _.each(obj, function(value, index, list) {
	      if (predicate(value, index, list)) results.push(value);
	    });
	    return results;
	  };

	  // Return all the elements for which a truth test fails.
	  _.reject = function(obj, predicate, context) {
	    return _.filter(obj, _.negate(cb(predicate)), context);
	  };

	  // Determine whether all of the elements match a truth test.
	  // Aliased as `all`.
	  _.every = _.all = function(obj, predicate, context) {
	    predicate = cb(predicate, context);
	    var keys = !isArrayLike(obj) && _.keys(obj),
	        length = (keys || obj).length;
	    for (var index = 0; index < length; index++) {
	      var currentKey = keys ? keys[index] : index;
	      if (!predicate(obj[currentKey], currentKey, obj)) return false;
	    }
	    return true;
	  };

	  // Determine if at least one element in the object matches a truth test.
	  // Aliased as `any`.
	  _.some = _.any = function(obj, predicate, context) {
	    predicate = cb(predicate, context);
	    var keys = !isArrayLike(obj) && _.keys(obj),
	        length = (keys || obj).length;
	    for (var index = 0; index < length; index++) {
	      var currentKey = keys ? keys[index] : index;
	      if (predicate(obj[currentKey], currentKey, obj)) return true;
	    }
	    return false;
	  };

	  // Determine if the array or object contains a given item (using `===`).
	  // Aliased as `includes` and `include`.
	  _.contains = _.includes = _.include = function(obj, item, fromIndex, guard) {
	    if (!isArrayLike(obj)) obj = _.values(obj);
	    if (typeof fromIndex != 'number' || guard) fromIndex = 0;
	    return _.indexOf(obj, item, fromIndex) >= 0;
	  };

	  // Invoke a method (with arguments) on every item in a collection.
	  _.invoke = function(obj, method) {
	    var args = slice.call(arguments, 2);
	    var isFunc = _.isFunction(method);
	    return _.map(obj, function(value) {
	      var func = isFunc ? method : value[method];
	      return func == null ? func : func.apply(value, args);
	    });
	  };

	  // Convenience version of a common use case of `map`: fetching a property.
	  _.pluck = function(obj, key) {
	    return _.map(obj, _.property(key));
	  };

	  // Convenience version of a common use case of `filter`: selecting only objects
	  // containing specific `key:value` pairs.
	  _.where = function(obj, attrs) {
	    return _.filter(obj, _.matcher(attrs));
	  };

	  // Convenience version of a common use case of `find`: getting the first object
	  // containing specific `key:value` pairs.
	  _.findWhere = function(obj, attrs) {
	    return _.find(obj, _.matcher(attrs));
	  };

	  // Return the maximum element (or element-based computation).
	  _.max = function(obj, iteratee, context) {
	    var result = -Infinity, lastComputed = -Infinity,
	        value, computed;
	    if (iteratee == null && obj != null) {
	      obj = isArrayLike(obj) ? obj : _.values(obj);
	      for (var i = 0, length = obj.length; i < length; i++) {
	        value = obj[i];
	        if (value > result) {
	          result = value;
	        }
	      }
	    } else {
	      iteratee = cb(iteratee, context);
	      _.each(obj, function(value, index, list) {
	        computed = iteratee(value, index, list);
	        if (computed > lastComputed || computed === -Infinity && result === -Infinity) {
	          result = value;
	          lastComputed = computed;
	        }
	      });
	    }
	    return result;
	  };

	  // Return the minimum element (or element-based computation).
	  _.min = function(obj, iteratee, context) {
	    var result = Infinity, lastComputed = Infinity,
	        value, computed;
	    if (iteratee == null && obj != null) {
	      obj = isArrayLike(obj) ? obj : _.values(obj);
	      for (var i = 0, length = obj.length; i < length; i++) {
	        value = obj[i];
	        if (value < result) {
	          result = value;
	        }
	      }
	    } else {
	      iteratee = cb(iteratee, context);
	      _.each(obj, function(value, index, list) {
	        computed = iteratee(value, index, list);
	        if (computed < lastComputed || computed === Infinity && result === Infinity) {
	          result = value;
	          lastComputed = computed;
	        }
	      });
	    }
	    return result;
	  };

	  // Shuffle a collection, using the modern version of the
	  // [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
	  _.shuffle = function(obj) {
	    var set = isArrayLike(obj) ? obj : _.values(obj);
	    var length = set.length;
	    var shuffled = Array(length);
	    for (var index = 0, rand; index < length; index++) {
	      rand = _.random(0, index);
	      if (rand !== index) shuffled[index] = shuffled[rand];
	      shuffled[rand] = set[index];
	    }
	    return shuffled;
	  };

	  // Sample **n** random values from a collection.
	  // If **n** is not specified, returns a single random element.
	  // The internal `guard` argument allows it to work with `map`.
	  _.sample = function(obj, n, guard) {
	    if (n == null || guard) {
	      if (!isArrayLike(obj)) obj = _.values(obj);
	      return obj[_.random(obj.length - 1)];
	    }
	    return _.shuffle(obj).slice(0, Math.max(0, n));
	  };

	  // Sort the object's values by a criterion produced by an iteratee.
	  _.sortBy = function(obj, iteratee, context) {
	    iteratee = cb(iteratee, context);
	    return _.pluck(_.map(obj, function(value, index, list) {
	      return {
	        value: value,
	        index: index,
	        criteria: iteratee(value, index, list)
	      };
	    }).sort(function(left, right) {
	      var a = left.criteria;
	      var b = right.criteria;
	      if (a !== b) {
	        if (a > b || a === void 0) return 1;
	        if (a < b || b === void 0) return -1;
	      }
	      return left.index - right.index;
	    }), 'value');
	  };

	  // An internal function used for aggregate "group by" operations.
	  var group = function(behavior) {
	    return function(obj, iteratee, context) {
	      var result = {};
	      iteratee = cb(iteratee, context);
	      _.each(obj, function(value, index) {
	        var key = iteratee(value, index, obj);
	        behavior(result, value, key);
	      });
	      return result;
	    };
	  };

	  // Groups the object's values by a criterion. Pass either a string attribute
	  // to group by, or a function that returns the criterion.
	  _.groupBy = group(function(result, value, key) {
	    if (_.has(result, key)) result[key].push(value); else result[key] = [value];
	  });

	  // Indexes the object's values by a criterion, similar to `groupBy`, but for
	  // when you know that your index values will be unique.
	  _.indexBy = group(function(result, value, key) {
	    result[key] = value;
	  });

	  // Counts instances of an object that group by a certain criterion. Pass
	  // either a string attribute to count by, or a function that returns the
	  // criterion.
	  _.countBy = group(function(result, value, key) {
	    if (_.has(result, key)) result[key]++; else result[key] = 1;
	  });

	  // Safely create a real, live array from anything iterable.
	  _.toArray = function(obj) {
	    if (!obj) return [];
	    if (_.isArray(obj)) return slice.call(obj);
	    if (isArrayLike(obj)) return _.map(obj, _.identity);
	    return _.values(obj);
	  };

	  // Return the number of elements in an object.
	  _.size = function(obj) {
	    if (obj == null) return 0;
	    return isArrayLike(obj) ? obj.length : _.keys(obj).length;
	  };

	  // Split a collection into two arrays: one whose elements all satisfy the given
	  // predicate, and one whose elements all do not satisfy the predicate.
	  _.partition = function(obj, predicate, context) {
	    predicate = cb(predicate, context);
	    var pass = [], fail = [];
	    _.each(obj, function(value, key, obj) {
	      (predicate(value, key, obj) ? pass : fail).push(value);
	    });
	    return [pass, fail];
	  };

	  // Array Functions
	  // ---------------

	  // Get the first element of an array. Passing **n** will return the first N
	  // values in the array. Aliased as `head` and `take`. The **guard** check
	  // allows it to work with `_.map`.
	  _.first = _.head = _.take = function(array, n, guard) {
	    if (array == null) return void 0;
	    if (n == null || guard) return array[0];
	    return _.initial(array, array.length - n);
	  };

	  // Returns everything but the last entry of the array. Especially useful on
	  // the arguments object. Passing **n** will return all the values in
	  // the array, excluding the last N.
	  _.initial = function(array, n, guard) {
	    return slice.call(array, 0, Math.max(0, array.length - (n == null || guard ? 1 : n)));
	  };

	  // Get the last element of an array. Passing **n** will return the last N
	  // values in the array.
	  _.last = function(array, n, guard) {
	    if (array == null) return void 0;
	    if (n == null || guard) return array[array.length - 1];
	    return _.rest(array, Math.max(0, array.length - n));
	  };

	  // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
	  // Especially useful on the arguments object. Passing an **n** will return
	  // the rest N values in the array.
	  _.rest = _.tail = _.drop = function(array, n, guard) {
	    return slice.call(array, n == null || guard ? 1 : n);
	  };

	  // Trim out all falsy values from an array.
	  _.compact = function(array) {
	    return _.filter(array, _.identity);
	  };

	  // Internal implementation of a recursive `flatten` function.
	  var flatten = function(input, shallow, strict, startIndex) {
	    var output = [], idx = 0;
	    for (var i = startIndex || 0, length = getLength(input); i < length; i++) {
	      var value = input[i];
	      if (isArrayLike(value) && (_.isArray(value) || _.isArguments(value))) {
	        //flatten current level of array or arguments object
	        if (!shallow) value = flatten(value, shallow, strict);
	        var j = 0, len = value.length;
	        output.length += len;
	        while (j < len) {
	          output[idx++] = value[j++];
	        }
	      } else if (!strict) {
	        output[idx++] = value;
	      }
	    }
	    return output;
	  };

	  // Flatten out an array, either recursively (by default), or just one level.
	  _.flatten = function(array, shallow) {
	    return flatten(array, shallow, false);
	  };

	  // Return a version of the array that does not contain the specified value(s).
	  _.without = function(array) {
	    return _.difference(array, slice.call(arguments, 1));
	  };

	  // Produce a duplicate-free version of the array. If the array has already
	  // been sorted, you have the option of using a faster algorithm.
	  // Aliased as `unique`.
	  _.uniq = _.unique = function(array, isSorted, iteratee, context) {
	    if (!_.isBoolean(isSorted)) {
	      context = iteratee;
	      iteratee = isSorted;
	      isSorted = false;
	    }
	    if (iteratee != null) iteratee = cb(iteratee, context);
	    var result = [];
	    var seen = [];
	    for (var i = 0, length = getLength(array); i < length; i++) {
	      var value = array[i],
	          computed = iteratee ? iteratee(value, i, array) : value;
	      if (isSorted) {
	        if (!i || seen !== computed) result.push(value);
	        seen = computed;
	      } else if (iteratee) {
	        if (!_.contains(seen, computed)) {
	          seen.push(computed);
	          result.push(value);
	        }
	      } else if (!_.contains(result, value)) {
	        result.push(value);
	      }
	    }
	    return result;
	  };

	  // Produce an array that contains the union: each distinct element from all of
	  // the passed-in arrays.
	  _.union = function() {
	    return _.uniq(flatten(arguments, true, true));
	  };

	  // Produce an array that contains every item shared between all the
	  // passed-in arrays.
	  _.intersection = function(array) {
	    var result = [];
	    var argsLength = arguments.length;
	    for (var i = 0, length = getLength(array); i < length; i++) {
	      var item = array[i];
	      if (_.contains(result, item)) continue;
	      for (var j = 1; j < argsLength; j++) {
	        if (!_.contains(arguments[j], item)) break;
	      }
	      if (j === argsLength) result.push(item);
	    }
	    return result;
	  };

	  // Take the difference between one array and a number of other arrays.
	  // Only the elements present in just the first array will remain.
	  _.difference = function(array) {
	    var rest = flatten(arguments, true, true, 1);
	    return _.filter(array, function(value){
	      return !_.contains(rest, value);
	    });
	  };

	  // Zip together multiple lists into a single array -- elements that share
	  // an index go together.
	  _.zip = function() {
	    return _.unzip(arguments);
	  };

	  // Complement of _.zip. Unzip accepts an array of arrays and groups
	  // each array's elements on shared indices
	  _.unzip = function(array) {
	    var length = array && _.max(array, getLength).length || 0;
	    var result = Array(length);

	    for (var index = 0; index < length; index++) {
	      result[index] = _.pluck(array, index);
	    }
	    return result;
	  };

	  // Converts lists into objects. Pass either a single array of `[key, value]`
	  // pairs, or two parallel arrays of the same length -- one of keys, and one of
	  // the corresponding values.
	  _.object = function(list, values) {
	    var result = {};
	    for (var i = 0, length = getLength(list); i < length; i++) {
	      if (values) {
	        result[list[i]] = values[i];
	      } else {
	        result[list[i][0]] = list[i][1];
	      }
	    }
	    return result;
	  };

	  // Generator function to create the findIndex and findLastIndex functions
	  function createPredicateIndexFinder(dir) {
	    return function(array, predicate, context) {
	      predicate = cb(predicate, context);
	      var length = getLength(array);
	      var index = dir > 0 ? 0 : length - 1;
	      for (; index >= 0 && index < length; index += dir) {
	        if (predicate(array[index], index, array)) return index;
	      }
	      return -1;
	    };
	  }

	  // Returns the first index on an array-like that passes a predicate test
	  _.findIndex = createPredicateIndexFinder(1);
	  _.findLastIndex = createPredicateIndexFinder(-1);

	  // Use a comparator function to figure out the smallest index at which
	  // an object should be inserted so as to maintain order. Uses binary search.
	  _.sortedIndex = function(array, obj, iteratee, context) {
	    iteratee = cb(iteratee, context, 1);
	    var value = iteratee(obj);
	    var low = 0, high = getLength(array);
	    while (low < high) {
	      var mid = Math.floor((low + high) / 2);
	      if (iteratee(array[mid]) < value) low = mid + 1; else high = mid;
	    }
	    return low;
	  };

	  // Generator function to create the indexOf and lastIndexOf functions
	  function createIndexFinder(dir, predicateFind, sortedIndex) {
	    return function(array, item, idx) {
	      var i = 0, length = getLength(array);
	      if (typeof idx == 'number') {
	        if (dir > 0) {
	            i = idx >= 0 ? idx : Math.max(idx + length, i);
	        } else {
	            length = idx >= 0 ? Math.min(idx + 1, length) : idx + length + 1;
	        }
	      } else if (sortedIndex && idx && length) {
	        idx = sortedIndex(array, item);
	        return array[idx] === item ? idx : -1;
	      }
	      if (item !== item) {
	        idx = predicateFind(slice.call(array, i, length), _.isNaN);
	        return idx >= 0 ? idx + i : -1;
	      }
	      for (idx = dir > 0 ? i : length - 1; idx >= 0 && idx < length; idx += dir) {
	        if (array[idx] === item) return idx;
	      }
	      return -1;
	    };
	  }

	  // Return the position of the first occurrence of an item in an array,
	  // or -1 if the item is not included in the array.
	  // If the array is large and already in sort order, pass `true`
	  // for **isSorted** to use binary search.
	  _.indexOf = createIndexFinder(1, _.findIndex, _.sortedIndex);
	  _.lastIndexOf = createIndexFinder(-1, _.findLastIndex);

	  // Generate an integer Array containing an arithmetic progression. A port of
	  // the native Python `range()` function. See
	  // [the Python documentation](http://docs.python.org/library/functions.html#range).
	  _.range = function(start, stop, step) {
	    if (stop == null) {
	      stop = start || 0;
	      start = 0;
	    }
	    step = step || 1;

	    var length = Math.max(Math.ceil((stop - start) / step), 0);
	    var range = Array(length);

	    for (var idx = 0; idx < length; idx++, start += step) {
	      range[idx] = start;
	    }

	    return range;
	  };

	  // Function (ahem) Functions
	  // ------------------

	  // Determines whether to execute a function as a constructor
	  // or a normal function with the provided arguments
	  var executeBound = function(sourceFunc, boundFunc, context, callingContext, args) {
	    if (!(callingContext instanceof boundFunc)) return sourceFunc.apply(context, args);
	    var self = baseCreate(sourceFunc.prototype);
	    var result = sourceFunc.apply(self, args);
	    if (_.isObject(result)) return result;
	    return self;
	  };

	  // Create a function bound to a given object (assigning `this`, and arguments,
	  // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
	  // available.
	  _.bind = function(func, context) {
	    if (nativeBind && func.bind === nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
	    if (!_.isFunction(func)) throw new TypeError('Bind must be called on a function');
	    var args = slice.call(arguments, 2);
	    var bound = function() {
	      return executeBound(func, bound, context, this, args.concat(slice.call(arguments)));
	    };
	    return bound;
	  };

	  // Partially apply a function by creating a version that has had some of its
	  // arguments pre-filled, without changing its dynamic `this` context. _ acts
	  // as a placeholder, allowing any combination of arguments to be pre-filled.
	  _.partial = function(func) {
	    var boundArgs = slice.call(arguments, 1);
	    var bound = function() {
	      var position = 0, length = boundArgs.length;
	      var args = Array(length);
	      for (var i = 0; i < length; i++) {
	        args[i] = boundArgs[i] === _ ? arguments[position++] : boundArgs[i];
	      }
	      while (position < arguments.length) args.push(arguments[position++]);
	      return executeBound(func, bound, this, this, args);
	    };
	    return bound;
	  };

	  // Bind a number of an object's methods to that object. Remaining arguments
	  // are the method names to be bound. Useful for ensuring that all callbacks
	  // defined on an object belong to it.
	  _.bindAll = function(obj) {
	    var i, length = arguments.length, key;
	    if (length <= 1) throw new Error('bindAll must be passed function names');
	    for (i = 1; i < length; i++) {
	      key = arguments[i];
	      obj[key] = _.bind(obj[key], obj);
	    }
	    return obj;
	  };

	  // Memoize an expensive function by storing its results.
	  _.memoize = function(func, hasher) {
	    var memoize = function(key) {
	      var cache = memoize.cache;
	      var address = '' + (hasher ? hasher.apply(this, arguments) : key);
	      if (!_.has(cache, address)) cache[address] = func.apply(this, arguments);
	      return cache[address];
	    };
	    memoize.cache = {};
	    return memoize;
	  };

	  // Delays a function for the given number of milliseconds, and then calls
	  // it with the arguments supplied.
	  _.delay = function(func, wait) {
	    var args = slice.call(arguments, 2);
	    return setTimeout(function(){
	      return func.apply(null, args);
	    }, wait);
	  };

	  // Defers a function, scheduling it to run after the current call stack has
	  // cleared.
	  _.defer = _.partial(_.delay, _, 1);

	  // Returns a function, that, when invoked, will only be triggered at most once
	  // during a given window of time. Normally, the throttled function will run
	  // as much as it can, without ever going more than once per `wait` duration;
	  // but if you'd like to disable the execution on the leading edge, pass
	  // `{leading: false}`. To disable execution on the trailing edge, ditto.
	  _.throttle = function(func, wait, options) {
	    var context, args, result;
	    var timeout = null;
	    var previous = 0;
	    if (!options) options = {};
	    var later = function() {
	      previous = options.leading === false ? 0 : _.now();
	      timeout = null;
	      result = func.apply(context, args);
	      if (!timeout) context = args = null;
	    };
	    return function() {
	      var now = _.now();
	      if (!previous && options.leading === false) previous = now;
	      var remaining = wait - (now - previous);
	      context = this;
	      args = arguments;
	      if (remaining <= 0 || remaining > wait) {
	        if (timeout) {
	          clearTimeout(timeout);
	          timeout = null;
	        }
	        previous = now;
	        result = func.apply(context, args);
	        if (!timeout) context = args = null;
	      } else if (!timeout && options.trailing !== false) {
	        timeout = setTimeout(later, remaining);
	      }
	      return result;
	    };
	  };

	  // Returns a function, that, as long as it continues to be invoked, will not
	  // be triggered. The function will be called after it stops being called for
	  // N milliseconds. If `immediate` is passed, trigger the function on the
	  // leading edge, instead of the trailing.
	  _.debounce = function(func, wait, immediate) {
	    var timeout, args, context, timestamp, result;

	    var later = function() {
	      var last = _.now() - timestamp;

	      if (last < wait && last >= 0) {
	        timeout = setTimeout(later, wait - last);
	      } else {
	        timeout = null;
	        if (!immediate) {
	          result = func.apply(context, args);
	          if (!timeout) context = args = null;
	        }
	      }
	    };

	    return function() {
	      context = this;
	      args = arguments;
	      timestamp = _.now();
	      var callNow = immediate && !timeout;
	      if (!timeout) timeout = setTimeout(later, wait);
	      if (callNow) {
	        result = func.apply(context, args);
	        context = args = null;
	      }

	      return result;
	    };
	  };

	  // Returns the first function passed as an argument to the second,
	  // allowing you to adjust arguments, run code before and after, and
	  // conditionally execute the original function.
	  _.wrap = function(func, wrapper) {
	    return _.partial(wrapper, func);
	  };

	  // Returns a negated version of the passed-in predicate.
	  _.negate = function(predicate) {
	    return function() {
	      return !predicate.apply(this, arguments);
	    };
	  };

	  // Returns a function that is the composition of a list of functions, each
	  // consuming the return value of the function that follows.
	  _.compose = function() {
	    var args = arguments;
	    var start = args.length - 1;
	    return function() {
	      var i = start;
	      var result = args[start].apply(this, arguments);
	      while (i--) result = args[i].call(this, result);
	      return result;
	    };
	  };

	  // Returns a function that will only be executed on and after the Nth call.
	  _.after = function(times, func) {
	    return function() {
	      if (--times < 1) {
	        return func.apply(this, arguments);
	      }
	    };
	  };

	  // Returns a function that will only be executed up to (but not including) the Nth call.
	  _.before = function(times, func) {
	    var memo;
	    return function() {
	      if (--times > 0) {
	        memo = func.apply(this, arguments);
	      }
	      if (times <= 1) func = null;
	      return memo;
	    };
	  };

	  // Returns a function that will be executed at most one time, no matter how
	  // often you call it. Useful for lazy initialization.
	  _.once = _.partial(_.before, 2);

	  // Object Functions
	  // ----------------

	  // Keys in IE < 9 that won't be iterated by `for key in ...` and thus missed.
	  var hasEnumBug = !{toString: null}.propertyIsEnumerable('toString');
	  var nonEnumerableProps = ['valueOf', 'isPrototypeOf', 'toString',
	                      'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'];

	  function collectNonEnumProps(obj, keys) {
	    var nonEnumIdx = nonEnumerableProps.length;
	    var constructor = obj.constructor;
	    var proto = (_.isFunction(constructor) && constructor.prototype) || ObjProto;

	    // Constructor is a special case.
	    var prop = 'constructor';
	    if (_.has(obj, prop) && !_.contains(keys, prop)) keys.push(prop);

	    while (nonEnumIdx--) {
	      prop = nonEnumerableProps[nonEnumIdx];
	      if (prop in obj && obj[prop] !== proto[prop] && !_.contains(keys, prop)) {
	        keys.push(prop);
	      }
	    }
	  }

	  // Retrieve the names of an object's own properties.
	  // Delegates to **ECMAScript 5**'s native `Object.keys`
	  _.keys = function(obj) {
	    if (!_.isObject(obj)) return [];
	    if (nativeKeys) return nativeKeys(obj);
	    var keys = [];
	    for (var key in obj) if (_.has(obj, key)) keys.push(key);
	    // Ahem, IE < 9.
	    if (hasEnumBug) collectNonEnumProps(obj, keys);
	    return keys;
	  };

	  // Retrieve all the property names of an object.
	  _.allKeys = function(obj) {
	    if (!_.isObject(obj)) return [];
	    var keys = [];
	    for (var key in obj) keys.push(key);
	    // Ahem, IE < 9.
	    if (hasEnumBug) collectNonEnumProps(obj, keys);
	    return keys;
	  };

	  // Retrieve the values of an object's properties.
	  _.values = function(obj) {
	    var keys = _.keys(obj);
	    var length = keys.length;
	    var values = Array(length);
	    for (var i = 0; i < length; i++) {
	      values[i] = obj[keys[i]];
	    }
	    return values;
	  };

	  // Returns the results of applying the iteratee to each element of the object
	  // In contrast to _.map it returns an object
	  _.mapObject = function(obj, iteratee, context) {
	    iteratee = cb(iteratee, context);
	    var keys =  _.keys(obj),
	          length = keys.length,
	          results = {},
	          currentKey;
	      for (var index = 0; index < length; index++) {
	        currentKey = keys[index];
	        results[currentKey] = iteratee(obj[currentKey], currentKey, obj);
	      }
	      return results;
	  };

	  // Convert an object into a list of `[key, value]` pairs.
	  _.pairs = function(obj) {
	    var keys = _.keys(obj);
	    var length = keys.length;
	    var pairs = Array(length);
	    for (var i = 0; i < length; i++) {
	      pairs[i] = [keys[i], obj[keys[i]]];
	    }
	    return pairs;
	  };

	  // Invert the keys and values of an object. The values must be serializable.
	  _.invert = function(obj) {
	    var result = {};
	    var keys = _.keys(obj);
	    for (var i = 0, length = keys.length; i < length; i++) {
	      result[obj[keys[i]]] = keys[i];
	    }
	    return result;
	  };

	  // Return a sorted list of the function names available on the object.
	  // Aliased as `methods`
	  _.functions = _.methods = function(obj) {
	    var names = [];
	    for (var key in obj) {
	      if (_.isFunction(obj[key])) names.push(key);
	    }
	    return names.sort();
	  };

	  // Extend a given object with all the properties in passed-in object(s).
	  _.extend = createAssigner(_.allKeys);

	  // Assigns a given object with all the own properties in the passed-in object(s)
	  // (https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
	  _.extendOwn = _.assign = createAssigner(_.keys);

	  // Returns the first key on an object that passes a predicate test
	  _.findKey = function(obj, predicate, context) {
	    predicate = cb(predicate, context);
	    var keys = _.keys(obj), key;
	    for (var i = 0, length = keys.length; i < length; i++) {
	      key = keys[i];
	      if (predicate(obj[key], key, obj)) return key;
	    }
	  };

	  // Return a copy of the object only containing the whitelisted properties.
	  _.pick = function(object, oiteratee, context) {
	    var result = {}, obj = object, iteratee, keys;
	    if (obj == null) return result;
	    if (_.isFunction(oiteratee)) {
	      keys = _.allKeys(obj);
	      iteratee = optimizeCb(oiteratee, context);
	    } else {
	      keys = flatten(arguments, false, false, 1);
	      iteratee = function(value, key, obj) { return key in obj; };
	      obj = Object(obj);
	    }
	    for (var i = 0, length = keys.length; i < length; i++) {
	      var key = keys[i];
	      var value = obj[key];
	      if (iteratee(value, key, obj)) result[key] = value;
	    }
	    return result;
	  };

	   // Return a copy of the object without the blacklisted properties.
	  _.omit = function(obj, iteratee, context) {
	    if (_.isFunction(iteratee)) {
	      iteratee = _.negate(iteratee);
	    } else {
	      var keys = _.map(flatten(arguments, false, false, 1), String);
	      iteratee = function(value, key) {
	        return !_.contains(keys, key);
	      };
	    }
	    return _.pick(obj, iteratee, context);
	  };

	  // Fill in a given object with default properties.
	  _.defaults = createAssigner(_.allKeys, true);

	  // Creates an object that inherits from the given prototype object.
	  // If additional properties are provided then they will be added to the
	  // created object.
	  _.create = function(prototype, props) {
	    var result = baseCreate(prototype);
	    if (props) _.extendOwn(result, props);
	    return result;
	  };

	  // Create a (shallow-cloned) duplicate of an object.
	  _.clone = function(obj) {
	    if (!_.isObject(obj)) return obj;
	    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
	  };

	  // Invokes interceptor with the obj, and then returns obj.
	  // The primary purpose of this method is to "tap into" a method chain, in
	  // order to perform operations on intermediate results within the chain.
	  _.tap = function(obj, interceptor) {
	    interceptor(obj);
	    return obj;
	  };

	  // Returns whether an object has a given set of `key:value` pairs.
	  _.isMatch = function(object, attrs) {
	    var keys = _.keys(attrs), length = keys.length;
	    if (object == null) return !length;
	    var obj = Object(object);
	    for (var i = 0; i < length; i++) {
	      var key = keys[i];
	      if (attrs[key] !== obj[key] || !(key in obj)) return false;
	    }
	    return true;
	  };


	  // Internal recursive comparison function for `isEqual`.
	  var eq = function(a, b, aStack, bStack) {
	    // Identical objects are equal. `0 === -0`, but they aren't identical.
	    // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
	    if (a === b) return a !== 0 || 1 / a === 1 / b;
	    // A strict comparison is necessary because `null == undefined`.
	    if (a == null || b == null) return a === b;
	    // Unwrap any wrapped objects.
	    if (a instanceof _) a = a._wrapped;
	    if (b instanceof _) b = b._wrapped;
	    // Compare `[[Class]]` names.
	    var className = toString.call(a);
	    if (className !== toString.call(b)) return false;
	    switch (className) {
	      // Strings, numbers, regular expressions, dates, and booleans are compared by value.
	      case '[object RegExp]':
	      // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
	      case '[object String]':
	        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
	        // equivalent to `new String("5")`.
	        return '' + a === '' + b;
	      case '[object Number]':
	        // `NaN`s are equivalent, but non-reflexive.
	        // Object(NaN) is equivalent to NaN
	        if (+a !== +a) return +b !== +b;
	        // An `egal` comparison is performed for other numeric values.
	        return +a === 0 ? 1 / +a === 1 / b : +a === +b;
	      case '[object Date]':
	      case '[object Boolean]':
	        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
	        // millisecond representations. Note that invalid dates with millisecond representations
	        // of `NaN` are not equivalent.
	        return +a === +b;
	    }

	    var areArrays = className === '[object Array]';
	    if (!areArrays) {
	      if (typeof a != 'object' || typeof b != 'object') return false;

	      // Objects with different constructors are not equivalent, but `Object`s or `Array`s
	      // from different frames are.
	      var aCtor = a.constructor, bCtor = b.constructor;
	      if (aCtor !== bCtor && !(_.isFunction(aCtor) && aCtor instanceof aCtor &&
	                               _.isFunction(bCtor) && bCtor instanceof bCtor)
	                          && ('constructor' in a && 'constructor' in b)) {
	        return false;
	      }
	    }
	    // Assume equality for cyclic structures. The algorithm for detecting cyclic
	    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.

	    // Initializing stack of traversed objects.
	    // It's done here since we only need them for objects and arrays comparison.
	    aStack = aStack || [];
	    bStack = bStack || [];
	    var length = aStack.length;
	    while (length--) {
	      // Linear search. Performance is inversely proportional to the number of
	      // unique nested structures.
	      if (aStack[length] === a) return bStack[length] === b;
	    }

	    // Add the first object to the stack of traversed objects.
	    aStack.push(a);
	    bStack.push(b);

	    // Recursively compare objects and arrays.
	    if (areArrays) {
	      // Compare array lengths to determine if a deep comparison is necessary.
	      length = a.length;
	      if (length !== b.length) return false;
	      // Deep compare the contents, ignoring non-numeric properties.
	      while (length--) {
	        if (!eq(a[length], b[length], aStack, bStack)) return false;
	      }
	    } else {
	      // Deep compare objects.
	      var keys = _.keys(a), key;
	      length = keys.length;
	      // Ensure that both objects contain the same number of properties before comparing deep equality.
	      if (_.keys(b).length !== length) return false;
	      while (length--) {
	        // Deep compare each member
	        key = keys[length];
	        if (!(_.has(b, key) && eq(a[key], b[key], aStack, bStack))) return false;
	      }
	    }
	    // Remove the first object from the stack of traversed objects.
	    aStack.pop();
	    bStack.pop();
	    return true;
	  };

	  // Perform a deep comparison to check if two objects are equal.
	  _.isEqual = function(a, b) {
	    return eq(a, b);
	  };

	  // Is a given array, string, or object empty?
	  // An "empty" object has no enumerable own-properties.
	  _.isEmpty = function(obj) {
	    if (obj == null) return true;
	    if (isArrayLike(obj) && (_.isArray(obj) || _.isString(obj) || _.isArguments(obj))) return obj.length === 0;
	    return _.keys(obj).length === 0;
	  };

	  // Is a given value a DOM element?
	  _.isElement = function(obj) {
	    return !!(obj && obj.nodeType === 1);
	  };

	  // Is a given value an array?
	  // Delegates to ECMA5's native Array.isArray
	  _.isArray = nativeIsArray || function(obj) {
	    return toString.call(obj) === '[object Array]';
	  };

	  // Is a given variable an object?
	  _.isObject = function(obj) {
	    var type = typeof obj;
	    return type === 'function' || type === 'object' && !!obj;
	  };

	  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp, isError.
	  _.each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error'], function(name) {
	    _['is' + name] = function(obj) {
	      return toString.call(obj) === '[object ' + name + ']';
	    };
	  });

	  // Define a fallback version of the method in browsers (ahem, IE < 9), where
	  // there isn't any inspectable "Arguments" type.
	  if (!_.isArguments(arguments)) {
	    _.isArguments = function(obj) {
	      return _.has(obj, 'callee');
	    };
	  }

	  // Optimize `isFunction` if appropriate. Work around some typeof bugs in old v8,
	  // IE 11 (#1621), and in Safari 8 (#1929).
	  if (typeof /./ != 'function' && typeof Int8Array != 'object') {
	    _.isFunction = function(obj) {
	      return typeof obj == 'function' || false;
	    };
	  }

	  // Is a given object a finite number?
	  _.isFinite = function(obj) {
	    return isFinite(obj) && !isNaN(parseFloat(obj));
	  };

	  // Is the given value `NaN`? (NaN is the only number which does not equal itself).
	  _.isNaN = function(obj) {
	    return _.isNumber(obj) && obj !== +obj;
	  };

	  // Is a given value a boolean?
	  _.isBoolean = function(obj) {
	    return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
	  };

	  // Is a given value equal to null?
	  _.isNull = function(obj) {
	    return obj === null;
	  };

	  // Is a given variable undefined?
	  _.isUndefined = function(obj) {
	    return obj === void 0;
	  };

	  // Shortcut function for checking if an object has a given property directly
	  // on itself (in other words, not on a prototype).
	  _.has = function(obj, key) {
	    return obj != null && hasOwnProperty.call(obj, key);
	  };

	  // Utility Functions
	  // -----------------

	  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
	  // previous owner. Returns a reference to the Underscore object.
	  _.noConflict = function() {
	    root._ = previousUnderscore;
	    return this;
	  };

	  // Keep the identity function around for default iteratees.
	  _.identity = function(value) {
	    return value;
	  };

	  // Predicate-generating functions. Often useful outside of Underscore.
	  _.constant = function(value) {
	    return function() {
	      return value;
	    };
	  };

	  _.noop = function(){};

	  _.property = property;

	  // Generates a function for a given object that returns a given property.
	  _.propertyOf = function(obj) {
	    return obj == null ? function(){} : function(key) {
	      return obj[key];
	    };
	  };

	  // Returns a predicate for checking whether an object has a given set of
	  // `key:value` pairs.
	  _.matcher = _.matches = function(attrs) {
	    attrs = _.extendOwn({}, attrs);
	    return function(obj) {
	      return _.isMatch(obj, attrs);
	    };
	  };

	  // Run a function **n** times.
	  _.times = function(n, iteratee, context) {
	    var accum = Array(Math.max(0, n));
	    iteratee = optimizeCb(iteratee, context, 1);
	    for (var i = 0; i < n; i++) accum[i] = iteratee(i);
	    return accum;
	  };

	  // Return a random integer between min and max (inclusive).
	  _.random = function(min, max) {
	    if (max == null) {
	      max = min;
	      min = 0;
	    }
	    return min + Math.floor(Math.random() * (max - min + 1));
	  };

	  // A (possibly faster) way to get the current timestamp as an integer.
	  _.now = Date.now || function() {
	    return new Date().getTime();
	  };

	   // List of HTML entities for escaping.
	  var escapeMap = {
	    '&': '&amp;',
	    '<': '&lt;',
	    '>': '&gt;',
	    '"': '&quot;',
	    "'": '&#x27;',
	    '`': '&#x60;'
	  };
	  var unescapeMap = _.invert(escapeMap);

	  // Functions for escaping and unescaping strings to/from HTML interpolation.
	  var createEscaper = function(map) {
	    var escaper = function(match) {
	      return map[match];
	    };
	    // Regexes for identifying a key that needs to be escaped
	    var source = '(?:' + _.keys(map).join('|') + ')';
	    var testRegexp = RegExp(source);
	    var replaceRegexp = RegExp(source, 'g');
	    return function(string) {
	      string = string == null ? '' : '' + string;
	      return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
	    };
	  };
	  _.escape = createEscaper(escapeMap);
	  _.unescape = createEscaper(unescapeMap);

	  // If the value of the named `property` is a function then invoke it with the
	  // `object` as context; otherwise, return it.
	  _.result = function(object, property, fallback) {
	    var value = object == null ? void 0 : object[property];
	    if (value === void 0) {
	      value = fallback;
	    }
	    return _.isFunction(value) ? value.call(object) : value;
	  };

	  // Generate a unique integer id (unique within the entire client session).
	  // Useful for temporary DOM ids.
	  var idCounter = 0;
	  _.uniqueId = function(prefix) {
	    var id = ++idCounter + '';
	    return prefix ? prefix + id : id;
	  };

	  // By default, Underscore uses ERB-style template delimiters, change the
	  // following template settings to use alternative delimiters.
	  _.templateSettings = {
	    evaluate    : /<%([\s\S]+?)%>/g,
	    interpolate : /<%=([\s\S]+?)%>/g,
	    escape      : /<%-([\s\S]+?)%>/g
	  };

	  // When customizing `templateSettings`, if you don't want to define an
	  // interpolation, evaluation or escaping regex, we need one that is
	  // guaranteed not to match.
	  var noMatch = /(.)^/;

	  // Certain characters need to be escaped so that they can be put into a
	  // string literal.
	  var escapes = {
	    "'":      "'",
	    '\\':     '\\',
	    '\r':     'r',
	    '\n':     'n',
	    '\u2028': 'u2028',
	    '\u2029': 'u2029'
	  };

	  var escaper = /\\|'|\r|\n|\u2028|\u2029/g;

	  var escapeChar = function(match) {
	    return '\\' + escapes[match];
	  };

	  // JavaScript micro-templating, similar to John Resig's implementation.
	  // Underscore templating handles arbitrary delimiters, preserves whitespace,
	  // and correctly escapes quotes within interpolated code.
	  // NB: `oldSettings` only exists for backwards compatibility.
	  _.template = function(text, settings, oldSettings) {
	    if (!settings && oldSettings) settings = oldSettings;
	    settings = _.defaults({}, settings, _.templateSettings);

	    // Combine delimiters into one regular expression via alternation.
	    var matcher = RegExp([
	      (settings.escape || noMatch).source,
	      (settings.interpolate || noMatch).source,
	      (settings.evaluate || noMatch).source
	    ].join('|') + '|$', 'g');

	    // Compile the template source, escaping string literals appropriately.
	    var index = 0;
	    var source = "__p+='";
	    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
	      source += text.slice(index, offset).replace(escaper, escapeChar);
	      index = offset + match.length;

	      if (escape) {
	        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
	      } else if (interpolate) {
	        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
	      } else if (evaluate) {
	        source += "';\n" + evaluate + "\n__p+='";
	      }

	      // Adobe VMs need the match returned to produce the correct offest.
	      return match;
	    });
	    source += "';\n";

	    // If a variable is not specified, place data values in local scope.
	    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

	    source = "var __t,__p='',__j=Array.prototype.join," +
	      "print=function(){__p+=__j.call(arguments,'');};\n" +
	      source + 'return __p;\n';

	    try {
	      var render = new Function(settings.variable || 'obj', '_', source);
	    } catch (e) {
	      e.source = source;
	      throw e;
	    }

	    var template = function(data) {
	      return render.call(this, data, _);
	    };

	    // Provide the compiled source as a convenience for precompilation.
	    var argument = settings.variable || 'obj';
	    template.source = 'function(' + argument + '){\n' + source + '}';

	    return template;
	  };

	  // Add a "chain" function. Start chaining a wrapped Underscore object.
	  _.chain = function(obj) {
	    var instance = _(obj);
	    instance._chain = true;
	    return instance;
	  };

	  // OOP
	  // ---------------
	  // If Underscore is called as a function, it returns a wrapped object that
	  // can be used OO-style. This wrapper holds altered versions of all the
	  // underscore functions. Wrapped objects may be chained.

	  // Helper function to continue chaining intermediate results.
	  var result = function(instance, obj) {
	    return instance._chain ? _(obj).chain() : obj;
	  };

	  // Add your own custom functions to the Underscore object.
	  _.mixin = function(obj) {
	    _.each(_.functions(obj), function(name) {
	      var func = _[name] = obj[name];
	      _.prototype[name] = function() {
	        var args = [this._wrapped];
	        push.apply(args, arguments);
	        return result(this, func.apply(_, args));
	      };
	    });
	  };

	  // Add all of the Underscore functions to the wrapper object.
	  _.mixin(_);

	  // Add all mutator Array functions to the wrapper.
	  _.each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
	    var method = ArrayProto[name];
	    _.prototype[name] = function() {
	      var obj = this._wrapped;
	      method.apply(obj, arguments);
	      if ((name === 'shift' || name === 'splice') && obj.length === 0) delete obj[0];
	      return result(this, obj);
	    };
	  });

	  // Add all accessor Array functions to the wrapper.
	  _.each(['concat', 'join', 'slice'], function(name) {
	    var method = ArrayProto[name];
	    _.prototype[name] = function() {
	      return result(this, method.apply(this._wrapped, arguments));
	    };
	  });

	  // Extracts the result from a wrapped and chained object.
	  _.prototype.value = function() {
	    return this._wrapped;
	  };

	  // Provide unwrapping proxy for some methods used in engine operations
	  // such as arithmetic and JSON stringification.
	  _.prototype.valueOf = _.prototype.toJSON = _.prototype.value;

	  _.prototype.toString = function() {
	    return '' + this._wrapped;
	  };

	  // AMD registration happens at the end for compatibility with AMD loaders
	  // that may not enforce next-turn semantics on modules. Even though general
	  // practice for AMD registration is to be anonymous, underscore registers
	  // as a named module because, like jQuery, it is a base library that is
	  // popular enough to be bundled in a third party lib, but not be part of
	  // an AMD load request. Those cases could generate an error when an
	  // anonymous define() is called outside of a loader request.
	  if (true) {
	    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function() {
	      return _;
	    }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	  }
	}.call(this));


/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;//     Underscore.js 1.8.3
	//     http://underscorejs.org
	//     (c) 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
	//     Underscore may be freely distributed under the MIT license.

	(function() {

	  // Baseline setup
	  // --------------

	  // Establish the root object, `window` in the browser, or `exports` on the server.
	  var root = this;

	  // Save the previous value of the `_` variable.
	  var previousUnderscore = root._;

	  // Save bytes in the minified (but not gzipped) version:
	  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

	  // Create quick reference variables for speed access to core prototypes.
	  var
	    push             = ArrayProto.push,
	    slice            = ArrayProto.slice,
	    toString         = ObjProto.toString,
	    hasOwnProperty   = ObjProto.hasOwnProperty;

	  // All **ECMAScript 5** native function implementations that we hope to use
	  // are declared here.
	  var
	    nativeIsArray      = Array.isArray,
	    nativeKeys         = Object.keys,
	    nativeBind         = FuncProto.bind,
	    nativeCreate       = Object.create;

	  // Naked function reference for surrogate-prototype-swapping.
	  var Ctor = function(){};

	  // Create a safe reference to the Underscore object for use below.
	  var _ = function(obj) {
	    if (obj instanceof _) return obj;
	    if (!(this instanceof _)) return new _(obj);
	    this._wrapped = obj;
	  };

	  // Export the Underscore object for **Node.js**, with
	  // backwards-compatibility for the old `require()` API. If we're in
	  // the browser, add `_` as a global object.
	  if (true) {
	    if (typeof module !== 'undefined' && module.exports) {
	      exports = module.exports = _;
	    }
	    exports._ = _;
	  } else {
	    root._ = _;
	  }

	  // Current version.
	  _.VERSION = '1.8.3';

	  // Internal function that returns an efficient (for current engines) version
	  // of the passed-in callback, to be repeatedly applied in other Underscore
	  // functions.
	  var optimizeCb = function(func, context, argCount) {
	    if (context === void 0) return func;
	    switch (argCount == null ? 3 : argCount) {
	      case 1: return function(value) {
	        return func.call(context, value);
	      };
	      case 2: return function(value, other) {
	        return func.call(context, value, other);
	      };
	      case 3: return function(value, index, collection) {
	        return func.call(context, value, index, collection);
	      };
	      case 4: return function(accumulator, value, index, collection) {
	        return func.call(context, accumulator, value, index, collection);
	      };
	    }
	    return function() {
	      return func.apply(context, arguments);
	    };
	  };

	  // A mostly-internal function to generate callbacks that can be applied
	  // to each element in a collection, returning the desired result — either
	  // identity, an arbitrary callback, a property matcher, or a property accessor.
	  var cb = function(value, context, argCount) {
	    if (value == null) return _.identity;
	    if (_.isFunction(value)) return optimizeCb(value, context, argCount);
	    if (_.isObject(value)) return _.matcher(value);
	    return _.property(value);
	  };
	  _.iteratee = function(value, context) {
	    return cb(value, context, Infinity);
	  };

	  // An internal function for creating assigner functions.
	  var createAssigner = function(keysFunc, undefinedOnly) {
	    return function(obj) {
	      var length = arguments.length;
	      if (length < 2 || obj == null) return obj;
	      for (var index = 1; index < length; index++) {
	        var source = arguments[index],
	            keys = keysFunc(source),
	            l = keys.length;
	        for (var i = 0; i < l; i++) {
	          var key = keys[i];
	          if (!undefinedOnly || obj[key] === void 0) obj[key] = source[key];
	        }
	      }
	      return obj;
	    };
	  };

	  // An internal function for creating a new object that inherits from another.
	  var baseCreate = function(prototype) {
	    if (!_.isObject(prototype)) return {};
	    if (nativeCreate) return nativeCreate(prototype);
	    Ctor.prototype = prototype;
	    var result = new Ctor;
	    Ctor.prototype = null;
	    return result;
	  };

	  var property = function(key) {
	    return function(obj) {
	      return obj == null ? void 0 : obj[key];
	    };
	  };

	  // Helper for collection methods to determine whether a collection
	  // should be iterated as an array or as an object
	  // Related: http://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength
	  // Avoids a very nasty iOS 8 JIT bug on ARM-64. #2094
	  var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
	  var getLength = property('length');
	  var isArrayLike = function(collection) {
	    var length = getLength(collection);
	    return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
	  };

	  // Collection Functions
	  // --------------------

	  // The cornerstone, an `each` implementation, aka `forEach`.
	  // Handles raw objects in addition to array-likes. Treats all
	  // sparse array-likes as if they were dense.
	  _.each = _.forEach = function(obj, iteratee, context) {
	    iteratee = optimizeCb(iteratee, context);
	    var i, length;
	    if (isArrayLike(obj)) {
	      for (i = 0, length = obj.length; i < length; i++) {
	        iteratee(obj[i], i, obj);
	      }
	    } else {
	      var keys = _.keys(obj);
	      for (i = 0, length = keys.length; i < length; i++) {
	        iteratee(obj[keys[i]], keys[i], obj);
	      }
	    }
	    return obj;
	  };

	  // Return the results of applying the iteratee to each element.
	  _.map = _.collect = function(obj, iteratee, context) {
	    iteratee = cb(iteratee, context);
	    var keys = !isArrayLike(obj) && _.keys(obj),
	        length = (keys || obj).length,
	        results = Array(length);
	    for (var index = 0; index < length; index++) {
	      var currentKey = keys ? keys[index] : index;
	      results[index] = iteratee(obj[currentKey], currentKey, obj);
	    }
	    return results;
	  };

	  // Create a reducing function iterating left or right.
	  function createReduce(dir) {
	    // Optimized iterator function as using arguments.length
	    // in the main function will deoptimize the, see #1991.
	    function iterator(obj, iteratee, memo, keys, index, length) {
	      for (; index >= 0 && index < length; index += dir) {
	        var currentKey = keys ? keys[index] : index;
	        memo = iteratee(memo, obj[currentKey], currentKey, obj);
	      }
	      return memo;
	    }

	    return function(obj, iteratee, memo, context) {
	      iteratee = optimizeCb(iteratee, context, 4);
	      var keys = !isArrayLike(obj) && _.keys(obj),
	          length = (keys || obj).length,
	          index = dir > 0 ? 0 : length - 1;
	      // Determine the initial value if none is provided.
	      if (arguments.length < 3) {
	        memo = obj[keys ? keys[index] : index];
	        index += dir;
	      }
	      return iterator(obj, iteratee, memo, keys, index, length);
	    };
	  }

	  // **Reduce** builds up a single result from a list of values, aka `inject`,
	  // or `foldl`.
	  _.reduce = _.foldl = _.inject = createReduce(1);

	  // The right-associative version of reduce, also known as `foldr`.
	  _.reduceRight = _.foldr = createReduce(-1);

	  // Return the first value which passes a truth test. Aliased as `detect`.
	  _.find = _.detect = function(obj, predicate, context) {
	    var key;
	    if (isArrayLike(obj)) {
	      key = _.findIndex(obj, predicate, context);
	    } else {
	      key = _.findKey(obj, predicate, context);
	    }
	    if (key !== void 0 && key !== -1) return obj[key];
	  };

	  // Return all the elements that pass a truth test.
	  // Aliased as `select`.
	  _.filter = _.select = function(obj, predicate, context) {
	    var results = [];
	    predicate = cb(predicate, context);
	    _.each(obj, function(value, index, list) {
	      if (predicate(value, index, list)) results.push(value);
	    });
	    return results;
	  };

	  // Return all the elements for which a truth test fails.
	  _.reject = function(obj, predicate, context) {
	    return _.filter(obj, _.negate(cb(predicate)), context);
	  };

	  // Determine whether all of the elements match a truth test.
	  // Aliased as `all`.
	  _.every = _.all = function(obj, predicate, context) {
	    predicate = cb(predicate, context);
	    var keys = !isArrayLike(obj) && _.keys(obj),
	        length = (keys || obj).length;
	    for (var index = 0; index < length; index++) {
	      var currentKey = keys ? keys[index] : index;
	      if (!predicate(obj[currentKey], currentKey, obj)) return false;
	    }
	    return true;
	  };

	  // Determine if at least one element in the object matches a truth test.
	  // Aliased as `any`.
	  _.some = _.any = function(obj, predicate, context) {
	    predicate = cb(predicate, context);
	    var keys = !isArrayLike(obj) && _.keys(obj),
	        length = (keys || obj).length;
	    for (var index = 0; index < length; index++) {
	      var currentKey = keys ? keys[index] : index;
	      if (predicate(obj[currentKey], currentKey, obj)) return true;
	    }
	    return false;
	  };

	  // Determine if the array or object contains a given item (using `===`).
	  // Aliased as `includes` and `include`.
	  _.contains = _.includes = _.include = function(obj, item, fromIndex, guard) {
	    if (!isArrayLike(obj)) obj = _.values(obj);
	    if (typeof fromIndex != 'number' || guard) fromIndex = 0;
	    return _.indexOf(obj, item, fromIndex) >= 0;
	  };

	  // Invoke a method (with arguments) on every item in a collection.
	  _.invoke = function(obj, method) {
	    var args = slice.call(arguments, 2);
	    var isFunc = _.isFunction(method);
	    return _.map(obj, function(value) {
	      var func = isFunc ? method : value[method];
	      return func == null ? func : func.apply(value, args);
	    });
	  };

	  // Convenience version of a common use case of `map`: fetching a property.
	  _.pluck = function(obj, key) {
	    return _.map(obj, _.property(key));
	  };

	  // Convenience version of a common use case of `filter`: selecting only objects
	  // containing specific `key:value` pairs.
	  _.where = function(obj, attrs) {
	    return _.filter(obj, _.matcher(attrs));
	  };

	  // Convenience version of a common use case of `find`: getting the first object
	  // containing specific `key:value` pairs.
	  _.findWhere = function(obj, attrs) {
	    return _.find(obj, _.matcher(attrs));
	  };

	  // Return the maximum element (or element-based computation).
	  _.max = function(obj, iteratee, context) {
	    var result = -Infinity, lastComputed = -Infinity,
	        value, computed;
	    if (iteratee == null && obj != null) {
	      obj = isArrayLike(obj) ? obj : _.values(obj);
	      for (var i = 0, length = obj.length; i < length; i++) {
	        value = obj[i];
	        if (value > result) {
	          result = value;
	        }
	      }
	    } else {
	      iteratee = cb(iteratee, context);
	      _.each(obj, function(value, index, list) {
	        computed = iteratee(value, index, list);
	        if (computed > lastComputed || computed === -Infinity && result === -Infinity) {
	          result = value;
	          lastComputed = computed;
	        }
	      });
	    }
	    return result;
	  };

	  // Return the minimum element (or element-based computation).
	  _.min = function(obj, iteratee, context) {
	    var result = Infinity, lastComputed = Infinity,
	        value, computed;
	    if (iteratee == null && obj != null) {
	      obj = isArrayLike(obj) ? obj : _.values(obj);
	      for (var i = 0, length = obj.length; i < length; i++) {
	        value = obj[i];
	        if (value < result) {
	          result = value;
	        }
	      }
	    } else {
	      iteratee = cb(iteratee, context);
	      _.each(obj, function(value, index, list) {
	        computed = iteratee(value, index, list);
	        if (computed < lastComputed || computed === Infinity && result === Infinity) {
	          result = value;
	          lastComputed = computed;
	        }
	      });
	    }
	    return result;
	  };

	  // Shuffle a collection, using the modern version of the
	  // [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
	  _.shuffle = function(obj) {
	    var set = isArrayLike(obj) ? obj : _.values(obj);
	    var length = set.length;
	    var shuffled = Array(length);
	    for (var index = 0, rand; index < length; index++) {
	      rand = _.random(0, index);
	      if (rand !== index) shuffled[index] = shuffled[rand];
	      shuffled[rand] = set[index];
	    }
	    return shuffled;
	  };

	  // Sample **n** random values from a collection.
	  // If **n** is not specified, returns a single random element.
	  // The internal `guard` argument allows it to work with `map`.
	  _.sample = function(obj, n, guard) {
	    if (n == null || guard) {
	      if (!isArrayLike(obj)) obj = _.values(obj);
	      return obj[_.random(obj.length - 1)];
	    }
	    return _.shuffle(obj).slice(0, Math.max(0, n));
	  };

	  // Sort the object's values by a criterion produced by an iteratee.
	  _.sortBy = function(obj, iteratee, context) {
	    iteratee = cb(iteratee, context);
	    return _.pluck(_.map(obj, function(value, index, list) {
	      return {
	        value: value,
	        index: index,
	        criteria: iteratee(value, index, list)
	      };
	    }).sort(function(left, right) {
	      var a = left.criteria;
	      var b = right.criteria;
	      if (a !== b) {
	        if (a > b || a === void 0) return 1;
	        if (a < b || b === void 0) return -1;
	      }
	      return left.index - right.index;
	    }), 'value');
	  };

	  // An internal function used for aggregate "group by" operations.
	  var group = function(behavior) {
	    return function(obj, iteratee, context) {
	      var result = {};
	      iteratee = cb(iteratee, context);
	      _.each(obj, function(value, index) {
	        var key = iteratee(value, index, obj);
	        behavior(result, value, key);
	      });
	      return result;
	    };
	  };

	  // Groups the object's values by a criterion. Pass either a string attribute
	  // to group by, or a function that returns the criterion.
	  _.groupBy = group(function(result, value, key) {
	    if (_.has(result, key)) result[key].push(value); else result[key] = [value];
	  });

	  // Indexes the object's values by a criterion, similar to `groupBy`, but for
	  // when you know that your index values will be unique.
	  _.indexBy = group(function(result, value, key) {
	    result[key] = value;
	  });

	  // Counts instances of an object that group by a certain criterion. Pass
	  // either a string attribute to count by, or a function that returns the
	  // criterion.
	  _.countBy = group(function(result, value, key) {
	    if (_.has(result, key)) result[key]++; else result[key] = 1;
	  });

	  // Safely create a real, live array from anything iterable.
	  _.toArray = function(obj) {
	    if (!obj) return [];
	    if (_.isArray(obj)) return slice.call(obj);
	    if (isArrayLike(obj)) return _.map(obj, _.identity);
	    return _.values(obj);
	  };

	  // Return the number of elements in an object.
	  _.size = function(obj) {
	    if (obj == null) return 0;
	    return isArrayLike(obj) ? obj.length : _.keys(obj).length;
	  };

	  // Split a collection into two arrays: one whose elements all satisfy the given
	  // predicate, and one whose elements all do not satisfy the predicate.
	  _.partition = function(obj, predicate, context) {
	    predicate = cb(predicate, context);
	    var pass = [], fail = [];
	    _.each(obj, function(value, key, obj) {
	      (predicate(value, key, obj) ? pass : fail).push(value);
	    });
	    return [pass, fail];
	  };

	  // Array Functions
	  // ---------------

	  // Get the first element of an array. Passing **n** will return the first N
	  // values in the array. Aliased as `head` and `take`. The **guard** check
	  // allows it to work with `_.map`.
	  _.first = _.head = _.take = function(array, n, guard) {
	    if (array == null) return void 0;
	    if (n == null || guard) return array[0];
	    return _.initial(array, array.length - n);
	  };

	  // Returns everything but the last entry of the array. Especially useful on
	  // the arguments object. Passing **n** will return all the values in
	  // the array, excluding the last N.
	  _.initial = function(array, n, guard) {
	    return slice.call(array, 0, Math.max(0, array.length - (n == null || guard ? 1 : n)));
	  };

	  // Get the last element of an array. Passing **n** will return the last N
	  // values in the array.
	  _.last = function(array, n, guard) {
	    if (array == null) return void 0;
	    if (n == null || guard) return array[array.length - 1];
	    return _.rest(array, Math.max(0, array.length - n));
	  };

	  // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
	  // Especially useful on the arguments object. Passing an **n** will return
	  // the rest N values in the array.
	  _.rest = _.tail = _.drop = function(array, n, guard) {
	    return slice.call(array, n == null || guard ? 1 : n);
	  };

	  // Trim out all falsy values from an array.
	  _.compact = function(array) {
	    return _.filter(array, _.identity);
	  };

	  // Internal implementation of a recursive `flatten` function.
	  var flatten = function(input, shallow, strict, startIndex) {
	    var output = [], idx = 0;
	    for (var i = startIndex || 0, length = getLength(input); i < length; i++) {
	      var value = input[i];
	      if (isArrayLike(value) && (_.isArray(value) || _.isArguments(value))) {
	        //flatten current level of array or arguments object
	        if (!shallow) value = flatten(value, shallow, strict);
	        var j = 0, len = value.length;
	        output.length += len;
	        while (j < len) {
	          output[idx++] = value[j++];
	        }
	      } else if (!strict) {
	        output[idx++] = value;
	      }
	    }
	    return output;
	  };

	  // Flatten out an array, either recursively (by default), or just one level.
	  _.flatten = function(array, shallow) {
	    return flatten(array, shallow, false);
	  };

	  // Return a version of the array that does not contain the specified value(s).
	  _.without = function(array) {
	    return _.difference(array, slice.call(arguments, 1));
	  };

	  // Produce a duplicate-free version of the array. If the array has already
	  // been sorted, you have the option of using a faster algorithm.
	  // Aliased as `unique`.
	  _.uniq = _.unique = function(array, isSorted, iteratee, context) {
	    if (!_.isBoolean(isSorted)) {
	      context = iteratee;
	      iteratee = isSorted;
	      isSorted = false;
	    }
	    if (iteratee != null) iteratee = cb(iteratee, context);
	    var result = [];
	    var seen = [];
	    for (var i = 0, length = getLength(array); i < length; i++) {
	      var value = array[i],
	          computed = iteratee ? iteratee(value, i, array) : value;
	      if (isSorted) {
	        if (!i || seen !== computed) result.push(value);
	        seen = computed;
	      } else if (iteratee) {
	        if (!_.contains(seen, computed)) {
	          seen.push(computed);
	          result.push(value);
	        }
	      } else if (!_.contains(result, value)) {
	        result.push(value);
	      }
	    }
	    return result;
	  };

	  // Produce an array that contains the union: each distinct element from all of
	  // the passed-in arrays.
	  _.union = function() {
	    return _.uniq(flatten(arguments, true, true));
	  };

	  // Produce an array that contains every item shared between all the
	  // passed-in arrays.
	  _.intersection = function(array) {
	    var result = [];
	    var argsLength = arguments.length;
	    for (var i = 0, length = getLength(array); i < length; i++) {
	      var item = array[i];
	      if (_.contains(result, item)) continue;
	      for (var j = 1; j < argsLength; j++) {
	        if (!_.contains(arguments[j], item)) break;
	      }
	      if (j === argsLength) result.push(item);
	    }
	    return result;
	  };

	  // Take the difference between one array and a number of other arrays.
	  // Only the elements present in just the first array will remain.
	  _.difference = function(array) {
	    var rest = flatten(arguments, true, true, 1);
	    return _.filter(array, function(value){
	      return !_.contains(rest, value);
	    });
	  };

	  // Zip together multiple lists into a single array -- elements that share
	  // an index go together.
	  _.zip = function() {
	    return _.unzip(arguments);
	  };

	  // Complement of _.zip. Unzip accepts an array of arrays and groups
	  // each array's elements on shared indices
	  _.unzip = function(array) {
	    var length = array && _.max(array, getLength).length || 0;
	    var result = Array(length);

	    for (var index = 0; index < length; index++) {
	      result[index] = _.pluck(array, index);
	    }
	    return result;
	  };

	  // Converts lists into objects. Pass either a single array of `[key, value]`
	  // pairs, or two parallel arrays of the same length -- one of keys, and one of
	  // the corresponding values.
	  _.object = function(list, values) {
	    var result = {};
	    for (var i = 0, length = getLength(list); i < length; i++) {
	      if (values) {
	        result[list[i]] = values[i];
	      } else {
	        result[list[i][0]] = list[i][1];
	      }
	    }
	    return result;
	  };

	  // Generator function to create the findIndex and findLastIndex functions
	  function createPredicateIndexFinder(dir) {
	    return function(array, predicate, context) {
	      predicate = cb(predicate, context);
	      var length = getLength(array);
	      var index = dir > 0 ? 0 : length - 1;
	      for (; index >= 0 && index < length; index += dir) {
	        if (predicate(array[index], index, array)) return index;
	      }
	      return -1;
	    };
	  }

	  // Returns the first index on an array-like that passes a predicate test
	  _.findIndex = createPredicateIndexFinder(1);
	  _.findLastIndex = createPredicateIndexFinder(-1);

	  // Use a comparator function to figure out the smallest index at which
	  // an object should be inserted so as to maintain order. Uses binary search.
	  _.sortedIndex = function(array, obj, iteratee, context) {
	    iteratee = cb(iteratee, context, 1);
	    var value = iteratee(obj);
	    var low = 0, high = getLength(array);
	    while (low < high) {
	      var mid = Math.floor((low + high) / 2);
	      if (iteratee(array[mid]) < value) low = mid + 1; else high = mid;
	    }
	    return low;
	  };

	  // Generator function to create the indexOf and lastIndexOf functions
	  function createIndexFinder(dir, predicateFind, sortedIndex) {
	    return function(array, item, idx) {
	      var i = 0, length = getLength(array);
	      if (typeof idx == 'number') {
	        if (dir > 0) {
	            i = idx >= 0 ? idx : Math.max(idx + length, i);
	        } else {
	            length = idx >= 0 ? Math.min(idx + 1, length) : idx + length + 1;
	        }
	      } else if (sortedIndex && idx && length) {
	        idx = sortedIndex(array, item);
	        return array[idx] === item ? idx : -1;
	      }
	      if (item !== item) {
	        idx = predicateFind(slice.call(array, i, length), _.isNaN);
	        return idx >= 0 ? idx + i : -1;
	      }
	      for (idx = dir > 0 ? i : length - 1; idx >= 0 && idx < length; idx += dir) {
	        if (array[idx] === item) return idx;
	      }
	      return -1;
	    };
	  }

	  // Return the position of the first occurrence of an item in an array,
	  // or -1 if the item is not included in the array.
	  // If the array is large and already in sort order, pass `true`
	  // for **isSorted** to use binary search.
	  _.indexOf = createIndexFinder(1, _.findIndex, _.sortedIndex);
	  _.lastIndexOf = createIndexFinder(-1, _.findLastIndex);

	  // Generate an integer Array containing an arithmetic progression. A port of
	  // the native Python `range()` function. See
	  // [the Python documentation](http://docs.python.org/library/functions.html#range).
	  _.range = function(start, stop, step) {
	    if (stop == null) {
	      stop = start || 0;
	      start = 0;
	    }
	    step = step || 1;

	    var length = Math.max(Math.ceil((stop - start) / step), 0);
	    var range = Array(length);

	    for (var idx = 0; idx < length; idx++, start += step) {
	      range[idx] = start;
	    }

	    return range;
	  };

	  // Function (ahem) Functions
	  // ------------------

	  // Determines whether to execute a function as a constructor
	  // or a normal function with the provided arguments
	  var executeBound = function(sourceFunc, boundFunc, context, callingContext, args) {
	    if (!(callingContext instanceof boundFunc)) return sourceFunc.apply(context, args);
	    var self = baseCreate(sourceFunc.prototype);
	    var result = sourceFunc.apply(self, args);
	    if (_.isObject(result)) return result;
	    return self;
	  };

	  // Create a function bound to a given object (assigning `this`, and arguments,
	  // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
	  // available.
	  _.bind = function(func, context) {
	    if (nativeBind && func.bind === nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
	    if (!_.isFunction(func)) throw new TypeError('Bind must be called on a function');
	    var args = slice.call(arguments, 2);
	    var bound = function() {
	      return executeBound(func, bound, context, this, args.concat(slice.call(arguments)));
	    };
	    return bound;
	  };

	  // Partially apply a function by creating a version that has had some of its
	  // arguments pre-filled, without changing its dynamic `this` context. _ acts
	  // as a placeholder, allowing any combination of arguments to be pre-filled.
	  _.partial = function(func) {
	    var boundArgs = slice.call(arguments, 1);
	    var bound = function() {
	      var position = 0, length = boundArgs.length;
	      var args = Array(length);
	      for (var i = 0; i < length; i++) {
	        args[i] = boundArgs[i] === _ ? arguments[position++] : boundArgs[i];
	      }
	      while (position < arguments.length) args.push(arguments[position++]);
	      return executeBound(func, bound, this, this, args);
	    };
	    return bound;
	  };

	  // Bind a number of an object's methods to that object. Remaining arguments
	  // are the method names to be bound. Useful for ensuring that all callbacks
	  // defined on an object belong to it.
	  _.bindAll = function(obj) {
	    var i, length = arguments.length, key;
	    if (length <= 1) throw new Error('bindAll must be passed function names');
	    for (i = 1; i < length; i++) {
	      key = arguments[i];
	      obj[key] = _.bind(obj[key], obj);
	    }
	    return obj;
	  };

	  // Memoize an expensive function by storing its results.
	  _.memoize = function(func, hasher) {
	    var memoize = function(key) {
	      var cache = memoize.cache;
	      var address = '' + (hasher ? hasher.apply(this, arguments) : key);
	      if (!_.has(cache, address)) cache[address] = func.apply(this, arguments);
	      return cache[address];
	    };
	    memoize.cache = {};
	    return memoize;
	  };

	  // Delays a function for the given number of milliseconds, and then calls
	  // it with the arguments supplied.
	  _.delay = function(func, wait) {
	    var args = slice.call(arguments, 2);
	    return setTimeout(function(){
	      return func.apply(null, args);
	    }, wait);
	  };

	  // Defers a function, scheduling it to run after the current call stack has
	  // cleared.
	  _.defer = _.partial(_.delay, _, 1);

	  // Returns a function, that, when invoked, will only be triggered at most once
	  // during a given window of time. Normally, the throttled function will run
	  // as much as it can, without ever going more than once per `wait` duration;
	  // but if you'd like to disable the execution on the leading edge, pass
	  // `{leading: false}`. To disable execution on the trailing edge, ditto.
	  _.throttle = function(func, wait, options) {
	    var context, args, result;
	    var timeout = null;
	    var previous = 0;
	    if (!options) options = {};
	    var later = function() {
	      previous = options.leading === false ? 0 : _.now();
	      timeout = null;
	      result = func.apply(context, args);
	      if (!timeout) context = args = null;
	    };
	    return function() {
	      var now = _.now();
	      if (!previous && options.leading === false) previous = now;
	      var remaining = wait - (now - previous);
	      context = this;
	      args = arguments;
	      if (remaining <= 0 || remaining > wait) {
	        if (timeout) {
	          clearTimeout(timeout);
	          timeout = null;
	        }
	        previous = now;
	        result = func.apply(context, args);
	        if (!timeout) context = args = null;
	      } else if (!timeout && options.trailing !== false) {
	        timeout = setTimeout(later, remaining);
	      }
	      return result;
	    };
	  };

	  // Returns a function, that, as long as it continues to be invoked, will not
	  // be triggered. The function will be called after it stops being called for
	  // N milliseconds. If `immediate` is passed, trigger the function on the
	  // leading edge, instead of the trailing.
	  _.debounce = function(func, wait, immediate) {
	    var timeout, args, context, timestamp, result;

	    var later = function() {
	      var last = _.now() - timestamp;

	      if (last < wait && last >= 0) {
	        timeout = setTimeout(later, wait - last);
	      } else {
	        timeout = null;
	        if (!immediate) {
	          result = func.apply(context, args);
	          if (!timeout) context = args = null;
	        }
	      }
	    };

	    return function() {
	      context = this;
	      args = arguments;
	      timestamp = _.now();
	      var callNow = immediate && !timeout;
	      if (!timeout) timeout = setTimeout(later, wait);
	      if (callNow) {
	        result = func.apply(context, args);
	        context = args = null;
	      }

	      return result;
	    };
	  };

	  // Returns the first function passed as an argument to the second,
	  // allowing you to adjust arguments, run code before and after, and
	  // conditionally execute the original function.
	  _.wrap = function(func, wrapper) {
	    return _.partial(wrapper, func);
	  };

	  // Returns a negated version of the passed-in predicate.
	  _.negate = function(predicate) {
	    return function() {
	      return !predicate.apply(this, arguments);
	    };
	  };

	  // Returns a function that is the composition of a list of functions, each
	  // consuming the return value of the function that follows.
	  _.compose = function() {
	    var args = arguments;
	    var start = args.length - 1;
	    return function() {
	      var i = start;
	      var result = args[start].apply(this, arguments);
	      while (i--) result = args[i].call(this, result);
	      return result;
	    };
	  };

	  // Returns a function that will only be executed on and after the Nth call.
	  _.after = function(times, func) {
	    return function() {
	      if (--times < 1) {
	        return func.apply(this, arguments);
	      }
	    };
	  };

	  // Returns a function that will only be executed up to (but not including) the Nth call.
	  _.before = function(times, func) {
	    var memo;
	    return function() {
	      if (--times > 0) {
	        memo = func.apply(this, arguments);
	      }
	      if (times <= 1) func = null;
	      return memo;
	    };
	  };

	  // Returns a function that will be executed at most one time, no matter how
	  // often you call it. Useful for lazy initialization.
	  _.once = _.partial(_.before, 2);

	  // Object Functions
	  // ----------------

	  // Keys in IE < 9 that won't be iterated by `for key in ...` and thus missed.
	  var hasEnumBug = !{toString: null}.propertyIsEnumerable('toString');
	  var nonEnumerableProps = ['valueOf', 'isPrototypeOf', 'toString',
	                      'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'];

	  function collectNonEnumProps(obj, keys) {
	    var nonEnumIdx = nonEnumerableProps.length;
	    var constructor = obj.constructor;
	    var proto = (_.isFunction(constructor) && constructor.prototype) || ObjProto;

	    // Constructor is a special case.
	    var prop = 'constructor';
	    if (_.has(obj, prop) && !_.contains(keys, prop)) keys.push(prop);

	    while (nonEnumIdx--) {
	      prop = nonEnumerableProps[nonEnumIdx];
	      if (prop in obj && obj[prop] !== proto[prop] && !_.contains(keys, prop)) {
	        keys.push(prop);
	      }
	    }
	  }

	  // Retrieve the names of an object's own properties.
	  // Delegates to **ECMAScript 5**'s native `Object.keys`
	  _.keys = function(obj) {
	    if (!_.isObject(obj)) return [];
	    if (nativeKeys) return nativeKeys(obj);
	    var keys = [];
	    for (var key in obj) if (_.has(obj, key)) keys.push(key);
	    // Ahem, IE < 9.
	    if (hasEnumBug) collectNonEnumProps(obj, keys);
	    return keys;
	  };

	  // Retrieve all the property names of an object.
	  _.allKeys = function(obj) {
	    if (!_.isObject(obj)) return [];
	    var keys = [];
	    for (var key in obj) keys.push(key);
	    // Ahem, IE < 9.
	    if (hasEnumBug) collectNonEnumProps(obj, keys);
	    return keys;
	  };

	  // Retrieve the values of an object's properties.
	  _.values = function(obj) {
	    var keys = _.keys(obj);
	    var length = keys.length;
	    var values = Array(length);
	    for (var i = 0; i < length; i++) {
	      values[i] = obj[keys[i]];
	    }
	    return values;
	  };

	  // Returns the results of applying the iteratee to each element of the object
	  // In contrast to _.map it returns an object
	  _.mapObject = function(obj, iteratee, context) {
	    iteratee = cb(iteratee, context);
	    var keys =  _.keys(obj),
	          length = keys.length,
	          results = {},
	          currentKey;
	      for (var index = 0; index < length; index++) {
	        currentKey = keys[index];
	        results[currentKey] = iteratee(obj[currentKey], currentKey, obj);
	      }
	      return results;
	  };

	  // Convert an object into a list of `[key, value]` pairs.
	  _.pairs = function(obj) {
	    var keys = _.keys(obj);
	    var length = keys.length;
	    var pairs = Array(length);
	    for (var i = 0; i < length; i++) {
	      pairs[i] = [keys[i], obj[keys[i]]];
	    }
	    return pairs;
	  };

	  // Invert the keys and values of an object. The values must be serializable.
	  _.invert = function(obj) {
	    var result = {};
	    var keys = _.keys(obj);
	    for (var i = 0, length = keys.length; i < length; i++) {
	      result[obj[keys[i]]] = keys[i];
	    }
	    return result;
	  };

	  // Return a sorted list of the function names available on the object.
	  // Aliased as `methods`
	  _.functions = _.methods = function(obj) {
	    var names = [];
	    for (var key in obj) {
	      if (_.isFunction(obj[key])) names.push(key);
	    }
	    return names.sort();
	  };

	  // Extend a given object with all the properties in passed-in object(s).
	  _.extend = createAssigner(_.allKeys);

	  // Assigns a given object with all the own properties in the passed-in object(s)
	  // (https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
	  _.extendOwn = _.assign = createAssigner(_.keys);

	  // Returns the first key on an object that passes a predicate test
	  _.findKey = function(obj, predicate, context) {
	    predicate = cb(predicate, context);
	    var keys = _.keys(obj), key;
	    for (var i = 0, length = keys.length; i < length; i++) {
	      key = keys[i];
	      if (predicate(obj[key], key, obj)) return key;
	    }
	  };

	  // Return a copy of the object only containing the whitelisted properties.
	  _.pick = function(object, oiteratee, context) {
	    var result = {}, obj = object, iteratee, keys;
	    if (obj == null) return result;
	    if (_.isFunction(oiteratee)) {
	      keys = _.allKeys(obj);
	      iteratee = optimizeCb(oiteratee, context);
	    } else {
	      keys = flatten(arguments, false, false, 1);
	      iteratee = function(value, key, obj) { return key in obj; };
	      obj = Object(obj);
	    }
	    for (var i = 0, length = keys.length; i < length; i++) {
	      var key = keys[i];
	      var value = obj[key];
	      if (iteratee(value, key, obj)) result[key] = value;
	    }
	    return result;
	  };

	   // Return a copy of the object without the blacklisted properties.
	  _.omit = function(obj, iteratee, context) {
	    if (_.isFunction(iteratee)) {
	      iteratee = _.negate(iteratee);
	    } else {
	      var keys = _.map(flatten(arguments, false, false, 1), String);
	      iteratee = function(value, key) {
	        return !_.contains(keys, key);
	      };
	    }
	    return _.pick(obj, iteratee, context);
	  };

	  // Fill in a given object with default properties.
	  _.defaults = createAssigner(_.allKeys, true);

	  // Creates an object that inherits from the given prototype object.
	  // If additional properties are provided then they will be added to the
	  // created object.
	  _.create = function(prototype, props) {
	    var result = baseCreate(prototype);
	    if (props) _.extendOwn(result, props);
	    return result;
	  };

	  // Create a (shallow-cloned) duplicate of an object.
	  _.clone = function(obj) {
	    if (!_.isObject(obj)) return obj;
	    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
	  };

	  // Invokes interceptor with the obj, and then returns obj.
	  // The primary purpose of this method is to "tap into" a method chain, in
	  // order to perform operations on intermediate results within the chain.
	  _.tap = function(obj, interceptor) {
	    interceptor(obj);
	    return obj;
	  };

	  // Returns whether an object has a given set of `key:value` pairs.
	  _.isMatch = function(object, attrs) {
	    var keys = _.keys(attrs), length = keys.length;
	    if (object == null) return !length;
	    var obj = Object(object);
	    for (var i = 0; i < length; i++) {
	      var key = keys[i];
	      if (attrs[key] !== obj[key] || !(key in obj)) return false;
	    }
	    return true;
	  };


	  // Internal recursive comparison function for `isEqual`.
	  var eq = function(a, b, aStack, bStack) {
	    // Identical objects are equal. `0 === -0`, but they aren't identical.
	    // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
	    if (a === b) return a !== 0 || 1 / a === 1 / b;
	    // A strict comparison is necessary because `null == undefined`.
	    if (a == null || b == null) return a === b;
	    // Unwrap any wrapped objects.
	    if (a instanceof _) a = a._wrapped;
	    if (b instanceof _) b = b._wrapped;
	    // Compare `[[Class]]` names.
	    var className = toString.call(a);
	    if (className !== toString.call(b)) return false;
	    switch (className) {
	      // Strings, numbers, regular expressions, dates, and booleans are compared by value.
	      case '[object RegExp]':
	      // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
	      case '[object String]':
	        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
	        // equivalent to `new String("5")`.
	        return '' + a === '' + b;
	      case '[object Number]':
	        // `NaN`s are equivalent, but non-reflexive.
	        // Object(NaN) is equivalent to NaN
	        if (+a !== +a) return +b !== +b;
	        // An `egal` comparison is performed for other numeric values.
	        return +a === 0 ? 1 / +a === 1 / b : +a === +b;
	      case '[object Date]':
	      case '[object Boolean]':
	        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
	        // millisecond representations. Note that invalid dates with millisecond representations
	        // of `NaN` are not equivalent.
	        return +a === +b;
	    }

	    var areArrays = className === '[object Array]';
	    if (!areArrays) {
	      if (typeof a != 'object' || typeof b != 'object') return false;

	      // Objects with different constructors are not equivalent, but `Object`s or `Array`s
	      // from different frames are.
	      var aCtor = a.constructor, bCtor = b.constructor;
	      if (aCtor !== bCtor && !(_.isFunction(aCtor) && aCtor instanceof aCtor &&
	                               _.isFunction(bCtor) && bCtor instanceof bCtor)
	                          && ('constructor' in a && 'constructor' in b)) {
	        return false;
	      }
	    }
	    // Assume equality for cyclic structures. The algorithm for detecting cyclic
	    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.

	    // Initializing stack of traversed objects.
	    // It's done here since we only need them for objects and arrays comparison.
	    aStack = aStack || [];
	    bStack = bStack || [];
	    var length = aStack.length;
	    while (length--) {
	      // Linear search. Performance is inversely proportional to the number of
	      // unique nested structures.
	      if (aStack[length] === a) return bStack[length] === b;
	    }

	    // Add the first object to the stack of traversed objects.
	    aStack.push(a);
	    bStack.push(b);

	    // Recursively compare objects and arrays.
	    if (areArrays) {
	      // Compare array lengths to determine if a deep comparison is necessary.
	      length = a.length;
	      if (length !== b.length) return false;
	      // Deep compare the contents, ignoring non-numeric properties.
	      while (length--) {
	        if (!eq(a[length], b[length], aStack, bStack)) return false;
	      }
	    } else {
	      // Deep compare objects.
	      var keys = _.keys(a), key;
	      length = keys.length;
	      // Ensure that both objects contain the same number of properties before comparing deep equality.
	      if (_.keys(b).length !== length) return false;
	      while (length--) {
	        // Deep compare each member
	        key = keys[length];
	        if (!(_.has(b, key) && eq(a[key], b[key], aStack, bStack))) return false;
	      }
	    }
	    // Remove the first object from the stack of traversed objects.
	    aStack.pop();
	    bStack.pop();
	    return true;
	  };

	  // Perform a deep comparison to check if two objects are equal.
	  _.isEqual = function(a, b) {
	    return eq(a, b);
	  };

	  // Is a given array, string, or object empty?
	  // An "empty" object has no enumerable own-properties.
	  _.isEmpty = function(obj) {
	    if (obj == null) return true;
	    if (isArrayLike(obj) && (_.isArray(obj) || _.isString(obj) || _.isArguments(obj))) return obj.length === 0;
	    return _.keys(obj).length === 0;
	  };

	  // Is a given value a DOM element?
	  _.isElement = function(obj) {
	    return !!(obj && obj.nodeType === 1);
	  };

	  // Is a given value an array?
	  // Delegates to ECMA5's native Array.isArray
	  _.isArray = nativeIsArray || function(obj) {
	    return toString.call(obj) === '[object Array]';
	  };

	  // Is a given variable an object?
	  _.isObject = function(obj) {
	    var type = typeof obj;
	    return type === 'function' || type === 'object' && !!obj;
	  };

	  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp, isError.
	  _.each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error'], function(name) {
	    _['is' + name] = function(obj) {
	      return toString.call(obj) === '[object ' + name + ']';
	    };
	  });

	  // Define a fallback version of the method in browsers (ahem, IE < 9), where
	  // there isn't any inspectable "Arguments" type.
	  if (!_.isArguments(arguments)) {
	    _.isArguments = function(obj) {
	      return _.has(obj, 'callee');
	    };
	  }

	  // Optimize `isFunction` if appropriate. Work around some typeof bugs in old v8,
	  // IE 11 (#1621), and in Safari 8 (#1929).
	  if (typeof /./ != 'function' && typeof Int8Array != 'object') {
	    _.isFunction = function(obj) {
	      return typeof obj == 'function' || false;
	    };
	  }

	  // Is a given object a finite number?
	  _.isFinite = function(obj) {
	    return isFinite(obj) && !isNaN(parseFloat(obj));
	  };

	  // Is the given value `NaN`? (NaN is the only number which does not equal itself).
	  _.isNaN = function(obj) {
	    return _.isNumber(obj) && obj !== +obj;
	  };

	  // Is a given value a boolean?
	  _.isBoolean = function(obj) {
	    return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
	  };

	  // Is a given value equal to null?
	  _.isNull = function(obj) {
	    return obj === null;
	  };

	  // Is a given variable undefined?
	  _.isUndefined = function(obj) {
	    return obj === void 0;
	  };

	  // Shortcut function for checking if an object has a given property directly
	  // on itself (in other words, not on a prototype).
	  _.has = function(obj, key) {
	    return obj != null && hasOwnProperty.call(obj, key);
	  };

	  // Utility Functions
	  // -----------------

	  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
	  // previous owner. Returns a reference to the Underscore object.
	  _.noConflict = function() {
	    root._ = previousUnderscore;
	    return this;
	  };

	  // Keep the identity function around for default iteratees.
	  _.identity = function(value) {
	    return value;
	  };

	  // Predicate-generating functions. Often useful outside of Underscore.
	  _.constant = function(value) {
	    return function() {
	      return value;
	    };
	  };

	  _.noop = function(){};

	  _.property = property;

	  // Generates a function for a given object that returns a given property.
	  _.propertyOf = function(obj) {
	    return obj == null ? function(){} : function(key) {
	      return obj[key];
	    };
	  };

	  // Returns a predicate for checking whether an object has a given set of
	  // `key:value` pairs.
	  _.matcher = _.matches = function(attrs) {
	    attrs = _.extendOwn({}, attrs);
	    return function(obj) {
	      return _.isMatch(obj, attrs);
	    };
	  };

	  // Run a function **n** times.
	  _.times = function(n, iteratee, context) {
	    var accum = Array(Math.max(0, n));
	    iteratee = optimizeCb(iteratee, context, 1);
	    for (var i = 0; i < n; i++) accum[i] = iteratee(i);
	    return accum;
	  };

	  // Return a random integer between min and max (inclusive).
	  _.random = function(min, max) {
	    if (max == null) {
	      max = min;
	      min = 0;
	    }
	    return min + Math.floor(Math.random() * (max - min + 1));
	  };

	  // A (possibly faster) way to get the current timestamp as an integer.
	  _.now = Date.now || function() {
	    return new Date().getTime();
	  };

	   // List of HTML entities for escaping.
	  var escapeMap = {
	    '&': '&amp;',
	    '<': '&lt;',
	    '>': '&gt;',
	    '"': '&quot;',
	    "'": '&#x27;',
	    '`': '&#x60;'
	  };
	  var unescapeMap = _.invert(escapeMap);

	  // Functions for escaping and unescaping strings to/from HTML interpolation.
	  var createEscaper = function(map) {
	    var escaper = function(match) {
	      return map[match];
	    };
	    // Regexes for identifying a key that needs to be escaped
	    var source = '(?:' + _.keys(map).join('|') + ')';
	    var testRegexp = RegExp(source);
	    var replaceRegexp = RegExp(source, 'g');
	    return function(string) {
	      string = string == null ? '' : '' + string;
	      return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
	    };
	  };
	  _.escape = createEscaper(escapeMap);
	  _.unescape = createEscaper(unescapeMap);

	  // If the value of the named `property` is a function then invoke it with the
	  // `object` as context; otherwise, return it.
	  _.result = function(object, property, fallback) {
	    var value = object == null ? void 0 : object[property];
	    if (value === void 0) {
	      value = fallback;
	    }
	    return _.isFunction(value) ? value.call(object) : value;
	  };

	  // Generate a unique integer id (unique within the entire client session).
	  // Useful for temporary DOM ids.
	  var idCounter = 0;
	  _.uniqueId = function(prefix) {
	    var id = ++idCounter + '';
	    return prefix ? prefix + id : id;
	  };

	  // By default, Underscore uses ERB-style template delimiters, change the
	  // following template settings to use alternative delimiters.
	  _.templateSettings = {
	    evaluate    : /<%([\s\S]+?)%>/g,
	    interpolate : /<%=([\s\S]+?)%>/g,
	    escape      : /<%-([\s\S]+?)%>/g
	  };

	  // When customizing `templateSettings`, if you don't want to define an
	  // interpolation, evaluation or escaping regex, we need one that is
	  // guaranteed not to match.
	  var noMatch = /(.)^/;

	  // Certain characters need to be escaped so that they can be put into a
	  // string literal.
	  var escapes = {
	    "'":      "'",
	    '\\':     '\\',
	    '\r':     'r',
	    '\n':     'n',
	    '\u2028': 'u2028',
	    '\u2029': 'u2029'
	  };

	  var escaper = /\\|'|\r|\n|\u2028|\u2029/g;

	  var escapeChar = function(match) {
	    return '\\' + escapes[match];
	  };

	  // JavaScript micro-templating, similar to John Resig's implementation.
	  // Underscore templating handles arbitrary delimiters, preserves whitespace,
	  // and correctly escapes quotes within interpolated code.
	  // NB: `oldSettings` only exists for backwards compatibility.
	  _.template = function(text, settings, oldSettings) {
	    if (!settings && oldSettings) settings = oldSettings;
	    settings = _.defaults({}, settings, _.templateSettings);

	    // Combine delimiters into one regular expression via alternation.
	    var matcher = RegExp([
	      (settings.escape || noMatch).source,
	      (settings.interpolate || noMatch).source,
	      (settings.evaluate || noMatch).source
	    ].join('|') + '|$', 'g');

	    // Compile the template source, escaping string literals appropriately.
	    var index = 0;
	    var source = "__p+='";
	    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
	      source += text.slice(index, offset).replace(escaper, escapeChar);
	      index = offset + match.length;

	      if (escape) {
	        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
	      } else if (interpolate) {
	        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
	      } else if (evaluate) {
	        source += "';\n" + evaluate + "\n__p+='";
	      }

	      // Adobe VMs need the match returned to produce the correct offest.
	      return match;
	    });
	    source += "';\n";

	    // If a variable is not specified, place data values in local scope.
	    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

	    source = "var __t,__p='',__j=Array.prototype.join," +
	      "print=function(){__p+=__j.call(arguments,'');};\n" +
	      source + 'return __p;\n';

	    try {
	      var render = new Function(settings.variable || 'obj', '_', source);
	    } catch (e) {
	      e.source = source;
	      throw e;
	    }

	    var template = function(data) {
	      return render.call(this, data, _);
	    };

	    // Provide the compiled source as a convenience for precompilation.
	    var argument = settings.variable || 'obj';
	    template.source = 'function(' + argument + '){\n' + source + '}';

	    return template;
	  };

	  // Add a "chain" function. Start chaining a wrapped Underscore object.
	  _.chain = function(obj) {
	    var instance = _(obj);
	    instance._chain = true;
	    return instance;
	  };

	  // OOP
	  // ---------------
	  // If Underscore is called as a function, it returns a wrapped object that
	  // can be used OO-style. This wrapper holds altered versions of all the
	  // underscore functions. Wrapped objects may be chained.

	  // Helper function to continue chaining intermediate results.
	  var result = function(instance, obj) {
	    return instance._chain ? _(obj).chain() : obj;
	  };

	  // Add your own custom functions to the Underscore object.
	  _.mixin = function(obj) {
	    _.each(_.functions(obj), function(name) {
	      var func = _[name] = obj[name];
	      _.prototype[name] = function() {
	        var args = [this._wrapped];
	        push.apply(args, arguments);
	        return result(this, func.apply(_, args));
	      };
	    });
	  };

	  // Add all of the Underscore functions to the wrapper object.
	  _.mixin(_);

	  // Add all mutator Array functions to the wrapper.
	  _.each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
	    var method = ArrayProto[name];
	    _.prototype[name] = function() {
	      var obj = this._wrapped;
	      method.apply(obj, arguments);
	      if ((name === 'shift' || name === 'splice') && obj.length === 0) delete obj[0];
	      return result(this, obj);
	    };
	  });

	  // Add all accessor Array functions to the wrapper.
	  _.each(['concat', 'join', 'slice'], function(name) {
	    var method = ArrayProto[name];
	    _.prototype[name] = function() {
	      return result(this, method.apply(this._wrapped, arguments));
	    };
	  });

	  // Extracts the result from a wrapped and chained object.
	  _.prototype.value = function() {
	    return this._wrapped;
	  };

	  // Provide unwrapping proxy for some methods used in engine operations
	  // such as arithmetic and JSON stringification.
	  _.prototype.valueOf = _.prototype.toJSON = _.prototype.value;

	  _.prototype.toString = function() {
	    return '' + this._wrapped;
	  };

	  // AMD registration happens at the end for compatibility with AMD loaders
	  // that may not enforce next-turn semantics on modules. Even though general
	  // practice for AMD registration is to be anonymous, underscore registers
	  // as a named module because, like jQuery, it is a base library that is
	  // popular enough to be bundled in a third party lib, but not be part of
	  // an AMD load request. Those cases could generate an error when an
	  // anonymous define() is called outside of a loader request.
	  if (true) {
	    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function() {
	      return _;
	    }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	  }
	}.call(this));


/***/ }
/******/ ]);