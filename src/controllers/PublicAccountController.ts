import { Router } from 'express';
import FirebaseService from '../service/firebase';

const PublicAccountController = (firebaseService: FirebaseService) => {
  let router = Router();

  router.use((req, res, next) => {next();});

  router.get('/crowd/:fid', async (req, res) => {
    const { fid } = req.params;
    const info = await firebaseService.getCrowdFundingById(fid);
    const participate = await firebaseService.getParticipate(fid);
    res.send({
      info,
      participate,
    });
  });

  router.post('/register', async (req, res) => {
    const { email, password, name } = req.body;
    await firebaseService.register({email, password, name})
    res.sendStatus(201);
  })

  return router;
}

export default PublicAccountController;
