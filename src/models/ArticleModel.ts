import { Schema, model } from "mongoose"

const ArticleScheme = new Schema({
  title: {
    type: String,
    require: true,
  }, 
  content: {
    type: String, 
    require: true,
  },
  date: {
    type: Date,
    default: Date.now()
  },
  image: {
    type: String,
    require: false,
  },
}, {
  versionKey: false
});

export const Article = model("Article", ArticleScheme, "articles");
