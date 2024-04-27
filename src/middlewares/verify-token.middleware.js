import jwt from "jsonwebtoken";
import "dotenv/config";

const verifyTokenMiddleware = (req, res, next) => {
  const accessToken = req.cookies["accessToken"];
  const jwtAccessTokenSecretKey = process.env.JWT_ACCESS_TOKEN_SECRET_KEY;

  if (!accessToken || !jwtAccessTokenSecretKey) {
    return res
      .status(401)
      .json({ error: "access token or jwt secret is required" });
  }

  try {
    const jwtPayload = jwt.verify(accessToken, jwtAccessTokenSecretKey);
    req.userData = jwtPayload;
    next();
  } catch (error) {
    return res.status(401).json({ error: "access token is invalid" });
  }
};

export default verifyTokenMiddleware;
