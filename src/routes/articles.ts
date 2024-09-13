import Elysia, { BodyHandler, t } from "elysia";
import { CreateArticle, DeleteOneArticle, GetArticles, GetFile, GetOneArticle, SearchArticle, UpdateArticle, UploadFile } from "../controllers/ArticleController";

export const articleRouter : Elysia = new Elysia()
.group("/articles", app => 
  app 
    .get("/", GetArticles, {
      type: "application/json",
      query: t.Object(
        {
          limit: t.Optional(t.Integer()), 
          offset: t.Optional(t.Integer()) 
        })
    })
    .guard(
      {
        params: t.Object({id: t.String()})
      },
      (app) => app
        .get("/:id", GetOneArticle)
        .delete("/:id", DeleteOneArticle)
    )
    .post("/upload/:id", UploadFile, {
      type: "application/json",
      params: t.Object({id: t.String()}),
      body: t.Object({
        file: t.File({type: "image"})
      })
    })
    .get("/files/:filename", GetFile, {
      type: "application/json",
      params: t.Object({
        filename: t.String()
      })
    })
    .get("/search", SearchArticle, {
      query: t.Object({
        q: t.String()
      })
    })
    .guard(
    {
      type: "application/json",
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
