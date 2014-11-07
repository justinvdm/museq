museq.pulse = function() {
  function pulse(cps) {
    var ticker
    var out = sig()

    var s = sig.map(sig(cps || 0.5), function(cps) {
        if (ticker) clearInterval(ticker)
        ticker = tick(out, cps)
    })

    sig.depend(s, out)
    return out
  }


  function tick(s, cps) {
    var i = 0

    var id = setInterval(function() {
      sig.push(s, ++i)
    }, cps * 1000)

    sig.push(s, i)
    return id
  }


  return pulse
}()
