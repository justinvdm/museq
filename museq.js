
(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(["sig-js"], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory(require('sig-js'));
  } else {
    root.museq = factory(root.sig);
  }
}(this, function(sig) {

var museq = function() {
  var all = sig.all,
      reset = sig.reset,
      cleanup = sig.cleanup,
      ensure = sig.ensure,
      spread = sig.spread,
      put = sig.put,
      then = sig.then,
      map = sig.map,
      redir = sig.redir,
      isSig = sig.isSig


  var globalOrigin = +(new Date())
  var isArray = Array.isArray
  var _slice = Array.prototype.slice


  function loop(x, interval, origin) {
    interval = deflt(interval, 2)
    origin = deflt(origin, globalOrigin)

    var currX
    var out = sig()

    vv(x)
      (ensure)
      (then, function(nextX) { currX = nextX })
      (redir, out)

    vv([interval, origin])
      (all)
      (update, spread, loopTick)
      (then, function() {
        if (typeof currX != 'undefined') put(this, currX)
      })
      (redir, out)

    return out
  }


  function loopTick(interval, origin) {
    interval = interval * 1000

    return vv(nextLoop(interval, origin))
      (sleep)
      (update, function() { return tick(interval) })
      ()
  }


  function nextLoop(interval, origin) {
    origin = +origin
    var now = +(new Date())
    var i = Math.ceil((now - origin) / interval)
    var then = origin + (i * interval)
    return then - now
  }


  function seq(values, interval) {
    return vv(values)
      (ensure)
      (append, seqOnce, interval)
  }
  

  function seqOnce(values, interval) {
    interval = deflt(interval, 2)

    var i = -1
    var currValues
    var out = sig()

    vv([values, interval])
      (all)
      (update, spread, function(nextValues, interval) {
        currValues = nextValues
        interval = interval * 1000
        interval = interval / nextValues.length
        return tick(interval)
      })
      (then, function() {
        if (++i < currValues.length) put(this, currValues[i])
      })
      (redir, out)

    return out
  }


  function every(s, n, fn) {
    var i = -n
    fn = prime(slice(arguments, 3), fn)

    return map(s, function(x) {
      return ++i % n === 0
        ? fn.call(this, x)
        : x
    })
  }


  function tr(s, fn) {
    fn = prime(slice(arguments, 2), fn)

    return map(s, function(obj) {
      return isArray(obj)
        ? obj.map(fn, this)
        : fn.call(this, obj)
    })
  }


  function run(s) {
    var args = slice(arguments, 1)

    return tr(s, function(obj) {
      return typeof obj == 'function'
        ? obj.apply(this, args)
        : obj
    })
  }


  function sleep(interval) {
    var s = sig()
    var delayId = setTimeout(resolve, interval, s)

    cleanup(s, function() {
      clearInterval(delayId)
    })

    return s
  }


  function tick(interval) {
    var s = sig()
    var intervalId = setInterval(resolve, interval, s)

    cleanup(s, function() {
      clearInterval(intervalId)
    })

    resolve(s)
    return s
  }


  function append(s, fn) {
    var out = sig()
    fn = prime(slice(arguments, 2), fn || identity)

    vv(s)
      (then, function(x) {
        var t = fn(x)
        if (isSig(t)) redir(t, out)
      })
      (redir, out)

    return out
  }


  function update(s, fn) {
    var curr
    var out = sig()
    fn = prime(slice(arguments, 2), fn || identity)

    vv(s)
      (then, function(x) {
        if (curr) reset(curr)
        var t = fn(x)
        if (isSig(t)) curr = redir(t, out)
      })
      (redir, out)

    return out
  }


  function resolve(s) {
    put(s, null)
  }


  function prime(args, fn) {
    if (!args.length) return fn

    return function(x) {
      return fn.apply(this, [x].concat(args))
    }
  }


  function deflt(a, b) {
    return exists(a)
      ? a
      : b
  }


  function exists(v) {
    return typeof v != 'undefined'
        && v !== null
  }


  function slice(arr, a, b) {
    return _slice.call(arr, a, b)
  }


  function identity(x) {
    return x
  }


  function ifExists(v, fn) {
    return exists(v)
      ? fn.call(this, v)
      : v
  }


  return {
    tr: tr,
    seq: seq,
    run: run,
    loop: loop,
    every: every,
    seqOnce: seqOnce,
    update: update,
    append: append,
    ifExists: ifExists
  }
}();
museq;

return museq;

}));
