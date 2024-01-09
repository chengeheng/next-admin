import next from "next";
import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import passport from "passport";
import session from "express-session";

import loginRouter from "./routers/login";
import * as config from "./config/index";
import passportLocal from "./common/passport-local";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
// without getRequestHandler() it will throw error
const handle = app.getRequestHandler();

const { databaseConfig } = config;
const mongoHost = `mongodb://${databaseConfig.username}:${databaseConfig.password}@${databaseConfig.host}:${databaseConfig.port}/${databaseConfig.database}`;
mongoose
  .connect(mongoHost, {
    authSource: "admin",
  })
  .then(() => {
    console.log("connect established: ", mongoHost);
  })
  .catch((err) => {
    console.log("connect error: ", err);
  });

app
  .prepare()
  .then(() => {
    const server = express();
    const router = express.Router();
    server.use(router);

    // express config
    router.use(bodyParser.urlencoded({ extended: false }));
    router.use(bodyParser.json());
    router.use(cookieParser());

    router.use(
      session({
        secret: config.JWT_KEY,
        resave: false,
        saveUninitialized: true,
      })
    );
    router.use(passport.initialize());
    router.use(passport.session());

    passportLocal(passport);

    router.use((req, res, next) => {
      req.passport = passport;
      next();
    });

    return server;
  })
  .then((server) => {
    // login router
    server.use("/api", loginRouter);

    return server;
  })
  .then((server) => {
    server.get("*", (req, res) => handle(req, res));
    server.listen(3000, () => {
      console.log("server is running on port 3000");
    });
  })
  .catch((err) => {
    console.log("process, exit: ", err);
    process.exit(1);
  });
