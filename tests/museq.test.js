describe("museq", function() {
  var testUtils = museq.testUtils,
      checkSeq = testUtils.checkSeq,
      fromNow = testUtils.fromNow

  it("should push each bucket of beat values", function(done) {
    checkSeq(museq([[0, 1], [2], [3, 4, 5]], {
        cps: 0.3,
        origin: fromNow(-5)
      }))
      .at(0, function(values) {
        values.should.be.empty
      })
      .at(110, function(values) {
        values.should.deep.equal([0, 1])
      })
      .at(210, function(values) {
        values.should.deep.equal([0, 1, 2])
      })
      .at(310, function(values) {
        values.should.deep.equal([0, 1, 2, 3, 4, 5])
      })
      .at(410, function(values) {
        values.should.deep.equal([0, 1, 2, 3, 4, 5, 0, 1])
      })
      .at(510, function(values) {
        values.should.deep.equal([0, 1, 2, 3, 4, 5, 0, 1, 2])
      })
      .at(610, function(values) {
        values.should.deep.equal([0, 1, 2, 3, 4, 5, 0, 1, 2, 3, 4, 5])
      })
      .done(done)
  })

  it("should support single beats", function(done) {
    checkSeq(museq([0, 1, 2], {
        cps: 0.3,
        origin: fromNow(-5)
      }))
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

  it("should support no beats", function(done) {
    checkSeq(museq([[0, 1], null, null, [2, 3]], {
        cps: 0.4,
        origin: fromNow(-5)
      }))
      .at(0, function(values) {
        values.should.be.empty
      })
      .at(110, function(values) {
        values.should.deep.equal([0, 1])
      })
      .at(210, function(values) {
        values.should.deep.equal([0, 1])
      })
      .at(310, function(values) {
        values.should.deep.equal([0, 1])
      })
      .at(410, function(values) {
        values.should.deep.equal([0, 1, 2, 3])
      })
      .at(510, function(values) {
        values.should.deep.equal([0, 1, 2, 3, 0, 1])
      })
      .at(610, function(values) {
        values.should.deep.equal([0, 1, 2, 3, 0, 1])
      })
      .at(710, function(values) {
        values.should.deep.equal([0, 1, 2, 3, 0, 1])
      })
      .at(810, function(values) {
        values.should.deep.equal([0, 1, 2, 3, 0, 1, 2, 3])
      })
      .done(done)
  })

  it("should allow the beats to be a signal", function(done) {
    var beats = sig([[[0, 1], [2], [4, 5]]])

    checkSeq(museq(beats, {
        cps: 0.3,
        origin: fromNow(-5)
      }))
      .at(0, function(values) {
        values.should.be.empty
      })
      .at(110, function(values) {
        values.should.deep.equal([
          0, 1
        ])
      })
      .at(210, function(values) {
        values.should.deep.equal([
          0, 1, 2
        ])
      })
      .at(310, function(values) {
        values.should.deep.equal([
          0, 1, 2, 3, 4, 5
        ])
      })
      .at(410, function(values) {
        values.should.deep.equal([
          0, 1, 2, 3, 4, 5, 0, 1
        ])
      })
      .at(510, function(values) {
        values.should.deep.equal([
          0, 1, 2, 3, 4, 5, 0, 1, 2
        ])
      })
      .at(610, function(values) {
        values.should.deep.equal([
          0, 1, 2, 3, 4, 5, 0, 1, 2, 3, 4, 5
        ])

        sig.put(beats, [[6, 7], [8], [9]])
      })
      .at(710, function(values) {
        values.should.deep.equal([
          0, 1, 2, 3, 4, 5, 0, 1, 2, 3, 4, 5,
          6, 7
        ])
      })
      .at(810, function(values) {
        values.should.deep.equal([
          0, 1, 2, 3, 4, 5, 0, 1, 2, 3, 4, 5,
          6, 7, 8
        ])
      })
      .at(910, function(values) {
        values.should.deep.equal([
          0, 1, 2, 3, 4, 5, 0, 1, 2, 3, 4, 5,
          6, 7, 8, 9])
      })
      .at(1110, function(values) {
        values.should.deep.equal([
          0, 1, 2, 3, 4, 5, 0, 1, 2, 3, 4, 5,
          6, 7, 8, 9, 6, 7
        ])
      })
      .at(1210, function(values) {
        values.should.deep.equal([
          0, 1, 2, 3, 4, 5, 0, 1, 2, 3, 4, 5,
          6, 7, 8, 8, 9, 6, 7, 8
        ])
      })
      .at(610, function(values) {
        values.should.deep.equal([
          0, 1, 2, 3, 4, 5, 0, 1, 2, 3, 4, 5,
          6, 7, 8, 8, 9, 6, 7, 8, 9
        ])
      })
      .done(done)
  })
})
