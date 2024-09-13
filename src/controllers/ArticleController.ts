import {Context, t} from "elysia"
import ResponseDTO from "../dto/responseDto";
import { Article } from "../models/ArticleModel";
import * as validator from "validator";
import mongoose from "mongoose";

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
};

export const UpdateArticle = (ctx : Context) => {
  const {params : {id}} = ctx;

  return id;
};

export const GetArticles = async(ctx : Context) => {
  const limit = parseInt(ctx.query["limit"] ?? '3');
  const offset = parseInt(ctx.query["offset"] ?? '0');
  const articles = await Article
    .find({})
    .sort({date: -1})
    .skip(offset) // offset in sql
    .limit(+limit) 
    .exec();

  return articles;
};

export const GetOneArticle = async (ctx : Context) => {
  try {
    const param = ctx.params["id"];
    const exists = await Article.exists({_id : param}).exec();

    if (!exists) throw new Error("ID doesnt exists");

    const article = await Article.findOne({_id: {"$eq": param}});

    return {
      error: false,
      data: article
    } as ResponseDTO;
  } catch (err) {
    return {
      error: true,
      error_desc: "Error fetching the article"
    } as ResponseDTO;
  }
};
