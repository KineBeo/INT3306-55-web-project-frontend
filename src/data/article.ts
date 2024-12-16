import { components } from "@/types/api";

export type CreateArticle = components["schemas"]["CreateArticleDto"];
export type UpdateArticle = components["schemas"]["UpdateArticleDto"];

export interface Article {
  id: number;
  title: string;
  description: string;
  content: string;
  image_url: string;
  status: string;
  created_at: string;
  updated_at: string;
  published_at: string;
  user: {
    id: number;
    fullname: string;
  };
};
