
(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(["sig-js"], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory(require('sig-js'));
  } else {
    root.museq = factory(root.sig);
  }
}(this, function(sig) {

;(function() {
  museq = {}
  museq.interval = sig.val(1000)
  museq.origin = +(new Date())


  museq.sync = function(v, origin, interval) {
    origin = origin || museq.origin
    interval = interval || museq.interval

    return sig.all([v, origin, interval])
      .update(sig.spread, function(v, origin, interval) {
        var intersection = nextIntersection(origin, interval)
        return museq.sleep(intersection).map(v)
      })
      .then(sig.val())
  }


  museq.loop = function(v, interval) {
    interval = sig.ensureVal(interval || museq.interval)

    return sig.all([v, museq.tick(interval)])
      .map(sig.spread, sig.identity)
  }


  museq.seq = function(values, interval) {
    var s = sig.ensureVal(values)
    interval = sig.ensureVal(interval || museq.interval)

    return s.append(function(values) {
      var i = -1

      return div(interval, values.length)
        .call(museq.tick)
        .each(function() {
          if (++i < values.length) this.put(values[i])
        })
    })
  }


  museq.every = function(s, n, fn) {
    var i = -n
    fn = sig.prime(sig.slice(arguments, 3), fn)

    return s.map(function(x) {
      return ++i % n === 0
        ? fn.call(this, x)
        : x
    })
  }


  museq.sleep = function(interval) {
    return sig.ensureVal(interval)
      .update(function(interval) {
        var s = sig()
        var id = setTimeout(sig.resolve, interval, s)
        s.teardown(function() { clearTimeout(id) })
        return s
      })
  }


  museq.tick = function(interval) {
    return sig.ensureVal(interval)
      .update(function(interval) {
        var s = sig()
        var id = setInterval(sig.put, interval, s)
        s.teardown(function() { clearInterval(id) })
        return s
      })
      .put()
  }


  function nextIntersection(origin, interval) {
    origin = +origin
    var now = +(new Date())
    var i = Math.ceil((now - origin) / interval)
    var then = origin + (i * interval)
    return then - now
  }


  function div(a, b) {
    return sig.all([a, b])
      .map(sig.spread, function(a, b) { return a / b })
  }


  return museq
})();

return museq;

}));
