/** @jsxImportSource @emotion/react */
import {
  calCampbuIndicator,
  color,
  config,
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
import { css, useTheme } from '@emotion/react';
import Gage from '../components/Gage';
import BackButton from '../components/BackButton';
import { Button } from '../components/Button';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Navigate, useNavigate } from 'react-router-dom';
import Calendar from '../components/CalendarForLender';
import Here from '../assets/Here.svg';
import { span, addressStyle, moneyTitle } from '../components/post';
import {
  useRecoilState,
  useRecoilValue,
  useResetRecoilState,
  useSetRecoilState,
} from 'recoil';
import {
  endDate,
  isSelectStart,
  selectDate,
  showCalendar,
  startDate,
  unableDate,
} from '../Atom';

const width = css`
  width: ${rem(752)};
`;
const moneyContent = css`
  width: ${rem(230)};
  margin-top: ${rem(16)};
`;
const productImg = css`
  width: ${rem(752)};
  height: ${rem(366)};
  background-size: cover;
`;

const reviewAlign = css`
  width: 23.1875rem;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-wrap: wrap;
`;
const feeView = css`
  border: 1px solid ${color.border};
  border-radius: ${rem(10)};
  width: ${rem(280)};
  font-size: ${rem(11)};
  margin-top: ${rem(50)};
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
    background-color: ${color.border};
  }
  :active {
    opacity: 0.5;
  }
`;

const fontSize9 = css`
  font-size: ${rem(9)};
  font-weight: 700;
`;
const fontSize40 = css`
  font-size: ${rem(40)};
  margin: 0 ${rem(20)};
  color: ${color.border};
`;

interface propsType {
  postId?: number;
}

