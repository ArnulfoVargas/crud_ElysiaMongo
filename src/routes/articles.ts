import Elysia, { BodyHandler, t } from "elysia";
import { CreateArticle, DeleteOneArticle, GetArticles, GetOneArticle, UpdateArticle, UploadFile } from "../controllers/ArticleController";

export const articleRouter : Elysia = new Elysia()
.group("/articles", app => 
  app 
    .get("/", GetArticles, {
      query: t.Object(
        {
          limit: t.Optional(t.Integer()), 
          offset: t.Optional(t.Integer()) 
        })
      })
    .get("/:id", GetOneArticle, {params: t.Object({id: t.String()})})
    .delete("/:id", DeleteOneArticle, {params: t.Object({id: t.String()})})
    .post("/upload/:id", UploadFile, {
      params: t.Object({id: t.String()}),
      body: t.Object({
        file: t.File()
      })
    })

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
        .put("/:id", UpdateArticle, {params: t.Object({id: t.String()})})
  )
);
