var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", {
    title: "Northwest Hosting - Datacenter Solutions",
    routename: "home",
    csrfToken: req.csrfToken()
  });
});


/* GET support pages. 
router.get("/support", function (req, res, next) {
  res.render("support", {
    title: "Qredit - Support",
    routename: "support",
    csrfToken: req.csrfToken()
  });
});
*/

module.exports = router;
