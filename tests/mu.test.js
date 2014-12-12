describe("mu", function() {
  var val = sig.val,
      put = sig.put

  var testUtils = mu.testUtils,
      fromNow = testUtils.fromNow,
      timeCheck = testUtils.timeCheck

  var at = timeCheck.at,
      end = timeCheck.end

  var loop = mu.loop

  describe(".loop", function() {
    it("should loop the given value", function(done) {
      vv(loop(23, 0.1, fromNow(-5)))
        (timeCheck)
        (at, 0, function(values) {
          values.should.be.empty
        })
        (at, 110, function(values) {
          values.should.deep.equal([23])
        })
        (at, 210, function(values) {
          values.should.deep.equal([23, 23])
        })
        (at, 310, function(values) {
          values.should.deep.equal([23, 23,23])
        })
        (at, 410, function(values) {
          values.should.deep.equal([23, 23, 23, 23])
        })
        (at, 510, function(values) {
          values.should.deep.equal([23, 23, 23, 23, 23])
        })
        (at, 610, function(values) {
          values.should.deep.equal([23, 23, 23, 23, 23, 23])
        })
        (end, done)
    })

    it("should align loops to a given origin timestamp", function(done) {
      vv(loop(23, 0.1, fromNow(-123)))
        (timeCheck)
        (at, 0, function(values) {
          values.should.be.empty
        })
        (at, 10 + 123, function(values) {
          values.should.deep.equal([23])
        })
        (at, 110 + 123, function(values) {
          values.should.deep.equal([23, 23])
        })
        (at, 210 + 123, function(values) {
          values.should.deep.equal([23, 23, 23])
        })
        (at, 310 + 123, function(values) {
          values.should.deep.equal([23, 23, 23, 23])
        })
        (at, 410 + 123, function(values) {
          values.should.deep.equal([23, 23, 23, 23, 23])
        })
        (end, done)
    })

    it("should allow value to be a signal", function(done) {
      var v = val(23)

      vv(loop(v, 0.1, fromNow(-5)))
        (timeCheck)
        (at, 0, function(values) {
          values.should.be.empty
        })
        (at, 110, function(values) {
          values.should.deep.equal([23])
        })
        (at, 210, function(values) {
          values.should.deep.equal([23, 23])
        })
        (at, 310, function(values) {
          values.should.deep.equal([23, 23, 23])
          put(v, 3)
        })
        (at, 410, function(values) {
          values.should.deep.equal([23, 23, 23, 3])
        })
        (at, 510, function(values) {
          values.should.deep.equal([23, 23, 23, 3, 3])
        })
        (at, 610, function(values) {
          values.should.deep.equal([23, 23, 23, 3, 3, 3])
        })
        (end, done)
    })

    it("should allow the interval to be a signal", function(done) {
      var interval = val(0.1)

      vv(loop(23, interval, fromNow(-5)))
        (timeCheck)
        (at, 0, function(values) {
          values.should.be.empty
        })
        (at, 110, function(values) {
          values.should.deep.equal([23])
        })
        (at, 210, function(values) {
          values.should.deep.equal([23, 23])
        })
        (at, 310, function(values) {
          values.should.deep.equal([23, 23, 23])
          put(interval, 0.2)
        })
        (at, 520, function(values) {
          values.should.deep.equal([23, 23, 23, 23])
        })
        (at, 720, function(values) {
          values.should.deep.equal([23, 23, 23, 23, 23])
        })
        (at, 920, function(values) {
          values.should.deep.equal([23, 23, 23, 23, 23, 23])
        })
        (end, done)
    })

    it("should allow the origin to be a signal", function(done) {
      var origin = val(fromNow(-123))
      var originB = fromNow(-182)

      vv(loop(23, 0.1, origin))
        (timeCheck)
        (at, 0, function(values) {
          values.should.be.empty
        })
        (at, 10 + 123, function(values) {
          values.should.deep.equal([23])
        })
        (at, 110 + 123, function(values) {
          values.should.deep.equal([23, 23])
        })
        (at, 210 + 123, function(values) {
          values.should.deep.equal([23, 23, 23])
          put(origin, originB)
        })
        (at, 310 + 182, function(values) {
          values.should.deep.equal([23, 23, 23, 23])
        })
        (at, 410 + 182, function(values) {
          values.should.deep.equal([23, 23, 23, 23, 23])
        })
        (end, done)
    })
  })

  describe(".seq", function() {
  })

  describe(".tr", function() {
  })

  describe(".run", function() {
  })
})
