import { google } from "googleapis";
import { ResponseError } from "./error.helper.js";
import createTransporter from "../apps/transporter.js";

const checkEnvironment = (
  gmailMaster,
  clientId,
  clientSecret,
  refreshToken
) => {
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
};

const getOauth2AccessToken = async (clientId, clientSecret, refreshToken) => {
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
  return accessToken;
};

const sendMail = async (gmailMaster, email, template) => {
  const transporter = await createTransporter();

  await transporter.sendMail({
    from: {
      name: "klin8",
      address: gmailMaster,
    },
    to: email,
    subject: "Veryfication With OTP",
    html: template,
  });
};

export const transporterHelper = {
  checkEnvironment,
  getOauth2AccessToken,
  sendMail,
};
