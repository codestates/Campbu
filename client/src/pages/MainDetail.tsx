/** @jsxImportSource @emotion/react */
import {
  calCampbuIndicator,
  color,
  flexBetween,
  flexVertical,
  host,
  relative,
  rem,
  reviews,
  reviewsType,
} from '../common';
import LikeSymbol from '../components/LikeSymbol';
import ReviewBox from '../components/ReviewBox';
import ReviewTitle from '../components/ReviweTitle';
import { css } from '@emotion/react';
import Gage from '../components/Gage';
import BackButton from '../components/BackButton';
import { Button } from '../components/Button';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Calendar from '../components/CalendarForLender';
import Here from '../assets/Here.svg';
import { span, addressStyle, moneyTitle } from '../components/post';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import {
  endDate,
  isLogin,
  isSelectStart,
  jwtToken,
  likedProducts,
  loginUserInfo,
  post_id,
  profileImgUrl,
  selectAddress,
  selectDate,
  showCalendar,
  showCompleteModal,
  showLoginModal,
  startDate,
  unableDate,
} from '../Atom';
import Complete from '../components/Complete';
import Profile from '../assets/Profile.svg';

const width = css`
  width: ${rem(752)};
`;
const moneyContent = css`
  width: ${rem(230)};
  margin-top: ${rem(16)};
  font-size: ${rem(14)};
`;
const productImg = css`
  width: ${rem(752)};
  height: ${rem(366)};
  object-fit: scale-down;
`;

const reviewAlign = css`
  width: 23.1875rem;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-wrap: wrap;
`;
const feeView = css`
  border-radius: ${rem(10)};
  width: ${rem(280)};
  font-size: ${rem(11)};
  margin-top: ${rem(50)};
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
`;

const selectDateStyle = css`
  width: ${rem(115)};
  height: ${rem(44)};
  justify-content: space-between;
  align-items: flex-start;
  padding: ${rem(7)};
  transition: 0.3s;
  :hover {
    cursor: pointer;
    background-color: '#f0f0f0';
  }
  :active {
    opacity: 0.5;
  }
`;

const fontSize9 = css`
  font-size: ${rem(12)};
  font-weight: 700;
`;
const arrowStyle = css`
  width: ${rem(60)};
  font-size: ${rem(40)};
  text-align: center;
  padding: auto;
  color: ${color.border};
  :hover {
    font-size: ${rem(50)};
    cursor: pointer;
  }
  :active {
    opacity: 0.6;
  }
`;

const showSelectImgContainerStyle = css`
  height: 1rem;
  border: 1px solid ${color.placeholder};
  background-color: ${color.white};
  border-radius: 0.5rem;
  padding: 0 0.5rem;
  display: flex;
  align-items: center;
  opacity: 0.65;
  position: absolute;
  bottom: 0.5rem;
`;

const showSelectImgCircleStyle = css`
  width: 0.6rem;
  height: 0.6rem;
  border: 1px solid ${color.point};
  border-radius: 50%;
  margin: 0 0.2rem;
  transition: 0.3s;
`;

const profileBoxStyle = css`
  width: ${rem(48)};
  height: ${rem(48)};
  border-radius: 50%;
  border: 2px solid ${color.point};
  margin-left: ${rem(10)};
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const profileImgStyle = css`
  display: block;
  width: ${rem(48)};
  height: ${rem(48)};
  object-fit: cover;
