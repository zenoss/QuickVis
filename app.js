(function () {
'use strict';

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};



function unwrapExports (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var runtime = createCommonjsModule(function (module) {
  /**
   * Copyright (c) 2014-present, Facebook, Inc.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */

  !function (global) {
    var Op = Object.prototype;
    var hasOwn = Op.hasOwnProperty;
    var undefined; // More compressible than void 0.
    var $Symbol = typeof Symbol === "function" ? Symbol : {};
    var iteratorSymbol = $Symbol.iterator || "@@iterator";
    var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
    var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

    var inModule = 'object' === "object";
    var runtime = global.regeneratorRuntime;
    if (runtime) {
      if (inModule) {
        // If regeneratorRuntime is defined globally and we're in a module,
        // make the exports object identical to regeneratorRuntime.
        module.exports = runtime;
      }
      // Don't bother evaluating the rest of this file if the runtime was
      // already defined globally.
      return;
    }

    // Define the runtime globally (as expected by generated code) as either
    // module.exports (if we're in a module) or a new, empty object.
    runtime = global.regeneratorRuntime = inModule ? module.exports : {};

    function wrap(innerFn, outerFn, self, tryLocsList) {
      // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
      var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
      var generator = Object.create(protoGenerator.prototype);
      var context = new Context(tryLocsList || []);

      // The ._invoke method unifies the implementations of the .next,
      // .throw, and .return methods.
      generator._invoke = makeInvokeMethod(innerFn, self, context);

      return generator;
    }
    runtime.wrap = wrap;

    // Try/catch helper to minimize deoptimizations. Returns a completion
    // record like context.tryEntries[i].completion. This interface could
    // have been (and was previously) designed to take a closure to be
    // invoked without arguments, but in all the cases we care about we
    // already have an existing method we want to call, so there's no need
    // to create a new function object. We can even get away with assuming
    // the method takes exactly one argument, since that happens to be true
    // in every case, so we don't have to touch the arguments object. The
    // only additional allocation required is the completion record, which
    // has a stable shape and so hopefully should be cheap to allocate.
    function tryCatch(fn, obj, arg) {
      try {
        return { type: "normal", arg: fn.call(obj, arg) };
      } catch (err) {
        return { type: "throw", arg: err };
      }
    }

    var GenStateSuspendedStart = "suspendedStart";
    var GenStateSuspendedYield = "suspendedYield";
    var GenStateExecuting = "executing";
    var GenStateCompleted = "completed";

    // Returning this object from the innerFn has the same effect as
    // breaking out of the dispatch switch statement.
    var ContinueSentinel = {};

    // Dummy constructor functions that we use as the .constructor and
    // .constructor.prototype properties for functions that return Generator
    // objects. For full spec compliance, you may wish to configure your
    // minifier not to mangle the names of these two functions.
    function Generator() {}
    function GeneratorFunction() {}
    function GeneratorFunctionPrototype() {}

    // This is a polyfill for %IteratorPrototype% for environments that
    // don't natively support it.
    var IteratorPrototype = {};
    IteratorPrototype[iteratorSymbol] = function () {
      return this;
    };

    var getProto = Object.getPrototypeOf;
    var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
    if (NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
      // This environment has a native %IteratorPrototype%; use it instead
      // of the polyfill.
      IteratorPrototype = NativeIteratorPrototype;
    }

    var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype);
    GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
    GeneratorFunctionPrototype.constructor = GeneratorFunction;
    GeneratorFunctionPrototype[toStringTagSymbol] = GeneratorFunction.displayName = "GeneratorFunction";

    // Helper for defining the .next, .throw, and .return methods of the
    // Iterator interface in terms of a single ._invoke method.
    function defineIteratorMethods(prototype) {
      ["next", "throw", "return"].forEach(function (method) {
        prototype[method] = function (arg) {
          return this._invoke(method, arg);
        };
      });
    }

    runtime.isGeneratorFunction = function (genFun) {
      var ctor = typeof genFun === "function" && genFun.constructor;
      return ctor ? ctor === GeneratorFunction ||
      // For the native GeneratorFunction constructor, the best we can
      // do is to check its .name property.
      (ctor.displayName || ctor.name) === "GeneratorFunction" : false;
    };

    runtime.mark = function (genFun) {
      if (Object.setPrototypeOf) {
        Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
      } else {
        genFun.__proto__ = GeneratorFunctionPrototype;
        if (!(toStringTagSymbol in genFun)) {
          genFun[toStringTagSymbol] = "GeneratorFunction";
        }
      }
      genFun.prototype = Object.create(Gp);
      return genFun;
    };

    // Within the body of any async function, `await x` is transformed to
    // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
    // `hasOwn.call(value, "__await")` to determine if the yielded value is
    // meant to be awaited.
    runtime.awrap = function (arg) {
      return { __await: arg };
    };

    function AsyncIterator(generator) {
      function invoke(method, arg, resolve, reject) {
        var record = tryCatch(generator[method], generator, arg);
        if (record.type === "throw") {
          reject(record.arg);
        } else {
          var result = record.arg;
          var value = result.value;
          if (value && typeof value === "object" && hasOwn.call(value, "__await")) {
            return Promise.resolve(value.__await).then(function (value) {
              invoke("next", value, resolve, reject);
            }, function (err) {
              invoke("throw", err, resolve, reject);
            });
          }

          return Promise.resolve(value).then(function (unwrapped) {
            // When a yielded Promise is resolved, its final value becomes
            // the .value of the Promise<{value,done}> result for the
            // current iteration. If the Promise is rejected, however, the
            // result for this iteration will be rejected with the same
            // reason. Note that rejections of yielded Promises are not
            // thrown back into the generator function, as is the case
            // when an awaited Promise is rejected. This difference in
            // behavior between yield and await is important, because it
            // allows the consumer to decide what to do with the yielded
            // rejection (swallow it and continue, manually .throw it back
            // into the generator, abandon iteration, whatever). With
            // await, by contrast, there is no opportunity to examine the
            // rejection reason outside the generator function, so the
            // only option is to throw it from the await expression, and
            // let the generator function handle the exception.
            result.value = unwrapped;
            resolve(result);
          }, reject);
        }
      }

      var previousPromise;

      function enqueue(method, arg) {
        function callInvokeWithMethodAndArg() {
          return new Promise(function (resolve, reject) {
            invoke(method, arg, resolve, reject);
          });
        }

        return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(callInvokeWithMethodAndArg,
        // Avoid propagating failures to Promises returned by later
        // invocations of the iterator.
        callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
      }

      // Define the unified helper method that is used to implement .next,
      // .throw, and .return (see defineIteratorMethods).
      this._invoke = enqueue;
    }

    defineIteratorMethods(AsyncIterator.prototype);
    AsyncIterator.prototype[asyncIteratorSymbol] = function () {
      return this;
    };
    runtime.AsyncIterator = AsyncIterator;

    // Note that simple async functions are implemented on top of
    // AsyncIterator objects; they just return a Promise for the value of
    // the final result produced by the iterator.
    runtime.async = function (innerFn, outerFn, self, tryLocsList) {
      var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList));

      return runtime.isGeneratorFunction(outerFn) ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function (result) {
        return result.done ? result.value : iter.next();
      });
    };

    function makeInvokeMethod(innerFn, self, context) {
      var state = GenStateSuspendedStart;

      return function invoke(method, arg) {
        if (state === GenStateExecuting) {
          throw new Error("Generator is already running");
        }

        if (state === GenStateCompleted) {
          if (method === "throw") {
            throw arg;
          }

          // Be forgiving, per 25.3.3.3.3 of the spec:
          // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
          return doneResult();
        }

        context.method = method;
        context.arg = arg;

        while (true) {
          var delegate = context.delegate;
          if (delegate) {
            var delegateResult = maybeInvokeDelegate(delegate, context);
            if (delegateResult) {
              if (delegateResult === ContinueSentinel) continue;
              return delegateResult;
            }
          }

          if (context.method === "next") {
            // Setting context._sent for legacy support of Babel's
            // function.sent implementation.
            context.sent = context._sent = context.arg;
          } else if (context.method === "throw") {
            if (state === GenStateSuspendedStart) {
              state = GenStateCompleted;
              throw context.arg;
            }

            context.dispatchException(context.arg);
          } else if (context.method === "return") {
            context.abrupt("return", context.arg);
          }

          state = GenStateExecuting;

          var record = tryCatch(innerFn, self, context);
          if (record.type === "normal") {
            // If an exception is thrown from innerFn, we leave state ===
            // GenStateExecuting and loop back for another invocation.
            state = context.done ? GenStateCompleted : GenStateSuspendedYield;

            if (record.arg === ContinueSentinel) {
              continue;
            }

            return {
              value: record.arg,
              done: context.done
            };
          } else if (record.type === "throw") {
            state = GenStateCompleted;
            // Dispatch the exception by looping back around to the
            // context.dispatchException(context.arg) call above.
            context.method = "throw";
            context.arg = record.arg;
          }
        }
      };
    }

    // Call delegate.iterator[context.method](context.arg) and handle the
    // result, either by returning a { value, done } result from the
    // delegate iterator, or by modifying context.method and context.arg,
    // setting context.delegate to null, and returning the ContinueSentinel.
    function maybeInvokeDelegate(delegate, context) {
      var method = delegate.iterator[context.method];
      if (method === undefined) {
        // A .throw or .return when the delegate iterator has no .throw
        // method always terminates the yield* loop.
        context.delegate = null;

        if (context.method === "throw") {
          if (delegate.iterator.return) {
            // If the delegate iterator has a return method, give it a
            // chance to clean up.
            context.method = "return";
            context.arg = undefined;
            maybeInvokeDelegate(delegate, context);

            if (context.method === "throw") {
              // If maybeInvokeDelegate(context) changed context.method from
              // "return" to "throw", let that override the TypeError below.
              return ContinueSentinel;
            }
          }

          context.method = "throw";
          context.arg = new TypeError("The iterator does not provide a 'throw' method");
        }

        return ContinueSentinel;
      }

      var record = tryCatch(method, delegate.iterator, context.arg);

      if (record.type === "throw") {
        context.method = "throw";
        context.arg = record.arg;
        context.delegate = null;
        return ContinueSentinel;
      }

      var info = record.arg;

      if (!info) {
        context.method = "throw";
        context.arg = new TypeError("iterator result is not an object");
        context.delegate = null;
        return ContinueSentinel;
      }

      if (info.done) {
        // Assign the result of the finished delegate to the temporary
        // variable specified by delegate.resultName (see delegateYield).
        context[delegate.resultName] = info.value;

        // Resume execution at the desired location (see delegateYield).
        context.next = delegate.nextLoc;

        // If context.method was "throw" but the delegate handled the
        // exception, let the outer generator proceed normally. If
        // context.method was "next", forget context.arg since it has been
        // "consumed" by the delegate iterator. If context.method was
        // "return", allow the original .return call to continue in the
        // outer generator.
        if (context.method !== "return") {
          context.method = "next";
          context.arg = undefined;
        }
      } else {
        // Re-yield the result returned by the delegate method.
        return info;
      }

      // The delegate iterator is finished, so forget it and continue with
      // the outer generator.
      context.delegate = null;
      return ContinueSentinel;
    }

    // Define Generator.prototype.{next,throw,return} in terms of the
    // unified ._invoke helper method.
    defineIteratorMethods(Gp);

    Gp[toStringTagSymbol] = "Generator";

    // A Generator should always return itself as the iterator object when the
    // @@iterator function is called on it. Some browsers' implementations of the
    // iterator prototype chain incorrectly implement this, causing the Generator
    // object to not be returned from this call. This ensures that doesn't happen.
    // See https://github.com/facebook/regenerator/issues/274 for more details.
    Gp[iteratorSymbol] = function () {
      return this;
    };

    Gp.toString = function () {
      return "[object Generator]";
    };

    function pushTryEntry(locs) {
      var entry = { tryLoc: locs[0] };

      if (1 in locs) {
        entry.catchLoc = locs[1];
      }

      if (2 in locs) {
        entry.finallyLoc = locs[2];
        entry.afterLoc = locs[3];
      }

      this.tryEntries.push(entry);
    }

    function resetTryEntry(entry) {
      var record = entry.completion || {};
      record.type = "normal";
      delete record.arg;
      entry.completion = record;
    }

    function Context(tryLocsList) {
      // The root entry object (effectively a try statement without a catch
      // or a finally block) gives us a place to store values thrown from
      // locations where there is no enclosing try statement.
      this.tryEntries = [{ tryLoc: "root" }];
      tryLocsList.forEach(pushTryEntry, this);
      this.reset(true);
    }

    runtime.keys = function (object) {
      var keys = [];
      for (var key in object) {
        keys.push(key);
      }
      keys.reverse();

      // Rather than returning an object with a next method, we keep
      // things simple and return the next function itself.
      return function next() {
        while (keys.length) {
          var key = keys.pop();
          if (key in object) {
            next.value = key;
            next.done = false;
            return next;
          }
        }

        // To avoid creating an additional object, we just hang the .value
        // and .done properties off the next function object itself. This
        // also ensures that the minifier will not anonymize the function.
        next.done = true;
        return next;
      };
    };

    function values(iterable) {
      if (iterable) {
        var iteratorMethod = iterable[iteratorSymbol];
        if (iteratorMethod) {
          return iteratorMethod.call(iterable);
        }

        if (typeof iterable.next === "function") {
          return iterable;
        }

        if (!isNaN(iterable.length)) {
          var i = -1,
              next = function next() {
            while (++i < iterable.length) {
              if (hasOwn.call(iterable, i)) {
                next.value = iterable[i];
                next.done = false;
                return next;
              }
            }

            next.value = undefined;
            next.done = true;

            return next;
          };

          return next.next = next;
        }
      }

      // Return an iterator with no values.
      return { next: doneResult };
    }
    runtime.values = values;

    function doneResult() {
      return { value: undefined, done: true };
    }

    Context.prototype = {
      constructor: Context,

      reset: function (skipTempReset) {
        this.prev = 0;
        this.next = 0;
        // Resetting context._sent for legacy support of Babel's
        // function.sent implementation.
        this.sent = this._sent = undefined;
        this.done = false;
        this.delegate = null;

        this.method = "next";
        this.arg = undefined;

        this.tryEntries.forEach(resetTryEntry);

        if (!skipTempReset) {
          for (var name in this) {
            // Not sure about the optimal order of these conditions:
            if (name.charAt(0) === "t" && hasOwn.call(this, name) && !isNaN(+name.slice(1))) {
              this[name] = undefined;
            }
          }
        }
      },

      stop: function () {
        this.done = true;

        var rootEntry = this.tryEntries[0];
        var rootRecord = rootEntry.completion;
        if (rootRecord.type === "throw") {
          throw rootRecord.arg;
        }

        return this.rval;
      },

      dispatchException: function (exception) {
        if (this.done) {
          throw exception;
        }

        var context = this;
        function handle(loc, caught) {
          record.type = "throw";
          record.arg = exception;
          context.next = loc;

          if (caught) {
            // If the dispatched exception was caught by a catch block,
            // then let that catch block handle the exception normally.
            context.method = "next";
            context.arg = undefined;
          }

          return !!caught;
        }

        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          var record = entry.completion;

          if (entry.tryLoc === "root") {
            // Exception thrown outside of any try block that could handle
            // it, so set the completion value of the entire function to
            // throw the exception.
            return handle("end");
          }

          if (entry.tryLoc <= this.prev) {
            var hasCatch = hasOwn.call(entry, "catchLoc");
            var hasFinally = hasOwn.call(entry, "finallyLoc");

            if (hasCatch && hasFinally) {
              if (this.prev < entry.catchLoc) {
                return handle(entry.catchLoc, true);
              } else if (this.prev < entry.finallyLoc) {
                return handle(entry.finallyLoc);
              }
            } else if (hasCatch) {
              if (this.prev < entry.catchLoc) {
                return handle(entry.catchLoc, true);
              }
            } else if (hasFinally) {
              if (this.prev < entry.finallyLoc) {
                return handle(entry.finallyLoc);
              }
            } else {
              throw new Error("try statement without catch or finally");
            }
          }
        }
      },

      abrupt: function (type, arg) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) {
            var finallyEntry = entry;
            break;
          }
        }

        if (finallyEntry && (type === "break" || type === "continue") && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc) {
          // Ignore the finally entry if control is not jumping to a
          // location outside the try/catch block.
          finallyEntry = null;
        }

        var record = finallyEntry ? finallyEntry.completion : {};
        record.type = type;
        record.arg = arg;

        if (finallyEntry) {
          this.method = "next";
          this.next = finallyEntry.finallyLoc;
          return ContinueSentinel;
        }

        return this.complete(record);
      },

      complete: function (record, afterLoc) {
        if (record.type === "throw") {
          throw record.arg;
        }

        if (record.type === "break" || record.type === "continue") {
          this.next = record.arg;
        } else if (record.type === "return") {
          this.rval = this.arg = record.arg;
          this.method = "return";
          this.next = "end";
        } else if (record.type === "normal" && afterLoc) {
          this.next = afterLoc;
        }

        return ContinueSentinel;
      },

      finish: function (finallyLoc) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          if (entry.finallyLoc === finallyLoc) {
            this.complete(entry.completion, entry.afterLoc);
            resetTryEntry(entry);
            return ContinueSentinel;
          }
        }
      },

      "catch": function (tryLoc) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          if (entry.tryLoc === tryLoc) {
            var record = entry.completion;
            if (record.type === "throw") {
              var thrown = record.arg;
              resetTryEntry(entry);
            }
            return thrown;
          }
        }

        // The context.catch method must only be called with a location
        // argument that corresponds to a known catch block.
        throw new Error("illegal catch attempt");
      },

      delegateYield: function (iterable, resultName, nextLoc) {
        this.delegate = {
          iterator: values(iterable),
          resultName: resultName,
          nextLoc: nextLoc
        };

        if (this.method === "next") {
          // Deliberately forget the last sent value so that we don't
          // accidentally pass it on to the delegate.
          this.arg = undefined;
        }

        return ContinueSentinel;
      }
    };
  }(
  // In sloppy mode, unbound `this` refers to the global object, fallback to
  // Function constructor if we're in global strict mode. That is sadly a form
  // of indirect eval which violates Content Security Policy.
  function () {
    return this;
  }() || Function("return this")());
});

