var quickvis = (function () {
'use strict';

/**
 * A collection of shims that provide minimal functionality of the ES6 collections.
 *
 * These implementations are not meant to be used outside of the ResizeObserver
 * modules as they cover only a limited range of use cases.
 */
/* eslint-disable require-jsdoc, valid-jsdoc */
var MapShim = (function () {
    if (typeof Map != 'undefined') {
        return Map;
    }

    /**
     * Returns index in provided array that matches the specified key.
     *
     * @param {Array<Array>} arr
     * @param {*} key
     * @returns {number}
     */
    function getIndex(arr, key) {
        var result = -1;

        arr.some(function (entry, index) {
            if (entry[0] === key) {
                result = index;

                return true;
            }

            return false;
        });

        return result;
    }

    return (function () {
        function anonymous() {
            this.__entries__ = [];
        }

        var prototypeAccessors = { size: {} };

        /**
         * @returns {boolean}
         */
        prototypeAccessors.size.get = function () {
            return this.__entries__.length;
        };

        /**
         * @param {*} key
         * @returns {*}
         */
        anonymous.prototype.get = function (key) {
            var index = getIndex(this.__entries__, key);
            var entry = this.__entries__[index];

            return entry && entry[1];
        };

        /**
         * @param {*} key
         * @param {*} value
         * @returns {void}
         */
        anonymous.prototype.set = function (key, value) {
            var index = getIndex(this.__entries__, key);

            if (~index) {
                this.__entries__[index][1] = value;
            } else {
                this.__entries__.push([key, value]);
            }
        };

        /**
         * @param {*} key
         * @returns {void}
         */
        anonymous.prototype.delete = function (key) {
            var entries = this.__entries__;
            var index = getIndex(entries, key);

            if (~index) {
                entries.splice(index, 1);
            }
        };

        /**
         * @param {*} key
         * @returns {void}
         */
        anonymous.prototype.has = function (key) {
            return !!~getIndex(this.__entries__, key);
        };

        /**
         * @returns {void}
         */
        anonymous.prototype.clear = function () {
            this.__entries__.splice(0);
        };

        /**
         * @param {Function} callback
         * @param {*} [ctx=null]
         * @returns {void}
         */
        anonymous.prototype.forEach = function (callback, ctx) {
            if ( ctx === void 0 ) ctx = null;

            for (var i = 0, list = this.__entries__; i < list.length; i += 1) {
                var entry = list[i];

                callback.call(ctx, entry[1], entry[0]);
            }
        };

        Object.defineProperties( anonymous.prototype, prototypeAccessors );

        return anonymous;
    }());
})();

/**
 * Detects whether window and document objects are available in current environment.
 */
var isBrowser = typeof window != 'undefined' && typeof document != 'undefined' && window.document === document;

/**
 * A shim for the requestAnimationFrame which falls back to the setTimeout if
 * first one is not supported.
 *
 * @returns {number} Requests' identifier.
 */
var requestAnimationFrame$1 = (function () {
    if (typeof requestAnimationFrame === 'function') {
        return requestAnimationFrame;
    }

    return function (callback) { return setTimeout(function () { return callback(Date.now()); }, 1000 / 60); };
})();

// Defines minimum timeout before adding a trailing call.
var trailingTimeout = 2;

/**
 * Creates a wrapper function which ensures that provided callback will be
 * invoked only once during the specified delay period.
 *
 * @param {Function} callback - Function to be invoked after the delay period.
 * @param {number} delay - Delay after which to invoke callback.
 * @returns {Function}
 */
var throttle = function (callback, delay) {
    var leadingCall = false,
        trailingCall = false,
        lastCallTime = 0;

    /**
     * Invokes the original callback function and schedules new invocation if
     * the "proxy" was called during current request.
     *
     * @returns {void}
     */
    function resolvePending() {
        if (leadingCall) {
            leadingCall = false;

            callback();
        }

        if (trailingCall) {
            proxy();
        }
    }

    /**
     * Callback invoked after the specified delay. It will further postpone
     * invocation of the original function delegating it to the
     * requestAnimationFrame.
     *
     * @returns {void}
     */
    function timeoutCallback() {
        requestAnimationFrame$1(resolvePending);
    }

    /**
     * Schedules invocation of the original function.
     *
     * @returns {void}
     */
    function proxy() {
        var timeStamp = Date.now();

        if (leadingCall) {
            // Reject immediately following calls.
            if (timeStamp - lastCallTime < trailingTimeout) {
                return;
            }

            // Schedule new call to be in invoked when the pending one is resolved.
            // This is important for "transitions" which never actually start
            // immediately so there is a chance that we might miss one if change
            // happens amids the pending invocation.
            trailingCall = true;
        } else {
            leadingCall = true;
            trailingCall = false;

            setTimeout(timeoutCallback, delay);
        }

        lastCallTime = timeStamp;
    }

    return proxy;
};

// Minimum delay before invoking the update of observers.
var REFRESH_DELAY = 20;

// A list of substrings of CSS properties used to find transition events that
// might affect dimensions of observed elements.
var transitionKeys = ['top', 'right', 'bottom', 'left', 'width', 'height', 'size', 'weight'];

// Detect whether running in IE 11 (facepalm).
var isIE11 = typeof navigator != 'undefined' && /Trident\/.*rv:11/.test(navigator.userAgent);

// MutationObserver should not be used if running in Internet Explorer 11 as it's
// implementation is unreliable. Example: https://jsfiddle.net/x2r3jpuz/2/
//
// It's a real bummer that there is no other way to check for this issue but to
// use the UA information.
var mutationObserverSupported = typeof MutationObserver != 'undefined' && !isIE11;

/**
 * Singleton controller class which handles updates of ResizeObserver instances.
 */
var ResizeObserverController = function() {
    /**
     * Indicates whether DOM listeners have been added.
     *
     * @private {boolean}
     */
    this.connected_ = false;

    /**
     * Tells that controller has subscribed for Mutation Events.
     *
     * @private {boolean}
     */
    this.mutationEventsAdded_ = false;

    /**
     * Keeps reference to the instance of MutationObserver.
     *
     * @private {MutationObserver}
     */
    this.mutationsObserver_ = null;

    /**
     * A list of connected observers.
     *
     * @private {Array<ResizeObserverSPI>}
     */
    this.observers_ = [];

    this.onTransitionEnd_ = this.onTransitionEnd_.bind(this);
    this.refresh = throttle(this.refresh.bind(this), REFRESH_DELAY);
};

/**
 * Adds observer to observers list.
 *
 * @param {ResizeObserverSPI} observer - Observer to be added.
 * @returns {void}
 */
ResizeObserverController.prototype.addObserver = function (observer) {
    if (!~this.observers_.indexOf(observer)) {
        this.observers_.push(observer);
    }

    // Add listeners if they haven't been added yet.
    if (!this.connected_) {
        this.connect_();
    }
};

/**
 * Removes observer from observers list.
 *
 * @param {ResizeObserverSPI} observer - Observer to be removed.
 * @returns {void}
 */
ResizeObserverController.prototype.removeObserver = function (observer) {
    var observers = this.observers_;
    var index = observers.indexOf(observer);

    // Remove observer if it's present in registry.
    if (~index) {
        observers.splice(index, 1);
    }

    // Remove listeners if controller has no connected observers.
    if (!observers.length && this.connected_) {
        this.disconnect_();
    }
};

/**
 * Invokes the update of observers. It will continue running updates insofar
 * it detects changes.
 *
 * @returns {void}
 */
ResizeObserverController.prototype.refresh = function () {
    var changesDetected = this.updateObservers_();

    // Continue running updates if changes have been detected as there might
    // be future ones caused by CSS transitions.
    if (changesDetected) {
        this.refresh();
    }
};

/**
 * Updates every observer from observers list and notifies them of queued
 * entries.
 *
 * @private
 * @returns {boolean} Returns "true" if any observer has detected changes in
 *  dimensions of it's elements.
 */
ResizeObserverController.prototype.updateObservers_ = function () {
    // Collect observers that have active observations.
    var activeObservers = this.observers_.filter(function (observer) {
        return observer.gatherActive(), observer.hasActive();
    });

    // Deliver notifications in a separate cycle in order to avoid any
    // collisions between observers, e.g. when multiple instances of
    // ResizeObserver are tracking the same element and the callback of one
    // of them changes content dimensions of the observed target. Sometimes
    // this may result in notifications being blocked for the rest of observers.
    activeObservers.forEach(function (observer) { return observer.broadcastActive(); });

    return activeObservers.length > 0;
};

/**
 * Initializes DOM listeners.
 *
 * @private
 * @returns {void}
 */
ResizeObserverController.prototype.connect_ = function () {
    // Do nothing if running in a non-browser environment or if listeners
    // have been already added.
    if (!isBrowser || this.connected_) {
        return;
    }

    // Subscription to the "Transitionend" event is used as a workaround for
    // delayed transitions. This way it's possible to capture at least the
    // final state of an element.
    document.addEventListener('transitionend', this.onTransitionEnd_);

    window.addEventListener('resize', this.refresh);

    if (mutationObserverSupported) {
        this.mutationsObserver_ = new MutationObserver(this.refresh);

        this.mutationsObserver_.observe(document, {
            attributes: true,
            childList: true,
            characterData: true,
            subtree: true
        });
    } else {
        document.addEventListener('DOMSubtreeModified', this.refresh);

        this.mutationEventsAdded_ = true;
    }

    this.connected_ = true;
};

/**
 * Removes DOM listeners.
 *
 * @private
 * @returns {void}
 */
ResizeObserverController.prototype.disconnect_ = function () {
    // Do nothing if running in a non-browser environment or if listeners
    // have been already removed.
    if (!isBrowser || !this.connected_) {
        return;
    }

    document.removeEventListener('transitionend', this.onTransitionEnd_);
    window.removeEventListener('resize', this.refresh);

    if (this.mutationsObserver_) {
        this.mutationsObserver_.disconnect();
    }

    if (this.mutationEventsAdded_) {
        document.removeEventListener('DOMSubtreeModified', this.refresh);
    }

    this.mutationsObserver_ = null;
    this.mutationEventsAdded_ = false;
    this.connected_ = false;
};

/**
 * "Transitionend" event handler.
 *
 * @private
 * @param {TransitionEvent} event
 * @returns {void}
 */
ResizeObserverController.prototype.onTransitionEnd_ = function (ref) {
        var propertyName = ref.propertyName;

    // Detect whether transition may affect dimensions of an element.
    var isReflowProperty = transitionKeys.some(function (key) {
        return !!~propertyName.indexOf(key);
    });

    if (isReflowProperty) {
        this.refresh();
    }
};

/**
 * Returns instance of the ResizeObserverController.
 *
 * @returns {ResizeObserverController}
 */
ResizeObserverController.getInstance = function () {
    if (!this.instance_) {
        this.instance_ = new ResizeObserverController();
    }

    return this.instance_;
};

/**
 * Holds reference to the controller's instance.
 *
 * @private {ResizeObserverController}
 */
ResizeObserverController.instance_ = null;

/**
 * Defines non-writable/enumerable properties of the provided target object.
 *
 * @param {Object} target - Object for which to define properties.
 * @param {Object} props - Properties to be defined.
 * @returns {Object} Target object.
 */
var defineConfigurable = (function (target, props) {
    for (var i = 0, list = Object.keys(props); i < list.length; i += 1) {
        var key = list[i];

        Object.defineProperty(target, key, {
            value: props[key],
            enumerable: false,
            writable: false,
            configurable: true
        });
    }

    return target;
});

// Placeholder of an empty content rectangle.
var emptyRect = createRectInit(0, 0, 0, 0);

/**
 * Converts provided string to a number.
 *
 * @param {number|string} value
 * @returns {number}
 */
function toFloat(value) {
    return parseFloat(value) || 0;
}

/**
 * Extracts borders size from provided styles.
 *
 * @param {CSSStyleDeclaration} styles
 * @param {...string} positions - Borders positions (top, right, ...)
 * @returns {number}
 */
function getBordersSize(styles) {
    var positions = Array.prototype.slice.call(arguments, 1);

    return positions.reduce(function (size, position) {
        var value = styles['border-' + position + '-width'];

        return size + toFloat(value);
    }, 0);
}

/**
 * Extracts paddings sizes from provided styles.
 *
 * @param {CSSStyleDeclaration} styles
 * @returns {Object} Paddings box.
 */
function getPaddings(styles) {
    var positions = ['top', 'right', 'bottom', 'left'];
    var paddings = {};

    for (var i = 0, list = positions; i < list.length; i += 1) {
        var position = list[i];

        var value = styles['padding-' + position];

        paddings[position] = toFloat(value);
    }

    return paddings;
}

/**
 * Calculates content rectangle of provided SVG element.
 *
 * @param {SVGGraphicsElement} target - Element content rectangle of which needs
 *      to be calculated.
 * @returns {DOMRectInit}
 */
function getSVGContentRect(target) {
    var bbox = target.getBBox();

    return createRectInit(0, 0, bbox.width, bbox.height);
}

/**
 * Calculates content rectangle of provided HTMLElement.
 *
 * @param {HTMLElement} target - Element for which to calculate the content rectangle.
 * @returns {DOMRectInit}
 */
function getHTMLElementContentRect(target) {
    // Client width & height properties can't be
    // used exclusively as they provide rounded values.
    var clientWidth = target.clientWidth;
    var clientHeight = target.clientHeight;

    // By this condition we can catch all non-replaced inline, hidden and
    // detached elements. Though elements with width & height properties less
    // than 0.5 will be discarded as well.
    //
    // Without it we would need to implement separate methods for each of
    // those cases and it's not possible to perform a precise and performance
    // effective test for hidden elements. E.g. even jQuery's ':visible' filter
    // gives wrong results for elements with width & height less than 0.5.
    if (!clientWidth && !clientHeight) {
        return emptyRect;
    }

    var styles = getComputedStyle(target);
    var paddings = getPaddings(styles);
    var horizPad = paddings.left + paddings.right;
    var vertPad = paddings.top + paddings.bottom;

    // Computed styles of width & height are being used because they are the
    // only dimensions available to JS that contain non-rounded values. It could
    // be possible to utilize the getBoundingClientRect if only it's data wasn't
    // affected by CSS transformations let alone paddings, borders and scroll bars.
    var width = toFloat(styles.width),
        height = toFloat(styles.height);

    // Width & height include paddings and borders when the 'border-box' box
    // model is applied (except for IE).
    if (styles.boxSizing === 'border-box') {
        // Following conditions are required to handle Internet Explorer which
        // doesn't include paddings and borders to computed CSS dimensions.
        //
        // We can say that if CSS dimensions + paddings are equal to the "client"
        // properties then it's either IE, and thus we don't need to subtract
        // anything, or an element merely doesn't have paddings/borders styles.
        if (Math.round(width + horizPad) !== clientWidth) {
            width -= getBordersSize(styles, 'left', 'right') + horizPad;
        }

        if (Math.round(height + vertPad) !== clientHeight) {
            height -= getBordersSize(styles, 'top', 'bottom') + vertPad;
        }
    }

    // Following steps can't be applied to the document's root element as its
    // client[Width/Height] properties represent viewport area of the window.
    // Besides, it's as well not necessary as the <html> itself neither has
    // rendered scroll bars nor it can be clipped.
    if (!isDocumentElement(target)) {
        // In some browsers (only in Firefox, actually) CSS width & height
        // include scroll bars size which can be removed at this step as scroll
        // bars are the only difference between rounded dimensions + paddings
        // and "client" properties, though that is not always true in Chrome.
        var vertScrollbar = Math.round(width + horizPad) - clientWidth;
        var horizScrollbar = Math.round(height + vertPad) - clientHeight;

        // Chrome has a rather weird rounding of "client" properties.
        // E.g. for an element with content width of 314.2px it sometimes gives
        // the client width of 315px and for the width of 314.7px it may give
        // 314px. And it doesn't happen all the time. So just ignore this delta
        // as a non-relevant.
        if (Math.abs(vertScrollbar) !== 1) {
            width -= vertScrollbar;
        }

        if (Math.abs(horizScrollbar) !== 1) {
            height -= horizScrollbar;
        }
    }

    return createRectInit(paddings.left, paddings.top, width, height);
}

/**
 * Checks whether provided element is an instance of the SVGGraphicsElement.
 *
 * @param {Element} target - Element to be checked.
 * @returns {boolean}
 */
var isSVGGraphicsElement = (function () {
    // Some browsers, namely IE and Edge, don't have the SVGGraphicsElement
    // interface.
    if (typeof SVGGraphicsElement != 'undefined') {
        return function (target) { return target instanceof SVGGraphicsElement; };
    }

    // If it's so, then check that element is at least an instance of the
    // SVGElement and that it has the "getBBox" method.
    // eslint-disable-next-line no-extra-parens
    return function (target) { return target instanceof SVGElement && typeof target.getBBox === 'function'; };
})();

/**
 * Checks whether provided element is a document element (<html>).
 *
 * @param {Element} target - Element to be checked.
 * @returns {boolean}
 */
function isDocumentElement(target) {
    return target === document.documentElement;
}

/**
 * Calculates an appropriate content rectangle for provided html or svg element.
 *
 * @param {Element} target - Element content rectangle of which needs to be calculated.
 * @returns {DOMRectInit}
 */
function getContentRect(target) {
    if (!isBrowser) {
        return emptyRect;
    }

    if (isSVGGraphicsElement(target)) {
        return getSVGContentRect(target);
    }

    return getHTMLElementContentRect(target);
}

/**
 * Creates rectangle with an interface of the DOMRectReadOnly.
 * Spec: https://drafts.fxtf.org/geometry/#domrectreadonly
 *
 * @param {DOMRectInit} rectInit - Object with rectangle's x/y coordinates and dimensions.
 * @returns {DOMRectReadOnly}
 */
function createReadOnlyRect(ref) {
    var x = ref.x;
    var y = ref.y;
    var width = ref.width;
    var height = ref.height;

    // If DOMRectReadOnly is available use it as a prototype for the rectangle.
    var Constr = typeof DOMRectReadOnly != 'undefined' ? DOMRectReadOnly : Object;
    var rect = Object.create(Constr.prototype);

    // Rectangle's properties are not writable and non-enumerable.
    defineConfigurable(rect, {
        x: x, y: y, width: width, height: height,
        top: y,
        right: x + width,
        bottom: height + y,
        left: x
    });

    return rect;
}

/**
 * Creates DOMRectInit object based on the provided dimensions and the x/y coordinates.
 * Spec: https://drafts.fxtf.org/geometry/#dictdef-domrectinit
 *
 * @param {number} x - X coordinate.
 * @param {number} y - Y coordinate.
 * @param {number} width - Rectangle's width.
 * @param {number} height - Rectangle's height.
 * @returns {DOMRectInit}
 */
function createRectInit(x, y, width, height) {
    return { x: x, y: y, width: width, height: height };
}

/**
 * Class that is responsible for computations of the content rectangle of
 * provided DOM element and for keeping track of it's changes.
 */
var ResizeObservation = function(target) {
    /**
     * Broadcasted width of content rectangle.
     *
     * @type {number}
     */
    this.broadcastWidth = 0;

    /**
     * Broadcasted height of content rectangle.
     *
     * @type {number}
     */
    this.broadcastHeight = 0;

    /**
     * Reference to the last observed content rectangle.
     *
     * @private {DOMRectInit}
     */
    this.contentRect_ = createRectInit(0, 0, 0, 0);

    /**
     * Reference to the observed element.
     *
     * @type {Element}
     */
    this.target = target;
};

/**
 * Updates content rectangle and tells whether it's width or height properties
 * have changed since the last broadcast.
 *
 * @returns {boolean}
 */
ResizeObservation.prototype.isActive = function () {
    var rect = getContentRect(this.target);

    this.contentRect_ = rect;

    return rect.width !== this.broadcastWidth || rect.height !== this.broadcastHeight;
};

/**
 * Updates 'broadcastWidth' and 'broadcastHeight' properties with a data
 * from the corresponding properties of the last observed content rectangle.
 *
 * @returns {DOMRectInit} Last observed content rectangle.
 */
ResizeObservation.prototype.broadcastRect = function () {
    var rect = this.contentRect_;

    this.broadcastWidth = rect.width;
    this.broadcastHeight = rect.height;

    return rect;
};

var ResizeObserverEntry = function(target, rectInit) {
    var contentRect = createReadOnlyRect(rectInit);

    // According to the specification following properties are not writable
    // and are also not enumerable in the native implementation.
    //
    // Property accessors are not being used as they'd require to define a
    // private WeakMap storage which may cause memory leaks in browsers that
    // don't support this type of collections.
    defineConfigurable(this, { target: target, contentRect: contentRect });
};

var ResizeObserverSPI = function(callback, controller, callbackCtx) {
    if (typeof callback !== 'function') {
        throw new TypeError('The callback provided as parameter 1 is not a function.');
    }

    /**
     * Collection of resize observations that have detected changes in dimensions
     * of elements.
     *
     * @private {Array<ResizeObservation>}
     */
    this.activeObservations_ = [];

    /**
     * Registry of the ResizeObservation instances.
     *
     * @private {Map<Element, ResizeObservation>}
     */
    this.observations_ = new MapShim();

    /**
     * Reference to the callback function.
     *
     * @private {ResizeObserverCallback}
     */
    this.callback_ = callback;

    /**
     * Reference to the associated ResizeObserverController.
     *
     * @private {ResizeObserverController}
     */
    this.controller_ = controller;

    /**
     * Public ResizeObserver instance which will be passed to the callback
     * function and used as a value of it's "this" binding.
     *
     * @private {ResizeObserver}
     */
    this.callbackCtx_ = callbackCtx;
};

/**
 * Starts observing provided element.
 *
 * @param {Element} target - Element to be observed.
 * @returns {void}
 */
ResizeObserverSPI.prototype.observe = function (target) {
    if (!arguments.length) {
        throw new TypeError('1 argument required, but only 0 present.');
    }

    // Do nothing if current environment doesn't have the Element interface.
    if (typeof Element === 'undefined' || !(Element instanceof Object)) {
        return;
    }

    if (!(target instanceof Element)) {
        throw new TypeError('parameter 1 is not of type "Element".');
    }

    var observations = this.observations_;

    // Do nothing if element is already being observed.
    if (observations.has(target)) {
        return;
    }

    observations.set(target, new ResizeObservation(target));

    this.controller_.addObserver(this);

    // Force the update of observations.
    this.controller_.refresh();
};

/**
 * Stops observing provided element.
 *
 * @param {Element} target - Element to stop observing.
 * @returns {void}
 */
ResizeObserverSPI.prototype.unobserve = function (target) {
    if (!arguments.length) {
        throw new TypeError('1 argument required, but only 0 present.');
    }

    // Do nothing if current environment doesn't have the Element interface.
    if (typeof Element === 'undefined' || !(Element instanceof Object)) {
        return;
    }

    if (!(target instanceof Element)) {
        throw new TypeError('parameter 1 is not of type "Element".');
    }

    var observations = this.observations_;

    // Do nothing if element is not being observed.
    if (!observations.has(target)) {
        return;
    }

    observations.delete(target);

    if (!observations.size) {
        this.controller_.removeObserver(this);
    }
};

/**
 * Stops observing all elements.
 *
 * @returns {void}
 */
ResizeObserverSPI.prototype.disconnect = function () {
    this.clearActive();
    this.observations_.clear();
    this.controller_.removeObserver(this);
};

/**
 * Collects observation instances the associated element of which has changed
 * it's content rectangle.
 *
 * @returns {void}
 */
ResizeObserverSPI.prototype.gatherActive = function () {
        var this$1 = this;

    this.clearActive();

    this.observations_.forEach(function (observation) {
        if (observation.isActive()) {
            this$1.activeObservations_.push(observation);
        }
    });
};

/**
 * Invokes initial callback function with a list of ResizeObserverEntry
 * instances collected from active resize observations.
 *
 * @returns {void}
 */
ResizeObserverSPI.prototype.broadcastActive = function () {
    // Do nothing if observer doesn't have active observations.
    if (!this.hasActive()) {
        return;
    }

    var ctx = this.callbackCtx_;

    // Create ResizeObserverEntry instance for every active observation.
    var entries = this.activeObservations_.map(function (observation) {
        return new ResizeObserverEntry(observation.target, observation.broadcastRect());
    });

    this.callback_.call(ctx, entries, ctx);
    this.clearActive();
};

/**
 * Clears the collection of active observations.
 *
 * @returns {void}
 */
ResizeObserverSPI.prototype.clearActive = function () {
    this.activeObservations_.splice(0);
};

/**
 * Tells whether observer has active observations.
 *
 * @returns {boolean}
 */
ResizeObserverSPI.prototype.hasActive = function () {
    return this.activeObservations_.length > 0;
};

// Registry of internal observers. If WeakMap is not available use current shim
// for the Map collection as it has all required methods and because WeakMap
// can't be fully polyfilled anyway.
var observers = typeof WeakMap != 'undefined' ? new WeakMap() : new MapShim();

/**
 * ResizeObserver API. Encapsulates the ResizeObserver SPI implementation
 * exposing only those methods and properties that are defined in the spec.
 */
var ResizeObserver$1 = function(callback) {
    if (!(this instanceof ResizeObserver$1)) {
        throw new TypeError('Cannot call a class as a function');
    }

    if (!arguments.length) {
        throw new TypeError('1 argument required, but only 0 present.');
    }

    var controller = ResizeObserverController.getInstance();
    var observer = new ResizeObserverSPI(callback, controller, this);

    observers.set(this, observer);
};

// Expose public methods of ResizeObserver.
['observe', 'unobserve', 'disconnect'].forEach(function (method) {
    ResizeObserver$1.prototype[method] = function () {
        return (ref = observers.get(this))[method].apply(ref, arguments);
        var ref;
    };
});

var index = (function () {
    // Export existing implementation if available.
    if (typeof ResizeObserver != 'undefined') {
        // eslint-disable-next-line no-undef
        return ResizeObserver;
    }

    return ResizeObserver$1;
})();

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};





function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var fastdom = createCommonjsModule(function (module) {
!(function(win) {

/**
 * FastDom
 *
 * Eliminates layout thrashing
 * by batching DOM read/write
 * interactions.
 *
 * @author Wilson Page <wilsonpage@me.com>
 * @author Kornel Lesinski <kornel.lesinski@ft.com>
 */

'use strict';

/**
 * Mini logger
 *
 * @return {Function}
 */
var debug = function() {};

/**
 * Normalized rAF
 *
 * @type {Function}
 */
var raf = win.requestAnimationFrame
  || win.webkitRequestAnimationFrame
  || win.mozRequestAnimationFrame
  || win.msRequestAnimationFrame
  || function(cb) { return setTimeout(cb, 16); };

/**
 * Initialize a `FastDom`.
 *
 * @constructor
 */
function FastDom() {
  var self = this;
  self.reads = [];
  self.writes = [];
  self.raf = raf.bind(win); // test hook
  debug('initialized', self);
}

FastDom.prototype = {
  constructor: FastDom,

  /**
   * Adds a job to the read batch and
   * schedules a new frame if need be.
   *
   * @param  {Function} fn
   * @public
   */
  measure: function(fn, ctx) {
    debug('measure');
    var task = !ctx ? fn : fn.bind(ctx);
    this.reads.push(task);
    scheduleFlush(this);
    return task;
  },

  /**
   * Adds a job to the
   * write batch and schedules
   * a new frame if need be.
   *
   * @param  {Function} fn
   * @public
   */
  mutate: function(fn, ctx) {
    debug('mutate');
    var task = !ctx ? fn : fn.bind(ctx);
    this.writes.push(task);
    scheduleFlush(this);
    return task;
  },

  /**
   * Clears a scheduled 'read' or 'write' task.
   *
   * @param {Object} task
   * @return {Boolean} success
   * @public
   */
  clear: function(task) {
    debug('clear', task);
    return remove(this.reads, task) || remove(this.writes, task);
  },

  /**
   * Extend this FastDom with some
   * custom functionality.
   *
   * Because fastdom must *always* be a
   * singleton, we're actually extending
   * the fastdom instance. This means tasks
   * scheduled by an extension still enter
   * fastdom's global task queue.
   *
   * The 'super' instance can be accessed
   * from `this.fastdom`.
   *
   * @example
   *
   * var myFastdom = fastdom.extend({
   *   initialize: function() {
   *     // runs on creation
   *   },
   *
   *   // override a method
   *   measure: function(fn) {
   *     // do extra stuff ...
   *
   *     // then call the original
   *     return this.fastdom.measure(fn);
   *   },
   *
   *   ...
   * });
   *
   * @param  {Object} props  properties to mixin
   * @return {FastDom}
   */
  extend: function(props) {
    debug('extend', props);
    if (typeof props != 'object') throw new Error('expected object');

    var child = Object.create(this);
    mixin(child, props);
    child.fastdom = this;

    // run optional creation hook
    if (child.initialize) child.initialize();

    return child;
  },

  // override this with a function
  // to prevent Errors in console
  // when tasks throw
  catch: null
};

/**
 * Schedules a new read/write
 * batch if one isn't pending.
 *
 * @private
 */
function scheduleFlush(fastdom) {
  if (!fastdom.scheduled) {
    fastdom.scheduled = true;
    fastdom.raf(flush.bind(null, fastdom));
    debug('flush scheduled');
  }
}

/**
 * Runs queued `read` and `write` tasks.
 *
 * Errors are caught and thrown by default.
 * If a `.catch` function has been defined
 * it is called instead.
 *
 * @private
 */
function flush(fastdom) {
  debug('flush');

  var writes = fastdom.writes;
  var reads = fastdom.reads;
  var error;

  try {
    debug('flushing reads', reads.length);
    runTasks(reads);
    debug('flushing writes', writes.length);
    runTasks(writes);
  } catch (e) { error = e; }

  fastdom.scheduled = false;

  // If the batch errored we may still have tasks queued
  if (reads.length || writes.length) scheduleFlush(fastdom);

  if (error) {
    debug('task errored', error.message);
    if (fastdom.catch) fastdom.catch(error);
    else throw error;
  }
}

/**
 * We run this inside a try catch
 * so that if any jobs error, we
 * are able to recover and continue
 * to flush the batch until it's empty.
 *
 * @private
 */
function runTasks(tasks) {
  debug('run tasks');
  var task; while (task = tasks.shift()) task();
}

/**
 * Remove an item from an Array.
 *
 * @param  {Array} array
 * @param  {*} item
 * @return {Boolean}
 */
function remove(array, item) {
  var index = array.indexOf(item);
  return !!~index && !!array.splice(index, 1);
}

/**
 * Mixin own properties of source
 * object into the target.
 *
 * @param  {Object} target
 * @param  {Object} source
 */
function mixin(target, source) {
  for (var key in source) {
    if (source.hasOwnProperty(key)) target[key] = source[key];
  }
}

// There should never be more than
// one instance of `FastDom` in an app
var exports = win.fastdom = (win.fastdom || new FastDom()); // jshint ignore:line

// Expose to CJS & AMD
if ((typeof undefined)[0] == 'f') undefined(function() { return exports; });
else if (('object')[0] == 'o') module.exports = exports;

})( typeof window !== 'undefined' ? window : commonjsGlobal);
});

/* globals console: true */
/* QuickVis makes a quick and perty visualization.
 * The constructor sets up the DOM element, resize listener, then
 * passes data and config to _update. _update uses config to 
 * configure things and reformates data as needed, and finally
 * calls _render. _render applies the data to the template and
 * inserts it in the DOM.
 *
 * Override _update and _render as needed.
 */

// a quick n purty visualization
class QuickVis {
    // creates a dom element for the vis to live in
    // optionally pass in data to render
    // NOTE: don't manipulate the DOM from here
    constructor(data, tag, template, className, config){
        // wrapper el
        this.el = document.createElement(tag || "div");
        this.el.classList.add("quickvis");
        if(className){
            this.el.classList.add(className);
        }
        // resize listener
        this._resizeObserve();
        // content template
        this.template = template || function(vm){
            return `<strong>hi</strong>`;
        };
        this.rendered = false;
        // do something!
        this._update(data, config);
    }

    _resizeObserve(){
        this.contentRect = {};
        this.observer = new index((entries, observer) => {
            for(let entry of entries){
                if(entry.target === this.el){
                    let oldW = this.contentRect.width;
                    let oldH = this.contentRect.height;
                    let newW = entry.contentRect.width;
                    let newH = entry.contentRect.height;
                    // check if width or height have changed
                    if(oldW !== newW || oldH !== newH){
                        this._onResize(entry.contentRect);
                    }
                    this.contentRect = entry.contentRect;
                }
            }
        });
        this.observer.observe(this.el);
    }

    _onResize(newSize){
        // console.log(`resize: old w: ${this.contentRect.width}, h: ${this.contentRect.height}; new w: ${newSize.width}, h: ${newSize.height}`);
        // TODO - debounce render probably
        this._render();
    }

    // do some work with incoming data
    // NOTE: override this as needed
    // NOTE: don't manipulate the DOM from here
    _update(data, config){
        this.data = data;
        this.config = config;
        // TODO - conditionally render?
        this._render();
    }

    // NOTE: override this as needed
    // NOTE: do all your DOM work here, but nowhere
    // else!
    _render(){
        this.rendered = false;
        let htmlStr = this.template(this);
        // TODO - provide a cleanup function before
        // re-render blows away the old dom els
        return this.insert(htmlStr).then(() => {
            this.rendered = true;
        });
    }

    // DOM helpers to prevent thrashing
    insert(htmlStr){
        return new Promise((resolve, reject) => {
            fastdom.mutate(() => {
                this.el.innerHTML = htmlStr;
                resolve();
            });
        });
    }
    measure(el){
        return new Promise((resolve, reject) => {
            fastdom.measure(() => {
                let bb = el.getBoundingClientRect();
                resolve(bb);
            });
        });
    }
}

// from https://github.com/mapbox/simple-linear-scaleA
// TODO - check license for this function
function linearScale(domain, range, clamp) {
    return function(value) {
        if (domain[0] === domain[1] || range[0] === range[1]) {
            return range[0];
        }
        let ratio = (range[1] - range[0]) / (domain[1] - domain[0]),
            result = range[0] + ratio * (value - domain[0]);
        return clamp ? Math.min(range[1], Math.max(range[0], result)) : result;
    };
}

// http://stackoverflow.com/a/37411738
function createSVGNode(n, v) {
    n = document.createElementNS("http://www.w3.org/2000/svg", n);
    for (let p in v){
        n.setAttributeNS(null, p.replace(/[A-Z]/g, function(m, p, o, s) { return "-" + m.toLowerCase(); }), v[p]);
    }
    return n;
}

let SYMBOLS = {
    "-8": "y",
    "-7:": "z",
    "-6": "a",
    "-5": "f",
    "-4": "p",
    "-3": "n",
    "-2": "u",
    "-1": "m",
    "0": "",
    "1": "K",
    "2": "M",
    "3": "G",
    "4": "T",
    "5": "P",
    "6": "E",
    "7": "Z",
    "8": "Y"
};

// max number of places after the decimal point.
// actual number after decimal may end up being less than this
const DEFAULT_MAX_FLOAT_PRECISION = 2;

function toEng(val, preferredUnit, width=DEFAULT_MAX_FLOAT_PRECISION, base=1000) {
    let sign = val < 0 ? -1 : 1;
    val = Math.abs(val);

    let result,
        unit,
        symbol;

    // if preferredUnit is provided, target that value
    if (preferredUnit !== undefined) {
        unit = preferredUnit;
    } else if (val === 0) {
        unit = 0;
    } else {
        unit = Math.floor(Math.log(Math.abs(val)) / Math.log(base));
    }

    symbol = SYMBOLS[unit];

    // TODO - if Math.abs(unit) > 8, return value in scientific notation
    result = val / Math.pow(base, unit);

    return [
        // shorten the number if its too long, add sign back
        sign * shortenNumber(result, width),
        symbol
    ];
}

// attempts to make a long floating point number
// fit in `length` characters. It will trim the
// fractional part of the number, but never the
// whole part of the number
// NOTE - does not round the number! it just chops it off
function shortenNumber(num, targetLength=DEFAULT_MAX_FLOAT_PRECISION){
    let numStr = num.toString(),
        parts = numStr.split("."),
        whole = parts[0],
        fractional = parts[1] || "",
        sign = "";

    // if negative, slice off the minus sign
    // so that we can count the number of digits
    if(whole[0] === "-"){
        whole = whole.substr(1);
    }

    // if the number is already short enough
    if (whole.length + fractional.length <= targetLength) {
        return num;
    }

    // if the whole part of the number is
    // too long, return it as is. we tried our best.
    if (whole.length >= targetLength) {
        return +whole;
    }

    return parseFloat(sign + whole + "." + fractional.substring(0, targetLength - whole.length));
}

// given a value, returns an array where
// index 0 is between 0 and 999, and
// index 1 describes the magnitude of the
// value. long floating point values are
// shortened
function getFormattedNumber(val){
    let result;

    // if this number is a float, attempt
    // to shorten it
    if(Math.abs(val) < 1){
        result = [shortenNumber(val), ""];
    } else {
        result = toEng(val);
    }

    return result;
}

// given an array of values, attempts to create an array of length
// maxLength by applying downsampleFunction to each slice
// of values
function downsampleData(data, maxLength, downsampleFn){
    let length = data.length;
    let max = Math.min(length, maxLength);
    let count = Math.floor(length / max);

    let downsampled = [];
    for(let i = 0; i < max; i++){
        let start = i * count;
        let end = (i + 1) * count;
        if(end > length){
            end = length;
        }
        let slice = data.slice(start, end);
        let val = downsampleFn(slice);
        downsampled.push(val);
    }

    return downsampled;
}
// returns either the largest number, or null
// if all values in the array are null
downsampleData.MAX = function(slice){
    return slice.reduce((agg, v) => {
        if(agg === null && v === null){
            return null;
        } else if (agg === null){
            return v;
        } else {
            return Math.max(agg, v);
        }
    }, null);
};

// template functions should take a viewmodel and return a string
// that can be put into the DOM. there should be as little logic in
// here as possible. Prefer to create viewmodel methods to handle
// logic.
function template(vm){
    return `
        <div class="label">${vm.label}</div>
        <div class="visualization">
            <svg class="graph"></svg>
        </div>
        <div class="last-value">
            <div class="value" style="${vm.hideLast ? "display:none;" : ""}">${vm.getFriendly(vm.last)}</div>
            <div class="magnitude">${vm.getMagnitude(vm.last)}</div>
            <div class="unit">${vm.unit}</div>
        </div>
        <div class="indicator ${vm.getIndicatorStatus()}"></div>
    `;
}

const SPARKLINE_PADDING = 4;
const SPARKLINE_DATA_PADDING = 1;
const FOCUSLINE_WIDTH = 2;

const defaultConfig = {
    label: "",
    style: "line",
    threshold: Infinity,
    template: template,
    unit: "B"
};

class Sparkline extends QuickVis {
    // setup configuration related thingies
    constructor(data, config){
        super(data, "div", template, "sparkline", config);
    }

    // update the model data and generate new data as
    // needed from the model data. Do not modify the model,
    // and if new data is needed, be sure its actual data
    // and not just view-related stuff (like text formatting)
    _update(data, config){
        if(!data || !data.length){
            throw new Error("cannot create sparkline from empty data");
        }

        this.data = data || [];
        this.last = data[data.length - 1];

        // dont let undefined value override default
        if(config.threshold === undefined){
            delete config.threshold;
        }
        config = Object.assign({}, defaultConfig, config);
        this.label = config.label;
        this.forceThreshold = config.forceThreshold;
        this.style = config.style;
        this.unit = config.unit;
        this.hideLast = config.hideLast;
        this.showLastPoint = config.showLastPoint;

        if(config.threshold !== undefined){
            this.threshold = config.threshold;
        }
        this.config = config;
    }

    /*******************
     * rendering and drawing functions are the only place
     * that it is ok to touch the dom!
     */
    async _render(){
        await super._render();

        // we still go more renderin' to do
        this.rendered = false;

        this.svg = this.el.querySelector(".graph");
        let bb = await this.measure(this.svg);
        this.setScales(bb.width, bb.height);
        this.setDrawableArea(bb.width, bb.height);

        switch(this.style){
            case "area":
                this.fillSparkline()
                    .drawSparkline()
                    .drawThreshold();
                if(this.showLastPoint){
                    this.drawLastPoint();
                }
                break;
            case "line":
                this.drawSparkline()
                    .drawThreshold();
                if(this.showLastPoint){
                    this.drawLastPoint();
                }
                break;
            case "bar":
                this.drawBars()
                    .drawThreshold();
                break;
            case "scatter":
                this.drawScatter()
                    .drawThreshold();
                break;
        }

        this.drawFocusLine();

        this.rendered = true;
    }

    // val should be 0-1 range. if val2 is present
    // it will focus the range rather than the point
    focus(val){
        if(!this.rendered){
            return;
        }

        let start = val;
        let end;
        // oooh a range
        if(Array.isArray(val)){
            start = val[0];
            end = val[1];
            // use last value for displaying stuff
            val = end;
        }

        let pxVal = this.xScale(this.xDomain[1] * start);
        let width = FOCUSLINE_WIDTH;
        if(end !== undefined){
            // map start and end values to start and end indices
            width = this.xScale(Math.ceil(this.data.length * end) - Math.floor(this.data.length * start));
            this.focusLine.classList.add("range");
        }
        this.focusLine.style.visibility = "visible";
        this.focusLine.setAttribute("x", pxVal);
        this.focusLine.setAttribute("width", width);

        // draw the value of the last focus point
        let lastValEl = this.el.querySelector(".value");
        let unitsEl = this.el.querySelector(".unit");
        let magnitudeEl = this.el.querySelector(".magnitude");
        let index = Math.floor(this.data.length * val);
        // TODO HACK FIX - i dunno, ya know?
        index = index === this.data.length ? index - 1 : index;
        lastValEl.innerHTML = this.getFriendly(this.data[index]);
        unitsEl.innerHTML = this.unit;
        magnitudeEl.innerHTML = this.getMagnitude(this.data[index]);

        // TODO - reevaluate threshold light
        if(this.showLastPoint){
            let lastPointEl = this.el.querySelector(".sparkline-last-point");
            lastPointEl.style.visibility = "hidden";
        }

        let indicatorEl = this.el.querySelector(".indicator");
        let status;
        // HACK - this is copy pasta
        if(this.threshold === Infinity){
            // if no threshold is set
            status = "off";
        } else if(this.data[index] > this.threshold){
            // if threshold is breached
            status = "on";
        } else {
            // if threshold is safe
            status = "safe";
        }
        indicatorEl.setAttribute("class", `indicator ${status}`);
    }

    blur(){
        if(!this.rendered){
            return;
        }
        this.focusLine.style.visibility = "hidden";
        this.focusLine.classList.remove("range");

        // draw the value of the last focus point
        let lastValEl = this.el.querySelector(".value");
        let unitsEl = this.el.querySelector(".unit");
        let magnitudeEl = this.el.querySelector(".magnitude");
        lastValEl.innerHTML = this.getFriendly(this.last);
        unitsEl.innerHTML = this.unit;
        magnitudeEl.innerHTML = this.getMagnitude(this.last);

        if(this.showLastPoint){
            let lastPointEl = this.el.querySelector(".sparkline-last-point");
            lastPointEl.style.visibility = "visible";
        }

        let indicatorEl = this.el.querySelector(".indicator");
        let status;
        // HACK - this is copy pasta
        if(this.threshold === Infinity){
            // if no threshold is set
            status = "off";
        } else if(this.last > this.threshold){
            // if threshold is breached
            status = "on";
        } else {
            // if threshold is safe
            status = "safe";
        }
        indicatorEl.setAttribute("class", `indicator ${status}`);
    }

    // sets up x and y scales, with consideration to including
    // padding in the drawable area
    setScales(width, height){
        let dataRange = this.data;

        // if forceThreshold, add it to the dataRange
        // so that min/max will include it
        if(this.forceThreshold){
            dataRange = dataRange.concat(this.threshold);
        }

        let min = Math.min.apply(Math, dataRange),
            max = Math.max.apply(Math, dataRange);

        this.xDomain = [0, this.data.length-1];
        // NOTE - min and max are swappped since the 
        // 0,0 origin is upper left (aka going down on
        // y axis is actually incrementing the y value)
        this.yDomain = [max + SPARKLINE_DATA_PADDING, min - SPARKLINE_DATA_PADDING];
        this.xScale = linearScale(this.xDomain, [SPARKLINE_PADDING, width-SPARKLINE_PADDING]);
        this.yScale = linearScale(this.yDomain, [SPARKLINE_PADDING, height-SPARKLINE_PADDING]);
    }

    // creates the bounds of the drawable area of the svg
    // to prevent elements from being clipped off the edges
    setDrawableArea(width, height){
        if(!this.xScale || !this.yScale){
            throw new Error("Cannot setup drawable area; scales have not been setup");
        }

        this.drawableArea = {
            x1: this.xScale(this.xDomain[0]),
            y1: this.yScale(this.yDomain[0]),
            x2: this.xScale(this.xDomain[1]),
            y2: this.yScale(this.yDomain[1])
        };
        this.drawableArea.width = this.drawableArea.x2 - this.drawableArea.x1;
        this.drawableArea.height = this.drawableArea.y2 - this.drawableArea.y1;

    }

    fillSparkline(){
        this.drawSparkline(true);
        return this;
    }

    drawSparkline(shaded=false){
        let {svg, xScale, yScale} = this,
            {x1, y1, x2, y2} = this.drawableArea,
            d = [];

        if(shaded){
            d.push(`M${x1},${y2}`);
            d.push(`L${x1},${y1}`);
        } else {
            //d.push(`M${x1},${y2}`);
            d.push(`M${x1},${yScale(this.data[0])}`);
        }
        this.data.forEach((dp, i) => {
            d.push(`L${xScale(i)},${yScale(dp)}`);
        });
        if(shaded){
            d.push(`L${x2},${y2}`);
        }

        svg.appendChild(createSVGNode("path", {
            d: d.join(" "),
            class: "sparkline-path" + (shaded ? " shaded" : "")
        }));
        return this;
    }

    drawBars(){
        const BAR_PADDING = 2;
        let {svg, xScale, yScale} = this,
            {x2, y2, width} = this.drawableArea,
            barWidth = (width / (this.data.length)) - BAR_PADDING,
            offsetLeft = xScale(0);

        this.data.forEach((dp, i) => {
            let barDiff = this.yScale(dp),
                barHeight = Math.ceil(y2 - barDiff) || 1;
            svg.appendChild(createSVGNode("rect", {
                // TODO - dont apply padding to last item
                x: offsetLeft + ((barWidth + BAR_PADDING) * i),
                y: y2 - barHeight,
                width: barWidth,
                height: barHeight,
                class: "sparkline-bar" + (dp > this.threshold ? " bad" : "")
            }));
        });
        return this;
    }

    drawScatter(){
        let {svg, xScale, yScale} = this,
            {x2, y2, width} = this.drawableArea;

        this.data.forEach((dp, i) => {
            svg.appendChild(createSVGNode("circle", {
                cx: this.xScale(i),
                cy: this.yScale(dp),
                r: 4,
                class: "sparkline-scatter" + (dp > this.threshold ? " bad" : "")
            }));
        });
        return this;
    }

    drawThreshold(){
        if(this.threshold === Infinity){
            return this;
        }

        let {svg, xScale, yScale} = this,
            {x1, y1, x2, y2} = this.drawableArea;
        svg.appendChild(createSVGNode("line", {
            x1: x1,
            y1: yScale(this.threshold),
            x2: x2,
            y2: yScale(this.threshold),
            class: "sparkline-threshold"
        }));
        return this;
    }

    drawFocusLine(){
        let {svg, xScale, yScale} = this,
            {x1, y1, x2, y2} = this.drawableArea;
        let focusLineEl = createSVGNode("rect", {
            x: y1 - SPARKLINE_PADDING,
            y: y1 - SPARKLINE_PADDING + FOCUSLINE_WIDTH,
            width: FOCUSLINE_WIDTH,
            height: y2 + SPARKLINE_PADDING,
            class: "sparkline-focus"
        });
        focusLineEl.style.visibility = "hidden";
        svg.appendChild(focusLineEl);
        this.focusLine = focusLineEl;
        return this;
    }

    drawLastPoint(){
        let {svg, xScale, yScale} = this,
            x = this.data.length - 1,
            y = this.data[this.data.length-1];
        svg.appendChild(createSVGNode("circle", {
            cx: xScale(x),
            cy: yScale(y),
            r: 3,
            class: "sparkline-last-point" + (this.lastExceedsThreshold() ? " bad" : "")
        }));
        return this;
    }

    /*************
     * vm methods transform model data into something
     * the view can use to make data useful to the user
     */
    getFriendly(val){
        if(val === null){
            return "";
        }
        return getFormattedNumber(val)[0];
    }

    getMagnitude(val){
        if(val === null){
            return "";
        }
        return getFormattedNumber(val)[1];
    }

    lastExceedsThreshold(){
        return this.last > this.threshold;
    }

    getIndicatorStatus(){
        if(this.threshold === Infinity){
            // if no threshold is set
            return "off";
        } else if(this.lastExceedsThreshold()){
            // if threshold is breached
            return "on";
        } else {
            // if threshold is safe
            return "safe";
        }
    }
}

/*global console: true */
const COLOR_PALETTE_LENGTH = 10;

function stackedBarTemplate(vm){
    return `
        <div class="stacked-wrapper">
            <div class="name">${vm.label}</div>
            <div class="bars">
                ${vm.data.map(bar => barTemplate(vm, bar)).join("")}

                <!-- empty bar for free space -->
                ${ vm.free ?
                    barTemplate(vm, {name:"Free", val: vm.free}) :
                    ""}

                ${ vm.threshold !== Infinity ? 
                    `<div class="threshold" style="left: ${vm.getThresholdPosition()}%;"></div>` :
                    ""}

            </div>
            <div class="stacked-footer">
                ${ vm.originalCapacity ? `
                    <div class="used">Used: <strong>${vm.getFormattedNumber(vm.used)}${vm.unit}</strong></div>
                    <div class="free">Free: <strong>${vm.getFormattedNumber(vm.free)}${vm.unit}</strong></div>` :
                    ""
                }
                <div class="total">Total: <strong>${vm.getFormattedNumber(vm.capacity)}${vm.unit}</strong></div>
            </div>
        </div>

        <div class="indicator ${vm.getIndicatorStatus()}"></div>
    `;
}

function barTemplate(vm, bar){
    let {name, val} = bar;
    if(!name){
        name = "";
    }

    return `
        <div class="bar ${vm.getColorClass(bar)} ${ name === "Free" ? "free" : ""}"
                style="flex: ${val} 0 0;"
                title="${vm.getTitle(name, val)}">
            <div class="bar-label">
                <!-- this is a hack to cause labels that are
                    too long to not appear at all. text-overflow
                    ellipsis is not sufficient here -->
                &#8203; ${name.replace(" ", "&nbsp;")}
            </div>
        </div>
    `;
}

const defaultConfig$1 = {
    template: stackedBarTemplate,
    label: "",
    unit: "B",
    threshold: Infinity
};

class StackedBar extends QuickVis {
    constructor(data, config){
        super(data, "div", stackedBarTemplate, "stacked-bar", config);
    }

    _update(data, config){
        if(!data){
            throw new Error("cannot create stacked bar from empty data");
        }

        this.data = data;
        this.used = this.data.reduce((acc, d) => d.val + acc, 0);

        config = Object.assign({}, defaultConfig$1, config);
        this.config = config;
        this.label = config.label;
        this.unit = config.unit;
        this.originalCapacity = config.capacity;
        this.originalThreshold = config.threshold;

        // set capacity and threshold to
        // original user requested values
        this.capacity = this.originalCapacity;
        this.threshold = this.originalThreshold;

        this.validateCapacity();
        this.validateThreshold();

        let free = this.capacity - this.used;
        this.free = free >= 0 ? free : 0;
    }

    validateCapacity(){
        // if no capacity was set, set it
        if(!this.capacity){
            this.capacity = this.used;
        }

        // if the total used value exceeds capacity, set
        // the capacity to the total used value.
        // aka: raise the roof
        if(this.used > this.capacity){
            console.warn("StackedBar used (" + getFormattedNumber(this.used).join("") + ") " +
                "exceeds specified capacity (" + getFormattedNumber(this.capacity).join("") + ") " +
                "by " + getFormattedNumber(this.used-this.capacity).join(""));
            this.capacity = this.used;
        }
    }

    validateThreshold(){
        if(this.threshold === Infinity){
            // no threshold was set
            return;
        }
        if(this.threshold > this.capacity){
            console.warn("StackedBar threshold (" + getFormattedNumber(this.threshold).join("") + ") " +
                "exceeds specified capacity (" + getFormattedNumber(this.capacity).join("") + ") " +
                "so it is being ignored");
            this.threshold = Infinity;
            return;
        }
    }

    getColorClass(bar){
        // empty bar for free space
        if(bar.name === "Free"){
            return "bar-color-none";
        } else {
            // TODO - other color palettes?
            return "bar-color-" + (this.getIndexOf(bar) % COLOR_PALETTE_LENGTH);
        }
    }

    getIndexOf(bar){
        return this.data.indexOf(bar);
    }

    getFormattedNumber(val){
        if(val === null){
            return "";
        }
        return getFormattedNumber(val).join("");
    }

    // if a threshold is set and the used exceeds
    // it, return true
    exceedsThreshold(){
        return !!(this.threshold && (this.used > this.threshold));
    }

    getIndicatorStatus(){
        if(this.threshold === Infinity){
            // if no threshold is set
            return "off";
        } else if(this.exceedsThreshold()){
            // if threshold is breached
            return "on";
        } else {
            // if threshold is safe
            return "safe";
        }
    }

    // get percent position of threshold indicator
    // NOTE - assumes threshold and capacity
    getThresholdPosition(){
        return this.threshold / this.capacity * 100;
    }

    getTitle(name, val){
        let formatted = this.getFormattedNumber(val) + this.unit;
        if(name){
            return name +": "+ formatted;
        } else {
            return formatted;
        }
    }
}

/*global console: true */
function template$1(vm){
    return `
        <div class="label">${vm.label}</div>
        <div class="visualization">
            <div class="bars">
                <div class="bar" style="flex: ${vm.getFocusedVal()} 0 0;" title="${vm.getTitle(name, vm.getFocusedVal())}"></div>
                <div class="bar bar-free" style="flex: ${vm.getFreeVal()} 0 0;" title="${vm.getFreeVal()} Free"></div>
                ${ vm.threshold !== Infinity ? 
                    `<div class="threshold" style="left: ${vm.getThresholdPosition()}%;"></div>` :
                    ""}
            </div>

        </div>
        <div class="last-value">
            <div class="value">${vm.getFocusedVal()}</div>
            <div class="magnitude">${vm.getFocusedMagnitude()}</div>
            <div class="unit">${vm.unit}</div>
        </div>

        <div class="indicator ${vm.getIndicatorStatus()}"></div>
    `;
}

const defaultConfig$2 = {
    label: "",
    unit: "B",
    threshold: Infinity
};

class Bar extends QuickVis {
    constructor(data, config){
        super(data, "div", template$1, "simple-bar", config);
    }

    _update(data, config){
        if(!data){
            throw new Error("cannot create bar from empty data");
        }

        if(!Array.isArray(data)){
            data = [data];
        }
        this.data = data;
        this.focused = this.data.length - 1;

        config = Object.assign({}, defaultConfig$2, config);
        this.config = config;
        this.label = config.label;
        this.unit = config.unit;
        // TODO - make capacity required
        this.capacity = config.capacity;
        this.threshold = config.threshold;
        this.validateThreshold();
        this.free = this.capacity - this.getFocusedVal();

        this._render();
    }

    focus(val){
        let start = val;
        let end;
        // oooh a range
        if(Array.isArray(val)){
            start = val[0];
            end = val[1];
            // use last value for displaying stuff
            val = end;
        }

        let pos = Math.floor(this.data.length * val);
        this.focused = pos;
        this._render();
    }

    blur(){
        this.focused = this.data.length - 1;
    }

    validateThreshold(){
        if(this.threshold === Infinity){
            // no threshold was set
            return;
        }
        if(this.threshold > this.capacity){
            console.warn("threshold exceeds capacity you silly person");
            this.threshold = Infinity;
        }
    }

    // if a threshold is set and the used exceeds
    // it, return true
    exceedsThreshold(){
        return !!(this.threshold && (this.getFocusedRaw() > this.threshold));
    }

    getFocusedRaw(){
        return this.data[this.focused];
    }
    getFocusedVal(){
        return getFormattedNumber(this.getFocusedRaw())[0];
    }
    getFocusedMagnitude(){
        return getFormattedNumber(this.getFocusedRaw())[1];
    }
    getFreeVal(){
        // TODO - ensure non-negative
        // TODO - format
        return this.capacity - this.getFocusedRaw();
    }

    getIndicatorStatus(){
        if(this.threshold === Infinity){
            // if no threshold is set
            return "off";
        } else if(this.exceedsThreshold()){
            // if threshold is breached
            return "on";
        } else {
            // if threshold is safe
            return "";
        }
    }

    // get percent position of threshold indicator
    // NOTE - assumes threshold and capacity
    getThresholdPosition(){
        return this.threshold / this.capacity * 100;
    }

    getTitle(name, val){
        let formatted = getFormattedNumber(this.getFocusedRaw()).join("") + this.unit;
        if(name){
            return name +": "+ formatted;
        } else {
            return formatted;
        }
    }
}

/*global console: true */
function winLossTemplate(vm){
    return `
        <div class="label">${vm.label}</div>
        <div class="visualization">
            <div class="topsies">
                ${vm.data
                    .map(dp => vm.winLoseOrDraw(dp))
                    .map(wld => wld === 1 ? true : false)
                    .map(marked => `<div class="winloss-block ${marked ? "marked" : ""}"></div>`)
                    .join("")}
            </div>
            <div class="bottomsies">
                ${vm.data
                    .map(dp => vm.winLoseOrDraw(dp))
                    .map(wld => wld === -1 ? true : false)
                    .map(marked => `<div class="winloss-block ${marked ? "marked" : ""}"></div>`)
                    .join("")}
            </div>
        </div>
        <div class="last-value" ${vm.hideWinPercent ? 'style="display:none;"' : ""}>
            <div class="value">${vm.getWinPercent()}</div>
            <div class="unit">%</div>
            <div class="magnitude"></div>
        </div>
        <div class="indicator ${vm.lastIsBad() ? "on" : ""}"></div>
    `;
}

const defaultConfig$3 = {
    template: winLossTemplate,
    label: "",
    hideWinPercent: false,
    tickCount: 0,
    downsampleFn: downsampleData.MAX
};

class WinLoss extends QuickVis {
    constructor(data, config){
        super(data, "div", winLossTemplate, "win-loss", config);
    }

    _update(data, config){
        if(!data || !data.length){
            throw new Error("cannot create graph bar from empty data");
        }

        config = Object.assign({}, defaultConfig$3, config);
        this.config = config;
        this.label = config.label;
        this.hideWinPercent = config.hideWinPercent;
        this.tickCount = config.tickCount;
        this.downsampleFn = config.downsampleFn;

        this.data = downsampleData(data, this.tickCount, this.downsampleFn);
        let [total, win, loss] = this.data.reduce((acc, dp) => {
            let wld = this.winLoseOrDraw(dp);
            // if its a draw, dont increment nothin'
            if(wld === 0){
                return acc;
            }

            // increment total
            acc[0] += 1;

            // increment wins
            if(wld === 1){
                acc[1]++;
            }
            // increment losses
            if(wld === -1){
                acc[2]++;
            }
            return acc;
        }, [0,0,0]);

        this.winPercent = win / total * 100;
    }

    getFormattedNumber(val){
        return getFormattedNumber(val).join("");
    }

    getLast(){
        if(this.data){
            return this.data.slice(-1)[0];
        }
        return null
    }

    lastIsBad(){
        let last = this.getLast();
        if(last || last === null){
            return false;
        } else {
            return true;
        }
    }

    winLoseOrDraw(val){
        if(val === undefined || val === null){
            return 0;
        } else if(val){
            return 1;
        } else {
            return -1;
        }
    }

    getWinPercent(){
        return Math.floor(this.winPercent);
    }

    focus(val){
        if(this.data && this.rendered){
            let start = val;
            let end;
            // oooh a range
            if(Array.isArray(val)){
                start = val[0];
                end = val[1];
                // use last value for displaying stuff
                val = end;
            }

            let pos = Math.floor(this.data.length * val);
            // TODO HACK FIX - i dunno, ya know?
            pos = pos === this.data.length ? pos - 1 : pos;
            this.blur();
            this.el.classList.add("focused");

            // this.el.querySelector(`.topsies .winloss-block:nth-child(${pos+1})`).classList.add("focused");
            // this.el.querySelector(`.bottomsies .winloss-block:nth-child(${pos+1})`).classList.add("focused");
            let topEls = Array.from(this.el.querySelectorAll(`.topsies .winloss-block`));
            let bottomEls = Array.from(this.el.querySelectorAll(`.bottomsies .winloss-block`));
            if(!topEls || !bottomEls){
                // things arent rendered, or no data or *something*
                return;
            }
            let focusEls = [topEls[pos], bottomEls[pos]];

            // if this should affect a range
            if(end){
                let startPos = Math.floor(this.data.length * start);
                // TODO HACK FIX - i dunno, ya know?
                startPos = startPos === this.data.length ? startPos - 1 : startPos;
                focusEls = [ ...topEls.slice(startPos, pos), ...bottomEls.slice(startPos, pos) ];
            }

            focusEls.forEach(el => el.classList.add("focused"));

            let indicatorEl = this.el.querySelector(".indicator");
            // LOOK im just trying to get this demo out. this code can all
            // burn in hell after this
            let last = this.data[Math.floor(this.data.length * val)];
            let status = "";
            // HACK - this is copy pasta
            if(!last && last !== null){
                status = "on";
            }
            indicatorEl.setAttribute("class", `indicator ${status}`);
        }
    }

    blur(){
        let nodes = this.el.querySelectorAll(`.winloss-block.focused`);
        let els = Array.from(nodes);
        els.forEach(el => el.classList.remove("focused"));
        this.el.classList.remove("focused");

        let indicatorEl = this.el.querySelector(".indicator");
        if(indicatorEl){
            let status = this.lastIsBad() ? "on" : "";
            indicatorEl.setAttribute("class", `indicator ${status}`);
        }
    }
}

class VisGrid {
    constructor(config){
        this.el = document.createElement("div");
        this.el.classList.add("quickvis");
        this.el.classList.add("vis-grid");

        this.vis = config.vis;
        // attach each vis to this grid
        fastdom.mutate(() => {
            this.vis.forEach(v => {
                this.el.appendChild(v.el);
                v._render();
            });

            fastdom.measure(() => {
                /*
                let max = [0,0,0,0];
                const selectors = [".label", ".visualization", ".last-value", ".indicator"];
                this.vis.forEach(v => {
                    selectors.forEach((selector, i) => {
                        let w = v.el.querySelector(selector).getBoundingClientRect().width;
                        max[i] = Math.max(w, max[i]);
                    });
                });
                console.log(max);
                */

                let w = this.el.getBoundingClientRect().width;
            });
        });
    }

    focus(val){
        this.vis.forEach(v => {
            v.focus(val);
        });
    }
    blur(){
        this.vis.forEach(v => {
            v.blur();
        });
    }

}

var quickvis = {
    Sparkline,
    StackedBar,
    WinLoss,
    Bar,
    VisGrid
};

return quickvis;

}());
//# sourceMappingURL=quickvis.js.map
(function(){
    var styleEl = document.createElement("style");
    styleEl.type = "text/css";
    styleEl.appendChild(document.createTextNode(`
/*
 * quickvis.css 
 */
@charset "UTF-8";
.vbox {
  display: flex;
  flex-direction: column; }

.hbox {
  display: flex;
  flex-direction: row; }

.quickvis .label {
  color: #888;
  font-size: 1.2rem;
  flex-basis: 100%; }

.quickvis .visualization {
  height: 2em; }

.quickvis .last-value {
  font-size: 2em;
  display: flex;
  flex-direction: row; }

.quickvis .last-value .value {
  font-size: 1em;
  color: #555; }

.quickvis .last-value .unit {
  font-size: 0.9em;
  color: #AAA; }

.quickvis .last-value .magnitude {
  font-size: 0.9em;
  color: #AAA; }

.quickvis .indicator:after {
  font-size: 2rem;
  content: "○";
  color: #CCC; }

.quickvis .indicator.off:after {
  display: none; }

.quickvis .indicator.on:after {
  color: #9C1200;
  content: "●"; }

/*
 * stacked-bar.css 
 */
@charset "UTF-8";
.stacked-bar {
  position: relative; }

.stacked-bar .stacked-wrapper {
  display: flex;
  flex-direction: column;
  color: #555;
  margin-right: 25px; }

.stacked-bar .name {
  font-size: 1.3em;
  margin-bottom: 2px; }

.stacked-bar .bars {
  display: flex;
  height: 30px;
  position: relative;
  border: solid #999 1px;
  background-color: #EEE; }

.stacked-bar .bars .bar-color-none {
  background-color: transparent !important; }

.stacked-bar .bars .bar-color-0 {
  background-color: #6A95A9 !important; }

.stacked-bar .bars .bar-color-1 {
  background-color: #314F5C !important; }

.stacked-bar .bars .bar-color-2 {
  background-color: #8F8B3E !important; }

.stacked-bar .bars .bar-color-3 {
  background-color: #A8A551 !important; }

.stacked-bar .bars .bar-color-4 {
  background-color: #3A583B !important; }

.stacked-bar .bars .bar-color-5 {
  background-color: #5CA45E !important; }

.stacked-bar .bars .bar-color-6 {
  background-color: #8B6A4E !important; }

.stacked-bar .bars .bar-color-7 {
  background-color: #A48164 !important; }

.stacked-bar .bars .bar-color-8 {
  background-color: #A44C73 !important; }

.stacked-bar .bars .bar-color-9 {
  background-color: #572038 !important; }

.stacked-bar .bars .bar {
  background-color: #555;
  color: #EEE;
  font-weight: bold;
  font-size: 0.9em;
  cursor: default;
  overflow: hidden;
  line-height: 30px; }

.stacked-bar .bar .bar-label {
  margin: 0 4px; }

.stacked-bar .bars .threshold {
  position: absolute;
  left: 0;
  top: -6px;
  height: 40px;
  background-color: white;
  border-left: dashed #555 2px; }

.stacked-bar .stacked-footer {
  font-size: 0.8em;
  display: flex;
  padding-top: 2px; }

.stacked-bar .stacked-footer .used,
.stacked-bar .stacked-footer .free {
  margin-right: 10px; }

.stacked-bar .stacked-footer .total {
  margin-left: auto; }

.stacked-bar .indicator {
  font-size: 1.8em;
  position: absolute;
  bottom: 30px;
  right: 0; }

.stacked-bar .indicator:after {
  display: flex;
  color: transparent;
  content: "○";
  color: #CCC; }

.stacked-bar .indicator.off:after {
  display: none; }

.stacked-bar .indicator.on:after {
  color: #9C1200;
  content: "●"; }

/*
 * win-loss.css 
 */
.win-loss {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center; }

.win-loss .label {
  margin-bottom: 4px; }

.win-loss .winloss-wrap {
  display: flex;
  flex: 1; }

.win-loss .visualization {
  flex: 1;
  padding: 6px 0; }

.win-loss .winloss {
  display: flex;
  flex-direction: column;
  flex: 1; }

.win-loss .winloss-block {
  min-width: 6px;
  height: 100%;
  flex: 1;
  margin-right: 1px; }

.win-loss .topsies, .win-loss .bottomsies {
  display: flex;
  height: 50%; }

.win-loss .topsies {
  border-bottom: dotted #888 1px; }

.win-loss .topsies .marked {
  background-color: #999; }

.win-loss .bottomsies .marked {
  background-color: #333; }

.win-loss .last-value {
  padding-right: 4px; }

.win-loss .indicator:after {
  position: relative;
  top: -1px; }

.win-loss.focused .winloss-block {
  opacity: 0.4; }

.win-loss.focused .winloss-block.focused {
  opacity: 1; }

/*
 * bar.css 
 */
.simple-bar {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center; }

.simple-bar .visualization {
  flex: 1;
  margin-right: 6px; }

.simple-bar .bars {
  display: flex;
  width: 100%;
  position: relative;
  border: solid #999 1px;
  background-color: #EEE;
  height: 2em; }

.simple-bar .bars .bar {
  background-color: #555;
  height: 100%; }

.simple-bar .bars .bar-free {
  background-color: transparent !important; }

.simple-bar .bars .threshold {
  position: absolute;
  left: 0;
  top: -6px;
  height: calc(10px + 2em);
  background-color: white;
  border-left: dotted #555 2px; }

/*
 * visgrid.css 
 */
.quickvis.vis-grid {
  display: table;
  width: 100%; }

.quickvis.vis-grid .sparkline,
.quickvis.vis-grid .win-loss,
.quickvis.vis-grid .simple-bar {
  flex-wrap: nowrap;
  display: table-row; }

.quickvis.vis-grid .sparkline > *,
.quickvis.vis-grid .win-loss > *,
.quickvis.vis-grid .simple-bar > * {
  display: table-cell;
  overflow: hidden;
  height: 20px;
  vertical-align: middle; }

.quickvis.vis-grid .sparkline .label,
.quickvis.vis-grid .win-loss .label,
.quickvis.vis-grid .simple-bar .label {
  font-size: 0.9em;
  flex-basis: initial;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  padding-right: 5px; }

.quickvis.vis-grid .sparkline .last-value,
.quickvis.vis-grid .win-loss .last-value,
.quickvis.vis-grid .simple-bar .last-value {
  font-size: 1.2em;
  padding-left: 5px;
  white-space: nowrap; }

.quickvis.vis-grid .sparkline .last-value > *,
.quickvis.vis-grid .win-loss .last-value > *,
.quickvis.vis-grid .simple-bar .last-value > * {
  display: inline-block; }

.quickvis.vis-grid .sparkline .indicator,
.quickvis.vis-grid .win-loss .indicator,
.quickvis.vis-grid .simple-bar .indicator {
  padding-left: 4px; }

.quickvis.vis-grid .simple-bar .bars {
  height: 10px; }

.quickvis.vis-grid .simple-bar .bars .threshold {
  top: -3px;
  height: 15px; }

/*
 * sparkline.css 
 */
.sparkline {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center; }

.sparkline .visualization {
  flex: 1; }

.sparkline .graph {
  margin-right: 6px;
  height: 100%;
  width: 100%; }

.sparkline .graph .sparkline-path {
  stroke: #555;
  stroke-width: 1;
  fill: transparent; }

.sparkline .graph .sparkline-path.shaded {
  stroke: transparent;
  fill: #CCC; }

.sparkline .graph .sparkline-bar {
  stroke: transparent;
  fill: #AAA; }

.sparkline .graph .sparkline-bar.bad {
  fill: #9C1200; }

.sparkline .graph .sparkline-scatter,
.sparkline .graph .sparkline-last-point {
  fill: #AAA; }

.sparkline .graph .sparkline-scatter.bad,
.sparkline .graph .sparkline-last-point.bad {
  fill: #9C1200; }

.sparkline .graph .sparkline-threshold {
  stroke: #AAA;
  stroke-width: 2;
  stroke-dasharray: 2, 2;
  fill: transparent; }

.sparkline .graph .sparkline-focus {
  fill: black; }

.sparkline .graph .sparkline-focus.range {
  opacity: 0.3; }

.sparkline .last-value {
  align-items: baseline;
  line-height: 0.7em;
  letter-spacing: -1px; }

.sparkline .value {
  margin-right: 2px; }
`));
    document.head.appendChild(styleEl);
})();
