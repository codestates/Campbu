/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import Gage from '../components/Gage';
import {
  color,
  rem,
  host,
  reviews,
  hidden,
  relative,
  colorPlaceholder,
  inactive,
  reviewsType,
  calCampbuIndicator,
  deleteS3Img,
} from '../common';
import ReviewBox from '../components/ReviewBox';
import ReviewTitle from '../components/ReviweTitle';
import axios from 'axios';
import { useState, useEffect } from 'react';
import {
  forceRender,
  isLogin,
  jwtToken,
  likedProducts,
  loginUserInfo,
  showCompleteModal,
} from '../Atom';
import {
  useRecoilState,
  useRecoilValue,
  useResetRecoilState,
  useSetRecoilState,
} from 'recoil';
import { useNavigate } from 'react-router-dom';
import Profile from '../assets/Profile.svg';
import BackButton from '../components/BackButton';
import Complete from '../components/Complete';

const imgStyle = css`
  width: ${rem(114)};
  height: ${rem(114)};
  border: 4px solid ${color.point};
  border-radius: 50%;
  background-size: cover;
  background-position: 50% 50%;
`;

const hello = css`
  text-align: center;
  font-size: ${rem(20)};
  font-weight: 700;
  margin-top: ${rem(24)};
  margin-bottom: ${rem(30)};
`;

const wnr = css`
  width: ${rem(265)};
  border-radius: ${rem(5)};
`;
const verticalAlign = css`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const inputStyle = css`
  height: ${rem(44)};
  border: 1px solid ${color.border};
  padding-left: ${rem(14)};
  font-size: ${rem(14)};
  margin-top: ${rem(11)};
  ::placeholder {
    color: ${color.placeholder};
  }
`;

const contentAlign = css`
  display: flex;
  font-size: ${rem(14)};
  justify-content: space-between;
  align-items: center;
  margin-top: ${rem(31)};
`;

const buttonStyle = css`
  border: none;
  height: ${rem(45)};
  color: ${color.white};
  background-color: ${color.point};
  font-size: ${rem(14)};
  transition: 0.1s;
  :hover {
    opacity: 0.8;
    cursor: pointer;
  }
  :active {
    opacity: 0.95;
  }
`;

const noticeOk = css`
  font-size: ${rem(10)};
  color: ${color.mid};
`;
export const noticeNo = css`
  font-size: ${rem(10)};
  color: ${color.point};
`;

const validButtonInactive = css`
  color: ${color.border};
  font-weight: 700;
`;
const validButtonActive = css`
  color: ${color.point};
  font-weight: 700;
  :hover {
    color: ${color.point};
    cursor: pointer;
    opacity: 0.8;
  }
  :active {
    opacity: 0.95;
  }
`;

const reviewsAlign = css`
  width: ${rem(371)};
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
`;
const hiddenUpload = css`
  position: absolute;
  line-height: ${rem(107)};
  color: white;
  top: 0;
  left: 0;
  background-color: black;
  opacity: 0;
  text-align: center;
  transition: 0.2s;
  :hover {
    opacity: 0.4;
    cursor: pointer;
  }
  :active {
    opacity: 0.1;
  }
`;

export const reqMsgStyle = css`
  height: 1rem;
  margin-top: ${rem(14)};
  margin-bottom: ${rem(3)};
