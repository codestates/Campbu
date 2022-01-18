/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import Input from '../components/Input';
import {
  color,
  flexVertical,
  flexBetween,
  rem,
  relative,
  hidden,
  config,
  host,
} from '../common';
import { Button } from '../components/Button';
import BackButton from '../components/BackButton';
import Calendar from '../components/CalendarForWrightingpage';
import { useState, useEffect } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import {
  selectDate,
  searchAddress,
  selectAddress,
  showAddressList,
  preView,
  imgFile,
  post_id,
} from '../Atom';
import axios from 'axios';
import SelectAddressList from '../components/SelectAddress';
import { useNavigate } from 'react-router-dom';
import Complete from '../components/Complete';
import { noticeNo, reqMsgStyle } from './Mypage';

const fixAddressList = css`
  position: absolute;
`;

const textareaStyle = css`
  width: 29.9375rem;
  height: 11.125rem;
  padding: 0.75rem;
  font-size: 1rem;
  border: 1px solid ${color.border};
  border-radius: 0.3125rem;
  resize: none;
  ::placeholder {
    font-size: 1rem;
    color: ${color.placeholder};
  }
`;

const selectStyle = css`
  width: ${rem(205)};
  height: ${rem(50)};
  color: ${color.placeholder};
  border: 1px solid ${color.border};
  border-radius: 0.3125rem;
  padding: 0 0.75rem;
  font-size: 1rem;
  margin-top: ${rem(32)};
`;
const marginTop = css`
  margin-top: 1rem;
`;

const onLoadImgStyle = css`
  border-radius: 0.35rem;
  margin-left: 0.688rem;
  text-align: center;
  border: 1px solid ${color.border};
  width: 7rem;
  height: 7rem;
  transition: 0.1s;
  color: rgba(0, 0, 0, 0);
  :hover {
    color: ${color.placeholder};
  }
`;

const imgStyle = css`
  border-radius: 0.3125rem;
  text-align: center;
  object-fit: cover;
  width: 100%;
  height: 100%;
  transition: 0.1s;
  :hover {
    opacity: 0.4;
  }
`;

const inputFileCenter = css`
  display: flex;
  justify-content: center;
  align-items: center;
`;
const labelStyle = css`
  color: ${color.placeholder};
  font-size: 5rem;
  width: 7rem;
  height: 7rem;
  line-height: 7.6rem;
  transition: 0.1s;
  :hover {
    opacity: 0.6;
  }
  :active {
    opacity: 0.95;
  }
`;
const xStyle = css`
  font-size: 2rem;
  position: absolute;
  top: 0.1rem;
  right: 0.5rem;
`;

const uploadImgStyle = css`
  width: ${rem(850)};
  display: flex;
  align-content: center;
  align-items: center;
`;

const subTitleStyle = css`
  margin-left: 0.75rem;
  color: ${color.point};
  font-weight: 700;
  margin-bottom: 0.75rem;
`;

const UploadImg = () => {
  const [imgFiles, setFiles] = useRecoilState(imgFile);
  const [imageUrls, setImageUrls] = useRecoilState(preView);

  const insertImgHandler = async (e: any) => {
    const file = e.target.files[0];
    // 파일이 이미지파일이아니면 등록못하게
    const geturlAPI = `${host}/newurl`;
    const { url } = await fetch(geturlAPI).then((res) => res.json());

    await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: file,
    });

    const imageUrl = url.split('?')[0];
    console.log(imageUrl);
    setImageUrls([...imageUrls, imageUrl]);
  };

  const deleteImg = (target: number) => {
    setImageUrls(imageUrls.filter((el, idx) => idx !== target));
  };
  return (
    <div css={[uploadImgStyle]}>
      {imageUrls.map((el, idx) => {
        return (
          <div
            key={idx}
            css={[
              onLoadImgStyle,
              relative,
              css`
                margin-left: ${idx ? null : rem(0)};
              `,
            ]}
          >
            <img css={imgStyle} draggable="false" src={el} alt={el} />
            <div css={xStyle} onClick={() => deleteImg(idx)}>
              ×
            </div>
          </div>
        );
      })}
      {imageUrls.length > 6 ? null : (
        <form
          css={[
            onLoadImgStyle,
            inputFileCenter,
            css`
              margin-left: ${imageUrls.length ? null : rem(0)};
            `,
          ]}
          encType="multiparty/form-data"
        >
          <label htmlFor="file" css={labelStyle}>
            +
          </label>
          <input
            css={hidden}
            type="file"
            id="file"
            accept="image/*"
            onChange={insertImgHandler}
          />
        </form>
      )}
    </div>
  );
};

