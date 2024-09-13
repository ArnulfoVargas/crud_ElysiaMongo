import {Context, t} from "elysia"
import ResponseDTO from "../dto/responseDto";
import { Article } from "../models/ArticleModel";
import * as validator from "validator";

export const CreateArticle = async (ctx : Context) => {

  interface Req {
    title: string,
    content: string
  }
  // Get params to save
  const body = ctx.body as Req;

  const res : ResponseDTO =  {} as ResponseDTO;

  try {

  // Validate data
    const titleHasContent : boolean = !validator.isEmpty(body.title) && validator.isLength(body.title ,{min: 5, max: undefined});
    const bodyHasContent : boolean = !validator.isEmpty(body.content);

    if (!titleHasContent || !bodyHasContent) throw new Error("No valid data");

  // Create Object to save
    const article = new Article(body);
    const obj = await article.save();
    if (!obj) throw new Error("Cannot save");

  // Asing values to model based object
    article.title = body.title;

  // Return the result
    return {
      error: false,
      data: obj 
    } as ResponseDTO;

  } catch (err) {
    res.error = true;
    res.error_desc = "Error was ocured creating the article";
    ctx.set.status = 400;
    validator.is
    
    return res; 
  }
}

export const UpdateArticle = (ctx : Context) => {
  const {params : {id}} = ctx;

  return id;
}

export const GetArticles = async(ctx : Context) => {
  const articles = await Article.find({}).exec();

  return articles;
}
