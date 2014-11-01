
(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(["sig-js"], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory(require('sig-js'));
  } else {
    root.museq = factory(root.sig);
  }
}(this, function(sig) {

var museq = function() {
  function museq() {
  }


  return museq
}()

museq.pulse = function() {
  function pulse() {
  }


  return pulse
}()

return museq;

}));