export const PostModify = () => {
  //전역상태
  const [unavailableDates, setUnavailableDates] = useRecoilState(selectDate);
  const [address, setAddress] = useRecoilState(selectAddress);
  const setSerchAdress = useSetRecoilState(searchAddress);
  const [showAdress, setShowAdress] = useRecoilState(showAddressList);
  const imgUrls = useRecoilValue(preView);
  const [postId, setPostId] = useRecoilState(post_id);

  //지역상태
  const [setCategory, setSetCategory] = useState<string>('');
  const [deposit, setDeposit] = useState<number>();
  const [rentalFee, setRentalFee] = useState<number>();
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [reqState, setReqState] = useState<string>('ok');
  const [isComplete, setIsComplete] = useState(false);
  const setImageUrls = useSetRecoilState(preView);
  const navigate = useNavigate();

  useEffect(() => {
    console.log('postId', postId);

    if (postId) {
      const API = `${host}/product/post/${postId}`;

      axios
        .get(API, config)
        .then((res) => {
          interface postInfoType {
            address: string;
            category: string;
            contetnt: string;
            title: string;
            deposit: number;
            rental_fee: number;
            content: string;
            img_urls: string[];
            unavailable_dates: string[];
          }
          const postInfo: postInfoType = res.data.posts;
          setTitle(postInfo.title);
          setAddress(postInfo.address);
          setSetCategory(postInfo.category);
          setDeposit(postInfo.deposit);
          setRentalFee(postInfo.rental_fee);
          setContent(postInfo.content);
          setImageUrls([...postInfo.img_urls]);
          setUnavailableDates([...postInfo.unavailable_dates]);
        })
        .catch((err) => console.log(err));
    }
  }, [postId]);

  const category: string[] = [
    '카테고리를 입력하세요',
    '패키지',
    '텐트/침낭',
    '그릴/버너',
    '의자/테이블',
    '배낭/아이스박스',
    '취식용품',
    '기타',
  ];

  interface reqMsgType {
    [key: string]: string;
  }
  const reqMsg: reqMsgType = {
    ok: '',
    title: '* 제목을 입력해주세요',
    category: '* 카테고리를 선택해주세요',
    address: '* 주소를 선택해주세요',
    deposit: '* 보증금을 입력해주세요',
    rentalFee: '* 대여비를 입력해주세요',
    content: '* 물품에 대한 설명을 작성해주세요',
    imgUrls: '* 최소 1장의 사진을 등록해주세요',
  };

  const titleHandler = (e: any) => setTitle(e.target.value);
  const depositHandler = (e: any) => setDeposit(e.target.value);
  const rentalFeeHandler = (e: any) => setRentalFee(e.target.value);
  const contentHandler = (e: any) => setContent(e.target.value);
  const setCategoryHandler = (e: any) => setSetCategory(e.target.value);
  const addressHandler = (e: any) => setAddress(e.target.value);

  const getAdress = () => {
    if (address.length > 0) {
      axios
        .get(
          `https://www.juso.go.kr/addrlink/addrLinkApi.do?currentPage=1&countPerPage=50&keyword=${address}&confmKey=${process.env.REACT_APP_ADDRESS_API}&resultType=json`,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        )
        .then((res) => {
          const address = res.data.results.juso;
          const adressList: string[] = [];
          if (address) {
            const allSerchAdress = address.map((el: any) => {
              return `${el.siNm} ${el.sggNm} ${el.emdNm}`;
            });

            allSerchAdress.forEach((el: string, idx: number) => {
              if (allSerchAdress.indexOf(el) === idx) {
                adressList.push(el);
              }
            });
          }

          setSerchAdress(adressList);
          setShowAdress(true);
        });
    }
  };

  const modifyHandler = () => {
    interface postType {
      category: string;
      deposit: number | undefined;
      rental_fee: number | undefined;
      unavailable_dates: string[] | [];
      title: string;
      content: string;
      address: string;
      img_urls: string[];
    }

    const data: postType = {
      category: setCategory,
      deposit: deposit,
      rental_fee: rentalFee,
      unavailable_dates: unavailableDates,
      title: title,
      content: content,
      address: address,
      img_urls: imgUrls,
    };

    if (!title) return setReqState('title');
    if (!setCategory) return setReqState('category');
    if (!address) return setReqState('address');
    if (!deposit) return setReqState('deposit');
    if (!rentalFee) return setReqState('rentalFee');
    if (!content) return setReqState('content');
    if (!imgUrls.length) return setReqState('imgUrls');

    const API = `${host}/post/${postId}`;
    console.log('포스트 등록요청');
    axios
      .patch(API, data, config)
      .then((res: any) => {
        if (res.status === 200) {
          setIsComplete(true);

          setPostId(0);
        }
      })
      .catch((err) => console.log(err));
  };

  const deleteHandler = () => {
    if (postId) {
      const API = `${host}/product/post/${postId}`;
      axios
        .delete(API, config)
        .then((res) => {
          console.log(res.status);
          setPostId(0);
          navigate('/lists/resistlist');
        })
        .catch((err) => console.log(err));
    }
  };

  return (
    <div css={flexVertical}>
      <div
        css={css`
          width: ${rem(850)};
        `}
      >
        <BackButton />
      </div>
      <div>
        <div css={marginTop}>
          <Input
            width={850}
            height={55}
            borderStyle="none none solid none"
            borderRadius={1}
            placeholder="제목을 입력해주세요"
            onChange={titleHandler}
            value={title}
          />
        </div>
        <div css={flexBetween}>
          <div
            css={css`
              width: 29.9375rem;
            `}
          >
            <select
              css={selectStyle}
              onChange={setCategoryHandler}
              value={setCategory}
            >
              {category.map((el, idx) => (
                <option key={idx}>{el}</option>
              ))}
            </select>
            <div css={[marginTop, flexBetween]}>
              <Input
                width={372}
                height={50}
                borderRadius={5}
                placeholder="주소를 검색하세요"
                onChange={addressHandler}
                value={address}
              />
              <Button
                text="주소 검색"
                width={rem(97)}
                height={rem(50)}
                background={color.white}
                color={color.point}
                size={rem(16)}
                border={`1px solid ${color.point}`}
                onClick={getAdress}
                cursor="pointer"
                hover="0.7"
              />
            </div>
            <div css={fixAddressList}>
              {showAdress ? <SelectAddressList /> : null}
            </div>
            <div
              css={[
                marginTop,
                flexBetween,
                css`
                  justify-content: flex-start;
                  align-items: center;
                `,
              ]}
            >
              <Input
                width={205}
                height={50}
                borderRadius={5}
                placeholder="보증금"
                onChange={depositHandler}
                type="number"
                value={String(deposit)}
              />
              <div
                css={css`
                  margin-left: ${rem(35)};
                `}
              >
                <Input width={19} height={19} type="checkbox" />
              </div>
              <span
                css={css`
                  margin-left: ${rem(17)};
                `}
              >
                대여자와 협의
              </span>
            </div>

            <div
              css={[
                marginTop,
                flexBetween,
                css`
                  justify-content: flex-start;
                  align-items: center;
                `,
              ]}
            >
              <Input
                width={205}
                height={50}
                borderRadius={5}
                placeholder="대여비"
                onChange={rentalFeeHandler}
                type="number"
                value={String(rentalFee)}
              />
              <div
                css={css`
                  margin-left: ${rem(35)};
                `}
              >
                <Input width={19} height={19} type="checkbox" />
              </div>
              <span
                css={css`
                  margin-left: ${rem(17)};
                `}
              >
                대여자와 협의
              </span>
            </div>

            <div css={marginTop}>
              <textarea
                css={textareaStyle}
                placeholder="용품에 대한 설명을 입력해주세요"
                onChange={contentHandler}
                value={content}
              />
            </div>
          </div>
          <div>
            <div
              css={css`
                margin-top: ${rem(32)};
              `}
            >
              <div css={subTitleStyle}>대여 불가능한 날짜 선택하기</div>
              <div>
                <Calendar />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        css={css`
          width: ${rem(850)};
          margin-top: 1rem;
        `}
      >
        <span css={subTitleStyle}>사진 등록하기</span>
        <span
          css={css`
            color: ${color.placeholder};
            font-size: ${rem(14)};
            margin-left: 1rem;
          `}
        >
          {' '}
          * 최대 7장까지 등록가능 합니다.
        </span>
      </div>
      <div
        css={[
          flexBetween,
          css`
            justify-content: flex-start;
            margin-top: 0.6rem;
          `,
        ]}
      >
        <UploadImg />
      </div>
      <div css={[noticeNo, reqMsgStyle]}>{reqMsg[reqState]}</div>
      <div>
        <Button
          text="수정"
          width={rem(97)}
          height={rem(40)}
          background={color.point}
          color={color.white}
          border="none"
          size={rem(14)}
          onClick={modifyHandler}
          margin="0 1rem"
          cursor="pointer"
          hover="0.85"
        />
        <Button
          text="삭제"
          width={rem(97)}
          height={rem(40)}
          background={color.placeholder}
          color={color.white}
          border="none"
          size={rem(14)}
          onClick={deleteHandler}
          margin="0 1rem"
          cursor="pointer"
          hover="0.85"
        />
      </div>
      {isComplete ? (
        <Complete
          text="물품이 수정되었습니다."
          onClick={() => {
            navigate('/lists/resistlist');
          }}
        />
      ) : null}
    </div>
  );
};

export default PostModify;
