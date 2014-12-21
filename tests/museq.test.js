describe("museq", function() {
  var val = sig.val,
      put = sig.put,
      then = sig.then,
      map = sig.map

  var testUtils = museq.testUtils,
      fromNow = testUtils.fromNow,
      timeCheck = testUtils.timeCheck

  var at = timeCheck.at,
      end = timeCheck.end

  var loop = museq.loop,
      seq = museq.seq,
      seqOnce = museq.seqOnce,
      every = museq.every,
      tr = museq.tr,
      run = museq.run,
      update = museq.update,
      append = museq.append

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
})
