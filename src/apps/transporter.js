import nodemailer from "nodemailer";
import { google } from "googleapis";
import { transporterHelper } from "../helpers/transporter.helper.js";

const createTransporter = async () => {
  const gmailMaster = process.env.GMAIL_MASTER;
  const clientId = process.env.OAUTH2_CLIENT_ID;
  const clientSecret = process.env.OAUTH2_CLIENT_SECRET;
  const refreshToken = process.env.OAUTH2_REFRESH_TOKEN;

  transporterHelper.checkEnvironment(
    gmailMaster,
    clientId,
    clientSecret,
    refreshToken
  );

  const accessToken = await transporterHelper.getOauth2AccessToken(
    clientId,
    clientSecret,
    refreshToken
  );

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
