const router = require("express").Router();
const sha1 = require("sha1");
const CustomerService = require("../../services/customerService");
const utils = require("../../utils/utils");

router.get("/customer/info", utils.requireRole('customer'), async (req, res) => {
  const response = await CustomerService.vidu();
  return res.json(response);
});

module.exports = router;