/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// This method of obtaining a reference to the global object needs to be
// kept identical to the way it is obtained in runtime.js
var g = function () {
  return this;
}() || Function("return this")();

// Use `getOwnPropertyNames` because not all browsers support calling
// `hasOwnProperty` on the global `self` object in a worker. See #183.
var hadRuntime = g.regeneratorRuntime && Object.getOwnPropertyNames(g).indexOf("regeneratorRuntime") >= 0;

// Save the old regeneratorRuntime in case it needs to be restored later.
var oldRuntime = hadRuntime && g.regeneratorRuntime;

// Force reevalutation of runtime.js.
g.regeneratorRuntime = undefined;

var runtimeModule = runtime;

if (hadRuntime) {
  // Restore the original runtime.
  g.regeneratorRuntime = oldRuntime;
} else {
  // Remove the global property added by runtime.js.
  try {
    delete g.regeneratorRuntime;
  } catch (e) {
    g.regeneratorRuntime = undefined;
  }
}

var regenerator = runtimeModule;

// 7.1.4 ToInteger
var ceil = Math.ceil;
var floor = Math.floor;
var _toInteger = function (it) {
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};

// 7.2.1 RequireObjectCoercible(argument)
var _defined = function (it) {
  if (it == undefined) throw TypeError("Can't call method on  " + it);
  return it;
};

// true  -> String#at
// false -> String#codePointAt
var _stringAt = function (TO_STRING) {
  return function (that, pos) {
    var s = String(_defined(that));
    var i = _toInteger(pos);
    var l = s.length;
    var a, b;
    if (i < 0 || i >= l) return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff ? TO_STRING ? s.charAt(i) : a : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};

var _library = true;

var _global = createCommonjsModule(function (module) {
  // https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
  var global = module.exports = typeof window != 'undefined' && window.Math == Math ? window : typeof self != 'undefined' && self.Math == Math ? self
  // eslint-disable-next-line no-new-func
  : Function('return this')();
  if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef
});

var _core = createCommonjsModule(function (module) {
  var core = module.exports = { version: '2.5.3' };
  if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef
});

var _core_1 = _core.version;

var _aFunction = function (it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};

// optional / simple context binding

var _ctx = function (fn, that, length) {
  _aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 1:
      return function (a) {
        return fn.call(that, a);
      };
    case 2:
      return function (a, b) {
        return fn.call(that, a, b);
      };
    case 3:
      return function (a, b, c) {
        return fn.call(that, a, b, c);
      };
  }
  return function () /* ...args */{
    return fn.apply(that, arguments);
  };
};

var _isObject = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};

var _anObject = function (it) {
  if (!_isObject(it)) throw TypeError(it + ' is not an object!');
  return it;
};

var _fails = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};

// Thank's IE8 for his funny defineProperty
var _descriptors = !_fails(function () {
  return Object.defineProperty({}, 'a', { get: function () {
      return 7;
    } }).a != 7;
});

var document$1 = _global.document;
// typeof document.createElement is 'object' in old IE
var is = _isObject(document$1) && _isObject(document$1.createElement);
var _domCreate = function (it) {
  return is ? document$1.createElement(it) : {};
};

var _ie8DomDefine = !_descriptors && !_fails(function () {
  return Object.defineProperty(_domCreate('div'), 'a', { get: function () {
      return 7;
    } }).a != 7;
});

// 7.1.1 ToPrimitive(input [, PreferredType])

// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
var _toPrimitive = function (it, S) {
  if (!_isObject(it)) return it;
  var fn, val;
  if (S && typeof (fn = it.toString) == 'function' && !_isObject(val = fn.call(it))) return val;
  if (typeof (fn = it.valueOf) == 'function' && !_isObject(val = fn.call(it))) return val;
  if (!S && typeof (fn = it.toString) == 'function' && !_isObject(val = fn.call(it))) return val;
  throw TypeError("Can't convert object to primitive value");
};

var dP = Object.defineProperty;

var f = _descriptors ? Object.defineProperty : function defineProperty(O, P, Attributes) {
  _anObject(O);
  P = _toPrimitive(P, true);
  _anObject(Attributes);
  if (_ie8DomDefine) try {
    return dP(O, P, Attributes);
  } catch (e) {/* empty */}
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};

var _objectDp = {
  f: f
};

var _propertyDesc = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};

var _hide = _descriptors ? function (object, key, value) {
  return _objectDp.f(object, key, _propertyDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};

var PROTOTYPE = 'prototype';

var $export = function (type, name, source) {
  var IS_FORCED = type & $export.F;
  var IS_GLOBAL = type & $export.G;
  var IS_STATIC = type & $export.S;
  var IS_PROTO = type & $export.P;
  var IS_BIND = type & $export.B;
  var IS_WRAP = type & $export.W;
  var exports = IS_GLOBAL ? _core : _core[name] || (_core[name] = {});
  var expProto = exports[PROTOTYPE];
  var target = IS_GLOBAL ? _global : IS_STATIC ? _global[name] : (_global[name] || {})[PROTOTYPE];
  var key, own, out;
  if (IS_GLOBAL) source = name;
  for (key in source) {
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    if (own && key in exports) continue;
    // export native or passed
    out = own ? target[key] : source[key];
    // prevent global pollution for namespaces
    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
    // bind timers to global for call from export context
    : IS_BIND && own ? _ctx(out, _global)
    // wrap global constructors for prevent change them in library
    : IS_WRAP && target[key] == out ? function (C) {
      var F = function (a, b, c) {
        if (this instanceof C) {
          switch (arguments.length) {
            case 0:
              return new C();
            case 1:
              return new C(a);
            case 2:
              return new C(a, b);
          }return new C(a, b, c);
        }return C.apply(this, arguments);
      };
      F[PROTOTYPE] = C[PROTOTYPE];
      return F;
      // make static versions for prototype methods
    }(out) : IS_PROTO && typeof out == 'function' ? _ctx(Function.call, out) : out;
    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
    if (IS_PROTO) {
      (exports.virtual || (exports.virtual = {}))[key] = out;
      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
      if (type & $export.R && expProto && !expProto[key]) _hide(expProto, key, out);
    }
  }
};
// type bitmap
$export.F = 1; // forced
$export.G = 2; // global
$export.S = 4; // static
$export.P = 8; // proto
$export.B = 16; // bind
$export.W = 32; // wrap
$export.U = 64; // safe
$export.R = 128; // real proto method for `library`
var _export = $export;

var _redefine = _hide;

var hasOwnProperty = {}.hasOwnProperty;
var _has = function (it, key) {
  return hasOwnProperty.call(it, key);
};

var _iterators = {};

var toString = {}.toString;

var _cof = function (it) {
  return toString.call(it).slice(8, -1);
};

// fallback for non-array-like ES3 and non-enumerable old V8 strings

// eslint-disable-next-line no-prototype-builtins
var _iobject = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
  return _cof(it) == 'String' ? it.split('') : Object(it);
};

// to indexed object, toObject with fallback for non-array-like ES3 strings


var _toIobject = function (it) {
  return _iobject(_defined(it));
};

// 7.1.15 ToLength

var min = Math.min;
var _toLength = function (it) {
  return it > 0 ? min(_toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};

var max = Math.max;
var min$1 = Math.min;
var _toAbsoluteIndex = function (index, length) {
  index = _toInteger(index);
  return index < 0 ? max(index + length, 0) : min$1(index, length);
};

// false -> Array#indexOf
// true  -> Array#includes


var _arrayIncludes = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = _toIobject($this);
    var length = _toLength(O.length);
    var index = _toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare
      if (value != value) return true;
      // Array#indexOf ignores holes, Array#includes - not
    } else for (; length > index; index++) if (IS_INCLUDES || index in O) {
      if (O[index] === el) return IS_INCLUDES || index || 0;
    }return !IS_INCLUDES && -1;
  };
};

var SHARED = '__core-js_shared__';
var store = _global[SHARED] || (_global[SHARED] = {});
var _shared = function (key) {
  return store[key] || (store[key] = {});
};

var id = 0;
var px = Math.random();
var _uid = function (key) {
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};

var shared$1 = _shared('keys');

var _sharedKey = function (key) {
  return shared$1[key] || (shared$1[key] = _uid(key));
};

var arrayIndexOf = _arrayIncludes(false);
var IE_PROTO = _sharedKey('IE_PROTO');

var _objectKeysInternal = function (object, names) {
  var O = _toIobject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) if (key != IE_PROTO) _has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (_has(O, key = names[i++])) {
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};

// IE 8- don't enum bug keys
var _enumBugKeys = 'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'.split(',');

// 19.1.2.14 / 15.2.3.14 Object.keys(O)


var _objectKeys = Object.keys || function keys(O) {
  return _objectKeysInternal(O, _enumBugKeys);
};

var _objectDps = _descriptors ? Object.defineProperties : function defineProperties(O, Properties) {
  _anObject(O);
  var keys = _objectKeys(Properties);
  var length = keys.length;
  var i = 0;
  var P;
  while (length > i) _objectDp.f(O, P = keys[i++], Properties[P]);
  return O;
};

var document$2 = _global.document;
var _html = document$2 && document$2.documentElement;

// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])


var IE_PROTO$1 = _sharedKey('IE_PROTO');
var Empty = function () {/* empty */};
var PROTOTYPE$1 = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = _domCreate('iframe');
  var i = _enumBugKeys.length;
  var lt = '<';
  var gt = '>';
  var iframeDocument;
  iframe.style.display = 'none';
  _html.appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while (i--) delete createDict[PROTOTYPE$1][_enumBugKeys[i]];
  return createDict();
};

var _objectCreate = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    Empty[PROTOTYPE$1] = _anObject(O);
    result = new Empty();
    Empty[PROTOTYPE$1] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO$1] = O;
  } else result = createDict();
  return Properties === undefined ? result : _objectDps(result, Properties);
};

var _wks = createCommonjsModule(function (module) {
  var store = _shared('wks');

  var Symbol = _global.Symbol;
  var USE_SYMBOL = typeof Symbol == 'function';

  var $exports = module.exports = function (name) {
    return store[name] || (store[name] = USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : _uid)('Symbol.' + name));
  };

  $exports.store = store;
});

var def = _objectDp.f;

var TAG = _wks('toStringTag');

var _setToStringTag = function (it, tag, stat) {
  if (it && !_has(it = stat ? it : it.prototype, TAG)) def(it, TAG, { configurable: true, value: tag });
};

var IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
_hide(IteratorPrototype, _wks('iterator'), function () {
  return this;
});

var _iterCreate = function (Constructor, NAME, next) {
  Constructor.prototype = _objectCreate(IteratorPrototype, { next: _propertyDesc(1, next) });
  _setToStringTag(Constructor, NAME + ' Iterator');
};

// 7.1.13 ToObject(argument)

var _toObject = function (it) {
  return Object(_defined(it));
};

// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)


var IE_PROTO$2 = _sharedKey('IE_PROTO');
var ObjectProto = Object.prototype;

var _objectGpo = Object.getPrototypeOf || function (O) {
  O = _toObject(O);
  if (_has(O, IE_PROTO$2)) return O[IE_PROTO$2];
  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
    return O.constructor.prototype;
  }return O instanceof Object ? ObjectProto : null;
};

var ITERATOR = _wks('iterator');
var BUGGY = !([].keys && 'next' in [].keys()); // Safari has buggy iterators w/o `next`
var FF_ITERATOR = '@@iterator';
var KEYS = 'keys';
var VALUES = 'values';

var returnThis = function () {
  return this;
};

