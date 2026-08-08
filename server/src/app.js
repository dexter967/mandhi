import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import menuRoutes from "./routes/menuRoutes.js";

const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Restaurant CMS API Running 🚀",
  });
});

app.use("/api/menu", menuRoutes);

export default app;
