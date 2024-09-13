import Elysia, { t } from "elysia";
import { CreateArticle, GetArticles, UpdateArticle } from "../controllers/ArticleController";

export const articleRouter : Elysia = new Elysia()
.group("/articles", app => 
  app 
    .get("/", GetArticles)
    .guard(
    {
      body: t.Object({
        "title" : t.String(),
        "content" : t.String(),
      })
    }, 
    (app) => 
      app
        .post("/", CreateArticle)
        .put("/:id", UpdateArticle)
  )
);