var _iterDefine = function (Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
  _iterCreate(Constructor, NAME, next);
  var getMethod = function (kind) {
    if (!BUGGY && kind in proto) return proto[kind];
    switch (kind) {
      case KEYS:
        return function keys() {
          return new Constructor(this, kind);
        };
      case VALUES:
        return function values() {
          return new Constructor(this, kind);
        };
    }return function entries() {
      return new Constructor(this, kind);
    };
  };
  var TAG = NAME + ' Iterator';
  var DEF_VALUES = DEFAULT == VALUES;
  var VALUES_BUG = false;
  var proto = Base.prototype;
  var $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT];
  var $default = !BUGGY && $native || getMethod(DEFAULT);
  var $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined;
  var $anyNative = NAME == 'Array' ? proto.entries || $native : $native;
  var methods, key, IteratorPrototype;
  // Fix native
  if ($anyNative) {
    IteratorPrototype = _objectGpo($anyNative.call(new Base()));
    if (IteratorPrototype !== Object.prototype && IteratorPrototype.next) {
      // Set @@toStringTag to native iterators
      _setToStringTag(IteratorPrototype, TAG, true);
      // fix for some old engines
      if (!_library && !_has(IteratorPrototype, ITERATOR)) _hide(IteratorPrototype, ITERATOR, returnThis);
    }
  }
  // fix Array#{values, @@iterator}.name in V8 / FF
  if (DEF_VALUES && $native && $native.name !== VALUES) {
    VALUES_BUG = true;
    $default = function values() {
      return $native.call(this);
    };
  }
  // Define iterator
  if ((!_library || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
    _hide(proto, ITERATOR, $default);
  }
  // Plug for library
  _iterators[NAME] = $default;
  _iterators[TAG] = returnThis;
  if (DEFAULT) {
    methods = {
      values: DEF_VALUES ? $default : getMethod(VALUES),
      keys: IS_SET ? $default : getMethod(KEYS),
      entries: $entries
    };
    if (FORCED) for (key in methods) {
      if (!(key in proto)) _redefine(proto, key, methods[key]);
    } else _export(_export.P + _export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};

var $at = _stringAt(true);

// 21.1.3.27 String.prototype[@@iterator]()
_iterDefine(String, 'String', function (iterated) {
  this._t = String(iterated); // target
  this._i = 0; // next index
  // 21.1.5.2.1 %StringIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var index = this._i;
  var point;
  if (index >= O.length) return { value: undefined, done: true };
  point = $at(O, index);
  this._i += point.length;
  return { value: point, done: false };
});

var _iterStep = function (done, value) {
  return { value: value, done: !!done };
};

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
var es6_array_iterator = _iterDefine(Array, 'Array', function (iterated, kind) {
  this._t = _toIobject(iterated); // target
  this._i = 0; // next index
  this._k = kind; // kind
  // 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var kind = this._k;
  var index = this._i++;
  if (!O || index >= O.length) {
    this._t = undefined;
    return _iterStep(1);
  }
  if (kind == 'keys') return _iterStep(0, index);
  if (kind == 'values') return _iterStep(0, O[index]);
  return _iterStep(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
_iterators.Arguments = _iterators.Array;

var TO_STRING_TAG = _wks('toStringTag');

var DOMIterables = ('CSSRuleList,CSSStyleDeclaration,CSSValueList,ClientRectList,DOMRectList,DOMStringList,' + 'DOMTokenList,DataTransferItemList,FileList,HTMLAllCollection,HTMLCollection,HTMLFormElement,HTMLSelectElement,' + 'MediaList,MimeTypeArray,NamedNodeMap,NodeList,PaintRequestList,Plugin,PluginArray,SVGLengthList,SVGNumberList,' + 'SVGPathSegList,SVGPointList,SVGStringList,SVGTransformList,SourceBufferList,StyleSheetList,TextTrackCueList,' + 'TextTrackList,TouchList').split(',');

for (var i = 0; i < DOMIterables.length; i++) {
  var NAME = DOMIterables[i];
  var Collection = _global[NAME];
  var proto = Collection && Collection.prototype;
  if (proto && !proto[TO_STRING_TAG]) _hide(proto, TO_STRING_TAG, NAME);
  _iterators[NAME] = _iterators.Array;
}

// getting tag from 19.1.3.6 Object.prototype.toString()

var TAG$1 = _wks('toStringTag');
// ES3 wrong here
var ARG = _cof(function () {
  return arguments;
}()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function (it, key) {
  try {
    return it[key];
  } catch (e) {/* empty */}
};

var _classof = function (it) {
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
  // @@toStringTag case
  : typeof (T = tryGet(O = Object(it), TAG$1)) == 'string' ? T
  // builtinTag case
  : ARG ? _cof(O)
  // ES3 arguments fallback
  : (B = _cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};

var _anInstance = function (it, Constructor, name, forbiddenField) {
  if (!(it instanceof Constructor) || forbiddenField !== undefined && forbiddenField in it) {
    throw TypeError(name + ': incorrect invocation!');
  }return it;
};

// call something on iterator step with safe closing on error

var _iterCall = function (iterator, fn, value, entries) {
  try {
    return entries ? fn(_anObject(value)[0], value[1]) : fn(value);
    // 7.4.6 IteratorClose(iterator, completion)
  } catch (e) {
    var ret = iterator['return'];
    if (ret !== undefined) _anObject(ret.call(iterator));
    throw e;
  }
};

// check on default Array iterator

var ITERATOR$1 = _wks('iterator');
var ArrayProto = Array.prototype;

var _isArrayIter = function (it) {
  return it !== undefined && (_iterators.Array === it || ArrayProto[ITERATOR$1] === it);
};

var ITERATOR$2 = _wks('iterator');

var core_getIteratorMethod = _core.getIteratorMethod = function (it) {
  if (it != undefined) return it[ITERATOR$2] || it['@@iterator'] || _iterators[_classof(it)];
};

var _forOf = createCommonjsModule(function (module) {
  var BREAK = {};
  var RETURN = {};
  var exports = module.exports = function (iterable, entries, fn, that, ITERATOR) {
    var iterFn = ITERATOR ? function () {
      return iterable;
    } : core_getIteratorMethod(iterable);
    var f = _ctx(fn, that, entries ? 2 : 1);
    var index = 0;
    var length, step, iterator, result;
    if (typeof iterFn != 'function') throw TypeError(iterable + ' is not iterable!');
    // fast case for arrays with default iterator
    if (_isArrayIter(iterFn)) for (length = _toLength(iterable.length); length > index; index++) {
      result = entries ? f(_anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
      if (result === BREAK || result === RETURN) return result;
    } else for (iterator = iterFn.call(iterable); !(step = iterator.next()).done;) {
      result = _iterCall(iterator, f, step.value, entries);
      if (result === BREAK || result === RETURN) return result;
    }
  };
  exports.BREAK = BREAK;
  exports.RETURN = RETURN;
});

// 7.3.20 SpeciesConstructor(O, defaultConstructor)


var SPECIES = _wks('species');
var _speciesConstructor = function (O, D) {
  var C = _anObject(O).constructor;
  var S;
  return C === undefined || (S = _anObject(C)[SPECIES]) == undefined ? D : _aFunction(S);
};

// fast apply, http://jsperf.lnkit.com/fast-apply/5
var _invoke = function (fn, args, that) {
                  var un = that === undefined;
                  switch (args.length) {
                                    case 0:
                                                      return un ? fn() : fn.call(that);
                                    case 1:
                                                      return un ? fn(args[0]) : fn.call(that, args[0]);
                                    case 2:
                                                      return un ? fn(args[0], args[1]) : fn.call(that, args[0], args[1]);
                                    case 3:
                                                      return un ? fn(args[0], args[1], args[2]) : fn.call(that, args[0], args[1], args[2]);
                                    case 4:
                                                      return un ? fn(args[0], args[1], args[2], args[3]) : fn.call(that, args[0], args[1], args[2], args[3]);
                  }return fn.apply(that, args);
};

var process = _global.process;
var setTask = _global.setImmediate;
var clearTask = _global.clearImmediate;
var MessageChannel = _global.MessageChannel;
var Dispatch = _global.Dispatch;
var counter = 0;
var queue = {};
var ONREADYSTATECHANGE = 'onreadystatechange';
var defer;
var channel;
var port;
var run = function () {
  var id = +this;
  // eslint-disable-next-line no-prototype-builtins
  if (queue.hasOwnProperty(id)) {
    var fn = queue[id];
    delete queue[id];
    fn();
  }
};
var listener = function (event) {
  run.call(event.data);
};
// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
if (!setTask || !clearTask) {
  setTask = function setImmediate(fn) {
    var args = [];
    var i = 1;
    while (arguments.length > i) args.push(arguments[i++]);
    queue[++counter] = function () {
      // eslint-disable-next-line no-new-func
      _invoke(typeof fn == 'function' ? fn : Function(fn), args);
    };
    defer(counter);
    return counter;
  };
  clearTask = function clearImmediate(id) {
    delete queue[id];
  };
  // Node.js 0.8-
  if (_cof(process) == 'process') {
    defer = function (id) {
      process.nextTick(_ctx(run, id, 1));
    };
    // Sphere (JS game engine) Dispatch API
  } else if (Dispatch && Dispatch.now) {
    defer = function (id) {
      Dispatch.now(_ctx(run, id, 1));
    };
    // Browsers with MessageChannel, includes WebWorkers
  } else if (MessageChannel) {
    channel = new MessageChannel();
    port = channel.port2;
    channel.port1.onmessage = listener;
    defer = _ctx(port.postMessage, port, 1);
    // Browsers with postMessage, skip WebWorkers
    // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
  } else if (_global.addEventListener && typeof postMessage == 'function' && !_global.importScripts) {
    defer = function (id) {
      _global.postMessage(id + '', '*');
    };
    _global.addEventListener('message', listener, false);
    // IE8-
  } else if (ONREADYSTATECHANGE in _domCreate('script')) {
    defer = function (id) {
      _html.appendChild(_domCreate('script'))[ONREADYSTATECHANGE] = function () {
        _html.removeChild(this);
        run.call(id);
      };
    };
    // Rest old browsers
  } else {
    defer = function (id) {
      setTimeout(_ctx(run, id, 1), 0);
    };
  }
}
var _task = {
  set: setTask,
  clear: clearTask
};

var macrotask = _task.set;
var Observer = _global.MutationObserver || _global.WebKitMutationObserver;
var process$1 = _global.process;
var Promise$1 = _global.Promise;
var isNode = _cof(process$1) == 'process';

var _microtask = function () {
  var head, last, notify;

  var flush = function () {
    var parent, fn;
    if (isNode && (parent = process$1.domain)) parent.exit();
    while (head) {
      fn = head.fn;
      head = head.next;
      try {
        fn();
      } catch (e) {
        if (head) notify();else last = undefined;
        throw e;
      }
    }last = undefined;
    if (parent) parent.enter();
  };

  // Node.js
  if (isNode) {
    notify = function () {
      process$1.nextTick(flush);
    };
    // browsers with MutationObserver, except iOS Safari - https://github.com/zloirock/core-js/issues/339
  } else if (Observer && !(_global.navigator && _global.navigator.standalone)) {
    var toggle = true;
    var node = document.createTextNode('');
    new Observer(flush).observe(node, { characterData: true }); // eslint-disable-line no-new
    notify = function () {
      node.data = toggle = !toggle;
    };
    // environments with maybe non-completely correct, but existent Promise
  } else if (Promise$1 && Promise$1.resolve) {
    var promise = Promise$1.resolve();
    notify = function () {
      promise.then(flush);
    };
    // for other environments - macrotask based on:
    // - setImmediate
    // - MessageChannel
    // - window.postMessag
    // - onreadystatechange
    // - setTimeout
  } else {
    notify = function () {
      // strange IE + webpack dev server bug - use .call(global)
      macrotask.call(_global, flush);
    };
  }

  return function (fn) {
    var task = { fn: fn, next: undefined };
    if (last) last.next = task;
    if (!head) {
      head = task;
      notify();
    }last = task;
  };
};

// 25.4.1.5 NewPromiseCapability(C)


function PromiseCapability(C) {
  var resolve, reject;
  this.promise = new C(function ($$resolve, $$reject) {
    if (resolve !== undefined || reject !== undefined) throw TypeError('Bad Promise constructor');
    resolve = $$resolve;
    reject = $$reject;
  });
  this.resolve = _aFunction(resolve);
  this.reject = _aFunction(reject);
}

var f$1 = function (C) {
  return new PromiseCapability(C);
};

var _newPromiseCapability = {
  f: f$1
};

var _perform = function (exec) {
  try {
    return { e: false, v: exec() };
  } catch (e) {
    return { e: true, v: e };
  }
};

var _promiseResolve = function (C, x) {
  _anObject(C);
  if (_isObject(x) && x.constructor === C) return x;
  var promiseCapability = _newPromiseCapability.f(C);
  var resolve = promiseCapability.resolve;
  resolve(x);
  return promiseCapability.promise;
};

var _redefineAll = function (target, src, safe) {
  for (var key in src) {
    if (safe && target[key]) target[key] = src[key];else _hide(target, key, src[key]);
  }return target;
};

var SPECIES$1 = _wks('species');

var _setSpecies = function (KEY) {
  var C = typeof _core[KEY] == 'function' ? _core[KEY] : _global[KEY];
  if (_descriptors && C && !C[SPECIES$1]) _objectDp.f(C, SPECIES$1, {
    configurable: true,
    get: function () {
      return this;
    }
  });
};

var ITERATOR$3 = _wks('iterator');
var SAFE_CLOSING = false;

try {
  var riter = [7][ITERATOR$3]();
  riter['return'] = function () {
    SAFE_CLOSING = true;
  };
  // eslint-disable-next-line no-throw-literal
  
} catch (e) {/* empty */}

var _iterDetect = function (exec, skipClosing) {
  if (!skipClosing && !SAFE_CLOSING) return false;
  var safe = false;
  try {
    var arr = [7];
    var iter = arr[ITERATOR$3]();
    iter.next = function () {
      return { done: safe = true };
    };
    arr[ITERATOR$3] = function () {
      return iter;
    };
    exec(arr);
  } catch (e) {/* empty */}
  return safe;
};

var task = _task.set;
var microtask = _microtask();

var PROMISE = 'Promise';
var TypeError$1 = _global.TypeError;
var process$2 = _global.process;
var $Promise = _global[PROMISE];
var isNode$1 = _classof(process$2) == 'process';
var empty = function () {/* empty */};
var Internal;
var newGenericPromiseCapability;
var OwnPromiseCapability;
var Wrapper;
var newPromiseCapability$1 = newGenericPromiseCapability = _newPromiseCapability.f;

var USE_NATIVE = !!function () {
  try {
    // correct subclassing with @@species support
    var promise = $Promise.resolve(1);
    var FakePromise = (promise.constructor = {})[_wks('species')] = function (exec) {
      exec(empty, empty);
    };
    // unhandled rejections tracking support, NodeJS Promise without it fails @@species test
    return (isNode$1 || typeof PromiseRejectionEvent == 'function') && promise.then(empty) instanceof FakePromise;
  } catch (e) {/* empty */}
}();

// helpers
var isThenable = function (it) {
  var then;
  return _isObject(it) && typeof (then = it.then) == 'function' ? then : false;
};
var notify = function (promise, isReject) {
  if (promise._n) return;
  promise._n = true;
  var chain = promise._c;
  microtask(function () {
    var value = promise._v;
    var ok = promise._s == 1;
    var i = 0;
    var run = function (reaction) {
      var handler = ok ? reaction.ok : reaction.fail;
      var resolve = reaction.resolve;
      var reject = reaction.reject;
      var domain = reaction.domain;
      var result, then;
      try {
        if (handler) {
          if (!ok) {
            if (promise._h == 2) onHandleUnhandled(promise);
            promise._h = 1;
          }
          if (handler === true) result = value;else {
            if (domain) domain.enter();
            result = handler(value);
            if (domain) domain.exit();
          }
          if (result === reaction.promise) {
            reject(TypeError$1('Promise-chain cycle'));
          } else if (then = isThenable(result)) {
            then.call(result, resolve, reject);
          } else resolve(result);
        } else reject(value);
      } catch (e) {
        reject(e);
      }
    };
    while (chain.length > i) run(chain[i++]); // variable length - can't use forEach
    promise._c = [];
    promise._n = false;
    if (isReject && !promise._h) onUnhandled(promise);
  });
};
var onUnhandled = function (promise) {
  task.call(_global, function () {
    var value = promise._v;
    var unhandled = isUnhandled(promise);
    var result, handler, console;
    if (unhandled) {
      result = _perform(function () {
        if (isNode$1) {
          process$2.emit('unhandledRejection', value, promise);
        } else if (handler = _global.onunhandledrejection) {
          handler({ promise: promise, reason: value });
        } else if ((console = _global.console) && console.error) {
          console.error('Unhandled promise rejection', value);
        }
      });
      // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
      promise._h = isNode$1 || isUnhandled(promise) ? 2 : 1;
    }promise._a = undefined;
    if (unhandled && result.e) throw result.v;
  });
};
var isUnhandled = function (promise) {
  return promise._h !== 1 && (promise._a || promise._c).length === 0;
};
var onHandleUnhandled = function (promise) {
  task.call(_global, function () {
    var handler;
    if (isNode$1) {
      process$2.emit('rejectionHandled', promise);
    } else if (handler = _global.onrejectionhandled) {
      handler({ promise: promise, reason: promise._v });
    }
  });
};
var $reject = function (value) {
  var promise = this;
  if (promise._d) return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  promise._v = value;
  promise._s = 2;
  if (!promise._a) promise._a = promise._c.slice();
  notify(promise, true);
};
var $resolve = function (value) {
  var promise = this;
  var then;
  if (promise._d) return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  try {
    if (promise === value) throw TypeError$1("Promise can't be resolved itself");
    if (then = isThenable(value)) {
      microtask(function () {
        var wrapper = { _w: promise, _d: false }; // wrap
        try {
          then.call(value, _ctx($resolve, wrapper, 1), _ctx($reject, wrapper, 1));
        } catch (e) {
          $reject.call(wrapper, e);
        }
      });
    } else {
      promise._v = value;
      promise._s = 1;
      notify(promise, false);
    }
  } catch (e) {
    $reject.call({ _w: promise, _d: false }, e); // wrap
  }
};

// constructor polyfill
if (!USE_NATIVE) {
  // 25.4.3.1 Promise(executor)
  $Promise = function Promise(executor) {
    _anInstance(this, $Promise, PROMISE, '_h');
    _aFunction(executor);
    Internal.call(this);
    try {
      executor(_ctx($resolve, this, 1), _ctx($reject, this, 1));
    } catch (err) {
      $reject.call(this, err);
    }
  };
  // eslint-disable-next-line no-unused-vars
  Internal = function Promise(executor) {
    this._c = []; // <- awaiting reactions
    this._a = undefined; // <- checked in isUnhandled reactions
    this._s = 0; // <- state
    this._d = false; // <- done
    this._v = undefined; // <- value
    this._h = 0; // <- rejection state, 0 - default, 1 - handled, 2 - unhandled
    this._n = false; // <- notify
  };
  Internal.prototype = _redefineAll($Promise.prototype, {
    // 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
    then: function then(onFulfilled, onRejected) {
      var reaction = newPromiseCapability$1(_speciesConstructor(this, $Promise));
      reaction.ok = typeof onFulfilled == 'function' ? onFulfilled : true;
      reaction.fail = typeof onRejected == 'function' && onRejected;
      reaction.domain = isNode$1 ? process$2.domain : undefined;
      this._c.push(reaction);
      if (this._a) this._a.push(reaction);
      if (this._s) notify(this, false);
      return reaction.promise;
    },
    // 25.4.5.1 Promise.prototype.catch(onRejected)
    'catch': function (onRejected) {
      return this.then(undefined, onRejected);
    }
  });
  OwnPromiseCapability = function () {
    var promise = new Internal();
    this.promise = promise;
    this.resolve = _ctx($resolve, promise, 1);
    this.reject = _ctx($reject, promise, 1);
  };
  _newPromiseCapability.f = newPromiseCapability$1 = function (C) {
    return C === $Promise || C === Wrapper ? new OwnPromiseCapability(C) : newGenericPromiseCapability(C);
  };
}

_export(_export.G + _export.W + _export.F * !USE_NATIVE, { Promise: $Promise });
_setToStringTag($Promise, PROMISE);
_setSpecies(PROMISE);
Wrapper = _core[PROMISE];

// statics
_export(_export.S + _export.F * !USE_NATIVE, PROMISE, {
  // 25.4.4.5 Promise.reject(r)
  reject: function reject(r) {
    var capability = newPromiseCapability$1(this);
    var $$reject = capability.reject;
    $$reject(r);
    return capability.promise;
  }
});
_export(_export.S + _export.F * (_library || !USE_NATIVE), PROMISE, {
  // 25.4.4.6 Promise.resolve(x)
  resolve: function resolve(x) {
    return _promiseResolve(_library && this === Wrapper ? $Promise : this, x);
  }
});
_export(_export.S + _export.F * !(USE_NATIVE && _iterDetect(function (iter) {
  $Promise.all(iter)['catch'](empty);
})), PROMISE, {
  // 25.4.4.1 Promise.all(iterable)
  all: function all(iterable) {
    var C = this;
    var capability = newPromiseCapability$1(C);
    var resolve = capability.resolve;
    var reject = capability.reject;
    var result = _perform(function () {
      var values = [];
      var index = 0;
      var remaining = 1;
      _forOf(iterable, false, function (promise) {
        var $index = index++;
        var alreadyCalled = false;
        values.push(undefined);
        remaining++;
        C.resolve(promise).then(function (value) {
          if (alreadyCalled) return;
          alreadyCalled = true;
          values[$index] = value;
          --remaining || resolve(values);
        }, reject);
      });
      --remaining || resolve(values);
    });
    if (result.e) reject(result.v);
    return capability.promise;
  },
  // 25.4.4.4 Promise.race(iterable)
  race: function race(iterable) {
    var C = this;
    var capability = newPromiseCapability$1(C);
    var reject = capability.reject;
    var result = _perform(function () {
      _forOf(iterable, false, function (promise) {
        C.resolve(promise).then(capability.resolve, reject);
      });
    });
    if (result.e) reject(result.v);
    return capability.promise;
  }
});

_export(_export.P + _export.R, 'Promise', { 'finally': function (onFinally) {
    var C = _speciesConstructor(this, _core.Promise || _global.Promise);
    var isFunction = typeof onFinally == 'function';
    return this.then(isFunction ? function (x) {
      return _promiseResolve(C, onFinally()).then(function () {
        return x;
      });
    } : onFinally, isFunction ? function (e) {
      return _promiseResolve(C, onFinally()).then(function () {
        throw e;
      });
    } : onFinally);
  } });

// https://github.com/tc39/proposal-promise-try


_export(_export.S, 'Promise', { 'try': function (callbackfn) {
    var promiseCapability = _newPromiseCapability.f(this);
    var result = _perform(callbackfn);
    (result.e ? promiseCapability.reject : promiseCapability.resolve)(result.v);
    return promiseCapability.promise;
  } });

var promise = _core.Promise;

var promise$2 = createCommonjsModule(function (module) {
  module.exports = { "default": promise, __esModule: true };
});

var _Promise = unwrapExports(promise$2);

var asyncToGenerator = createCommonjsModule(function (module, exports) {
  exports.__esModule = true;

  var _promise2 = _interopRequireDefault(promise$2);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }

  exports.default = function (fn) {
    return function () {
      var gen = fn.apply(this, arguments);
      return new _promise2.default(function (resolve, reject) {
        function step(key, arg) {
          try {
            var info = gen[key](arg);
            var value = info.value;
          } catch (error) {
            reject(error);
            return;
          }

          if (info.done) {
            resolve(value);
          } else {
            return _promise2.default.resolve(value).then(function (value) {
              step("next", value);
            }, function (err) {
              step("throw", err);
            });
          }
        }

        return step("next");
      });
    };
  };
});

var _asyncToGenerator = unwrapExports(asyncToGenerator);

var f$2 = Object.getOwnPropertySymbols;

var _objectGops = {
	f: f$2
};

var f$3 = {}.propertyIsEnumerable;

var _objectPie = {
	f: f$3
};

// 19.1.2.1 Object.assign(target, source, ...)


var $assign = Object.assign;

// should work with symbols and should have deterministic property order (V8 bug)
var _objectAssign = !$assign || _fails(function () {
  var A = {};
  var B = {};
  // eslint-disable-next-line no-undef
  var S = Symbol();
  var K = 'abcdefghijklmnopqrst';
  A[S] = 7;
  K.split('').forEach(function (k) {
    B[k] = k;
  });
  return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
}) ? function assign(target, source) {
  // eslint-disable-line no-unused-vars
  var T = _toObject(target);
  var aLen = arguments.length;
  var index = 1;
  var getSymbols = _objectGops.f;
  var isEnum = _objectPie.f;
  while (aLen > index) {
    var S = _iobject(arguments[index++]);
    var keys = getSymbols ? _objectKeys(S).concat(getSymbols(S)) : _objectKeys(S);
    var length = keys.length;
    var j = 0;
    var key;
    while (length > j) if (isEnum.call(S, key = keys[j++])) T[key] = S[key];
  }return T;
} : $assign;

// 19.1.3.1 Object.assign(target, source)


_export(_export.S + _export.F, 'Object', { assign: _objectAssign });

var assign = _core.Object.assign;

var assign$2 = createCommonjsModule(function (module) {
  module.exports = { "default": assign, __esModule: true };
});

var _Object$assign = unwrapExports(assign$2);

// most Object methods by ES6 should accept primitives


var _objectSap = function (KEY, exec) {
  var fn = (_core.Object || {})[KEY] || Object[KEY];
  var exp = {};
  exp[KEY] = exec(fn);
  _export(_export.S + _export.F * _fails(function () {
    fn(1);
  }), 'Object', exp);
};

// 19.1.2.9 Object.getPrototypeOf(O)


_objectSap('getPrototypeOf', function () {
  return function getPrototypeOf(it) {
    return _objectGpo(_toObject(it));
  };
});

var getPrototypeOf = _core.Object.getPrototypeOf;

var getPrototypeOf$2 = createCommonjsModule(function (module) {
  module.exports = { "default": getPrototypeOf, __esModule: true };
});

var _Object$getPrototypeOf = unwrapExports(getPrototypeOf$2);

var classCallCheck = createCommonjsModule(function (module, exports) {
  exports.__esModule = true;

  exports.default = function (instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };
});

var _classCallCheck = unwrapExports(classCallCheck);

// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
_export(_export.S + _export.F * !_descriptors, 'Object', { defineProperty: _objectDp.f });

var $Object = _core.Object;
var defineProperty = function defineProperty(it, key, desc) {
  return $Object.defineProperty(it, key, desc);
};

var defineProperty$2 = createCommonjsModule(function (module) {
  module.exports = { "default": defineProperty, __esModule: true };
});

unwrapExports(defineProperty$2);

var createClass = createCommonjsModule(function (module, exports) {
  exports.__esModule = true;

  var _defineProperty2 = _interopRequireDefault(defineProperty$2);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }

  exports.default = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        (0, _defineProperty2.default)(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();
});

var _createClass = unwrapExports(createClass);

var f$4 = _wks;

var _wksExt = {
	f: f$4
};

var iterator = _wksExt.f('iterator');

var iterator$2 = createCommonjsModule(function (module) {
  module.exports = { "default": iterator, __esModule: true };
});

unwrapExports(iterator$2);

var _meta = createCommonjsModule(function (module) {
  var META = _uid('meta');

  var setDesc = _objectDp.f;
  var id = 0;
  var isExtensible = Object.isExtensible || function () {
    return true;
  };
  var FREEZE = !_fails(function () {
    return isExtensible(Object.preventExtensions({}));
  });
  var setMeta = function (it) {
    setDesc(it, META, { value: {
        i: 'O' + ++id, // object ID
        w: {} // weak collections IDs
      } });
  };
  var fastKey = function (it, create) {
    // return primitive with prefix
    if (!_isObject(it)) return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
    if (!_has(it, META)) {
      // can't set metadata to uncaught frozen object
      if (!isExtensible(it)) return 'F';
      // not necessary to add metadata
      if (!create) return 'E';
      // add missing metadata
      setMeta(it);
      // return object ID
    }return it[META].i;
  };
  var getWeak = function (it, create) {
    if (!_has(it, META)) {
      // can't set metadata to uncaught frozen object
      if (!isExtensible(it)) return true;
      // not necessary to add metadata
      if (!create) return false;
      // add missing metadata
      setMeta(it);
      // return hash weak collections IDs
    }return it[META].w;
  };
  // add metadata on freeze-family methods calling
  var onFreeze = function (it) {
    if (FREEZE && meta.NEED && isExtensible(it) && !_has(it, META)) setMeta(it);
    return it;
  };
  var meta = module.exports = {
    KEY: META,
    NEED: false,
    fastKey: fastKey,
    getWeak: getWeak,
    onFreeze: onFreeze
  };
});

var _meta_1 = _meta.KEY;
var _meta_2 = _meta.NEED;
var _meta_3 = _meta.fastKey;
var _meta_4 = _meta.getWeak;
var _meta_5 = _meta.onFreeze;

var defineProperty$4 = _objectDp.f;
var _wksDefine = function (name) {
  var $Symbol = _core.Symbol || (_core.Symbol = _library ? {} : _global.Symbol || {});
  if (name.charAt(0) != '_' && !(name in $Symbol)) defineProperty$4($Symbol, name, { value: _wksExt.f(name) });
};

// all enumerable object keys, includes symbols


var _enumKeys = function (it) {
  var result = _objectKeys(it);
  var getSymbols = _objectGops.f;
  if (getSymbols) {
    var symbols = getSymbols(it);
    var isEnum = _objectPie.f;
    var i = 0;
    var key;
    while (symbols.length > i) if (isEnum.call(it, key = symbols[i++])) result.push(key);
  }return result;
};

// 7.2.2 IsArray(argument)

var _isArray = Array.isArray || function isArray(arg) {
  return _cof(arg) == 'Array';
};

// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)

var hiddenKeys = _enumBugKeys.concat('length', 'prototype');

var f$5 = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
  return _objectKeysInternal(O, hiddenKeys);
};

var _objectGopn = {
  f: f$5
};

// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window

var gOPN = _objectGopn.f;
var toString$1 = {}.toString;

var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames ? Object.getOwnPropertyNames(window) : [];

var getWindowNames = function (it) {
  try {
    return gOPN(it);
  } catch (e) {
    return windowNames.slice();
  }
};

var f$6 = function getOwnPropertyNames(it) {
  return windowNames && toString$1.call(it) == '[object Window]' ? getWindowNames(it) : gOPN(_toIobject(it));
};

var _objectGopnExt = {
  f: f$6
};

var gOPD = Object.getOwnPropertyDescriptor;

var f$7 = _descriptors ? gOPD : function getOwnPropertyDescriptor(O, P) {
  O = _toIobject(O);
  P = _toPrimitive(P, true);
  if (_ie8DomDefine) try {
    return gOPD(O, P);
  } catch (e) {/* empty */}
  if (_has(O, P)) return _propertyDesc(!_objectPie.f.call(O, P), O[P]);
};

var _objectGopd = {
  f: f$7
};

// ECMAScript 6 symbols shim


var META = _meta.KEY;

var gOPD$1 = _objectGopd.f;
var dP$1 = _objectDp.f;
var gOPN$1 = _objectGopnExt.f;
var $Symbol = _global.Symbol;
var $JSON = _global.JSON;
var _stringify = $JSON && $JSON.stringify;
var PROTOTYPE$2 = 'prototype';
var HIDDEN = _wks('_hidden');
var TO_PRIMITIVE = _wks('toPrimitive');
var isEnum = {}.propertyIsEnumerable;
var SymbolRegistry = _shared('symbol-registry');
var AllSymbols = _shared('symbols');
var OPSymbols = _shared('op-symbols');
var ObjectProto$1 = Object[PROTOTYPE$2];
var USE_NATIVE$1 = typeof $Symbol == 'function';
var QObject = _global.QObject;
// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
var setter = !QObject || !QObject[PROTOTYPE$2] || !QObject[PROTOTYPE$2].findChild;

// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
var setSymbolDesc = _descriptors && _fails(function () {
  return _objectCreate(dP$1({}, 'a', {
    get: function () {
      return dP$1(this, 'a', { value: 7 }).a;
    }
  })).a != 7;
}) ? function (it, key, D) {
  var protoDesc = gOPD$1(ObjectProto$1, key);
  if (protoDesc) delete ObjectProto$1[key];
  dP$1(it, key, D);
  if (protoDesc && it !== ObjectProto$1) dP$1(ObjectProto$1, key, protoDesc);
} : dP$1;

var wrap = function (tag) {
  var sym = AllSymbols[tag] = _objectCreate($Symbol[PROTOTYPE$2]);
  sym._k = tag;
  return sym;
};

var isSymbol = USE_NATIVE$1 && typeof $Symbol.iterator == 'symbol' ? function (it) {
  return typeof it == 'symbol';
} : function (it) {
  return it instanceof $Symbol;
};

var $defineProperty$1 = function defineProperty(it, key, D) {
  if (it === ObjectProto$1) $defineProperty$1(OPSymbols, key, D);
  _anObject(it);
  key = _toPrimitive(key, true);
  _anObject(D);
  if (_has(AllSymbols, key)) {
    if (!D.enumerable) {
      if (!_has(it, HIDDEN)) dP$1(it, HIDDEN, _propertyDesc(1, {}));
      it[HIDDEN][key] = true;
    } else {
      if (_has(it, HIDDEN) && it[HIDDEN][key]) it[HIDDEN][key] = false;
      D = _objectCreate(D, { enumerable: _propertyDesc(0, false) });
    }return setSymbolDesc(it, key, D);
  }return dP$1(it, key, D);
};
var $defineProperties = function defineProperties(it, P) {
  _anObject(it);
  var keys = _enumKeys(P = _toIobject(P));
  var i = 0;
  var l = keys.length;
  var key;
  while (l > i) $defineProperty$1(it, key = keys[i++], P[key]);
  return it;
};
var $create = function create(it, P) {
  return P === undefined ? _objectCreate(it) : $defineProperties(_objectCreate(it), P);
};
var $propertyIsEnumerable = function propertyIsEnumerable(key) {
  var E = isEnum.call(this, key = _toPrimitive(key, true));
  if (this === ObjectProto$1 && _has(AllSymbols, key) && !_has(OPSymbols, key)) return false;
  return E || !_has(this, key) || !_has(AllSymbols, key) || _has(this, HIDDEN) && this[HIDDEN][key] ? E : true;
};
var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key) {
  it = _toIobject(it);
  key = _toPrimitive(key, true);
  if (it === ObjectProto$1 && _has(AllSymbols, key) && !_has(OPSymbols, key)) return;
  var D = gOPD$1(it, key);
  if (D && _has(AllSymbols, key) && !(_has(it, HIDDEN) && it[HIDDEN][key])) D.enumerable = true;
  return D;
};
var $getOwnPropertyNames = function getOwnPropertyNames(it) {
  var names = gOPN$1(_toIobject(it));
  var result = [];
  var i = 0;
  var key;
  while (names.length > i) {
    if (!_has(AllSymbols, key = names[i++]) && key != HIDDEN && key != META) result.push(key);
  }return result;
};
var $getOwnPropertySymbols = function getOwnPropertySymbols(it) {
  var IS_OP = it === ObjectProto$1;
  var names = gOPN$1(IS_OP ? OPSymbols : _toIobject(it));
  var result = [];
  var i = 0;
  var key;
  while (names.length > i) {
    if (_has(AllSymbols, key = names[i++]) && (IS_OP ? _has(ObjectProto$1, key) : true)) result.push(AllSymbols[key]);
  }return result;
};

// 19.4.1.1 Symbol([description])
if (!USE_NATIVE$1) {
  $Symbol = function Symbol() {
    if (this instanceof $Symbol) throw TypeError('Symbol is not a constructor!');
    var tag = _uid(arguments.length > 0 ? arguments[0] : undefined);
    var $set = function (value) {
      if (this === ObjectProto$1) $set.call(OPSymbols, value);
      if (_has(this, HIDDEN) && _has(this[HIDDEN], tag)) this[HIDDEN][tag] = false;
      setSymbolDesc(this, tag, _propertyDesc(1, value));
    };
    if (_descriptors && setter) setSymbolDesc(ObjectProto$1, tag, { configurable: true, set: $set });
    return wrap(tag);
  };
  _redefine($Symbol[PROTOTYPE$2], 'toString', function toString() {
    return this._k;
  });

  _objectGopd.f = $getOwnPropertyDescriptor;
  _objectDp.f = $defineProperty$1;
  _objectGopn.f = _objectGopnExt.f = $getOwnPropertyNames;
  _objectPie.f = $propertyIsEnumerable;
  _objectGops.f = $getOwnPropertySymbols;

  if (_descriptors && !_library) {
    _redefine(ObjectProto$1, 'propertyIsEnumerable', $propertyIsEnumerable, true);
  }

  _wksExt.f = function (name) {
    return wrap(_wks(name));
  };
}

_export(_export.G + _export.W + _export.F * !USE_NATIVE$1, { Symbol: $Symbol });

for (var es6Symbols =
// 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14
'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'.split(','), j = 0; es6Symbols.length > j;) _wks(es6Symbols[j++]);

for (var wellKnownSymbols = _objectKeys(_wks.store), k = 0; wellKnownSymbols.length > k;) _wksDefine(wellKnownSymbols[k++]);

_export(_export.S + _export.F * !USE_NATIVE$1, 'Symbol', {
  // 19.4.2.1 Symbol.for(key)
  'for': function (key) {
    return _has(SymbolRegistry, key += '') ? SymbolRegistry[key] : SymbolRegistry[key] = $Symbol(key);
  },
  // 19.4.2.5 Symbol.keyFor(sym)
  keyFor: function keyFor(sym) {
    if (!isSymbol(sym)) throw TypeError(sym + ' is not a symbol!');
    for (var key in SymbolRegistry) if (SymbolRegistry[key] === sym) return key;
  },
  useSetter: function () {
    setter = true;
  },
  useSimple: function () {
    setter = false;
  }
});

_export(_export.S + _export.F * !USE_NATIVE$1, 'Object', {
  // 19.1.2.2 Object.create(O [, Properties])
  create: $create,
  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
  defineProperty: $defineProperty$1,
  // 19.1.2.3 Object.defineProperties(O, Properties)
  defineProperties: $defineProperties,
  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
  // 19.1.2.7 Object.getOwnPropertyNames(O)
  getOwnPropertyNames: $getOwnPropertyNames,
  // 19.1.2.8 Object.getOwnPropertySymbols(O)
  getOwnPropertySymbols: $getOwnPropertySymbols
});

// 24.3.2 JSON.stringify(value [, replacer [, space]])
$JSON && _export(_export.S + _export.F * (!USE_NATIVE$1 || _fails(function () {
  var S = $Symbol();
  // MS Edge converts symbol values to JSON as {}
  // WebKit converts symbol values to JSON as null
  // V8 throws on boxed symbols
  return _stringify([S]) != '[null]' || _stringify({ a: S }) != '{}' || _stringify(Object(S)) != '{}';
})), 'JSON', {
  stringify: function stringify(it) {
    var args = [it];
    var i = 1;
    var replacer, $replacer;
    while (arguments.length > i) args.push(arguments[i++]);
    $replacer = replacer = args[1];
    if (!_isObject(replacer) && it === undefined || isSymbol(it)) return; // IE8 returns string on undefined
    if (!_isArray(replacer)) replacer = function (key, value) {
      if (typeof $replacer == 'function') value = $replacer.call(this, key, value);
      if (!isSymbol(value)) return value;
    };
    args[1] = replacer;
    return _stringify.apply($JSON, args);
  }
});

// 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)
$Symbol[PROTOTYPE$2][TO_PRIMITIVE] || _hide($Symbol[PROTOTYPE$2], TO_PRIMITIVE, $Symbol[PROTOTYPE$2].valueOf);
// 19.4.3.5 Symbol.prototype[@@toStringTag]
_setToStringTag($Symbol, 'Symbol');
// 20.2.1.9 Math[@@toStringTag]
_setToStringTag(Math, 'Math', true);
// 24.3.3 JSON[@@toStringTag]
_setToStringTag(_global.JSON, 'JSON', true);

_wksDefine('asyncIterator');

_wksDefine('observable');

var symbol = _core.Symbol;

var symbol$2 = createCommonjsModule(function (module) {
  module.exports = { "default": symbol, __esModule: true };
});

unwrapExports(symbol$2);

var _typeof_1 = createCommonjsModule(function (module, exports) {
  exports.__esModule = true;

  var _iterator2 = _interopRequireDefault(iterator$2);

  var _symbol2 = _interopRequireDefault(symbol$2);

  var _typeof = typeof _symbol2.default === "function" && typeof _iterator2.default === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj;
  };

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }

  exports.default = typeof _symbol2.default === "function" && _typeof(_iterator2.default) === "symbol" ? function (obj) {
    return typeof obj === "undefined" ? "undefined" : _typeof(obj);
  } : function (obj) {
    return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof(obj);
  };
});

unwrapExports(_typeof_1);

var possibleConstructorReturn = createCommonjsModule(function (module, exports) {
  exports.__esModule = true;

  var _typeof3 = _interopRequireDefault(_typeof_1);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }

  exports.default = function (self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && ((typeof call === "undefined" ? "undefined" : (0, _typeof3.default)(call)) === "object" || typeof call === "function") ? call : self;
  };
});

var _possibleConstructorReturn = unwrapExports(possibleConstructorReturn);

// 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)

var $getOwnPropertyDescriptor$1 = _objectGopd.f;

_objectSap('getOwnPropertyDescriptor', function () {
  return function getOwnPropertyDescriptor(it, key) {
    return $getOwnPropertyDescriptor$1(_toIobject(it), key);
  };
});

var $Object$1 = _core.Object;
var getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key) {
  return $Object$1.getOwnPropertyDescriptor(it, key);
};

var getOwnPropertyDescriptor$2 = createCommonjsModule(function (module) {
  module.exports = { "default": getOwnPropertyDescriptor, __esModule: true };
});

unwrapExports(getOwnPropertyDescriptor$2);

var get = createCommonjsModule(function (module, exports) {
  exports.__esModule = true;

  var _getPrototypeOf2 = _interopRequireDefault(getPrototypeOf$2);

  var _getOwnPropertyDescriptor2 = _interopRequireDefault(getOwnPropertyDescriptor$2);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }

  exports.default = function get(object, property, receiver) {
    if (object === null) object = Function.prototype;
    var desc = (0, _getOwnPropertyDescriptor2.default)(object, property);

    if (desc === undefined) {
      var parent = (0, _getPrototypeOf2.default)(object);

      if (parent === null) {
        return undefined;
      } else {
        return get(parent, property, receiver);
      }
    } else if ("value" in desc) {
      return desc.value;
    } else {
      var getter = desc.get;

      if (getter === undefined) {
        return undefined;
      }

      return getter.call(receiver);
    }
  };
});

