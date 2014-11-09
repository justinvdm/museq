describe("museq.pulse", function() {
  function capture(s) {
    var values = []

    sig.map(s, function(x) {
      values.push(x)
    })

    return values
  }


  function fromNow(offset) {
    return +(new Date()) + offset
  }


  function checkPulse() {
    var checks = []

    var self = {
      at: at,
      check: check
    }

    function at(t, fn) {
      checks.push([t, fn])
      return self
    }

    function check(pulse, done) {
      var ids = []
      var values = capture(pulse)

      at(checks[checks.length - 1][0] + 1, function() {
        ids.forEach(clearTimeout)
        museq.pulse.stop(pulse)
        done()
      })

      checks.forEach(sig.spread(function(t, fn) {
        ids.push(setTimeout(fn, t, values))
      }))

      return self
    }

    return self
  }


  it("should push a new counter value each beat", function(done) {
    checkPulse()
      .at(0, function(values) {
        values.should.be.empty
      })
      .at(110, function(values) {
        values.should.deep.equal([0])
      })
      .at(210, function(values) {
        values.should.deep.equal([0, 1])
      })
      .at(310, function(values) {
        values.should.deep.equal([0, 1, 2])
      })
      .at(410, function(values) {
        values.should.deep.equal([0, 1, 2, 0])
      })
      .at(510, function(values) {
        values.should.deep.equal([0, 1, 2, 0, 1])
      })
      .at(610, function(values) {
        values.should.deep.equal([0, 1, 2, 0, 1, 2])
      })
      .check(museq.pulse(3, 0.3, fromNow(-5)), done)
  })

  it("should align pulses to a given origin timestamp", function(done) {
    checkPulse()
      .at(0, function(values) {
        values.should.be.empty
      })
      .at(10 + 123, function(values) {
        values.should.deep.equal([1])
      })
      .at(110 + 123, function(values) {
        values.should.deep.equal([1, 2])
      })
      .at(210 + 123, function(values) {
        values.should.deep.equal([1, 2, 0])
      })
      .at(310 + 123, function(values) {
        values.should.deep.equal([1, 2, 0, 1])
      })
      .at(410 + 123, function(values) {
        values.should.deep.equal([1, 2, 0, 1, 2])
      })
      .check(museq.pulse(3, 0.3, fromNow(-123)), done)
  })

  it("should allow the beat count to be a signal", function(done) {
    var beatCount = sig(4)

    checkPulse()
      .at(0, function(values) {
        values.should.be.empty
      })
      .at(110, function(values) {
        values.should.deep.equal([0])
      })
      .at(210, function(values) {
        values.should.deep.equal([0, 1])
      })
      .at(310, function(values) {
        values.should.deep.equal([0, 1, 2])
      })
      .at(410, function(values) {
        values.should.deep.equal([0, 1, 2, 3])
        sig.push(beatCount, 2)
      })
      .at(610, function(values) {
        values.should.deep.equal([0, 1, 2, 3, 0])
      })
      .at(810, function(values) {
        values.should.deep.equal([0, 1, 2, 3, 0, 1])
      })
      .at(1010, function(values) {
        values.should.deep.equal([0, 1, 2, 3, 0, 1, 0])
      })
      .check(museq.pulse(beatCount, 0.4, fromNow(-5)), done)
  })

  it("should allow the cycles per second to be a signal", function(done) {
    var cps = sig(0.6)

    checkPulse()
      .at(0, function(values) {
        values.should.be.empty
      })
      .at(210, function(values) {
        values.should.deep.equal([0])
      })
      .at(410, function(values) {
        values.should.deep.equal([0, 1])
      })
      .at(610, function(values) {
        values.should.deep.equal([0, 1, 2])
        sig.push(cps, 0.3)
      })
      .at(710, function(values) {
        values.should.deep.equal([0, 1, 2, 0])
      })
      .at(810, function(values) {
        values.should.deep.equal([0, 1, 2, 0, 1])
      })
      .at(910, function(values) {
        values.should.deep.equal([0, 1, 2, 0, 1, 2])
      })
      .check(museq.pulse(3, cps, fromNow(-5)), done)
  })

  it("should allow the origin to be a signal", function(done) {
    var origin = sig(fromNow(-123))
    var nextValue = fromNow(-182)

    checkPulse()
      .at(0, function(values) {
        values.should.be.empty
      })
      .at(10 + 123, function(values) {
        values.should.deep.equal([1])
      })
      .at(110 + 123, function(values) {
        values.should.deep.equal([1, 2])
        sig.push(origin, nextValue)
      })
      .at(210 + 182, function(values) {
        values.should.deep.equal([1, 2, 1])
      })
      .at(310 + 182, function(values) {
        values.should.deep.equal([1, 2, 1, 2])
      })
      .check(museq.pulse(3, 0.3, origin), done)
  })
})
