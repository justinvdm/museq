describe("museq", function() {
  var val = sig.val,
      put = sig.put,
      then = sig.then

  var testUtils = museq.testUtils,
      timeCheck = testUtils.timeCheck,
      fromNow = testUtils.fromNow

  var at = timeCheck.at,
      end = timeCheck.end

  var loop = museq.loop,
      seq = museq.seq,
      every = museq.every,
      sync = museq.sync
      update = museq.update,
      append = museq.append


  describe(".sync", function() {
    it("should delay a value until the next intersection", function(done) {
      vv(23)
        (sync, fromNow(-50), 100)
        (timeCheck)
        (at, 0, function(results) {
          results.should.be.empty
        })
        (at, 60, function(results) {
          results.should.deep.equal([23])
        })
        (end, done)
    })

    it("should delay signals until the next intersection", function(done) {
      vv([23])
        (sig)
        (sync, fromNow(-50), 100)
        (timeCheck)
        (at, 0, function(results) {
          results.should.be.empty
        })
        (at, 60, function(results) {
          results.should.deep.equal([23])
        })
        (end, done)
    })
  })


  describe(".loop", function() {
    it("should loop the given value", function(done) {
      vv(23)
        (loop, 100)
        (timeCheck)
        (at, 0, function(results) {
          results.should.deep.equal([23])
        })
        (at, 110, function(results) {
          results.should.deep.equal([23, 23])
        })
        (at, 210, function(results) {
          results.should.deep.equal([23, 23,23])
        })
        (at, 310, function(results) {
          results.should.deep.equal([23, 23, 23, 23])
        })
        (at, 410, function(results) {
          results.should.deep.equal([23, 23, 23, 23, 23])
        })
        (at, 510, function(results) {
          results.should.deep.equal([23, 23, 23, 23, 23, 23])
        })
        (end, done)
    })

    it("should allow the value to be a signal", function(done) {
      var v = val()

      vv(v)
        (loop, 100)
        (timeCheck)
        (at, 0, function(results) {
          results.should.be.empty
        })
        (at, 50, function(results) {
          put(v, 23)
          results.should.deep.equal([23])
        })
        (at, 110, function(results) {
          results.should.deep.equal([23])
        })
        (at, 160, function(results) {
          results.should.deep.equal([23, 23])
        })
        (at, 260, function(results) {
          results.should.deep.equal([23, 23, 23])
          put(v, 3)
        })
        (at, 360, function(results) {
          results.should.deep.equal([23, 23, 23, 3])
        })
        (at, 460, function(results) {
          results.should.deep.equal([23, 23, 23, 3, 3])
        })
        (at, 560, function(results) {
          results.should.deep.equal([23, 23, 23, 3, 3, 3])
        })
        (end, done)
    })

    it("should allow the interval to be a signal", function(done) {
      var t = val(100)

      vv(23)
        (loop, t)
        (timeCheck)
        (at, 0, function(results) {
          results.should.deep.equal([23])
        })
        (at, 110, function(results) {
          results.should.deep.equal([23, 23])
        })
        (at, 210, function(results) {
          results.should.deep.equal([23, 23, 23])
          put(t, 200)
        })
        (at, 310, function(results) {
          results.should.deep.equal([23, 23, 23])
        })
        (at, 520, function(results) {
          results.should.deep.equal([23, 23, 23, 23])
        })
        (at, 720, function(results) {
          results.should.deep.equal([23, 23, 23, 23, 23])
        })
        (end, done)
    })
  })


  describe(".seq", function() {
    it("should sequence the given results", function(done) {
      vv([21, 22, 23])
        (seq, 300)
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

      vv(values)
        (seq, 600)
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
      var t = val(800)

      vv([20, 21, 22, 23])
        (seq, t)
        (timeCheck)
        (at, 0, function(results) {
          results.should.deep.equal([20])
        })
        (at, 210, function(results) {
          results.should.deep.equal([20, 21])
          put(t, 400)
        })
        (at, 310, function(results) {
          results.should.deep.equal([20, 21])
        })
        (at, 410, function(results) {
          results.should.deep.equal([20, 21, 22])
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
})
