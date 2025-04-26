import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth2";
import Parent from "../models/parent.model.js";
import dotenv from "dotenv";
dotenv.config();
const googleAuthConfig = {
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: `${process.env.FRONTEND_URL}/api/parents/google/callback`,
  passReqToCallback: true,
};

const googleVerifyCallback = async (
  request,
  accessToken,
  refreshToken,
  profile,
  done
) => {
  try {
    const email = profile.emails?.[0]?.value;
    if (!email) {
      return done(
        new Error("Google profile does not contain an email address."),
        null
      );
    }
    const existingUser = await Parent.findOne({ email });
    if (existingUser) {
      return done(null, existingUser);
    }

    const newUser = new Parent({
      fullName: profile.displayName,
      email: profile.emails?.[0]?.value,
    });

    await newUser.save();
    return done(null, newUser);
  } catch (error) {
    console.error("Error during Google authentication:", error);
    return done(error, null);
  }
};

passport.use(new GoogleStrategy(googleAuthConfig, googleVerifyCallback));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await Parent.findById(id);
    done(null, user);
  } catch (error) {
    console.error("Error deserializing user:", error);
    done(error, null);
  }
});

export const initializeGoogleAuth = () => {};
