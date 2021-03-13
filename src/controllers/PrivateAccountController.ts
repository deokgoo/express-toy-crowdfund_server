import { Router } from 'express';
import FirebaseService from '../service/firebase';

const PrivateAccountController = (firebaseService: FirebaseService) => {
  let router = Router();

  router.use(async (req, res, next) => {
    // TODO: Authorization
    const { authorization } = req.headers;
    next();
  });

  router.post('/crowd/create', async (req, res) => {
    // TODO currentUser uid
    const userId = 'testUid';
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
    // TODO: getUid
    const uid = 'testUid';
    const data = await firebaseService.getCrowdFunding(uid);
    res.send(data);
  });

  router.post('/crowd/deposit', async (req, res) => {
    // TODO:
    const userId = 'testUid';
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
