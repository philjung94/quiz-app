import path from "path";
import express from "express";
import hbs from "express-handlebars";
import methodOverride from "method-override";
import fileUpload from "express-fileupload";
import * as db from "./db";
import * as helpers from "./helpers";

// Constants
const PORT = 8080;
const HOST = "0.0.0.0"; // Must run on the generic host to expose containerised web server to host machine.

// App
async function setupApp() {
  const { default: routes } = await import("./routes");
  const app = express();

  app.engine("hbs", hbs({ extname: ".hbs", helpers }));
  app.set("view engine", "hbs");
  app.set("views", path.join(__dirname, "views"));
  app.use(express.urlencoded({ extended: true }));
  app.use(
    methodOverride((req) => {
      if (req.body && typeof req.body === "object" && "_method" in req.body) {
        const method = req.body._method;
        delete req.body._method;
        return method;
      }
    }),
  );
  app.use(fileUpload());
  app.use(routes);

  // Home
  app.get("/", (_, res) => res.render("home"));

  app.listen(PORT, HOST);
  console.log(`Running on http://${HOST}:${PORT}`);
}

db.setup().then(setupApp);