var _get = unwrapExports(get);

// Works with __proto__ only. Old v8 can't work with null proto objects.
/* eslint-disable no-proto */

var check = function (O, proto) {
  _anObject(O);
  if (!_isObject(proto) && proto !== null) throw TypeError(proto + ": can't set as prototype!");
};
var _setProto = {
  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
  function (test, buggy, set) {
    try {
      set = _ctx(Function.call, _objectGopd.f(Object.prototype, '__proto__').set, 2);
      set(test, []);
      buggy = !(test instanceof Array);
    } catch (e) {
      buggy = true;
    }
    return function setPrototypeOf(O, proto) {
      check(O, proto);
      if (buggy) O.__proto__ = proto;else set(O, proto);
      return O;
    };
  }({}, false) : undefined),
  check: check
};

// 19.1.3.19 Object.setPrototypeOf(O, proto)

_export(_export.S, 'Object', { setPrototypeOf: _setProto.set });

var setPrototypeOf = _core.Object.setPrototypeOf;

var setPrototypeOf$2 = createCommonjsModule(function (module) {
  module.exports = { "default": setPrototypeOf, __esModule: true };
});

unwrapExports(setPrototypeOf$2);

// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
_export(_export.S, 'Object', { create: _objectCreate });

var $Object$2 = _core.Object;
var create = function create(P, D) {
  return $Object$2.create(P, D);
};

