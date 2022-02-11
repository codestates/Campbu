import aws from 'aws-sdk';
import { css } from '@emotion/react';

const rootPixel: number = 16;

export const color = {
  point: '#ED662C',
  deep: '#395825',
  mid: '#609238',
  light: '#eeefcb',
  placeholder: '#c4c4c4',
  border: '#dedede',
  white: '#ffffff',
};
export const rem = (px: number): string => `${px / rootPixel}rem`;
export const shadow = '0px 4px 10px rgba(0, 0, 0, 0.1)';
export const hover = '0px 4px 10px rgba(0, 0, 0, 0.25)';

export const relative = css`
  position: relative;
`;
export const absolute = css`
  position: absolute;
`;
export const confirm = css`
  background-color: #ffeaff;
`;
export const flex = css`
  display: flex;
`;
export const textDecorationNone = css`
  text-decoration: none;
  :visited {
    color: black;
  }
`;
export const flexBetween = css`
  display: flex;
  justify-content: space-between;
`;
export const flexVertical = css`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const modalBackgroundStyle = css`
  z-index: 999;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.4);
  display: grid;
  place-items: center;
`;

export const hidden = css`
  position: absolute;
  width: 0;
  height: 0;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  border: 0;
`;

export const colorPlaceholder = css`
  color: ${color.placeholder};
`;
export const inactive = css`
  :focus {
    outline: none;
  }
  :hover {
    cursor: not-allowed;
  }
`;

export const reviews: { id: number; review: string }[] = [
  { id: 1, review: '질 좋은 물건' },
  { id: 2, review: '합리적인 대여비' },
  { id: 3, review: '깨끗한 반납' },
  { id: 4, review: '상세한 물품 설명' },
  { id: 5, review: '정확한 시간 약속' },
  { id: 6, review: '빠른 답장' },
  { id: 7, review: '질 낮은 물건' },
  { id: 8, review: '비싼 대여비' },
  { id: 9, review: '반납 시 손상/훼손' },
  { id: 10, review: '실제와 다른 상품 설명' },
  { id: 11, review: '느린 답장 및 지각' },
  { id: 12, review: '욕설 등의 비매너' },
];


export const host = 'https://campbuserver.cf';


export const addressAPI = `U01TX0FVVEgyMDIyMDExMDIxMjMzNTExMjExNzA=`;

export type reviewsType = {
  id: number;
  review: string;
  count?: number;
}[];

export const calCampbuIndicator = (reviews: reviewsType) => {
  let positive = 0;
  let negative = 0;
  reviews.forEach((el) => {
    if (el.id < 7) {
      positive = positive + (el.count ? el.count : 0);
    } else {
      negative = negative + (el.count ? el.count : 0);
    }
  });
  let cal =
    positive - negative > 0
      ? 0
      : positive - negative < -100
      ? -100
      : positive - negative;
  return (100 + cal) / 100;
};

//axios
// export const config = {
//   headers: {
//     'Content-Type': 'application/json',
//   },
//   withCredentials: true,
// };

//? aws s3
const region = 'ap-northeast-2';
const bucketName = 'image-upload-storage-test';
const accessKeyId = process.env.REACT_APP_AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.REACT_APP_AWS_SECRET_ACCESS_KEY;

const s3 = new aws.S3({
  region,
  accessKeyId,
  secretAccessKey,
  signatureVersion: 'v4',
});
// 단일 오브젝트 삭제
export function deleteS3Img(url: string) {
  const divUrl = url.split('/');
  const key = divUrl[divUrl.length - 1];
  s3.deleteObject(
    {
      Bucket: bucketName,
      Key: key,
    },
    (err, data) => {
      if (err) {
        throw err;
      }
    },
  );
}

// 여러 오브젝트 삭제

export function deleteS3Imgs(
  obj: {
    Key: string;
  }[],
) {
  const params = {
    Bucket: bucketName,
    Delete: {
      Objects: obj,
      Quiet: false,
    },
  };
  s3.deleteObjects(params, function (err, data) {
    if (err) console.log(err, err.stack);
    else console.log(data);
  });
}
