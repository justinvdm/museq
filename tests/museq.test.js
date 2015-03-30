describe("museq", function() {
  function fromNow(offset) {
    return +(new Date()) + offset
  }


  function capture(s, fn) {
    var results = []
    fn = sig.prime(sig.slice(arguments, 2), fn || sig.identity)

    s.then(function(v) {
      results.push(v)
      this.next()
    })

    return fn(results)
  }


  function snapshots() {
    var tasks = []

    self.at = function(interval, fn) {
      tasks.push([interval, fn])
      return self
    }

    function self(s) {
      var values = []

      var t = sig(tasks)
        .append(sig.spread, function(interval, fn) {
          return museq.sleep(interval)
            .map(function() { return fn(values) })
        })
        .limit(tasks.length)
        .each(function() { this.next() })

      s.each(function(x) { values.push(x) })
       .redir(t)

      return t
    }

    return self
  }


  describe(".sync", function() {
    it("should delay a value until the next intersection", function(done) {
      museq.sync(23, fromNow(-50), 100)
        .call(snapshots()
          .at(0, function(results) {
            results.should.be.empty
          })
          .at(60, function(results) {
            results.should.deep.equal([23])
          }))
        .teardown(done)
    })

    it("should delay signals until the next intersection", function(done) {
      var s = sig()

      museq.sync(s, fromNow(-50), 100)
        .call(snapshots()
          .at(0, function(results) {
            results.should.be.empty
          })
          .at(60, function(results) {
            results.should.deep.equal([23])
          }))
        .teardown(done)

      s.put(23)
    })
  })


  describe(".loop", function() {
    it("should loop the given value", function(done) {
      museq.loop(23, 100)
        .call(snapshots()
          .at(0, function(results) {
            results.should.deep.equal([23])
          })
          .at(110, function(results) {
            results.should.deep.equal([23, 23])
          })
          .at(210, function(results) {
            results.should.deep.equal([23, 23, 23])
          })
          .at(310, function(results) {
            results.should.deep.equal([23, 23, 23, 23])
          })
          .at(410, function(results) {
            results.should.deep.equal([23, 23, 23, 23, 23])
          })
          .at(510, function(results) {
            results.should.deep.equal([23, 23, 23, 23, 23, 23])
          }))
        .teardown(done)
    })

    it("should allow the value to be a signal", function(done) {
      var v = sig.val()

      museq.loop(v, 100)
        .call(snapshots()
          .at(0, function(results) {
            results.should.be.empty
          })
          .at(50, function(results) {
            v.put(23)
            results.should.deep.equal([23])
          })
          .at(110, function(results) {
            results.should.deep.equal([23, 23])
          })
          .at(160, function(results) {
            results.should.deep.equal([23, 23])
          })
          .at(260, function(results) {
            results.should.deep.equal([23, 23, 23])
            v.put(3)
          })
          .at(360, function(results) {
            results.should.deep.equal([23, 23, 23, 3, 3])
          })
          .at(460, function(results) {
            results.should.deep.equal([23, 23, 23, 3, 3, 3])
          })
          .at(560, function(results) {
            results.should.deep.equal([23, 23, 23, 3, 3, 3, 3])
          }))
        .teardown(done)
    })

    it("should allow the interval to be a signal", function(done) {
      var t = sig.val(100)

      museq.loop(23, t)
        .call(snapshots()
          .at(0, function(results) {
            results.should.deep.equal([23])
          })
          .at(110, function(results) {
            results.should.deep.equal([23, 23])
          })
          .at(210, function(results) {
            results.should.deep.equal([23, 23, 23])
            t.put(200)
          })
          .at(310, function(results) {
            results.should.deep.equal([23, 23, 23])
          })
          .at(520, function(results) {
            results.should.deep.equal([23, 23, 23, 23])
          })
          .at(720, function(results) {
            results.should.deep.equal([23, 23, 23, 23, 23])
          }))
        .teardown(done)
    })
  })


  describe(".seq", function() {
    it("should sequence the given results", function(done) {
      museq.seq([21, 22, 23], 300)
        .call(snapshots()
          .at(0, function(results) {
            results.should.deep.equal([21])
          })
          .at(110, function(results) {
            results.should.deep.equal([21, 22])
          })
          .at(210, function(results) {
            results.should.deep.equal([21, 22, 23])
          })
          .at(310, function(results) {
            results.should.deep.equal([21, 22, 23])
          })
          .at(410, function(results) {
            results.should.deep.equal([21, 22, 23])
          })
          .at(510, function(results) {
            results.should.deep.equal([21, 22, 23])
          })
          .at(610, function(results) {
            results.should.deep.equal([21, 22, 23])
          }))
        .teardown(done)
    })

    it("should allow concurrent value groups using signals", function(done) {
      var values = sig.val([21, 22, 23])

      museq.seq(values, 600)
        .call(snapshots()
          .at(0, function(results) {
            results.should.deep.equal([21])
          })
          .at(210, function(results) {
            results.should.deep.equal([21, 22])
            values.put([24, 25, 26, 27, 28, 29])
          })
          .at(310, function(results) {
            results.should.deep.equal([21, 22, 24])
          })
          .at(410, function(results) {
            results.should.deep.equal([21, 22, 24, 25, 23])
          })
          .at(510, function(results) {
            results.should.deep.equal([21, 22, 24, 25, 23, 26])
          })
          .at(610, function(results) {
            results.should.deep.equal([21, 22, 24, 25, 23, 26, 27])
          })
          .at(710, function(results) {
            results.should.deep.equal([21, 22, 24, 25, 23, 26, 27, 28])
          })
          .at(810, function(results) {
            results.should.deep.equal([21, 22, 24, 25, 23, 26, 27, 28, 29])
          }))
        .teardown(done)
    })

    it("should allow the interval to be a signal", function(done) {
      var t = sig.val(800)

      museq.seq([20, 21, 22, 23], t)
        .call(snapshots()
          .at(0, function(results) {
            results.should.deep.equal([20])
          })
          .at(210, function(results) {
            results.should.deep.equal([20, 21])
            t.put(400)
          })
          .at(310, function(results) {
            results.should.deep.equal([20, 21])
          })
          .at(410, function(results) {
            results.should.deep.equal([20, 21, 22])
          })
          .at(510, function(results) {
            results.should.deep.equal([20, 21, 22, 23])
          })
          .at(610, function(results) {
            results.should.deep.equal([20, 21, 22, 23])
          })
          .at(710, function(results) {
            results.should.deep.equal([20, 21, 22, 23])
          })
          .at(810, function(results) {
            results.should.deep.equal([20, 21, 22, 23])
          }))
        .teardown(done)
    })
  })


  describe(".every", function() {
    it("should map every nth signal", function() {
      var s = sig()

      var results = s
       .call(museq.every, 3, function(x) { return -x })
       .call(capture)

      s.putEach([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
      assert.deepEqual(results, [1, 2, -3, 4, 5, -6, 7, 8, -9, 10])
    })

    it("should allow extra args", function() {
      var s = sig()

      var results = s
        .call(museq.every, 3, function(x, n) { return -x * n }, 2)
        .call(capture)

      s.putEach([1, 2, 3])
      assert.deepEqual(results, [1, 2, -6])
    })
  })
})
