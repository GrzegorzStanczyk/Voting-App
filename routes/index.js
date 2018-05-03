const router = require('express').Router();
const path = require('path');

router.get('/:id', (req, res) => {
  console.log(req.params.id)
  res.send(req.params.id)
});

router.get('*', (req, res) => res.sendFile(path.join(__dirname + '/..', 'dist', 'index.html')));

module.exports = router;