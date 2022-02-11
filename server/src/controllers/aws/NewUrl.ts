import { Request, Response } from 'express';
import { generateUploadURL } from './s3Url';

export default async (req: Request, res: Response) => {
  const url = await generateUploadURL();
  res.json({ url });
};
