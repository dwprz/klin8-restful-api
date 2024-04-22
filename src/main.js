import app from "./apps/app/app.js";
import "dotenv/config";

const appPort = process.env.APP_PORT;

app.listen(appPort, () => {
  console.log(`App running in port ${appPort}`);
});
