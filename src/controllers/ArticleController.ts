import {Context} from "elysia"
import ResponseDTO from "../dto/responseDto";
import { Article } from "../models/ArticleModel";
import { unlink } from "node:fs/promises";
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
};

export const UpdateArticle = async(ctx : Context) => {
  try {
    interface Req {
      title: String,
      content: String
    }

    const {params : {id}} = ctx;
    const body : Req = ctx.body as Req; 
    
    const titleHasContent : boolean = !validator.isEmpty(body.title) && validator.isLength(body.title ,{min: 5, max: undefined});
    const bodyHasContent : boolean = !validator.isEmpty(body.content);

    if (!titleHasContent || !bodyHasContent) throw new Error();
    if (!await Article.exists({_id : id})) throw new Error();

    const article = await Article.findOneAndUpdate({_id : id}, body, {new: true}).exec();

    return {
      error: false,
      data: article
    } as ResponseDTO;
  } catch (err) {
    return {
      error: true,
      error_desc: "Error updating"
    } as ResponseDTO;
  }
};

export const GetArticles = async(ctx : Context) => {
  const limit : number = parseInt(ctx.query["limit"] ?? "") ?? 3;
  const offset : number = parseInt(ctx.query["offset"] ?? "") ?? 0;

  const articles = await Article
    .find({})
    .sort({date: -1})
    .skip(offset) // offset in sql
    .limit(limit) 
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

export const DeleteOneArticle = async (ctx : Context) => {
  try {
    const id = ctx.params["id"];

    const exists = await Article.exists({_id : id}).exec();
    if (!exists) throw new Error("Id doesnt exists");

    const article = await Article.findOneAndDelete({_id : id});

    return {
      error: false,
      data: article
    } as ResponseDTO;
  } catch (err) {
    return {
      error: true,
      error_desc: "Error deleting article"
    } as ResponseDTO;
  }
}

export const UploadFile = async (ctx : Context) => {
  interface Req {
    file : Blob
  }

  const body : Req = ctx.body as Req;
  const params : string = ctx.params["id"];

  const baseDir = Bun.main.replace("src\\index.ts", "images\\");
  const fileName = `${Date.now()}_${body.file.name}`
  const dir = baseDir + fileName;

  try {
    await Bun.write(dir, body.file);
    const article = await Article.findById(params)
     
    if (article && article.image)
    {
      await unlink(article.image);
    } else throw new Error();
  } catch (err) {
    return {
      error: true,
      error_desc: "Error while storing image"
    } as ResponseDTO;
  }

  try {
    const article = await Article.findOneAndUpdate({_id:params}, {image: fileName}, {new: true}).exec();
    return {
      error: false,
      data: article
    } as ResponseDTO;
  } catch (err) {
    return {
      error: true,
      error_desc: "Error updating data"
    } as ResponseDTO;
  }
}

export const GetFile = async(ctx : Context) => {
  const fileName = ctx.params["filename"];
  const baseDir = Bun.main.replace("src\\index.ts", "images\\");
  const dir = baseDir + fileName;

  try {
    const file = Bun.file(dir);
    const exists = await file.exists();
    if (!exists) throw new Error()

    return file;
  } catch(err) {
    return {
      error: true, 
      error_desc: "File doesnt exists"
    } as ResponseDTO;
  }
}

export const SearchArticle = async(ctx : Context) => {
  const query = ctx.query["q"];

  try {
    const articles = await Article.find({"$or" : [{
          "title" : { 
            "$regex" : query, 
            "$options": "i"
          }
        }, {
          "content" : {
            "$regex" : query,
            "$options" : "i"
          }
        }
      ]
    }).sort({date: -1}).exec();

    if (!articles) throw new Error();

    return {
      error: false,
      data: articles
    } as ResponseDTO;
  } catch (err) {
    return {
      error: true,
      error_desc: "Couldnt get"
    } as ResponseDTO;
  }
}
