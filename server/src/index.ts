import "reflect-metadata";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import router from "./routes/index";
import { createConnection } from "typeorm";
import http from "http";

const app = express();
export const server = http.createServer(app);
const port = 5050;

createConnection()
  .then(async (connection) => {
    const review = getRepository(reviews);
    await review.insert([
      { content: '질 좋은 물건' },
      { content: '합리적인 대여비' },
      { content: '깨끗한 반납' },
      { content: '상세한 물품 설명' },
      { content: '정확한 시간 약속' },
      { content: '빠른 답장' },
      { content: '질 낮은 물건' },
      { content: '비싼 대여비' },
      { content: '반납 시 손상/훼손' },
      { content: '실제와 다른 상품 설명' },
      { content: '느린 답장 및 지각' },
      { content: '욕설 등의 비매너' },
  ]);
})
.catch((error) => console.log(error));