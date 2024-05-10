import jwt from "jsonwebtoken";
import "dotenv/config";

const verifyTokenMiddleware = (req, res, next) => {
  const accessToken = req.cookies["accessToken"];
  const secretKey = process.env.JWT_ACCESS_TOKEN_SECRET_KEY;

  if (!secretKey) {
    return res.status(422).json({ error: "jwt secret key is not provided" });
  }

  try {
    const jwtPayload = jwt.verify(accessToken, secretKey);
    req["userData"] = jwtPayload;
    next();
  } catch (error) {
    return res.status(401).json({ error: "access token is invalid" });
  }
};

export default verifyTokenMiddleware;
