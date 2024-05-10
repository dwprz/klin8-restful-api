import jwt from "jsonwebtoken";
import "dotenv/config";

const verifyQRCodeTokenMiddleware = (req, res, next) => {
  const qrcodeToken = req.headers["authorization"];
  const secretKey = process.env.JWT_QRCODE_TOKEN_SECRET_KEY;

  if (!secretKey) {
    return res
      .status(422)
      .json({ error: "qrcode token secret key is not provided" });
  }

  try {
    const { orderId } = jwt.verify(qrcodeToken, secretKey);
    req["orderId"] = orderId;
    next();
  } catch (error) {
    return res.status(401).json({ error: "qrcode token is invalid" });
  }
};

export default verifyQRCodeTokenMiddleware;
