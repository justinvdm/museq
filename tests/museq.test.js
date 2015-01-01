describe("museq", function() {
  var val = sig.val,
      put = sig.put,
      then = sig.then,
      all = sig.all,
      spread = sig.spread

  var testUtils = museq.testUtils,
      timeCheck = testUtils.timeCheck,
      fromNow = testUtils.fromNow

  var at = timeCheck.at,
      end = timeCheck.end

  var tempo = museq.tempo,
      loop = museq.loop,
      seq = museq.seq,
      every = museq.every,
      sync = museq.sync
      update = museq.update,
      append = museq.append


  describe(".tempo", function() {
    it("should assign a tempo to signals", function(done) {
      var s = tempo(val(23), 100)

      vv([s, s.tempo])
        (all)
        (then, spread, function(v, ms) {
          v.should.equal(23)
          ms.should.equal(100)
          done()
        })
    })

    it("should assign a tempo to non-signals", function(done) {
      var s = tempo(23, 100)

      vv([s, s.tempo])
        (all)
        (then, spread, function(v, ms) {
          v.should.equal(23)
          ms.should.equal(100)
          done()
        })
    })

    it("should ensure tempos are sticky signals", function(done) {
      var s = tempo(sig(), 100)

      then(s.tempo, function(ms) {
        ms.should.equal(100)

        then(s.tempo, function(ms) {
          ms.should.equal(100)
          done()
        })
      })
    })
  })


  describe(".sync", function() {
    it("should delay a value until the next intersection", function(done) {
      vv(23)
        (tempo, 100)
        (sync, fromNow(-50))
        (timeCheck)
        (at, 0, function(results) {
          results.should.be.empty
        })
        (at, 60, function(results) {
          results.should.deep.equal([23])
        })
        (end, done)
    })

    it("should delay early signals until the next intersection", function(done) {
      vv([23])
        (sig)
        (tempo, 100)
        (sync, fromNow(-50))
        (timeCheck)
        (at, 0, function(results) {
          results.should.be.empty
        })
        (at, 60, function(results) {
          results.should.deep.equal([23])
        })
        (end, done)
    })

    it("should not change the behavior of late signals", function(done) {
      var s = sig()

      vv(s)
        (tempo, 100)
        (sync, fromNow(-50))
        (timeCheck)
        (at, 0, function(results) {
          results.should.be.empty
        })
        (at, 60, function(results) {
          results.should.be.empty
          put(s, 23)
          results.should.deep.equal([23])
        })
        (end, done)
    })

    it("should only react to the initial tempo value", function(done) {
      var t = val(100)

      vv(23)
        (tempo, t)
        (sync, fromNow(-50))
        (timeCheck)
        (at, 0, function(results) {
          results.should.be.empty
        })
        (at, 60, function(results) {
          results.should.deep.equal([23])
          put(t, 50)
        })
        (at, 110, function(results) {
          results.should.deep.equal([23])
        })
        (at, 160, function(results) {
          results.should.deep.equal([23])
        })
        (end, done)
    })

    it("should only react to the initial origin value", function(done) {
      var origin = val(fromNow(-50))

      vv(23)
        (tempo, 100)
        (sync, origin)
        (timeCheck)
        (at, 0, function(results) {
          results.should.be.empty
        })
        (at, 60, function(results) {
          results.should.deep.equal([23])
          put(origin, fromNow(-5))
        })
        (at, 110, function(results) {
          results.should.deep.equal([23])
        })
        (at, 160, function(results) {
          results.should.deep.equal([23])
        })
        (end, done)
    })
  })


  describe(".loop", function() {
    it("should loop the given value", function(done) {
      vv(23)
        (tempo, 100)
        (loop)
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
      var v = val(23)

      vv(v)
        (tempo, 100)
        (loop)
        (timeCheck)
        (at, 0, function(results) {
          results.should.deep.equal([23])
        })
        (at, 110, function(results) {
          results.should.deep.equal([23, 23])
        })
        (at, 210, function(results) {
          results.should.deep.equal([23, 23, 23])
          put(v, 3)
        })
        (at, 310, function(results) {
          results.should.deep.equal([23, 23, 23, 3])
        })
        (at, 410, function(results) {
          results.should.deep.equal([23, 23, 23, 3, 3])
        })
        (at, 510, function(results) {
          results.should.deep.equal([23, 23, 23, 3, 3, 3])
        })
        (end, done)
    })

    it("should allow the tempo to be a signal", function(done) {
      var t = val(100)

      vv(23)
        (tempo, t)
        (loop)
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
          results.should.deep.equal([23, 23, 23, 23])
        })
        (at, 520, function(results) {
          results.should.deep.equal([23, 23, 23, 23, 23])
        })
        (at, 720, function(results) {
          results.should.deep.equal([23, 23, 23, 23, 23, 23])
        })
        (end, done)
    })
  })


  describe(".seq", function() {
    it("should sequence the given results", function(done) {
      vv([21, 22, 23])
        (tempo, 300)
        (seq)
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
        (tempo, 600)
        (seq)
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

    it("should allow the tempo to be a signal", function(done) {
      var t = val(800)

      vv([20, 21, 22, 23])
        (tempo, t)
        (seq)
        (timeCheck)
        (at, 0, function(results) {
          results.should.deep.equal([20])
        })
        (at, 210, function(results) {
          results.should.deep.equal([20, 21])
          put(t, 400)
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
})
