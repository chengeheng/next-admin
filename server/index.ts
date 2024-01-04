import next from "next";
import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
// without getRequestHandler() it will throw error
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    const server = express();
    const router = express.Router();
    server.use(router);

    // express config
    router.use(cookieParser());
    router.use(bodyParser.urlencoded({ extended: false }));
    router.use(bodyParser.json());

    router.get("/", (req, res) => {
      res.send("hello world");
    });
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