`;
//요청 결과 예시 데이터
let dummyData = {
  posts: {
    id: 0,
    category: 'Tent',
    deposit: 30000,
    rental_fee: 20000,
    unavailable_dates: [],
    title: '',
    content: '',
    longitude: 126.99597295767953,
    latitude: 35.97664845766847,
    address: '',
    img_urls: [],
    users_id: 0,
    created_at: '',
    updated_at: '',
    likes_count: 0,
  },
  reviews: [
    {
      count: 0,
      reviews_id: 0,
    },
  ],
  user: {
    email: 'string',
    id: 0,
    nicknamge: 'string',
    users_img: 'string',
  },
};

interface postInfoType {
  posts: {
    id: number;
    category: string;
    deposit: number;
    rental_fee: number;
    unavailable_dates: string[];
    title: string;
    content: string;
    longitude: number;
    latitude: number;
    address: string;
    img_urls: string[];
    users_id: number;
    likes_count: number;
  };
  reviews:
    | {
        count: number;
        reviews_id: number;
      }[]
    | [];
  user: {
    email: string;
    id: number;
    nicknamge: string;
    users_img: string;
  };
}

// interface DetailviewType {
//   postId: number;
// }
function DetailView() {
  //전역
  const setUnableDates = useSetRecoilState(unableDate);
  const [start, setStart] = useRecoilState(startDate);
  const [end, setEnd] = useRecoilState(endDate);
  const [totalRentalDates, setTotalRentalDates] = useRecoilState(selectDate);
  const [isSelectStartState, setIsSelectStartState] =
    useRecoilState(isSelectStart);
  const [isShowCalendar, setIsShowCalendar] = useRecoilState(showCalendar);
  const postId = useRecoilValue(post_id);
  const login = useRecoilValue(isLogin);
  const setShowLoginModal = useSetRecoilState(showLoginModal);
  const profileImg = useRecoilValue(profileImgUrl);
  const userInfo = useRecoilValue(loginUserInfo);
  const [completeModal, setCompleteModal] = useRecoilState(showCompleteModal);
  const navigation = useNavigate();
  const [getReviews, setGetReviews] = useState<reviewsType>([]);
  const [postInfo, setPostInfo] = useState<postInfoType>(dummyData);
  const [selectImgNum, setSelectImgNum] = useState<number>(0);
  const [isLikePost, setIsLikePost] = useState(false);
  const token = useRecoilValue(jwtToken);
  useEffect(() => {
    if (postId) {
      const API = `${host}/product/post/${postId}`;

      axios
        .get(API, {
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        })
        .then((res: any) => {
          const postInfo = res.data;
          setPostInfo(postInfo);
          let reservations: string[] = [];
          postInfo.reservations.forEach((el: any) => {
            reservations = [...reservations, ...el.reservation_dates];
          });

          let unableDates: string[] = [
            ...postInfo.posts.unavailable_dates,
            ...reservations,
          ];

          setUnableDates(unableDates.sort());

          let tempReviews: reviewsType = [...reviews];
          postInfo.reviews.forEach((el: any) => {
            tempReviews[el.reviews_id - 1] = {
              ...tempReviews[el.reviews_id - 1],
              count: el.count,
            };
          });

          axios
            .get(`${host}/product/address/${postInfo.posts.address}`, {
              headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${token}`,
              },
              withCredentials: true,
            })
            .then((res) => {
              if (res.status === 200) {
                const likes = res.data.likes;
                let isLike = false;
                for (let i = 0; i < likes.length; i++) {
                  if (likes[i].posts_id === postId) {
                    isLike = true;
                    break;
                  }
                }
                setIsLikePost(isLike);
              }
            });

          setGetReviews(tempReviews);
        })
        .catch((err) => console.log(err));
    }

    setStart('');
    setEnd('');
  }, [postId, setEnd, setStart, setUnableDates]);

  const campbuIndicator = calCampbuIndicator(getReviews);
  const startDateHandler = () => {
    setIsSelectStartState(true);
    setIsShowCalendar(true);
  };
  const endDateHandler = () => {
    setIsSelectStartState(false);
    setIsShowCalendar(true);
  };

  const reservationHandler = () => {
    if (start && end) {
      setIsShowCalendar(false);
    }

    if (login) {
      const API = `${host}/reservation`;
      const data = {
        posts_id: postId,
        reservation_dates: totalRentalDates,
      };
      if (start && end) {
        axios
          .post(API, data, {
            headers: {
              'Content-Type': 'application/json',
              authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          })
          .then((res) => {
            setCompleteModal(true);
          })
          .catch((err) => console.log(err));
      }
    } else {
      setShowLoginModal(true);
    }
    setTotalRentalDates([]);
  };

  const urlnums = postInfo.posts.img_urls.length;

  const selectImgHandler = (prenext: string) => {
    if (prenext === 'pre') {
      if (selectImgNum === 0) {
        setSelectImgNum(urlnums - 1);
      } else {
        setSelectImgNum(selectImgNum - 1);
      }
    } else if (prenext === 'next') {
      if (selectImgNum === urlnums - 1) {
        setSelectImgNum(0);
      } else {
        setSelectImgNum(selectImgNum + 1);
      }
    }
  };

  const reservationComplete = () => {
    setCompleteModal(false);
    navigation('/lists/chat');
  };
  return (
    <div css={[flexVertical, `margin-bottom: ${rem(100)}`]}>
      {completeModal && (
        <Complete text="예약이 완료되었습니다" onClick={reservationComplete} />
      )}
      <div css={flexVertical}>
        <div
          css={css`
            width: ${rem(830)};
            text-align: left;
            margin-bottom: ${rem(32)};
          `}
        >
          <BackButton />
        </div>
        <div
          css={[
            flexBetween,
            css`
              width: ${rem(752)};
              align-items: center;
              align-content: center;
            `,
          ]}
        >
          <div>
            <div style={{ fontSize: `${rem(20)}`, marginBottom: `${rem(6)}` }}>
              {postInfo.posts.title}
            </div>
            <span css={[span, moneyTitle, `font-size: ${rem(12)}`]}>
              <img src={Here} alt="위치" style={{ marginRight: '2px' }} />
              {postInfo.posts.address}
            </span>
          </div>

          <LikeSymbol
            postId={postId}
            isFill={isLikePost}
            count={postInfo.posts.likes_count}
            fontSize={18}
            borderColor={color.border}
          />
        </div>
        <div
          css={[
            flexBetween,
            css`
              margin-top: ${rem(20)};
              align-items: center;
            `,
          ]}
        >
          <div
            css={arrowStyle}
            onClick={() => {
              selectImgHandler('pre');
            }}
          >{`<`}</div>

          <div css={[flexVertical, relative]}>
            <img
              css={[productImg]}
              src={`${postInfo.posts.img_urls[selectImgNum]}`}
              alt="detail"
              draggable="false"
            />
            <div css={showSelectImgContainerStyle}>
              {postInfo.posts.img_urls.map((el, idx) => (
                <div
                  key={idx}
                  css={[
                    showSelectImgCircleStyle,
                    css`
                      background-color: ${idx === selectImgNum
                        ? color.point
                        : null};
                    `,
                  ]}
                ></div>
              ))}
            </div>
          </div>

          <div
            css={arrowStyle}
            onClick={() => {
              selectImgHandler('next');
            }}
          >{`>`}</div>
        </div>
      </div>
      <div css={[flexBetween, width]}>
        <div>
          <ReviewTitle text={'상세설명'} width={371} />
          <div
            css={[
              css`
                width: 23.1875rem;
                height: 6.25rem;
              `,
            ]}
          >
            <p>{postInfo.posts.content}</p>
          </div>
          <ReviewTitle text={'대여자에게 받은 좋은 리뷰'} width={371} />
          <div css={reviewAlign}>
            {getReviews.map((review, idx) => {
              return review.id < 7 ? (
                <ReviewBox
                  key={idx}
                  content={reviews[review.id - 1].review}
                  count={review.count}
                  isBad={false}
                  width={180}
                  height={37}
                  margin={`${rem(4)} 0`}
                  fontColor={`${color.mid}`}
                  borderColor={`${color.mid}`}
                  notClickable
                />
              ) : null;
            })}
          </div>
          <ReviewTitle text={'대여자에게 받은 나쁜 리뷰'} width={371} />
          <div css={reviewAlign}>
            {getReviews.map((review, idx) => {
              return review.id < 7 ? null : (
                <ReviewBox
                  key={idx}
                  content={reviews[review.id - 1].review}
                  count={review.count}
                  isBad={true}
                  width={180}
                  height={37}
                  margin={`${rem(4)} 0`}
                  fontColor={`${color.deep}`}
                  borderColor={`${color.deep}`}
                  notClickable
                />
              );
            })}
          </div>
        </div>
        <div
          css={[
            flexVertical,
            css`
              margin-top: ${rem(30)};
            `,
          ]}
        >
          <div>
            <div
              css={[
                flexBetween,
                css`
                  width: ${rem(280)};
                  align-items: flex-end;
                  justify-content: flex-end;
                  margin-bottom: ${rem(10)};
                `,
              ]}
            >
              <div>
                <div
                  css={css`
                    text-align: right;
                    font-weight: 700;
                  `}
                >
                  {`${campbuIndicator * 100}%`}
                </div>
                <Gage ratio={campbuIndicator} width={153} />
              </div>
              <div css={profileBoxStyle}>
                <img
                  css={profileImgStyle}
                  src={postInfo.user.users_img || Profile}
                  alt="profileImg"
                  draggable="false"
                />
              </div>
            </div>
            <div
              css={css`
                text-align: right;
                font-weight: 700;
              `}
            >
              깐부지수
            </div>
          </div>
          <div css={[flexVertical, feeView]}>
            <div
              css={[
                moneyContent,
                css`
                  font-size: ${rem(16)};
                `,
              ]}
            >
              {userInfo.id === postInfo.user.id
                ? '해당 물품의 등록 정보를 수정 또는 삭제 할 수 있습니다.'
                : '날짜를 입력하고 대여 비용을 확인해보세요.'}
            </div>
            <div
              css={[
                relative,
                css`
                  display: flex;
                  margin-top: ${rem(15)};
                  border: 1px solid ${color.border};
                  border-radius: ${rem(5)};
                `,
              ]}
            >
              <div
                css={[
                  flexVertical,
                  selectDateStyle,
                  css`
                    border-right: 1px solid ${color.border};
                    background-color: ${isShowCalendar
                      ? isSelectStartState
                        ? '#f0f0f0'
                        : null
                      : null};
                  `,
                ]}
                onClick={startDateHandler}
              >
                <div css={fontSize9}>대여일</div>
                <div>{start}</div>
              </div>
              <div
                css={[
                  flexVertical,
                  selectDateStyle,
                  css`
                    background-color: ${isShowCalendar
                      ? isSelectStartState
                        ? null
                        : '#f0f0f0'
                      : null};
                  `,
                ]}
                onClick={endDateHandler}
              >
                <div css={fontSize9}>반납일</div>
                <div>{end}</div>
              </div>
              {isShowCalendar ? <Calendar /> : null}
            </div>
            <div css={[flexBetween, moneyContent]}>
              <span>보증금 </span>
              <span>{`${postInfo.posts.deposit.toLocaleString(
                'ko-KR',
              )} 원`}</span>
            </div>
            <div css={[flexBetween, moneyContent]}>
              <span>대여비 </span>

              {totalRentalDates.length > 0 ? (
                <>
                  {start && end ? (
                    <span
                      style={{ color: `#b8b8b8` }}
                    >{`${postInfo.posts.rental_fee.toLocaleString('ko-KR')} × ${
                      totalRentalDates.length - 1
                    }박 ${totalRentalDates.length}일`}</span>
                  ) : null}
                  <span>{` ${(
                    postInfo.posts.rental_fee *
                    (totalRentalDates.length - 1)
                  ).toLocaleString('ko-KR')} 원`}</span>
                </>
              ) : (
                `${postInfo.posts.rental_fee.toLocaleString('ko-KR')} 원`
              )}
            </div>
            <div
              css={[
                flexBetween,
                moneyContent,
                css`
                  border-top: 1px solid black;
                  padding: ${rem(15)} 0;
                  font-weight: 700;
                `,
              ]}
            >
              <span>총 합계 </span>
              <span>
                {start && end
                  ? ` ${(
                      postInfo.posts.rental_fee *
                        (totalRentalDates ? totalRentalDates.length - 1 : 1) +
                      postInfo.posts.deposit
                    ).toLocaleString('ko-KR')} 원`
                  : `원`}
              </span>
            </div>
            <div
              css={css`
                color: ${color.point};
                height: 0.8rem;
                font-size: 0.8rem;
              `}
            >
              {userInfo.id === postInfo.user.id
                ? null
                : start && end
                ? null
                : '대여일, 반납일을 지정해주세요.'}
            </div>
            {userInfo.id === postInfo.user.id ? (
              <Link to={`/writing/${postId}`}>
                <Button
                  text="수정 / 삭제"
                  width={rem(240)}
                  height={rem(40)}
                  background={color.point}
                  color={color.white}
                  border="none"
                  size={rem(14)}
                  margin={`${rem(10)} 0 ${rem(16)} 0`}
                  hover="0.85"
                  cursor="pointer"
                />
              </Link>
            ) : (
              <Button
                text="예약하기"
                width={rem(240)}
                height={rem(40)}
                background={start && end ? color.point : color.border}
                color={color.white}
                border="none"
                size={rem(14)}
                margin={`${rem(10)} 0 ${rem(16)} 0`}
                onClick={reservationHandler}
                hover="0.85"
                cursor="pointer"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetailView;
