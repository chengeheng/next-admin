import next from "next";
import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import passport from "passport";
import session from "express-session";

import authRouter from "./routers/auth";
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

    // express config
    server.use(bodyParser.urlencoded({ extended: false }));
    server.use(bodyParser.json());
    server.use(cookieParser());

    server.use(
      session({
        secret: config.JWT_KEY,
        resave: false,
        saveUninitialized: true,
      })
    );
    // passport
    server.use(passport.initialize());
    // server.use(passport.session());

    server.use((req, res, next) => {
      req.passport = passport;
      next();
    });

    passportLocal(passport);
    return server;
  })
  .then((server) => {
    // login router
    server.use("/api", authRouter);

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
