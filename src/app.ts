import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import chalk from 'chalk';
import ExpressCore from 'express-serve-static-core';
import AccountController from './controllers/AccountController';

class App {
  private app: ExpressCore.Express;
  private port: number|string;

  private constructor() {
    this.app = express();
    this.port = process.env.PORT??80;
    this.useExpress();
  }
  useExpress() {
    this.app.use(morgan('combined'));
    this.app.use(cors);
    this.app.use(bodyParser);
  }
  setController() {
    this.app.use(AccountController);
  }
  serverStart() {
    this.app.listen(this.port, () => {
      console.log(chalk.green(`server at http://localhost:${this.port}`))
    });
  }
  static run() {
    const app = new App();
    app.serverStart();
  }
}

App.run();
