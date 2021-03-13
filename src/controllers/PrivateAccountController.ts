import { Router } from 'express';

let PrivateAccountController = Router();

PrivateAccountController.use(async (req, res, next) => {
  // TODO: Authorization
  const { authorization } = req.headers;
  next();
});

PrivateAccountController.post('/crowd/:id', async (req, res) => {
  res.end();
});

export default PrivateAccountController;
