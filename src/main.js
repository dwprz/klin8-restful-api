import "dotenv/config";
import app from "./apps/app.js";

const appPort = process.env.APP_PORT;

app.listen(appPort, () => {
  console.log(`App running in port ${appPort}`);
});