var create$2 = createCommonjsModule(function (module) {
  module.exports = { "default": create, __esModule: true };
});

unwrapExports(create$2);

var inherits = createCommonjsModule(function (module, exports) {
  exports.__esModule = true;

  var _setPrototypeOf2 = _interopRequireDefault(setPrototypeOf$2);

  var _create2 = _interopRequireDefault(create$2);

  var _typeof3 = _interopRequireDefault(_typeof_1);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }

  exports.default = function (subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : (0, _typeof3.default)(superClass)));
    }

    subClass.prototype = (0, _create2.default)(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) _setPrototypeOf2.default ? (0, _setPrototypeOf2.default)(subClass, superClass) : subClass.__proto__ = superClass;
  };
});

var _inherits = unwrapExports(inherits);

var core_getIterator = _core.getIterator = function (it) {
  var iterFn = core_getIteratorMethod(it);
  if (typeof iterFn != 'function') throw TypeError(it + ' is not iterable!');
  return _anObject(iterFn.call(it));
};

var getIterator = core_getIterator;

var getIterator$2 = createCommonjsModule(function (module) {
  module.exports = { "default": getIterator, __esModule: true };
});

var _getIterator = unwrapExports(getIterator$2);

/**
 * A collection of shims that provide minimal functionality of the ES6 collections.
 *
 * These implementations are not meant to be used outside of the ResizeObserver
 * modules as they cover only a limited range of use cases.
 */
/* eslint-disable require-jsdoc, valid-jsdoc */
var MapShim = function () {
    if (typeof Map !== 'undefined') {
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

    return function () {
        function anonymous() {
            this.__entries__ = [];
        }

        var prototypeAccessors = { size: { configurable: true } };

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
            var this$1 = this;
            if (ctx === void 0) ctx = null;

            for (var i = 0, list = this$1.__entries__; i < list.length; i += 1) {
                var entry = list[i];

                callback.call(ctx, entry[1], entry[0]);
            }
        };

        Object.defineProperties(anonymous.prototype, prototypeAccessors);

        return anonymous;
    }();
}();

/**
 * Detects whether window and document objects are available in current environment.
 */
var isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined' && window.document === document;

// Returns global object of a current environment.
var global$1$1 = function () {
    if (typeof global !== 'undefined' && global.Math === Math) {
        return global;
    }

    if (typeof self !== 'undefined' && self.Math === Math) {
        return self;
    }

    if (typeof window !== 'undefined' && window.Math === Math) {
        return window;
    }

    // eslint-disable-next-line no-new-func
    return Function('return this')();
}();

/**
 * A shim for the requestAnimationFrame which falls back to the setTimeout if
 * first one is not supported.
 *
 * @returns {number} Requests' identifier.
 */
var requestAnimationFrame$1 = function () {
    if (typeof requestAnimationFrame === 'function') {
        // It's required to use a bounded function because IE sometimes throws
        // an "Invalid calling object" error if rAF is invoked without the global
        // object on the left hand side.
        return requestAnimationFrame.bind(global$1$1);
    }

    return function (callback) {
        return setTimeout(function () {
            return callback(Date.now());
        }, 1000 / 60);
    };
}();

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

// Check if MutationObserver is available.
var mutationObserverSupported = typeof MutationObserver !== 'undefined';

/**
 * Singleton controller class which handles updates of ResizeObserver instances.
 */
