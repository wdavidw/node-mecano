
const quote = require('regexp-quote');

module.exports = {
  // Escape RegExp related charracteres
  // eg `///^\*/\w+@#{misc.regexp.escape realm}\s+\*///mg`
  escape: function(str) {
    return str.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
  },
  is: function(reg) {
    return reg instanceof RegExp;
  },
  quote: quote
};
