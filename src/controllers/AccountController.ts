import { Router } from 'express';

let router = Router();

router.use(async (req, res, next) => {
  // TODO: Authorization
  const { authorization } = req.headers;
  next();
});

router.post('/crowd/:id', async (req, res) => {
  req.body.
  res.end();
});

export default router;