var ResizeObserverController = function () {
    this.connected_ = false;
    this.mutationEventsAdded_ = false;
    this.mutationsObserver_ = null;
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

/**
 * Holds reference to the controller's instance.
 *
 * @private {ResizeObserverController}
 */

/**
 * Keeps reference to the instance of MutationObserver.
 *
 * @private {MutationObserver}
 */

/**
 * Indicates whether DOM listeners have been added.
 *
 * @private {boolean}
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
    activeObservers.forEach(function (observer) {
        return observer.broadcastActive();
    });

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
    var propertyName = ref.propertyName;if (propertyName === void 0) propertyName = '';

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

ResizeObserverController.instance_ = null;

/**
 * Defines non-writable/enumerable properties of the provided target object.
 *
 * @param {Object} target - Object for which to define properties.
 * @param {Object} props - Properties to be defined.
 * @returns {Object} Target object.
 */
var defineConfigurable = function (target, props) {
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
};

/**
 * Returns the global object associated with provided element.
 *
 * @param {Object} target
 * @returns {Object}
 */
var getWindowOf = function (target) {
    // Assume that the element is an instance of Node, which means that it
    // has the "ownerDocument" property from which we can retrieve a
    // corresponding global object.
    var ownerGlobal = target && target.ownerDocument && target.ownerDocument.defaultView;

    // Return the local global object if it's not possible extract one from
    // provided element.
    return ownerGlobal || global$1$1;
};

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
    var positions = [],
        len = arguments.length - 1;
    while (len-- > 0) positions[len] = arguments[len + 1];

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

    var styles = getWindowOf(target).getComputedStyle(target);
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
var isSVGGraphicsElement = function () {
    // Some browsers, namely IE and Edge, don't have the SVGGraphicsElement
    // interface.
    if (typeof SVGGraphicsElement !== 'undefined') {
        return function (target) {
            return target instanceof getWindowOf(target).SVGGraphicsElement;
        };
    }

    // If it's so, then check that element is at least an instance of the
    // SVGElement and that it has the "getBBox" method.
    // eslint-disable-next-line no-extra-parens
    return function (target) {
        return target instanceof getWindowOf(target).SVGElement && typeof target.getBBox === 'function';
    };
}();

/**
 * Checks whether provided element is a document element (<html>).
 *
 * @param {Element} target - Element to be checked.
 * @returns {boolean}
 */
function isDocumentElement(target) {
    return target === getWindowOf(target).document.documentElement;
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
    var Constr = typeof DOMRectReadOnly !== 'undefined' ? DOMRectReadOnly : Object;
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
var ResizeObservation = function (target) {
    this.broadcastWidth = 0;
    this.broadcastHeight = 0;
    this.contentRect_ = createRectInit(0, 0, 0, 0);

    this.target = target;
};

/**
 * Updates content rectangle and tells whether it's width or height properties
 * have changed since the last broadcast.
 *
 * @returns {boolean}
 */

/**
 * Reference to the last observed content rectangle.
 *
 * @private {DOMRectInit}
 */

/**
 * Broadcasted width of content rectangle.
 *
 * @type {number}
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

var ResizeObserverEntry = function (target, rectInit) {
    var contentRect = createReadOnlyRect(rectInit);

    // According to the specification following properties are not writable
    // and are also not enumerable in the native implementation.
    //
    // Property accessors are not being used as they'd require to define a
    // private WeakMap storage which may cause memory leaks in browsers that
    // don't support this type of collections.
    defineConfigurable(this, { target: target, contentRect: contentRect });
};

var ResizeObserverSPI = function (callback, controller, callbackCtx) {
    this.activeObservations_ = [];
    this.observations_ = new MapShim();

    if (typeof callback !== 'function') {
        throw new TypeError('The callback provided as parameter 1 is not a function.');
    }

    this.callback_ = callback;
    this.controller_ = controller;
    this.callbackCtx_ = callbackCtx;
};

/**
 * Starts observing provided element.
 *
 * @param {Element} target - Element to be observed.
 * @returns {void}
 */

/**
 * Registry of the ResizeObservation instances.
 *
 * @private {Map<Element, ResizeObservation>}
 */

/**
 * Public ResizeObserver instance which will be passed to the callback
 * function and used as a value of it's "this" binding.
 *
 * @private {ResizeObserver}
 */

/**
 * Collection of resize observations that have detected changes in dimensions
 * of elements.
 *
 * @private {Array<ResizeObservation>}
 */
ResizeObserverSPI.prototype.observe = function (target) {
    if (!arguments.length) {
        throw new TypeError('1 argument required, but only 0 present.');
    }

    // Do nothing if current environment doesn't have the Element interface.
    if (typeof Element === 'undefined' || !(Element instanceof Object)) {
        return;
    }

    if (!(target instanceof getWindowOf(target).Element)) {
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

    if (!(target instanceof getWindowOf(target).Element)) {
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
var observers = typeof WeakMap !== 'undefined' ? new WeakMap() : new MapShim();

/**
 * ResizeObserver API. Encapsulates the ResizeObserver SPI implementation
 * exposing only those methods and properties that are defined in the spec.
 */
var ResizeObserver = function (callback) {
    if (!(this instanceof ResizeObserver)) {
        throw new TypeError('Cannot call a class as a function.');
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
    ResizeObserver.prototype[method] = function () {
        return (ref = observers.get(this))[method].apply(ref, arguments);
        var ref;
    };
});

var index = function () {
    // Export existing implementation if available.
    if (typeof global$1$1.ResizeObserver !== 'undefined') {
        return global$1$1.ResizeObserver;
    }

    return ResizeObserver;
}();

var fastdom = createCommonjsModule(function (module) {
  !function (win) {

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

    var debug = function () {};

    /**
     * Normalized rAF
     *
     * @type {Function}
     */
    var raf = win.requestAnimationFrame || win.webkitRequestAnimationFrame || win.mozRequestAnimationFrame || win.msRequestAnimationFrame || function (cb) {
      return setTimeout(cb, 16);
    };

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
      
    }

    FastDom.prototype = {
      constructor: FastDom,

      /**
       * Adds a job to the read batch and
       * schedules a new frame if need be.
       *
       * @param  {Function} fn
       * @param  {Object} ctx the context to be bound to `fn` (optional).
       * @public
       */
      measure: function (fn, ctx) {
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
       * @param  {Object} ctx the context to be bound to `fn` (optional).
       * @public
       */
      mutate: function (fn, ctx) {
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
      clear: function (task) {
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
      extend: function (props) {
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
      var writes = fastdom.writes;
      var reads = fastdom.reads;
      var error;

      try {
        debug('flushing reads', reads.length);
        runTasks(reads);
        debug('flushing writes', writes.length);
        runTasks(writes);
      } catch (e) {
        error = e;
      }

      fastdom.scheduled = false;

      // If the batch errored we may still have tasks queued
      if (reads.length || writes.length) scheduleFlush(fastdom);

      if (error) {
        debug('task errored', error.message);
        if (fastdom.catch) fastdom.catch(error);else throw error;
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
      var task;while (task = tasks.shift()) task();
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
    var exports = win.fastdom = win.fastdom || new FastDom(); // jshint ignore:line

    // Expose to CJS & AMD
    if (typeof undefined == 'function') undefined(function () {
      return exports;
    });else module.exports = exports;
  }(typeof window !== 'undefined' ? window : commonjsGlobal);
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

var QuickVis = function () {
    // creates a dom element for the vis to live in
    // optionally pass in data to render
    // NOTE: don't manipulate the DOM from here
    function QuickVis(data, tag, template, className, config) {
        _classCallCheck(this, QuickVis);

        // wrapper el
        this.el = document.createElement(tag || "div");
        this.el.classList.add("quickvis");
        if (className) {
            this.el.classList.add(className);
        }
        // resize listener
        this._resizeObserve();
        // content template
        this.template = template || function (vm) {
            return "<strong>hi</strong>";
        };
        this.rendered = false;
        // do something!
        this._update(data, config);
    }

    _createClass(QuickVis, [{
        key: "_resizeObserve",
        value: function _resizeObserve() {
            var _this = this;

            this.contentRect = {};
            this.observer = new index(function (entries, observer) {
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = _getIterator(entries), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var entry = _step.value;

                        if (entry.target === _this.el) {
                            var oldW = _this.contentRect.width;
                            var oldH = _this.contentRect.height;
                            var newW = entry.contentRect.width;
                            var newH = entry.contentRect.height;
                            // check if width or height have changed
                            if (oldW !== newW || oldH !== newH) {
                                _this._onResize(entry.contentRect);
                            }
                            _this.contentRect = entry.contentRect;
                        }
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return) {
                            _iterator.return();
                        }
                    } finally {
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }
            });
            this.observer.observe(this.el);
        }
    }, {
        key: "_onResize",
        value: function _onResize(newSize) {
            // console.log(`resize: old w: ${this.contentRect.width}, h: ${this.contentRect.height}; new w: ${newSize.width}, h: ${newSize.height}`);
            // TODO - debounce render probably
            this._render();
        }

        // do some work with incoming data
        // NOTE: override this as needed
        // NOTE: don't manipulate the DOM from here

    }, {
        key: "_update",
        value: function _update(data, config) {
            this.data = data;
            this.config = config;
            // TODO - conditionally render?
            this._render();
        }

        // NOTE: override this as needed
        // NOTE: do all your DOM work here, but nowhere
        // else!

    }, {
        key: "_render",
        value: function _render() {
            var _this2 = this;

            this.rendered = false;
            var htmlStr = this.template(this);
            // TODO - provide a cleanup function before
            // re-render blows away the old dom els
            return this.insert(htmlStr).then(function () {
                _this2.rendered = true;
            });
        }

        // DOM helpers to prevent thrashing

    }, {
        key: "insert",
        value: function insert(htmlStr) {
            var _this3 = this;

            return new _Promise(function (resolve, reject) {
                fastdom.mutate(function () {
                    _this3.el.innerHTML = htmlStr;
                    resolve();
                });
            });
        }
    }, {
        key: "measure",
        value: function measure(el) {
            return new _Promise(function (resolve, reject) {
                fastdom.measure(function () {
                    var bb = el.getBoundingClientRect();
                    resolve(bb);
                });
            });
        }
    }]);

    return QuickVis;
}();

// from https://github.com/mapbox/simple-linear-scaleA
// TODO - check license for this function

function linearScale(domain, range, clamp) {
    return function (value) {
        if (domain[0] === domain[1] || range[0] === range[1]) {
            return range[0];
        }
        var ratio = (range[1] - range[0]) / (domain[1] - domain[0]),
            result = range[0] + ratio * (value - domain[0]);
        return clamp ? Math.min(range[1], Math.max(range[0], result)) : result;
    };
}

// http://stackoverflow.com/a/37411738
function createSVGNode(n, v) {
    n = document.createElementNS("http://www.w3.org/2000/svg", n);
    for (var p in v) {
        n.setAttributeNS(null, p.replace(/[A-Z]/g, function (m, p, o, s) {
            return "-" + m.toLowerCase();
        }), v[p]);
    }
    return n;
}

var SYMBOLS = {
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
var DEFAULT_MAX_FLOAT_PRECISION = 2;

function toEng(val, preferredUnit) {
    var width = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : DEFAULT_MAX_FLOAT_PRECISION;
    var base = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1000;

    var sign = val < 0 ? -1 : 1;
    val = Math.abs(val);

    var result = void 0,
        unit = void 0,
        symbol = void 0;

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
    sign * shortenNumber(result, width), symbol];
}

// attempts to make a long floating point number
// fit in `length` characters. It will trim the
// fractional part of the number, but never the
// whole part of the number
// NOTE - does not round the number! it just chops it off
function shortenNumber(num) {
    var targetLength = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : DEFAULT_MAX_FLOAT_PRECISION;

    var numStr = num.toString(),
        parts = numStr.split("."),
        whole = parts[0],
        fractional = parts[1] || "",
        sign = "";

    // if negative, slice off the minus sign
    // so that we can count the number of digits
    if (whole[0] === "-") {
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
function getFormattedNumber(val) {
    var result = void 0;

    // if this number is a float, attempt
    // to shorten it
    if (Math.abs(val) < 1) {
        result = [shortenNumber(val), ""];
    } else {
        result = toEng(val);
    }

    return result;
}

// given an array of values, attempts to create an array of length
// maxLength by applying downsampleFunction to each slice
// of values
function downsampleData(data, maxLength, downsampleFn) {
    var length = data.length;
    var max = Math.min(length, maxLength);
    var count = Math.floor(length / max);

    var downsampled = [];
    for (var i = 0; i < max; i++) {
        var start = i * count;
        var end = (i + 1) * count;
        if (end > length) {
            end = length;
        }
        var slice = data.slice(start, end);
        var val = downsampleFn(slice);
        downsampled.push(val);
    }

    return downsampled;
}
// returns either the largest number, or null
// if all values in the array are null
downsampleData.MAX = function (slice) {
    return slice.reduce(function (agg, v) {
        if (agg === null && v === null) {
            return null;
        } else if (agg === null) {
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
function template(vm) {
    return "\n        <div class=\"label\">" + vm.label + "</div>\n        <div class=\"visualization\">\n            <svg class=\"graph\"></svg>\n        </div>\n        <div class=\"last-value\">\n            <div class=\"value\" style=\"" + (vm.hideLast ? "display:none;" : "") + "\">" + vm.getFriendly(vm.last) + "</div>\n            <div class=\"magnitude\">" + vm.getMagnitude(vm.last) + "</div>\n            <div class=\"unit\">" + vm.unit + "</div>\n        </div>\n        <div class=\"indicator " + vm.getIndicatorStatus() + "\"></div>\n    ";
}

var SPARKLINE_PADDING = 4;
var SPARKLINE_DATA_PADDING = 1;
var FOCUSLINE_WIDTH = 2;

var defaultConfig = {
    label: "",
    style: "line",
    threshold: Infinity,
    template: template,
    unit: "B"
};

var Sparkline = function (_QuickVis) {
    _inherits(Sparkline, _QuickVis);

    // setup configuration related thingies
    function Sparkline(data, config) {
        _classCallCheck(this, Sparkline);

        return _possibleConstructorReturn(this, (Sparkline.__proto__ || _Object$getPrototypeOf(Sparkline)).call(this, data, "div", template, "sparkline", config));
    }

    // update the model data and generate new data as
    // needed from the model data. Do not modify the model,
    // and if new data is needed, be sure its actual data
    // and not just view-related stuff (like text formatting)


    _createClass(Sparkline, [{
        key: "_update",
        value: function _update(data, config) {
            if (!data || !data.length) {
                throw new Error("cannot create sparkline from empty data");
            }

            this.data = data || [];
            this.last = data[data.length - 1];

            // dont let undefined value override default
            if (config.threshold === undefined) {
                delete config.threshold;
            }
            config = _Object$assign({}, defaultConfig, config);
            this.label = config.label;
            this.forceThreshold = config.forceThreshold;
            this.style = config.style;
            this.unit = config.unit;
            this.hideLast = config.hideLast;
            this.showLastPoint = config.showLastPoint;

            if (config.threshold !== undefined) {
                this.threshold = config.threshold;
            }
            this.config = config;
        }

        /*******************
         * rendering and drawing functions are the only place
         * that it is ok to touch the dom!
         */

    }, {
        key: "_render",
        value: function () {
            var _ref = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee() {
                var bb;
                return regenerator.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.next = 2;
                                return _get(Sparkline.prototype.__proto__ || _Object$getPrototypeOf(Sparkline.prototype), "_render", this).call(this);

                            case 2:

                                // we still go more renderin' to do
                                this.rendered = false;

                                this.svg = this.el.querySelector(".graph");
                                _context.next = 6;
                                return this.measure(this.svg);

                            case 6:
                                bb = _context.sent;

                                this.setScales(bb.width, bb.height);
                                this.setDrawableArea(bb.width, bb.height);

                                _context.t0 = this.style;
                                _context.next = _context.t0 === "area" ? 12 : _context.t0 === "line" ? 15 : _context.t0 === "bar" ? 18 : _context.t0 === "scatter" ? 20 : 22;
                                break;

                            case 12:
                                this.fillSparkline().drawSparkline().drawThreshold();
                                if (this.showLastPoint) {
                                    this.drawLastPoint();
                                }
                                return _context.abrupt("break", 23);

                            case 15:
                                this.drawSparkline().drawThreshold();
                                if (this.showLastPoint) {
                                    this.drawLastPoint();
                                }
                                return _context.abrupt("break", 23);

                            case 18:
                                this.drawBars().drawThreshold();
                                return _context.abrupt("break", 23);

                            case 20:
                                this.drawScatter().drawThreshold();
                                return _context.abrupt("break", 23);

                            case 22:
                                return _context.abrupt("break", 23);

                            case 23:

                                this.drawFocusLine();

                                this.rendered = true;

                            case 25:
                            case "end":
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function _render() {
                return _ref.apply(this, arguments);
            }

            return _render;
        }()

        // val should be 0-1 range. if val2 is present
        // it will focus the range rather than the point

    }, {
        key: "focus",
        value: function focus(val) {
            if (!this.rendered) {
                return;
            }

            var start = val;
            var end = void 0;
            // oooh a range
            if (Array.isArray(val)) {
                start = val[0];
                end = val[1];
                // use last value for displaying stuff
                val = end;
            }

            var pxVal = this.xScale(this.xDomain[1] * start);
            var width = FOCUSLINE_WIDTH;
            if (end !== undefined) {
                // map start and end values to start and end indices
                width = this.xScale(Math.ceil(this.data.length * end) - Math.floor(this.data.length * start));
                this.focusLine.classList.add("range");
            }
            this.focusLine.style.visibility = "visible";
            this.focusLine.setAttribute("x", pxVal);
            this.focusLine.setAttribute("width", width);

            // draw the value of the last focus point
            var lastValEl = this.el.querySelector(".value");
            var unitsEl = this.el.querySelector(".unit");
            var magnitudeEl = this.el.querySelector(".magnitude");
            var index = Math.floor(this.data.length * val);
            // TODO HACK FIX - i dunno, ya know?
            index = index === this.data.length ? index - 1 : index;
            lastValEl.innerHTML = this.getFriendly(this.data[index]);
            unitsEl.innerHTML = this.unit;
            magnitudeEl.innerHTML = this.getMagnitude(this.data[index]);

            // TODO - reevaluate threshold light
            if (this.showLastPoint) {
                var lastPointEl = this.el.querySelector(".sparkline-last-point");
                lastPointEl.style.visibility = "hidden";
            }

            var indicatorEl = this.el.querySelector(".indicator");
            var status = void 0;
            // HACK - this is copy pasta
            if (this.threshold === Infinity) {
                // if no threshold is set
                status = "off";
            } else if (this.data[index] > this.threshold) {
                // if threshold is breached
                status = "on";
            } else {
                // if threshold is safe
                status = "safe";
            }
            indicatorEl.setAttribute("class", "indicator " + status);
        }
    }, {
        key: "blur",
        value: function blur() {
            if (!this.rendered) {
                return;
            }
            this.focusLine.style.visibility = "hidden";
            this.focusLine.classList.remove("range");

            // draw the value of the last focus point
            var lastValEl = this.el.querySelector(".value");
            var unitsEl = this.el.querySelector(".unit");
            var magnitudeEl = this.el.querySelector(".magnitude");
            lastValEl.innerHTML = this.getFriendly(this.last);
            unitsEl.innerHTML = this.unit;
            magnitudeEl.innerHTML = this.getMagnitude(this.last);

            if (this.showLastPoint) {
                var lastPointEl = this.el.querySelector(".sparkline-last-point");
                lastPointEl.style.visibility = "visible";
            }

            var indicatorEl = this.el.querySelector(".indicator");
            var status = void 0;
            // HACK - this is copy pasta
            if (this.threshold === Infinity) {
                // if no threshold is set
                status = "off";
            } else if (this.last > this.threshold) {
                // if threshold is breached
                status = "on";
            } else {
                // if threshold is safe
                status = "safe";
            }
            indicatorEl.setAttribute("class", "indicator " + status);
        }

        // sets up x and y scales, with consideration to including
        // padding in the drawable area

    }, {
        key: "setScales",
        value: function setScales(width, height) {
            var dataRange = this.data;

            // if forceThreshold, add it to the dataRange
            // so that min/max will include it
            if (this.forceThreshold) {
                dataRange = dataRange.concat(this.threshold);
            }

            var min = Math.min.apply(Math, dataRange),
                max = Math.max.apply(Math, dataRange);

            this.xDomain = [0, this.data.length - 1];
            // NOTE - min and max are swappped since the 
            // 0,0 origin is upper left (aka going down on
            // y axis is actually incrementing the y value)
            this.yDomain = [max + SPARKLINE_DATA_PADDING, min - SPARKLINE_DATA_PADDING];
            this.xScale = linearScale(this.xDomain, [SPARKLINE_PADDING, width - SPARKLINE_PADDING]);
            this.yScale = linearScale(this.yDomain, [SPARKLINE_PADDING, height - SPARKLINE_PADDING]);
        }

        // creates the bounds of the drawable area of the svg
        // to prevent elements from being clipped off the edges

    }, {
        key: "setDrawableArea",
        value: function setDrawableArea(width, height) {
            if (!this.xScale || !this.yScale) {
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
    }, {
        key: "fillSparkline",
        value: function fillSparkline() {
            this.drawSparkline(true);
            return this;
        }
    }, {
        key: "drawSparkline",
        value: function drawSparkline() {
            var shaded = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
            var svg = this.svg,
                xScale = this.xScale,
                yScale = this.yScale,
                _drawableArea = this.drawableArea,
                x1 = _drawableArea.x1,
                y1 = _drawableArea.y1,
                x2 = _drawableArea.x2,
                y2 = _drawableArea.y2,
                d = [];


            if (shaded) {
                d.push("M" + x1 + "," + y2);
                d.push("L" + x1 + "," + y1);
            } else {
                //d.push(`M${x1},${y2}`);
                d.push("M" + x1 + "," + yScale(this.data[0]));
            }
            this.data.forEach(function (dp, i) {
                d.push("L" + xScale(i) + "," + yScale(dp));
            });
            if (shaded) {
                d.push("L" + x2 + "," + y2);
            }

            svg.appendChild(createSVGNode("path", {
                d: d.join(" "),
                class: "sparkline-path" + (shaded ? " shaded" : "")
            }));
            return this;
        }
    }, {
        key: "drawBars",
        value: function drawBars() {
            var _this2 = this;

            var BAR_PADDING = 2;
            var svg = this.svg,
                xScale = this.xScale,
                _drawableArea2 = this.drawableArea,
                y2 = _drawableArea2.y2,
                width = _drawableArea2.width,
                barWidth = width / this.data.length - BAR_PADDING,
                offsetLeft = xScale(0);


            this.data.forEach(function (dp, i) {
                var barDiff = _this2.yScale(dp),
                    barHeight = Math.ceil(y2 - barDiff) || 1;
                svg.appendChild(createSVGNode("rect", {
                    // TODO - dont apply padding to last item
                    x: offsetLeft + (barWidth + BAR_PADDING) * i,
                    y: y2 - barHeight,
                    width: barWidth,
                    height: barHeight,
                    class: "sparkline-bar" + (dp > _this2.threshold ? " bad" : "")
                }));
            });
            return this;
        }
    }, {
        key: "drawScatter",
        value: function drawScatter() {
            var _this3 = this;

            var svg = this.svg;


            this.data.forEach(function (dp, i) {
                svg.appendChild(createSVGNode("circle", {
                    cx: _this3.xScale(i),
                    cy: _this3.yScale(dp),
                    r: 4,
                    class: "sparkline-scatter" + (dp > _this3.threshold ? " bad" : "")
                }));
            });
            return this;
        }
    }, {
        key: "drawThreshold",
        value: function drawThreshold() {
            if (this.threshold === Infinity) {
                return this;
            }

            var svg = this.svg,
                yScale = this.yScale,
                _drawableArea3 = this.drawableArea,
                x1 = _drawableArea3.x1,
                x2 = _drawableArea3.x2;

            svg.appendChild(createSVGNode("line", {
                x1: x1,
                y1: yScale(this.threshold),
                x2: x2,
                y2: yScale(this.threshold),
                class: "sparkline-threshold"
            }));
            return this;
        }
    }, {
        key: "drawFocusLine",
        value: function drawFocusLine() {
            var svg = this.svg,
                _drawableArea4 = this.drawableArea,
                y1 = _drawableArea4.y1,
                y2 = _drawableArea4.y2;

            var focusLineEl = createSVGNode("rect", {
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
    }, {
        key: "drawLastPoint",
        value: function drawLastPoint() {
            var svg = this.svg,
                xScale = this.xScale,
                yScale = this.yScale,
                x = this.data.length - 1,
                y = this.data[this.data.length - 1];

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

    }, {
        key: "getFriendly",
        value: function getFriendly(val) {
            if (val === null) {
                return "";
            }
            return getFormattedNumber(val)[0];
        }
    }, {
        key: "getMagnitude",
        value: function getMagnitude(val) {
            if (val === null) {
                return "";
            }
            return getFormattedNumber(val)[1];
        }
    }, {
        key: "lastExceedsThreshold",
        value: function lastExceedsThreshold() {
            return this.last > this.threshold;
        }
    }, {
        key: "getIndicatorStatus",
        value: function getIndicatorStatus() {
            if (this.threshold === Infinity) {
                // if no threshold is set
                return "off";
            } else if (this.lastExceedsThreshold()) {
                // if threshold is breached
                return "on";
            } else {
                // if threshold is safe
                return "safe";
            }
        }
    }]);

    return Sparkline;
}(QuickVis);

/*global console: true */
var COLOR_PALETTE_LENGTH = 10;

function stackedBarTemplate(vm) {
    return "\n        <div class=\"stacked-wrapper\">\n            <div class=\"name\">" + vm.label + "</div>\n            <div class=\"bars\">\n                " + vm.data.map(function (bar) {
        return barTemplate(vm, bar);
    }).join("") + "\n\n                <!-- empty bar for free space -->\n                " + (vm.free ? barTemplate(vm, { name: "Free", val: vm.free }) : "") + "\n\n                " + (vm.threshold !== Infinity ? "<div class=\"threshold\" style=\"left: " + vm.getThresholdPosition() + "%;\"></div>" : "") + "\n\n            </div>\n            <div class=\"stacked-footer\">\n                " + (vm.originalCapacity ? "\n                    <div class=\"used\">Used: <strong>" + vm.getFormattedNumber(vm.used) + vm.unit + "</strong></div>\n                    <div class=\"free\">Free: <strong>" + vm.getFormattedNumber(vm.free) + vm.unit + "</strong></div>" : "") + "\n                <div class=\"total\">Total: <strong>" + vm.getFormattedNumber(vm.capacity) + vm.unit + "</strong></div>\n            </div>\n        </div>\n\n        <div class=\"indicator " + vm.getIndicatorStatus() + "\"></div>\n    ";
}

function barTemplate(vm, bar) {
    var name = bar.name,
        val = bar.val;

    if (!name) {
        name = "";
    }

    return "\n        <div class=\"bar " + vm.getColorClass(bar) + " " + (name === "Free" ? "free" : "") + "\"\n                style=\"flex: " + val + " 0 0;\"\n                title=\"" + vm.getTitle(name, val) + "\">\n            <div class=\"bar-label\">\n                <!-- this is a hack to cause labels that are\n                    too long to not appear at all. text-overflow\n                    ellipsis is not sufficient here -->\n                &#8203; " + name.replace(" ", "&nbsp;") + "\n            </div>\n        </div>\n    ";
}

var defaultConfig$1 = {
    template: stackedBarTemplate,
    label: "",
    unit: "B",
    threshold: Infinity
};

var StackedBar = function (_QuickVis) {
    _inherits(StackedBar, _QuickVis);

    function StackedBar(data, config) {
        _classCallCheck(this, StackedBar);

        return _possibleConstructorReturn(this, (StackedBar.__proto__ || _Object$getPrototypeOf(StackedBar)).call(this, data, "div", stackedBarTemplate, "stacked-bar", config));
    }

    _createClass(StackedBar, [{
        key: "_update",
        value: function _update(data, config) {
            if (!data) {
                throw new Error("cannot create stacked bar from empty data");
            }

            this.data = data;
            this.used = this.data.reduce(function (acc, d) {
                return d.val + acc;
            }, 0);

            config = _Object$assign({}, defaultConfig$1, config);
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

            var free = this.capacity - this.used;
            this.free = free >= 0 ? free : 0;
            this._render();
        }
    }, {
        key: "validateCapacity",
        value: function validateCapacity() {
            // if no capacity was set, set it
            if (!this.capacity) {
                this.capacity = this.used;
            }

            // if the total used value exceeds capacity, set
            // the capacity to the total used value.
            // aka: raise the roof
            if (this.used > this.capacity) {
                console.warn("StackedBar used (" + getFormattedNumber(this.used).join("") + ") " + "exceeds specified capacity (" + getFormattedNumber(this.capacity).join("") + ") " + "by " + getFormattedNumber(this.used - this.capacity).join(""));
                this.capacity = this.used;
            }
        }
    }, {
        key: "validateThreshold",
        value: function validateThreshold() {
            if (this.threshold === Infinity) {
                // no threshold was set
                return;
            }
            if (this.threshold > this.capacity) {
                console.warn("StackedBar threshold (" + getFormattedNumber(this.threshold).join("") + ") " + "exceeds specified capacity (" + getFormattedNumber(this.capacity).join("") + ") " + "so it is being ignored");
                this.threshold = Infinity;
                return;
            }
        }
    }, {
        key: "getColorClass",
        value: function getColorClass(bar) {
            // empty bar for free space
            if (bar.name === "Free") {
                return "bar-color-none";
            } else {
                // TODO - other color palettes?
                return "bar-color-" + this.getIndexOf(bar) % COLOR_PALETTE_LENGTH;
            }
        }
    }, {
        key: "getIndexOf",
        value: function getIndexOf(bar) {
            return this.data.indexOf(bar);
        }
    }, {
        key: "getFormattedNumber",
        value: function getFormattedNumber$$1(val) {
            if (val === null) {
                return "";
            }
            return getFormattedNumber(val).join("");
        }

        // if a threshold is set and the used exceeds
        // it, return true

    }, {
        key: "exceedsThreshold",
        value: function exceedsThreshold() {
            return !!(this.threshold && this.used > this.threshold);
        }
    }, {
        key: "getIndicatorStatus",
        value: function getIndicatorStatus() {
            if (this.threshold === Infinity) {
                // if no threshold is set
                return "off";
            } else if (this.exceedsThreshold()) {
                // if threshold is breached
                return "on";
            } else {
                // if threshold is safe
                return "safe";
            }
        }

        // get percent position of threshold indicator
        // NOTE - assumes threshold and capacity

    }, {
        key: "getThresholdPosition",
        value: function getThresholdPosition() {
            return this.threshold / this.capacity * 100;
        }
    }, {
        key: "getTitle",
        value: function getTitle(name, val) {
            var formatted = this.getFormattedNumber(val) + this.unit;
            if (name) {
                return name + ": " + formatted;
            } else {
                return formatted;
            }
        }
    }]);

    return StackedBar;
}(QuickVis);

/*global console: true */
function template$1(vm) {
    return "\n        <div class=\"label\">" + vm.label + "</div>\n        <div class=\"visualization\">\n            <div class=\"bars\">\n                <div class=\"bar\" style=\"flex: " + vm.getFocusedVal() + " 0 0;\" title=\"" + vm.getTitle(name, vm.getFocusedVal()) + "\"></div>\n                <div class=\"bar bar-free\" style=\"flex: " + vm.getFreeVal() + " 0 0;\" title=\"" + vm.getFreeVal() + " Free\"></div>\n                " + (vm.threshold !== Infinity ? "<div class=\"threshold\" style=\"left: " + vm.getThresholdPosition() + "%;\"></div>" : "") + "\n            </div>\n\n        </div>\n        <div class=\"last-value\">\n            <div class=\"value\">" + vm.getFocusedVal() + "</div>\n            <div class=\"magnitude\">" + vm.getFocusedMagnitude() + "</div>\n            <div class=\"unit\">" + vm.unit + "</div>\n        </div>\n\n        <div class=\"indicator " + vm.getIndicatorStatus() + "\"></div>\n    ";
}

var defaultConfig$2 = {
    label: "",
    unit: "B",
    threshold: Infinity
};

var Bar = function (_QuickVis) {
    _inherits(Bar, _QuickVis);

    function Bar(data, config) {
        _classCallCheck(this, Bar);

        return _possibleConstructorReturn(this, (Bar.__proto__ || _Object$getPrototypeOf(Bar)).call(this, data, "div", template$1, "simple-bar", config));
    }

    _createClass(Bar, [{
        key: "_update",
        value: function _update(data, config) {
            if (!data) {
                throw new Error("cannot create bar from empty data");
            }

            if (!Array.isArray(data)) {
                data = [data];
            }
            this.data = data;
            this.focused = this.data.length - 1;

            config = _Object$assign({}, defaultConfig$2, config);
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
    }, {
        key: "focus",
        value: function focus(val) {
            var end = void 0;
            // oooh a range
            if (Array.isArray(val)) {
                end = val[1];
                // use last value for displaying stuff
                val = end;
            }

            var pos = Math.floor(this.data.length * val);
            this.focused = pos;
            this._render();
        }
    }, {
        key: "blur",
        value: function blur() {
            this.focused = this.data.length - 1;
        }
    }, {
        key: "validateThreshold",
        value: function validateThreshold() {
            if (this.threshold === Infinity) {
                // no threshold was set
                return;
            }
            if (this.threshold > this.capacity) {
                console.warn("threshold exceeds capacity you silly person");
                this.threshold = Infinity;
            }
        }

        // if a threshold is set and the used exceeds
        // it, return true

    }, {
        key: "exceedsThreshold",
        value: function exceedsThreshold() {
            return !!(this.threshold && this.getFocusedRaw() > this.threshold);
        }
    }, {
        key: "getFocusedRaw",
        value: function getFocusedRaw() {
            return this.data[this.focused];
        }
    }, {
        key: "getFocusedVal",
        value: function getFocusedVal() {
            return getFormattedNumber(this.getFocusedRaw())[0];
        }
    }, {
        key: "getFocusedMagnitude",
        value: function getFocusedMagnitude() {
            return getFormattedNumber(this.getFocusedRaw())[1];
        }
    }, {
        key: "getFreeVal",
        value: function getFreeVal() {
            // TODO - ensure non-negative
            // TODO - format
            return this.capacity - this.getFocusedRaw();
        }
    }, {
        key: "getIndicatorStatus",
        value: function getIndicatorStatus() {
            if (this.threshold === Infinity) {
                // if no threshold is set
                return "off";
            } else if (this.exceedsThreshold()) {
                // if threshold is breached
                return "on";
            } else {
                // if threshold is safe
                return "";
            }
        }

        // get percent position of threshold indicator
        // NOTE - assumes threshold and capacity

    }, {
        key: "getThresholdPosition",
        value: function getThresholdPosition() {
            return this.threshold / this.capacity * 100;
        }
    }, {
        key: "getTitle",
        value: function getTitle(name, val) {
            var formatted = getFormattedNumber(this.getFocusedRaw()).join("") + this.unit;
            if (name) {
                return name + ": " + formatted;
            } else {
                return formatted;
            }
        }
    }]);

    return Bar;
}(QuickVis);

var _createProperty = function (object, index, value) {
  if (index in object) _objectDp.f(object, index, _propertyDesc(0, value));else object[index] = value;
};

_export(_export.S + _export.F * !_iterDetect(function (iter) {
  
}), 'Array', {
  // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
  from: function from(arrayLike /* , mapfn = undefined, thisArg = undefined */) {
    var O = _toObject(arrayLike);
    var C = typeof this == 'function' ? this : Array;
    var aLen = arguments.length;
    var mapfn = aLen > 1 ? arguments[1] : undefined;
    var mapping = mapfn !== undefined;
    var index = 0;
    var iterFn = core_getIteratorMethod(O);
    var length, result, step, iterator;
    if (mapping) mapfn = _ctx(mapfn, aLen > 2 ? arguments[2] : undefined, 2);
    // if object isn't iterable or it's array with default iterator - use simple case
    if (iterFn != undefined && !(C == Array && _isArrayIter(iterFn))) {
      for (iterator = iterFn.call(O), result = new C(); !(step = iterator.next()).done; index++) {
        _createProperty(result, index, mapping ? _iterCall(iterator, mapfn, [step.value, index], true) : step.value);
      }
    } else {
      length = _toLength(O.length);
      for (result = new C(length); length > index; index++) {
        _createProperty(result, index, mapping ? mapfn(O[index], index) : O[index]);
      }
    }
    result.length = index;
    return result;
  }
});

var from = _core.Array.from;

var from$2 = createCommonjsModule(function (module) {
  module.exports = { "default": from, __esModule: true };
});

var _Array$from = unwrapExports(from$2);

var toConsumableArray = createCommonjsModule(function (module, exports) {
  exports.__esModule = true;

  var _from2 = _interopRequireDefault(from$2);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }

  exports.default = function (arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
        arr2[i] = arr[i];
      }

      return arr2;
    } else {
      return (0, _from2.default)(arr);
    }
  };
});

var _toConsumableArray = unwrapExports(toConsumableArray);

var ITERATOR$4 = _wks('iterator');

var core_isIterable = _core.isIterable = function (it) {
  var O = Object(it);
  return O[ITERATOR$4] !== undefined || '@@iterator' in O
  // eslint-disable-next-line no-prototype-builtins
  || _iterators.hasOwnProperty(_classof(O));
};

var isIterable = core_isIterable;

var isIterable$2 = createCommonjsModule(function (module) {
  module.exports = { "default": isIterable, __esModule: true };
});

unwrapExports(isIterable$2);

var slicedToArray = createCommonjsModule(function (module, exports) {
  exports.__esModule = true;

  var _isIterable3 = _interopRequireDefault(isIterable$2);

  var _getIterator3 = _interopRequireDefault(getIterator$2);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }

  exports.default = function () {
    function sliceIterator(arr, i) {
      var _arr = [];
      var _n = true;
      var _d = false;
      var _e = undefined;

      try {
        for (var _i = (0, _getIterator3.default)(arr), _s; !(_n = (_s = _i.next()).done); _n = true) {
          _arr.push(_s.value);

          if (i && _arr.length === i) break;
        }
      } catch (err) {
        _d = true;
        _e = err;
      } finally {
        try {
          if (!_n && _i["return"]) _i["return"]();
        } finally {
          if (_d) throw _e;
        }
      }

      return _arr;
    }

    return function (arr, i) {
      if (Array.isArray(arr)) {
        return arr;
      } else if ((0, _isIterable3.default)(Object(arr))) {
        return sliceIterator(arr, i);
      } else {
        throw new TypeError("Invalid attempt to destructure non-iterable instance");
      }
    };
  }();
});

var _slicedToArray = unwrapExports(slicedToArray);

/*global console: true */
function winLossTemplate(vm) {
    return "\n        <div class=\"label\">" + vm.label + "</div>\n        <div class=\"visualization\">\n            <div class=\"topsies\">\n                " + vm.data.map(function (dp) {
        return vm.winLoseOrDraw(dp);
    }).map(function (wld) {
        return wld === 1 ? true : false;
    }).map(function (marked) {
        return "<div class=\"winloss-block " + (marked ? "marked" : "") + "\"></div>";
    }).join("") + "\n            </div>\n            <div class=\"bottomsies\">\n                " + vm.data.map(function (dp) {
        return vm.winLoseOrDraw(dp);
    }).map(function (wld) {
        return wld === -1 ? true : false;
    }).map(function (marked) {
        return "<div class=\"winloss-block " + (marked ? "marked" : "") + "\"></div>";
    }).join("") + "\n            </div>\n        </div>\n        <div class=\"last-value\" " + (vm.hideWinPercent ? 'style="display:none;"' : "") + ">\n            <div class=\"value\">" + vm.getWinPercent() + "</div>\n            <div class=\"unit\">%</div>\n            <div class=\"magnitude\"></div>\n        </div>\n        <div class=\"indicator " + (vm.lastIsBad() ? "on" : "") + "\"></div>\n    ";
}

var defaultConfig$3 = {
    template: winLossTemplate,
    label: "",
    hideWinPercent: false,
    tickCount: 0,
    downsampleFn: downsampleData.MAX
};

var WinLoss = function (_QuickVis) {
    _inherits(WinLoss, _QuickVis);

    function WinLoss(data, config) {
        _classCallCheck(this, WinLoss);

        return _possibleConstructorReturn(this, (WinLoss.__proto__ || _Object$getPrototypeOf(WinLoss)).call(this, data, "div", winLossTemplate, "win-loss", config));
    }

    _createClass(WinLoss, [{
        key: "_update",
        value: function _update(data, config) {
            var _this2 = this;

            if (!data || !data.length) {
                throw new Error("cannot create graph bar from empty data");
            }

            config = _Object$assign({}, defaultConfig$3, config);
            this.config = config;
            this.label = config.label;
            this.hideWinPercent = config.hideWinPercent;
            this.tickCount = config.tickCount || data.length;
            this.downsampleFn = config.downsampleFn;

            this.data = downsampleData(data, this.tickCount, this.downsampleFn);

            var _data$reduce = this.data.reduce(function (acc, dp) {
                var wld = _this2.winLoseOrDraw(dp);
                // if its a draw, dont increment nothin'
                if (wld === 0) {
                    return acc;
                }

                // increment total
                acc[0] += 1;

                // increment wins
                if (wld === 1) {
                    acc[1]++;
                }
                // increment losses
                if (wld === -1) {
                    acc[2]++;
                }
                return acc;
            }, [0, 0, 0]),
                _data$reduce2 = _slicedToArray(_data$reduce, 2),
                total = _data$reduce2[0],
                win = _data$reduce2[1];

            this.winPercent = win / total * 100;
        }
    }, {
        key: "getFormattedNumber",
        value: function getFormattedNumber$$1(val) {
            return getFormattedNumber(val).join("");
        }
    }, {
        key: "getLast",
        value: function getLast() {
            if (this.data) {
                return this.data.slice(-1)[0];
            }
            return null;
        }
    }, {
        key: "lastIsBad",
        value: function lastIsBad() {
            var last = this.getLast();
            if (last || last === null) {
                return false;
            } else {
                return true;
            }
        }
    }, {
        key: "winLoseOrDraw",
        value: function winLoseOrDraw(val) {
            if (val === undefined || val === null) {
                return 0;
            } else if (val) {
                return 1;
            } else {
                return -1;
            }
        }
    }, {
        key: "getWinPercent",
        value: function getWinPercent() {
            return Math.floor(this.winPercent);
        }
    }, {
        key: "focus",
        value: function focus(val) {
            if (this.data && this.rendered) {
                var start = val;
                var end = void 0;
                // oooh a range
                if (Array.isArray(val)) {
                    start = val[0];
                    end = val[1];
                    // use last value for displaying stuff
                    val = end;
                }

                var pos = Math.floor(this.data.length * val);
                // TODO HACK FIX - i dunno, ya know?
                pos = pos === this.data.length ? pos - 1 : pos;
                this.blur();
                this.el.classList.add("focused");

                // this.el.querySelector(`.topsies .winloss-block:nth-child(${pos+1})`).classList.add("focused");
                // this.el.querySelector(`.bottomsies .winloss-block:nth-child(${pos+1})`).classList.add("focused");
                var topEls = _Array$from(this.el.querySelectorAll(".topsies .winloss-block"));
                var bottomEls = _Array$from(this.el.querySelectorAll(".bottomsies .winloss-block"));
                if (!topEls || !bottomEls) {
                    // things arent rendered, or no data or *something*
                    return;
                }
                var focusEls = [topEls[pos], bottomEls[pos]];

                // if this should affect a range
                if (end) {
                    var startPos = Math.floor(this.data.length * start);
                    // TODO HACK FIX - i dunno, ya know?
                    startPos = startPos === this.data.length ? startPos - 1 : startPos;
                    focusEls = [].concat(_toConsumableArray(topEls.slice(startPos, pos)), _toConsumableArray(bottomEls.slice(startPos, pos)));
                }

                focusEls.forEach(function (el) {
                    return el.classList.add("focused");
                });

                var indicatorEl = this.el.querySelector(".indicator");
                // LOOK im just trying to get this demo out. this code can all
                // burn in hell after this
                var last = this.data[Math.floor(this.data.length * val)];
                var status = "";
                // HACK - this is copy pasta
                if (!last && last !== null) {
                    status = "on";
                }
                indicatorEl.setAttribute("class", "indicator " + status);
            }
        }
    }, {
        key: "blur",
        value: function blur() {
            var nodes = this.el.querySelectorAll(".winloss-block.focused");
            var els = _Array$from(nodes);
            els.forEach(function (el) {
                return el.classList.remove("focused");
            });
            this.el.classList.remove("focused");

            var indicatorEl = this.el.querySelector(".indicator");
            if (indicatorEl) {
                var status = this.lastIsBad() ? "on" : "";
                indicatorEl.setAttribute("class", "indicator " + status);
            }
        }
    }]);

    return WinLoss;
}(QuickVis);

var VisGrid = function () {
    function VisGrid(config) {
        var _this = this;

        _classCallCheck(this, VisGrid);

        this.el = document.createElement("div");
        this.el.classList.add("quickvis");
        this.el.classList.add("vis-grid");

        this.vis = config.vis;
        // attach each vis to this grid
        fastdom.mutate(function () {
            _this.vis.forEach(function (v) {
                _this.el.appendChild(v.el);
                v._render();
            });
        });
    }

    _createClass(VisGrid, [{
        key: "focus",
        value: function focus(val) {
            this.vis.forEach(function (v) {
                v.focus(val);
            });
        }
    }, {
        key: "blur",
        value: function blur() {
            this.vis.forEach(function (v) {
                v.blur();
            });
        }
    }]);

    return VisGrid;
}();

var quickvis = {
    Sparkline: Sparkline,
    StackedBar: StackedBar,
    WinLoss: WinLoss,
    Bar: Bar,
    VisGrid: VisGrid
};

(function(){
    var styleEl = document.createElement("style");
    styleEl.type = "text/css";
    styleEl.appendChild(document.createTextNode('.vbox{display:flex;flex-direction:column}.hbox{display:flex;flex-direction:row}.quickvis .label{color:#888;font-size:1.2rem;flex-basis:100%}.quickvis .visualization{height:2em}.quickvis .last-value{font-size:2em;display:flex;flex-direction:row}.quickvis .last-value .value{font-size:1em;color:#555}.quickvis .last-value .unit{font-size:0.9em;color:#AAA}.quickvis .last-value .magnitude{font-size:0.9em;color:#AAA}.quickvis .indicator:after{font-size:2rem;content:"○";color:#CCC}.quickvis .indicator.off:after{display:none}.quickvis .indicator.on:after{color:#9C1200;content:"●"}.stacked-bar{position:relative}.stacked-bar .stacked-wrapper{display:flex;flex-direction:column;color:#555;margin-right:25px}.stacked-bar .name{font-size:1.3em;margin-bottom:2px}.stacked-bar .bars{display:flex;height:30px;position:relative;border:solid #999 1px;background-color:#EEE}.stacked-bar .bars .bar-color-none{background-color:transparent !important}.stacked-bar .bars .bar-color-0{background-color:#6A95A9 !important}.stacked-bar .bars .bar-color-1{background-color:#314F5C !important}.stacked-bar .bars .bar-color-2{background-color:#8F8B3E !important}.stacked-bar .bars .bar-color-3{background-color:#A8A551 !important}.stacked-bar .bars .bar-color-4{background-color:#3A583B !important}.stacked-bar .bars .bar-color-5{background-color:#5CA45E !important}.stacked-bar .bars .bar-color-6{background-color:#8B6A4E !important}.stacked-bar .bars .bar-color-7{background-color:#A48164 !important}.stacked-bar .bars .bar-color-8{background-color:#A44C73 !important}.stacked-bar .bars .bar-color-9{background-color:#572038 !important}.stacked-bar .bars .bar{background-color:#555;color:#EEE;font-weight:bold;font-size:0.9em;cursor:default;overflow:hidden;line-height:30px}.stacked-bar .bar .bar-label{margin:0 4px}.stacked-bar .bars .threshold{position:absolute;left:0;top:-6px;height:40px;background-color:white;border-left:dashed #555 2px}.stacked-bar .stacked-footer{font-size:0.8em;display:flex;padding-top:2px}.stacked-bar .stacked-footer .used,.stacked-bar .stacked-footer .free{margin-right:10px}.stacked-bar .stacked-footer .total{margin-left:auto}.stacked-bar .indicator{font-size:1.8em;position:absolute;bottom:30px;right:0}.stacked-bar .indicator:after{display:flex;color:transparent;content:"○";color:#CCC}.stacked-bar .indicator.off:after{display:none}.stacked-bar .indicator.on:after{color:#9C1200;content:"●"}.win-loss{display:flex;flex-direction:row;flex-wrap:wrap;align-items:center}.win-loss .label{margin-bottom:4px}.win-loss .winloss-wrap{display:flex;flex:1}.win-loss .visualization{flex:1;padding:6px 0}.win-loss .winloss{display:flex;flex-direction:column;flex:1}.win-loss .winloss-block{min-width:6px;height:100%;flex:1;margin-right:1px}.win-loss .topsies,.win-loss .bottomsies{display:flex;height:50%}.win-loss .topsies{border-bottom:dotted #888 1px}.win-loss .topsies .marked{background-color:#999}.win-loss .bottomsies .marked{background-color:#333}.win-loss .last-value{padding-right:4px}.win-loss .indicator:after{position:relative;top:-1px}.win-loss.focused .winloss-block{opacity:0.4}.win-loss.focused .winloss-block.focused{opacity:1}.simple-bar{display:flex;flex-direction:row;flex-wrap:wrap;align-items:center}.simple-bar .visualization{flex:1;margin-right:6px}.simple-bar .bars{display:flex;width:100%;position:relative;border:solid #999 1px;background-color:#EEE;height:2em}.simple-bar .bars .bar{background-color:#555;height:100%}.simple-bar .bars .bar-free{background-color:transparent !important}.simple-bar .bars .threshold{position:absolute;left:0;top:-6px;height:calc(10px + 2em);background-color:white;border-left:dotted #555 2px}.quickvis.vis-grid{display:table;width:100%}.quickvis.vis-grid .sparkline,.quickvis.vis-grid .win-loss,.quickvis.vis-grid .simple-bar{flex-wrap:nowrap;display:table-row}.quickvis.vis-grid .sparkline>*,.quickvis.vis-grid .win-loss>*,.quickvis.vis-grid .simple-bar>*{display:table-cell;overflow:hidden;height:20px;vertical-align:middle}.quickvis.vis-grid .sparkline .label,.quickvis.vis-grid .win-loss .label,.quickvis.vis-grid .simple-bar .label{font-size:0.9em;flex-basis:initial;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;padding-right:5px}.quickvis.vis-grid .sparkline .last-value,.quickvis.vis-grid .win-loss .last-value,.quickvis.vis-grid .simple-bar .last-value{font-size:1.2em;padding-left:5px;white-space:nowrap}.quickvis.vis-grid .sparkline .last-value>*,.quickvis.vis-grid .win-loss .last-value>*,.quickvis.vis-grid .simple-bar .last-value>*{display:inline-block}.quickvis.vis-grid .sparkline .indicator,.quickvis.vis-grid .win-loss .indicator,.quickvis.vis-grid .simple-bar .indicator{padding-left:4px}.quickvis.vis-grid .simple-bar .bars{height:10px}.quickvis.vis-grid .simple-bar .bars .threshold{top:-3px;height:15px}.sparkline{display:flex;flex-direction:row;flex-wrap:wrap;align-items:center}.sparkline .visualization{flex:1}.sparkline .graph{margin-right:6px;height:100%;width:100%}.sparkline .graph .sparkline-path{stroke:#555;stroke-width:1;fill:transparent}.sparkline .graph .sparkline-path.shaded{stroke:transparent;fill:#CCC}.sparkline .graph .sparkline-bar{stroke:transparent;fill:#AAA}.sparkline .graph .sparkline-bar.bad{fill:#9C1200}.sparkline .graph .sparkline-scatter,.sparkline .graph .sparkline-last-point{fill:#AAA}.sparkline .graph .sparkline-scatter.bad,.sparkline .graph .sparkline-last-point.bad{fill:#9C1200}.sparkline .graph .sparkline-threshold{stroke:#AAA;stroke-width:2;stroke-dasharray:2, 2;fill:transparent}.sparkline .graph .sparkline-focus{fill:black}.sparkline .graph .sparkline-focus.range{opacity:0.3}.sparkline .last-value{align-items:baseline;line-height:0.7em;letter-spacing:-1px}.sparkline .value{margin-right:2px}'));
    document.head.appendChild(styleEl);
})();

(function(){
    var {StackedBar, Sparkline, WinLoss, Bar, VisGrid} = quickvis;

    let focusables = [];

    // demo the focus line across all sparklines
    document.querySelector(".content-wrap").addEventListener("mousemove", e => {
        let x = e.pageX - e.currentTarget.offsetLeft,
            val = x / e.currentTarget.clientWidth;
        if(val < 0){
            val = 0;
        }
        // NOTE - this calculation assumes all sparklines are showing the same
        // "range" of data. It is up to the caller to pass in the right value
        focusables.forEach(s => s.focus(val));
    });
    document.querySelector(".content-wrap").addEventListener("mouseleave", e => {
        focusables.forEach(s => s.blur());
    });

    // just like, make a sparkline and attach
    // to dom el with specified index
    function attachSparky(index, config, vals){
        var sparkyEl = document.querySelectorAll(".sparky")[index];
        var sparky = new Sparkline(vals, config);
        focusables.push(sparky);
        sparkyEl.appendChild(sparky.el);
    }

    function attachStacked(index, config, vals){
        var stackedEl = document.querySelectorAll(".stacked")[index];
        var stacked = new StackedBar(vals, config);
        stackedEl.appendChild(stacked.el);
    }

    // setup webpage
    // night mode toggle
    document.querySelector(".night-toggle").addEventListener("click", function(e){
        document.body.classList.toggle("night"); 
    });

    // setup example quickvis's
    // basic sparkline
    attachSparky(0, {
        label: "Horses",
    }, [1, 4, 7, 18, 24, 98, 97, 90]);

    // more sparkline options
    attachSparky(1, {
        label: "Narwhals",
        style: "area",
        unit: "❤"
    }, [1, 4, 7, 18, 24, 98, 97, 90]);

    // large numbers
    attachSparky(2, {
        label: "Camels",
    },[916575094, 37473322, 783412004, 787777074, 957795371, 291285024, 847501582, 265160769, 71343712, 979961954]);

    // sparkline with threshold
    attachSparky(3, {
        label: "Turtles",
        style: "line",
        threshold: 50
    }, [1, 4, 7, 18, 24, 98, 97, 90]);

    // sparkline with forced threshold
    attachSparky(4, {
        label: "Ducks",
        style: "line",
        threshold: 50,
        forceThreshold: true
    }, [1, 4, 7, 18, 24, 20, 22, 23]);

    // styles
    ["line", "area", "bar", "scatter"].forEach(function(style){
        attachSparky(5, {
            label: style,
            style: style,
            threshold: 50
        }, [1, 4, 7, 18, 24, 95, 90, Math.random() * 100]);
    });

    attachStacked(0, {}, [
        { val: 20000 },
        { val: 30000 },
        { val: 1120 },
        { val: 20000 },
        { val: 105000 }
    ]);

    attachStacked(1, {
        label: "My Disk",
    }, [
        { name: "Games", val: 20000 },
        { name: "Jim", val: 30000 },
        { name: "AUTOEXEC.BAT", val: 1120 },
        { name: "Program Files", val: 20000 },
        { name: "pagefile.sys", val: 105000 }
    ]);

    attachStacked(2, {
        label: "My Disk",
        capacity: 200000
    }, [
        { name: "Games", val: 20000 },
        { name: "Jim", val: 30000 },
        { name: "AUTOEXEC.BAT", val: 1120 },
        { name: "Program Files", val: 20000 },
        { name: "pagefile.sys", val: 105000 }
    ]);

    attachStacked(3, {
        label: "My Disk",
        capacity: 200000,
        threshold: 200000 * 0.8
    }, [
        { name: "Games", val: 20000 },
        { name: "Jim", val: 30000 },
        { name: "AUTOEXEC.BAT", val: 1120 },
        { name: "Program Files", val: 20000 },
        { name: "pagefile.sys", val: 105000 }
    ]);

    var barEl = document.querySelector(".bar-wrap");
    var bar = new Bar(
        57,
        {
            label: "simple",
            capacity: 100,
            threshold: 50
        }
    );
    barEl.appendChild(bar.el);

    var barEl2 = document.querySelector(".bar2-wrap");
    var bar2 = new Bar(
        [65,63,73,82,50,41,93,63,11,57],
        {
            label: "simple",
            capacity: 100,
            threshold: 50
        }
    );
    barEl2.appendChild(bar2.el);
    focusables.push(bar2);

    // bar grids
    var gridEl = document.querySelector(".grid-wrap");
    var vis = [
        new Sparkline([98,72,6,18,18,123,95,38,1023,11], {label: "horses", threshold: 500}),
        new Sparkline([30,32,33,56,22,46,56,43,24,94], {label: "cats"}),
        new Sparkline([30,32,33,56,22,0,0,0,0,94], {label: "cat arms", style: "bar", unit: ""}),
        new WinLoss([1,1,1,1,0,0,null,null,0,0,1,1,1,0,1,1], {label: "horses2cat", tickCount: 15}),
        new WinLoss([1,1,0,0,1,0,1,1,1,1,0,1,1,0,1,1], {label: "humans", tickCount: 15}),
        new Bar([65,63,73,82,50,41,93,63,11,57], {
            label: "bear bar",
            capacity: 100,
            threshold: 75
        })
    ];
    var grid = new VisGrid({vis: vis});
    focusables.push(grid);
    gridEl.appendChild(grid.el);

    var winLossEl = document.querySelector(".win-loss-wrap");
    var data = [];
    for(let j = 0; j < 20; j++){
        let val = 1;
        if(Math.random() > 0.9){
            val = null;
        } else if(Math.random() > 0.5){
            val = 0;
        }
        data.push(val);
    }
    var wl = new WinLoss(
    [1,0,1,1,1,null,null,1,0,1,1,0,1,1],
    {
        label: "win or lose",
    });
    winLossEl.appendChild(wl.el);
    focusables.push(wl);
})();

}());
//# sourceMappingURL=app.js.map
