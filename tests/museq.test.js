describe("museq", function() {
  var val = sig.val,
      put = sig.put,
      then = sig.then,
      map = sig.map,
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
      tr = museq.tr,
      run = museq.run,
      sync = museq.sync
      update = museq.update,
      append = museq.append,
      ifExists = museq.ifExists,


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


  describe(".tr", function() {
    it("should map each element in arrays given by the signal", function() {
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

    it("should map single values", function() {
      var s = sig()
      var results = []

      vv(s)
        (tr, function(x) { return -x })
        (then, function(values) { results.push(values) })

      vv(s)
        (put, 3)
        (put, [4, 5, 6])

      assert.deepEqual(results, [-3, [-4, -5, -6]])
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
    it("should map each function in each array to its result", function() {
      var s = sig()
      var results = []

      vv(s)
        (run)
        (then, function(values) { results.push(values) })

      vv(s)
        (put, [a, b, a])
        (put, [a, a, b])

      assert.deepEqual(results, [
        [0, 1, 0],
        [0, 0, 1]])

      function a() {
        return 0
      }

      function b() {
        return 1
      }
    })

    it("should simply pass through non-functions", function() {
      var s = sig()
      var results = []

      vv(s)
        (run)
        (then, function(values) { results.push(values) })

      vv(s)
        (put, [a, 1, a])
        (put, [a, a, 1])

      assert.deepEqual(results, [
        [0, 1, 0],
        [0, 0, 1]])

      function a() {
        return 0
      }
    })

    it("should allow extra args", function() {
      var s = sig()
      var results = []

      vv(s)
        (run, 2)
        (then, function(values) { results.push(values) })

      vv(s)
        (put, [a, b, a])
        (put, [a, a, b])

      assert.deepEqual(results, [
        [4, 6, 4],
        [4, 4, 6]])

      function a(n) {
        return n * 2
      }

      function b(n) {
        return n * 3
      }
    })
  })


  describe(".update", function() {
    it("should update the signal to use the last returned signal", function() {
      var s = sig()
      var results = []

      vv(s)
        (update, function(u) {
          return map(u, function(x) { return x * 2 })
        })
        (then, function(v) {
          results.push(v)
        })

      var t = sig()
      put(s, t)

      vv(t)
        (put, 1)
        (put, 2)
        (put, 3)

      var u = sig()
      put(s, u)

      vv(u)
        (put, 4)
        (put, 5)
        (put, 6)

      vv(t)
        (put, 7)
        (put, 8)
        (put, 9)

      assert.deepEqual(results, [2, 4, 6, 8, 10, 12])
    })

    it("should support additional args", function() {
      var s = sig()
      var results = []

      vv(s)
        (update, map, function(x) { return x * 2 })
        (then, function(v) { results.push(v) })

      var t = sig()
      put(s, t)

      vv(t)
        (put, 1)
        (put, 2)
        (put, 3)

      assert.deepEqual(results, [2, 4, 6])
    })

    it("should default to an identity function", function() {
      var s = sig()
      var results = []

      vv(s)
        (update)
        (then, function(v) { results.push(v) })

      var t = sig()
      put(s, t)

      vv(t)
        (put, 1)
        (put, 2)
        (put, 3)

      assert.deepEqual(results, [1, 2, 3])
    })

    it("should do nothing if a non-signal is returned", function() {
      var s = sig()
      var results = []

      vv(s)
        (update, function(x) { if (x % 2) return val(x) })
        (then, function(v) { results.push(v) })

      vv(s)
        (put, 1)
        (put, 2)
        (put, 3)
        (put, 4)
        (put, 5)

      assert.deepEqual(results, [1, 3, 5])
    })
  })


  describe(".append", function() {
    it("should append each returned signal", function() {
      var s = sig()
      var results = []

      vv(s)
        (append, function(u) {
          return map(u, function(x) { return x * 2 })
        })
        (then, function(v) {
          results.push(v)
        })

      var t = sig()
      put(s, t)

      vv(t)
        (put, 1)
        (put, 2)
        (put, 3)

      var u = sig()
      put(s, u)

      vv(u)
        (put, 4)
        (put, 5)
        (put, 6)

      vv(t)
        (put, 7)
        (put, 8)
        (put, 9)

      assert.deepEqual(results, [2, 4, 6, 8, 10, 12, 14, 16, 18])
    })

    it("should support additional args", function() {
      var s = sig()
      var results = []

      vv(s)
        (append, map, function(x) { return x * 2 })
        (then, function(v) { results.push(v) })

      var t = sig()
      put(s, t)

      vv(t)
        (put, 1)
        (put, 2)
        (put, 3)

      var u = sig()
      put(s, u)

      vv(u)
        (put, 4)
        (put, 5)
        (put, 6)

      assert.deepEqual(results, [2, 4, 6, 8, 10, 12])
    })

    it("should default to an identity function", function() {
      var s = sig()
      var results = []

      vv(s)
        (append)
        (then, function(v) { results.push(v) })

      var t = sig()
      put(s, t)

      vv(t)
        (put, 1)
        (put, 2)
        (put, 3)

      assert.deepEqual(results, [1, 2, 3])
    })

    it("should do nothing if a non-signal is returned", function() {
      var s = sig()
      var results = []

      vv(s)
        (append, function(x) { if (x % 2) return val(x) })
        (then, function(v) { results.push(v) })

      vv(s)
        (put, 1)
        (put, 2)
        (put, 3)
        (put, 4)
        (put, 5)

      assert.deepEqual(results, [1, 3, 5])
    })
  })


  describe(".ifExists", function() {
    it("should simply return the value if it is null", function() {
      assert.strictEqual(ifExists(null, function(){}), null)
    })

    it("should simply return the value if it is undefined", function() {
      assert.strictEqual(ifExists(void 0, function(){}), void 0)
    })

    it("should call the given function if the given value exists", function() {
      function double(v) { return v * 2 }
      assert.equal(ifExists(3, double), 6)
      assert.equal(ifExists(23, double), 46)
    })
  })
})
