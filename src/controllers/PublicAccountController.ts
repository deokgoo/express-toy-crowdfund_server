import { Router } from 'express';

let PublicAccountController = Router();

PublicAccountController.use((req, res, next) => {
  console.log('public controller');
  next();
});

PublicAccountController.get('/crowd/:id', async (req, res) => {
  const { id } = req.params;
  res.send({
    [id]: {
      account: 12345,
      member: 20,
      created_at: '2021-03-13 12:23:00',
    }
  });
});

export default PublicAccountController;
