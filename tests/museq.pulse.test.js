describe("museq.pulse", function() {
  function capture(s) {
    var values = []

    sig.map(s, function(x) {
      values.push(x)
    })

    return values
  }

  it("should push a new value each cycle", function(done) {
    var results = capture(museq.pulse(0.1))
    results.should.deep.equal([0])

    setTimeout(function() {
      results.should.deep.equal([0, 1])
    }, 110)

    setTimeout(function() {
      results.should.deep.equal([0, 1, 2])
    }, 210)

    setTimeout(function() {
      results.should.deep.equal([0, 1, 2, 3])
      done()
    }, 310)
  })

  it("should allow the cycles per second to be a signal", function(done) {
    var cps = sig(0.1)

    var results = capture(museq.pulse(cps))
    results.should.deep.equal([0])

    setTimeout(function() {
      results.should.deep.equal([0, 1])
    }, 110)

    setTimeout(function() {
      results.should.deep.equal([0, 1, 2])
    }, 210)

    setTimeout(function() {
      results.should.deep.equal([0, 1, 2, 3])

      sig.push(cps, 0.2)
      results.should.deep.equal([0, 1, 2, 3, 0])
    }, 310)

    setTimeout(function() {
      results.should.deep.equal([0, 1, 2, 3, 0, 1])
    }, 520)

    setTimeout(function() {
      results.should.deep.equal([0, 1, 2, 3, 0, 1, 2])
    }, 720)

    setTimeout(function() {
      results.should.deep.equal([0, 1, 2, 3, 0, 1, 2, 3])
      done()
    }, 920)
  })
})
