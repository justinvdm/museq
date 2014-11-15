describe("museq.pulse", function() {
  var testUtils = museq.testUtils,
      checkPulse = testUtils.checkPulse,
      fromNow = testUtils.fromNow

  it("should push a new counter value each beat", function(done) {
    checkPulse(museq.pulse(3, 0.3, fromNow(-5)))
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
      .done(done)
  })

  it("should align pulses to a given origin timestamp", function(done) {
    checkPulse(museq.pulse(3, 0.3, fromNow(-123)))
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
      .done(done)
  })

  it("should allow the beat count to be a signal", function(done) {
    var beatCount = sig(4)

    checkPulse(museq.pulse(beatCount, 0.4, fromNow(-5)))
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
      .done(done)
  })

  it("should allow the cycles per second to be a signal", function(done) {
    var cps = sig(0.6)

    checkPulse(museq.pulse(3, cps, fromNow(-5)))
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
      .done(done)
  })

  it("should allow the origin to be a signal", function(done) {
    var origin = sig(fromNow(-123))
    var nextValue = fromNow(-182)

    checkPulse(museq.pulse(3, 0.3, origin))
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
      .done(done)
  })
})