function DetailView({ postId }: propsType) {
  const navigate = useNavigate();
  const [deposit, setDeposit] = useState(0);
  const [rentalFee, setRentalFee] = useState(0);
  const setUnableDates = useSetRecoilState(unableDate);
  const [start, setStart] = useRecoilState(startDate);
  const [end, setEnd] = useRecoilState(endDate);
  const [totalRentalDates, setTotalRentalDates] = useRecoilState(selectDate);
  const [isSelectStartState, setIsSelectStartState] =
    useRecoilState(isSelectStart);
  const [isShowCalendar, setIsShowCalendar] = useRecoilState(showCalendar);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imgUrls, setImgUrls] = useState<any>();
  const [address, setAddress] = useState('');
  const [getReviews, setGetReviews] = useState<reviewsType>([]);

  useEffect(() => {
    const API = `${host}/product/post/${postId}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    console.log(`${API} 로 요청하고 스테이트 변경 지금은 더미데이터`);
    // axios.get(API, config).then(res=> const postinfo=res.data);

    //요청 결과 예시 데이터
    let dummydata = {
      posts: [
        {
          id: 1,
          category: 'Tent',
          deposit: 30000,
          rental_fee: 20000,
          unavailable_dates: [
            '2021.12.20',
            '2021.12.21',
            '2021.12.22',
            '2022.01.23',
            '2022.01.15',
            '2022.01.01',
          ],
          title: '3~4인용 텐트 빌려드려요',
          content: '쉽게 설치할 수 있는 3~4인용 텐트입니다.',
          longitude: 126.99597295767953,
          latitude: 35.97664845766847,
          address: '서울특별시 동작구 신대방동',
          img_urls:
            'https://paperbarkcamp.com.au/wp-content/uploads/2019/07/paperbark_flash-camp_news_1218x650.jpg',
          users_id: 1,
          created_at: '2021-12-16T09:42:40.000Z',
          updated_at: '2021-12-16T09:42:40.000Z',
          likes_count: 5,
        },
      ],
      reviews: [
        {
          id: 1,
          users_id: 1,
          reviews_id: 2,
          count: 15,
          created_at: '2021-12-16T09:42:40.000Z',
          updated_at: '2021-12-16T09:42:40.000Z',
        },
        {
          id: 1,
          users_id: 1,
          reviews_id: 8,
          count: 52,
          created_at: '2021-12-16T09:42:40.000Z',
          updated_at: '2021-12-16T09:42:40.000Z',
        },
        {
          id: 1,
          users_id: 1,
          reviews_id: 4,
          count: 5,
          created_at: '2021-12-16T09:42:40.000Z',
          updated_at: '2021-12-16T09:42:40.000Z',
        },
        {
          id: 1,
          users_id: 1,
          reviews_id: 11,
          count: 5,
          created_at: '2021-12-16T09:42:40.000Z',
          updated_at: '2021-12-16T09:42:40.000Z',
        },
      ],
    };

    const postInfo = dummydata;
    let tempReviews: reviewsType = [...reviews];

    postInfo.reviews.forEach((el: any) => {
      tempReviews[el.reviews_id - 1] = {
        ...tempReviews[el.reviews_id - 1],
        count: el.count,
      };
    });

    console.log(1);
    setGetReviews(tempReviews);
    setDeposit(postInfo.posts[0].deposit);
    setRentalFee(postInfo.posts[0].rental_fee);
    setUnableDates(postInfo.posts[0].unavailable_dates);
    setTitle(postInfo.posts[0].title);
    setContent(postInfo.posts[0].content);
    setImgUrls(postInfo.posts[0].img_urls);
    setAddress(postInfo.posts[0].address);
    // setStart('');
    // setEnd('');
    // setTotalRentalDates([]);
    // setIsShowCalendar(false);
  }, []);

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
    const API = `${host}/reservation`;
    const data = {
      posts_id: postId,
      reservation_dates: totalRentalDates,
    };
    if (start && end) {
      console.log('data', data);
      axios.post(API, data, config).catch((err) => console.log(err));
    } else {
      console.log('대여일,반납일을 선택하세요');
    }
  };

  return (
    <div css={flexVertical}>
      <div css={flexVertical}>
        <div
          css={css`
            width: ${rem(830)};
            text-align: left;
            margin-bottom: ${rem(32)};
          `}
        >
          <div
            onClick={() => {
              navigate('/main');
            }}
          >
            <BackButton />
          </div>
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
          <div>{title}</div>
          <LikeSymbol
            isFill={false}
            count={14}
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
          <div css={fontSize40}>{`<`}</div>
          <div
            css={[
              productImg,
              css`
                background-image: ${`url(${imgUrls})`};
              `,
            ]}
          ></div>
          <div css={fontSize40}>{`>`}</div>
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
            <p>{content}</p>
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
                />
              );
            })}
          </div>
        </div>
        <div
          css={[
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
              <div
                css={css`
                  width: ${rem(48)};
                  height: ${rem(48)};
                  border-radius: 50%;
                  border: 2px solid ${color.point};
                  margin-left: ${rem(10)};
                `}
              ></div>
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
          <span css={[span, moneyTitle, addressStyle]}>
            <img src={Here} alt="위치" style={{ marginRight: '4px' }} />
            {address}
          </span>
          <div css={[flexVertical, feeView]}>
            <div
              css={[
                moneyContent,
                css`
                  font-size: ${rem(16)};
                `,
              ]}
            >
              날짜를 입력하고 대여 비용을 확인해보세요
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
                        ? color.border
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
                        : color.border
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
              <span>{`${deposit.toLocaleString('ko-KR')} 원`}</span>
            </div>
            <div css={[flexBetween, moneyContent]}>
              <span>대여비 </span>

              {totalRentalDates.length > 0 ? (
                <>
                  <span>{`${rentalFee.toLocaleString('ko-KR')} × ${
                    totalRentalDates.length
                  }일`}</span>
                  <span>{` ${(
                    rentalFee * totalRentalDates.length
                  ).toLocaleString('ko-KR')} 원`}</span>
                </>
              ) : (
                `${rentalFee.toLocaleString('ko-KR')} 원`
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
              <span>{` ${(
                rentalFee * (totalRentalDates ? totalRentalDates.length : 1) +
                deposit
              ).toLocaleString('ko-KR')} 원`}</span>
            </div>
            <Button
              text="예약하기"
              width={rem(221)}
              height={rem(36)}
              background={color.point}
              color={color.white}
              border="none"
              size={rem(14)}
              margin={`${rem(10)} 0`}
              onClick={reservationHandler}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetailView;