`;

const API = `${host}/userinfo/account`;

function Mypage() {
  //????????????
  const setIsLogin = useSetRecoilState(isLogin);

  //????????????
  const [currentNickName, setCurrentNickName] = useState('');
  const [nickname, setNickname] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [userImg, setUserImg] = useState<string>('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [getReviews, setGetReviews] = useState<reviewsType>([]);
  const [passwordValid, setPasswordValid] = useState(false);
  const [nickDuplicateClick, setNickDuplicateClick] = useState(false);
  const [nickDupliacte, setNickDupliacte] = useState(false);
  const [reqState, setReqState] = useState<string>('ok');
  const resetLoginUserInfo = useResetRecoilState(loginUserInfo);
  const resetLikedPosts = useResetRecoilState(likedProducts);
  const token = useRecoilValue(jwtToken);

  const setLoginUserInfo = useSetRecoilState(loginUserInfo);
  const [selectImgFile, setSelectImgFile] = useState<any>();
  const [earlyImgUrl, setEarlyImgUrl] = useState<string>('');
  const [complete, setComplete] = useRecoilState(showCompleteModal);

  const navigate = useNavigate();
  // ??????????????????
  useEffect(() => {
    const API = `${host}/userinfo/account`;

    axios
      .get(API, {
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      })
      .then((res) => {
        const userinfo = res.data;
        setEarlyImgUrl(userinfo.users.users_img);
        setUserImg(userinfo.users.users_img);
        setCurrentNickName(userinfo.users.nickname);
        setEmail(userinfo.users.email);
        //?????? review ??????
        let tempReviews: reviewsType = [...reviews];

        userinfo.reviews.forEach((el: any) => {
          tempReviews[el.reviews_id - 1] = {
            ...tempReviews[el.reviews_id - 1],
            count: el.count,
          };
        });
        setGetReviews(tempReviews);
      });
  }, []);

  interface reqMsgType {
    [key: string]: string;
  }
  const reqMag: reqMsgType = {
    ok: '',
    nickname: '* ???????????? ??????????????????',
    password: '* ??????????????? ??????????????????',
  };

  const nicknameHandler = (e: any) => {
    setNickname(e.target.value);
    setNickDuplicateClick(false);
    setNickDupliacte(false);
  };
  const nicknameDuplicateCheckHandler = () => {
    if (nickname.length > 0) {
      setNickDuplicateClick(true);

      axios
        .get(`${host}/user/signup?nickname=${nickname}`)
        .then((res) => {
          if (res.status === 200) {
            setReqState('ok');
            setNickDupliacte(true);
          }
        })
        .catch((err) => {
          setNickDupliacte(false);
        });
    }
  };

  const emailHandler = (e: any) => setEmail(e.target.value);
  const passwordHandler = (e: any) => {
    const password = e.target.value;
    setPassword(password);
    const passwordValidator = /(?=.*[0-9])(?=.*[A-Za-z]).{8,}/g;
    setPasswordValid(passwordValidator.test(password));
  };

  const confirmPasswordHandler = (e: any) => setConfirmPassword(e.target.value);

  const campbuIndicator = calCampbuIndicator(getReviews);
  //! ?????? ?????? ?????? ??????
  const modifyAccount = async () => {
    if (!!nickname && !nickDupliacte) {
      return setReqState('nickname');
    }

    if (passwordValid && password === confirmPassword) {
      const geturlAPI = `${host}/newurl`;
      const { url } = await fetch(geturlAPI).then((res) => res.json());

      let userImg = earlyImgUrl;

      if (selectImgFile) {
        await fetch(url, {
          method: 'PUT',
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          body: selectImgFile,
        });
        userImg = url.split('?')[0];
      }

      const data: {
        nickname: string;
        password: string;
        users_img: string;
      } = {
        nickname: !nickname ? currentNickName : nickname,
        password: password,
        users_img: userImg,
      };

      axios
        .patch(API, data, {
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        })
        .then((res: any) => {
          interface loginUserInfoType {
            created_at: string;
            email: string;
            id: number;
            nickname: string;
            updated_at: string;
            users_img: string;
          }
          const userinfo: loginUserInfoType = res.data.users;
          setLoginUserInfo(userinfo);
          localStorage.setItem('isLogin', 'true');
          localStorage.setItem('userInfo', JSON.stringify(userinfo));
          deleteS3Img(earlyImgUrl);
          setEarlyImgUrl(userinfo.users_img);
          setCurrentNickName(userinfo.nickname);
          setUserImg(userinfo.users_img);
          setSelectImgFile('');
          setReqState('ok');
          setComplete(true);
        })
        .catch((err) => console.error(err));
    } else {
      return setReqState('password');
    }
  };

  const completeClick = () => {
    setComplete(false);
  };

  const deleteAccount = () => {
    setIsLogin(false);
    axios
      .get(`${host}/user/logout`)
      .then((res: any) => {
        localStorage.removeItem('isLogin');
        localStorage.removeItem('userInfo');
        resetLoginUserInfo();
        resetLikedPosts();
        axios
          .delete(API, {
            headers: {
              'Content-Type': 'application/json',
              authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          })
          .then((res) => {
            if (res.status === 200) {
              deleteS3Img(earlyImgUrl);
            }
          })
          .catch((err) => {
            console.log('???????????????');
          });
        navigate('/');
      })
      .catch((err) => console.error(err));
  };

  const insertImgHandler = async (e: any) => {
    const file = e.target.files[0];
    if (file) {
      const preViewUrl = URL.createObjectURL(file);
      setSelectImgFile(file);
      setUserImg(preViewUrl);
    }
  };

  return (
    <div style={{ paddingTop: `${rem(16)}` }}>
      <BackButton />
      <div
        css={css`
          width: ${rem(1280)};
          justify-content: center;
          margin: 0 auto;
          margin-top: ${rem(20)};
          display: flex;
        `}
      >
        {complete && (
          <Complete text="????????? ?????????????????????." onClick={completeClick} />
        )}
        <div
          css={[
            css`
              width: ${rem(430)};
              display: flex;
              flex-direction: column;
              align-items: center;
            `,
          ]}
        >
          <form encType="multiparty/form-data" css={relative}>
            <img src={userImg || Profile} css={[imgStyle, relative]} alt="" />
            <label css={[imgStyle, hiddenUpload]} htmlFor="file">
              ????????????
            </label>
            <input
              css={hidden}
              type="file"
              id="file"
              accept="image/*"
              onChange={insertImgHandler}
            />
          </form>

          <div css={hello}>{`???????????????, ${currentNickName} ???`}</div>
          <Gage ratio={campbuIndicator} />
          <div
            css={[
              wnr,
              css`
                margin-top: ${rem(10)};
                margin-bottom: ${rem(20)};
                font-weight: 700;
              `,
            ]}
          >
            {`???????????? ${campbuIndicator * 100}%`}
          </div>
          <ReviewTitle text="??????????????? ?????? ?????? ??????" width={371} />
          <div css={reviewsAlign}>
            {getReviews.map((review, idx) => {
              return review.id < 7 ? (
                <ReviewBox
                  key={idx}
                  content={review.review}
                  count={review.count}
                  isBad={false}
                  width={180}
                  margin={`${rem(5)} 0`}
                  fontColor={`${color.mid}`}
                  borderColor={`${color.mid}`}
                  notClickable
                />
              ) : null;
            })}
          </div>
          <ReviewTitle text="??????????????? ?????? ?????? ??????" width={371} />
          <div css={reviewsAlign}>
            {getReviews.map((review, idx) => {
              return review.id < 7 ? null : (
                <ReviewBox
                  key={idx}
                  content={review.review}
                  count={review.count}
                  isBad={true}
                  width={180}
                  margin={`${rem(5)} 0`}
                  fontColor={`${color.deep}`}
                  borderColor={`${color.deep}`}
                  notClickable
                />
              );
            })}
          </div>
        </div>

        <div
          css={css`
            display: flex;
            align-items: center;
            justify-content: center;
            width: ${rem(430)};
          `}
        >
          <div css={[verticalAlign]}>
            <div css={hello}>???????????? ??????</div>

            <div css={[wnr, contentAlign]}>
              <span>?????????</span>
              <div
                css={css`
                  width: ${rem(120)};
                  margin-right: ${rem(8)};
                `}
              >
                {nickDuplicateClick ? (
                  nickDupliacte ? (
                    <div css={noticeOk}> * ??????????????? ??????????????????.</div>
                  ) : (
                    <div css={noticeNo}> * ????????? ??????????????????.</div>
                  )
                ) : null}
              </div>
              <span
                css={
                  nickname.length > 0 ? validButtonActive : validButtonInactive
                }
                onClick={nicknameDuplicateCheckHandler}
              >
                ?????? ??????
              </span>
            </div>
            <input
              css={[wnr, inputStyle]}
              type="text"
              placeholder={currentNickName}
              onChange={nicknameHandler}
              value={nickname}
            />
            <div css={[wnr, contentAlign]}>
              <span>?????????</span>
            </div>
            <input
              css={[wnr, inputStyle, colorPlaceholder, inactive]}
              type="text"
              placeholder="???????????? ??????????????????."
              onChange={emailHandler}
              value={email}
              readOnly
            />
            <div css={[wnr, contentAlign]}>
              <div>????????????</div>
              <div
                css={css`
                  width: ${rem(180)};
                  margin-right: ${rem(24)};
                `}
              >
                {confirmPassword.length > 0 && passwordValid ? (
                  password === confirmPassword ? (
                    <div css={noticeOk}>* ??????????????? ?????????????????????.</div>
                  ) : (
                    <div css={noticeNo}>* ??????????????? ???????????? ????????????.</div>
                  )
                ) : password.length > 0 ? (
                  passwordValid ? null : (
                    <div css={noticeNo}>
                      * ??????, ?????? ?????? 8??? ?????? ??????????????????.{' '}
                    </div>
                  )
                ) : null}
              </div>
            </div>
            <input
              css={[wnr, inputStyle]}
              type="password"
              placeholder="??????????????? ??????????????????."
              onChange={passwordHandler}
              value={password}
            />
            <input
              css={[wnr, inputStyle]}
              type="password"
              placeholder="??????????????? ??? ??? ??? ??????????????????."
              onChange={confirmPasswordHandler}
              value={confirmPassword}
            />
            <div css={[reqMsgStyle, noticeNo]}>{reqMag[reqState]}</div>
            <button css={[wnr, buttonStyle]} onClick={modifyAccount}>
              ????????????
            </button>
            <div
              css={css`
                color: ${color.placeholder};
                margin-top: ${rem(30)};
                font-size: ${rem(14)};
                text-decoration: underline;
                transition: 0.1s;
                :hover {
                  font-weight: 700;
                  cursor: pointer;
                }
                :active {
                  opacity: 0.75;
                }
              `}
              onClick={deleteAccount}
            >
              ????????????
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Mypage;
