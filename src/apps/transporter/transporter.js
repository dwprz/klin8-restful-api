import nodemailer from "nodemailer";
import { ResponseError } from "../../helpers/response-error.helper.js";
import { google } from "googleapis";

const createTransporter = async () => {
  const gmailMaster = process.env.GMAIL_MASTER;
  const clientId = process.env.OAUTH2_CLIENT_ID;
  const clientSecret = process.env.OAUTH2_CLIENT_SECRET;
  const refreshToken = process.env.OAUTH2_REFRESH_TOKEN;

  if (!gmailMaster) {
    throw new ResponseError(422, "gmail master is not provided");
  }

  if (!clientId) {
    throw new ResponseError(422, "oauth2 client id is not provided");
  }

  if (!clientSecret) {
    throw new ResponseError(422, "oauth2 client secret is not provided");
  }

  if (!refreshToken) {
    throw new ResponseError(422, "oauth2 refresh token is not provided");
  }

  const Oauth2 = google.auth.OAuth2;

  const oauth2Client = new Oauth2({
    clientId: clientId,
    clientSecret: clientSecret,
    redirectUri: "https://developers.google.com/oauthplayground",
  });

  oauth2Client.setCredentials({
    refresh_token: refreshToken,
  });

  const accessToken = await oauth2Client.getAccessToken();

  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      type: "OAuth2",
      user: gmailMaster,
      clientId: clientId,
      clientSecret: clientSecret,
      refreshToken: refreshToken,
      accessToken: accessToken,
    },
  });

  return transporter;
};

export default createTransporter;
