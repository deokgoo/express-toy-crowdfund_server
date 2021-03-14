import { Router } from 'express';
import FirebaseService from '../service/firebase';

const PrivateAccountController = (firebaseService: FirebaseService) => {
  let router = Router();

  router.use(async (req, res, next) => {
    const { authorization } = req.headers;
    const idToken = authorization?.split(' ')[1];
    if(!idToken) {
      res.sendStatus(401);
      return;
    }
    try {
      await firebaseService.verifyIdToken(idToken);
    } catch(err) {
      res.sendStatus(401);
    }
    next();
  });

  router.post('/crowd/create', async (req, res) => {
    const { authorization } = req.headers;
    const idToken = authorization?.split(' ')[1];
    const userId = await firebaseService.verifyIdToken(idToken!);
    const { title, desc, targetMoney } = req.body;
    if(!title || !desc || !targetMoney) {
      res.sendStatus(400);
      return;
    }
    firebaseService.createCrowdFunding({
      userId,
      title,
      desc,
      targetMoney,
    })
    res.sendStatus(201);
  });

  router.get('/crowd', async (req,res) => {
    const { authorization } = req.headers;
    const idToken = authorization?.split(' ')[1];
    const uid = await firebaseService.verifyIdToken(idToken!);
    const data = await firebaseService.getCrowdFunding(uid);
    res.send(data);
  });

  router.post('/crowd/deposit', async (req, res) => {
    const { authorization } = req.headers;
    const idToken = authorization?.split(' ')[1];
    const userId = await firebaseService.verifyIdToken(idToken!);
    const { fid, money } = req.body;

    try {
      await firebaseService.depositFunding({
        fid,
        userId,
        money,
      });
      res.sendStatus(200);
    } catch(err) {
      console.log(err);
      res.sendStatus(500)
    }
  });

  return router;
}

export default PrivateAccountController;
