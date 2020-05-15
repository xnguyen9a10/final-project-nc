const router = require('express').Router();
const sha1 = require('sha1');
const bankLinkService = require('../../services/bankLinkService');

router.post('/api/partner/new', (req, res) => {

})

router.get("/api/test", async (req, res) => {
  const response = await bankLinkService.validate(req.headers, req.body);
  return res.json(response);
});

module.exports = router;
