import { Elysia } from "elysia";
import { connect } from "./database/connection";
import { articleRouter } from "./routes/articles";
import cors from "@elysiajs/cors";
import swagger from "@elysiajs/swagger";

connect();

const port : string = process.env.PORT ?? "8080";

new Elysia({prefix:"/api"})
  .use(swagger())
  .use(cors())
  .get("/hello", () => "test")
  .use(articleRouter)
  .listen(port, () => {
  console.log("Listening on port " + port)
  }
);
