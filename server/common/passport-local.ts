import * as config from "../config";
import User from "../models/user";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";

const opts = {
  // Prepare the extractor from the header.
  jwtFromRequest: ExtractJwt.fromExtractors([
    (req) => req.cookies["authorization"],
    ExtractJwt.fromUrlQueryParameter("access_token"),
    ExtractJwt.fromAuthHeaderWithScheme("Bearer"),
  ]),
  // jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
  // Use the secret passed in which is loaded from the environment. This can be
  // a certificate (loaded) or a HMAC key.
  secretOrKey: config.JWT_KEY,
  // Verify the issuer.
  issuer: config.JWT_ISSUER,
  // Verify the audience.
  audience: config.JWT_AUDIENCE,
  // Enable only the HS256 algorithm.
  algorithms: [config.JWT_ALG],
  // Pass the request object back to the callback so we can attach the JWT to it.
  passReqToCallback: true,
};

export default (passport) => {
  passport.use(
    new JwtStrategy(opts, async function (req, jwt_payload, done) {
      try {
        console.log("**********:", jwt_payload);
        const userInfo = await User.findOne({
          user_uuid: jwt_payload.user_uuid,
        });
        console.log(userInfo);
        if (userInfo && userInfo.user_role > 0) {
          done(null, userInfo);
        } else {
          done(null, false);
        }
      } catch (e) {
        return done(e);
      }
    })
  );
};
