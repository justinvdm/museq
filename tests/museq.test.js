describe("museq", function() {
  var val = sig.val,
      put = sig.put,
      then = sig.then

  var testUtils = museq.testUtils,
      fromNow = testUtils.fromNow,
      timeCheck = testUtils.timeCheck

  var at = timeCheck.at,
      end = timeCheck.end

  var loop = museq.loop,
      seq = museq.seq,
      seqOnce = museq.seqOnce,
      every = museq.every,
      tr = museq.tr

  describe(".loop", function() {
    it("should loop the given value", function(done) {
      vv(loop(23, 0.1, fromNow(-5)))
        (timeCheck)
        (at, 0, function(results) {
          results.should.be.empty
        })
        (at, 110, function(results) {
          results.should.deep.equal([23])
        })
        (at, 210, function(results) {
          results.should.deep.equal([23, 23])
        })
        (at, 310, function(results) {
          results.should.deep.equal([23, 23,23])
        })
        (at, 410, function(results) {
          results.should.deep.equal([23, 23, 23, 23])
        })
        (at, 510, function(results) {
          results.should.deep.equal([23, 23, 23, 23, 23])
        })
        (at, 610, function(results) {
          results.should.deep.equal([23, 23, 23, 23, 23, 23])
        })
        (end, done)
    })

    it("should align loops to a given origin timestamp", function(done) {
      vv(loop(23, 0.1, fromNow(-123)))
        (timeCheck)
        (at, 0, function(results) {
          results.should.be.empty
        })
        (at, 10 + 123, function(results) {
          results.should.deep.equal([23])
        })
        (at, 110 + 123, function(results) {
          results.should.deep.equal([23, 23])
        })
        (at, 210 + 123, function(results) {
          results.should.deep.equal([23, 23, 23])
        })
        (at, 310 + 123, function(results) {
          results.should.deep.equal([23, 23, 23, 23])
        })
        (at, 410 + 123, function(results) {
          results.should.deep.equal([23, 23, 23, 23, 23])
        })
        (end, done)
    })

    it("should allow the value to be a signal", function(done) {
      var v = val(23)

      vv(loop(v, 0.1, fromNow(-5)))
        (timeCheck)
        (at, 0, function(results) {
          results.should.be.empty
        })
        (at, 110, function(results) {
          results.should.deep.equal([23])
        })
        (at, 210, function(results) {
          results.should.deep.equal([23, 23])
        })
        (at, 310, function(results) {
          results.should.deep.equal([23, 23, 23])
          put(v, 3)
        })
        (at, 410, function(results) {
          results.should.deep.equal([23, 23, 23, 3])
        })
        (at, 510, function(results) {
          results.should.deep.equal([23, 23, 23, 3, 3])
        })
        (at, 610, function(results) {
          results.should.deep.equal([23, 23, 23, 3, 3, 3])
        })
        (end, done)
    })

    it("should allow the interval to be a signal", function(done) {
      var interval = val(0.1)

      vv(loop(23, interval, fromNow(-5)))
        (timeCheck)
        (at, 0, function(results) {
          results.should.be.empty
        })
        (at, 110, function(results) {
          results.should.deep.equal([23])
        })
        (at, 210, function(results) {
          results.should.deep.equal([23, 23])
        })
        (at, 310, function(results) {
          results.should.deep.equal([23, 23, 23])
          put(interval, 0.2)
        })
        (at, 520, function(results) {
          results.should.deep.equal([23, 23, 23, 23])
        })
        (at, 720, function(results) {
          results.should.deep.equal([23, 23, 23, 23, 23])
        })
        (at, 920, function(results) {
          results.should.deep.equal([23, 23, 23, 23, 23, 23])
        })
        (end, done)
    })

    it("should allow the origin to be a signal", function(done) {
      var origin = val(fromNow(-123))
      var originB = fromNow(-182)

      vv(loop(23, 0.1, origin))
        (timeCheck)
        (at, 0, function(results) {
          results.should.be.empty
        })
        (at, 10 + 123, function(results) {
          results.should.deep.equal([23])
        })
        (at, 110 + 123, function(results) {
          results.should.deep.equal([23, 23])
        })
        (at, 210 + 123, function(results) {
          results.should.deep.equal([23, 23, 23])
          put(origin, originB)
        })
        (at, 310 + 182, function(results) {
          results.should.deep.equal([23, 23, 23, 23])
        })
        (at, 410 + 182, function(results) {
          results.should.deep.equal([23, 23, 23, 23, 23])
        })
        (end, done)
    })
  })


  describe(".seq", function() {
    it("should sequence the given results", function(done) {
      vv(seq([21, 22, 23], 0.3))
        (timeCheck)
        (at, 0, function(results) {
          results.should.deep.equal([21])
        })
        (at, 110, function(results) {
          results.should.deep.equal([21, 22])
        })
        (at, 210, function(results) {
          results.should.deep.equal([21, 22, 23])
        })
        (at, 310, function(results) {
          results.should.deep.equal([21, 22, 23])
        })
        (at, 410, function(results) {
          results.should.deep.equal([21, 22, 23])
        })
        (at, 510, function(results) {
          results.should.deep.equal([21, 22, 23])
        })
        (at, 610, function(results) {
          results.should.deep.equal([21, 22, 23])
        })
        (end, done)
    })

    it("should allow concurrent value groups using signals", function(done) {
      var values = val([21, 22, 23])

      vv(seq(values, 0.6))
        (timeCheck)
        (at, 0, function(results) {
          results.should.deep.equal([21])
        })
        (at, 210, function(results) {
          results.should.deep.equal([21, 22])
          put(values, [24, 25, 26, 27, 28, 29])
        })
        (at, 310, function(results) {
          results.should.deep.equal([21, 22, 24])
        })
        (at, 410, function(results) {
          results.should.deep.equal([21, 22, 24, 25, 23])
        })
        (at, 510, function(results) {
          results.should.deep.equal([21, 22, 24, 25, 23, 26])
        })
        (at, 610, function(results) {
          results.should.deep.equal([21, 22, 24, 25, 23, 26, 27])
        })
        (at, 710, function(results) {
          results.should.deep.equal([21, 22, 24, 25, 23, 26, 27, 28])
        })
        (at, 810, function(results) {
          results.should.deep.equal([21, 22, 24, 25, 23, 26, 27, 28, 29])
        })
        (end, done)
    })

    it("should allow the interval to be a signal", function(done) {
      var interval = val(0.8)

      vv(seq([20, 21, 22, 23], interval))
        (timeCheck)
        (at, 0, function(results) {
          results.should.deep.equal([20])
        })
        (at, 210, function(results) {
          results.should.deep.equal([20, 21])
          put(interval, 0.4)
        })
        (at, 310, function(results) {
          results.should.deep.equal([20, 21, 22])
        })
        (at, 410, function(results) {
          results.should.deep.equal([20, 21, 22, 23])
        })
        (at, 510, function(results) {
          results.should.deep.equal([20, 21, 22, 23])
        })
        (at, 610, function(results) {
          results.should.deep.equal([20, 21, 22, 23])
        })
        (at, 710, function(results) {
          results.should.deep.equal([20, 21, 22, 23])
        })
        (at, 810, function(results) {
          results.should.deep.equal([20, 21, 22, 23])
        })
        (end, done)
    })
  })


  describe(".seqOnce", function() {
    it("should sequence the given results", function(done) {
      vv(seqOnce([21, 22, 23], 0.3))
        (timeCheck)
        (at, 0, function(results) {
          results.should.deep.equal([21])
        })
        (at, 110, function(results) {
          results.should.deep.equal([21, 22])
        })
        (at, 210, function(results) {
          results.should.deep.equal([21, 22, 23])
        })
        (at, 310, function(results) {
          results.should.deep.equal([21, 22, 23])
        })
        (at, 410, function(results) {
          results.should.deep.equal([21, 22, 23])
        })
        (at, 510, function(results) {
          results.should.deep.equal([21, 22, 23])
        })
        (at, 610, function(results) {
          results.should.deep.equal([21, 22, 23])
        })
        (end, done)
    })

    it("should allow the values to be a signal", function(done) {
      var values = val([21, 22, 23])

      vv(seqOnce(values, 0.6))
        (timeCheck)
        (at, 0, function(results) {
          results.should.deep.equal([21])
        })
        (at, 210, function(results) {
          results.should.deep.equal([21, 22])
          put(values, [24, 25, 26, 27, 28, 29])
        })
        (at, 310, function(results) {
          results.should.deep.equal([21, 22, 26])
        })
        (at, 410, function(results) {
          results.should.deep.equal([21, 22, 26, 27])
        })
        (at, 510, function(results) {
          results.should.deep.equal([21, 22, 26, 27, 28])
        })
        (at, 610, function(results) {
          results.should.deep.equal([21, 22, 26, 27, 28, 29])
        })
        (at, 710, function(results) {
          results.should.deep.equal([21, 22, 26, 27, 28, 29])
        })
        (at, 810, function(results) {
          results.should.deep.equal([21, 22, 26, 27, 28, 29])
        })
        (end, done)
    })

    it("should allow the interval to be a signal", function(done) {
      var interval = val(0.8)

      vv(seqOnce([20, 21, 22, 23], interval))
        (timeCheck)
        (at, 0, function(results) {
          results.should.deep.equal([20])
        })
        (at, 210, function(results) {
          results.should.deep.equal([20, 21])
          put(interval, 0.4)
        })
        (at, 310, function(results) {
          results.should.deep.equal([20, 21, 22])
        })
        (at, 410, function(results) {
          results.should.deep.equal([20, 21, 22, 23])
        })
        (at, 510, function(results) {
          results.should.deep.equal([20, 21, 22, 23])
        })
        (at, 610, function(results) {
          results.should.deep.equal([20, 21, 22, 23])
        })
        (at, 710, function(results) {
          results.should.deep.equal([20, 21, 22, 23])
        })
        (at, 810, function(results) {
          results.should.deep.equal([20, 21, 22, 23])
        })
        (end, done)
    })
  })


  describe(".every", function() {
    it("should map every nth signal", function() {
      var s = sig()
      var results = []

      vv(s)
        (every, 3, function(x) { return -x })
        (then, function(x) { results.push(x) })

      vv(s)
        (put, 1)
        (put, 2)
        (put, 3)
        (put, 4)
        (put, 5)
        (put, 6)
        (put, 7)
        (put, 8)
        (put, 9)
        (put, 10)

      assert.deepEqual(results, [1, 2, -3, 4, 5, -6, 7, 8, -9, 10])
    })

    it("should allow extra args", function() {
      var s = sig()
      var results = []

      vv(s)
        (every, 3, function(x, n) { return -x * n }, 2)
        (then, function(x) { results.push(x) })

      vv(s)
        (put, 1)
        (put, 2)
        (put, 3)

      assert.deepEqual(results, [1, 2, -6])
    })
  })


  describe(".tr", function() {
    it("should map each element in each array given by the signal", function() {
      var s = sig()
      var results = []

      vv(s)
        (tr, function(x) { return -x })
        (then, function(values) { results.push(values) })

      vv(s)
        (put, [1, 2, 3])
        (put, [4, 5, 6])

      assert.deepEqual(results, [
        [-1, -2, -3],
        [-4, -5, -6]])
    })

    it("should allow extra args", function() {
      var s = sig()
      var results = []

      vv(s)
        (tr, function(x, n) { return -x * n }, 2)
        (then, function(values) { results.push(values) })

      vv(s)
        (put, [1, 2, 3])
        (put, [4, 5, 6])

      assert.deepEqual(results, [
        [-2, -4, -6],
        [-8, -10, -12]])
    })
  })


  describe(".run", function() {
  })
})
