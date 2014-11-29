
(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(["sig-js"], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory(require('sig-js'));
  } else {
    root.mu = factory(root.sig);
  }
}(this, function(sig) {

var mu = function() {
  function loop() {
  }


  function seq() {
  }


  function tr() {
  }


  function run() {
  }


  return {
    tr: tr,
    run: run,
    seq: seq,
    loop: loop
  }
}()

return mu;

}));
