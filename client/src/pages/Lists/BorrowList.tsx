/** @jsxImportSource @emotion/react */
import Reservation from '../../components/Reservation';
import { css } from '@emotion/react';
import { color, rem, flex, host, config } from '../../common';
import ListTab from '../../components/ListTab';
import { Link, useNavigate } from 'react-router-dom';
import { link, visit } from './tab';
import { Button } from '../../components/Button';
import emptyBorrow from '../../assets/pictures/emptyBorrow.svg';
import { container, section, message } from './tab';
import { useRecoilState, useRecoilValue } from 'recoil';
import {
  showCompleteModal,
  showConfirmModal,
  showReviewModal,
  showSubmitModal,
} from '../../Atom';
import { useEffect, useState } from 'react';
import YesOrNo from '../../components/ConfirmBorrow';
import axios from 'axios';
import Complete from '../../components/Complete';
import ReviewModal from '../../components/ReviewModal';
import { List } from './interface';

interface Borrow {
  borrow: List[];
}

const borrows = {
  borrow: [
    {
      reservation_id: 1,
      reservation_reservation_dates: ['2022.01.15', '2022.01.16', '2022.01.17'],
      reservation_reservation_status: 1,
      reservation_users_id: 2,
      reservation_posts_id: 2,
      posts_id: 2,
      posts_category: '의자/테이블',
      posts_deposit: 20000,
      posts_rental_fee: 40000,
      posts_unavailable_dates: ['2022.01.11', '2022.01.12', '2022.01.13'],
      posts_title: '튼튼한 의자 빌려드려요',
      posts_content: '올라가도 안 부서집니다.',
      posts_longitude: '127.044484819305',
      posts_latitude: '37.2244311943994',
      posts_address: '화성시 기산동',
      posts_img_urls:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ98OT7JgUOpLY1IN0cPBLYfEDTisFUCKLrZw&usqp=CAU',
      posts_users_id: 1,
    },
  ],
};

function BorrowList() {
  const [borrowLists, setBorrowLists] = useState<Borrow>(borrows);
  const [confirm, setConfirm] = useRecoilState(showConfirmModal);
  const [complete, setComplete] = useRecoilState(showCompleteModal);
  const [review, setReview] = useRecoilState(showReviewModal);
  const [submit, setSubmit] = useRecoilState(showSubmitModal);
  const button = ['예약 취소', '반납하기', '반납 확인 대기 중', '반납 완료'];
  const [reservationId, setReservationId] = useState(0);
  const [reservationStatus, setReservationStatus] = useState(0);
  const [userId, setUserId] = useState(0);

  const printStatusText = (status: number) => button[status - 1];

  const onButtonClick = (id: number, status: number, userId: number) => {
    setReservationId(id);
    setReservationStatus(status);
    setUserId(userId);
    setConfirm(true);
  };

  const onCompleteClick = () => {
    setComplete(false);
    if (reservationStatus === 2) {
      setReview(true);
    }
  };

  const onReviewCompleteClick = async () => {
    setSubmit(false);
    await axios
      .get(`${host}/userinfo/product/borrow`, config)
      .then((res) => {
        const sortedData = res.data['borrow'].sort(
          (a: any, b: any) => b.reservation_id - a.reservation_id,
        );
        setBorrowLists({ borrow: sortedData });
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    axios
      .get(`${host}/userinfo/product/borrow`, config)
      .then((res) => {
        const sortedData = res.data['borrow'].sort(
          (a: any, b: any) => b.reservation_id - a.reservation_id,
        );
        setBorrowLists({ borrow: sortedData });
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <>
      <ListTab />
      <nav css={[container, flex]}>
        <Link to="/lists/borrowlist" css={[link, visit]}>
          빌린 목록
        </Link>
        <Link to="/lists/lendlist" css={link}>
          빌려준 목록
        </Link>
        <Link to="/lists/likelist" css={link}>
          찜한 목록
        </Link>
        <Link to="/lists/resistlist" css={link}>
          내가 쓴 글
        </Link>
      </nav>
      <div css={container}>
        {confirm &&
          ((reservationStatus === 1 && (
            <YesOrNo
              reservationId={reservationId}
              reservation_status={1}
              text={'예약 취소'}
              title={'예약 취소'}
              text1={`예약을 취소하시겠습니까?`}
              text2={`대여자가 예약을 수락하기 전까지 취소할 수 있습니다.`}
            />
          )) ||
            (reservationStatus === 2 && (
              <YesOrNo
                reservationId={reservationId}
                reservation_status={2}
                text={'반납하기'}
                title={'반납하기'}
                text1={`반납하시겠습니까?`}
                text2={`대여자가 상품 회수 후 반납 확인 시 최종 반납 처리가 됩니다.`}
              />
            )))}
        {complete &&
          (reservationStatus === 1 ? (
            <Complete text="예약이 취소되었습니다" onClick={onCompleteClick} />
          ) : (
            <Complete text="반납이 완료되었습니다" onClick={onCompleteClick} />
          ))}
        {review && <ReviewModal userId={userId} />}
        {submit && (
          <Complete
            text="리뷰가 등록되었습니다."
            onClick={onReviewCompleteClick}
          />
        )}
        {borrowLists['borrow'].length === 0 ? (
          <div style={{ padding: `${rem(100)} 0` }}>
            <img src={emptyBorrow} alt="camping" />
            <p css={message}>
              빌린 목록이 없어요! <br />
              캠핑용품을 대여해서 즐거운 캠핑을 떠나보세요!
            </p>
            <Button
              text="캠핑 용품 보러 가기"
              width={`${rem(180)}`}
              height={`${rem(43)}`}
              background="white"
              color={`${color.mid}`}
              border={`1px solid ${color.mid}`}
              size={`${rem(14)}`}
              cursor={'pointer'}
              hover="80%"
            />
          </div>
        ) : (
          <section css={section}>
            {borrowLists['borrow'].map((borrowList: List, index: number) => (
              <Reservation
                key={index}
                text={printStatusText(
                  borrowList.reservation_reservation_status,
                )}
                background={
                  borrowList.reservation_reservation_status !== 4
                    ? `${color.point}`
                    : `${color.mid}`
                }
                color="white"
                cursor={
                  borrowList.reservation_reservation_status === 1 ||
                  borrowList.reservation_reservation_status === 2
                    ? 'pointer'
                    : 'not-allowed'
                }
                hover={
                  borrowList.reservation_reservation_status === 4
                    ? '100%'
                    : borrowList.reservation_reservation_status === 3
                    ? '50%'
                    : '80%'
                }
                opacity={
                  borrowList.reservation_reservation_status === 3
                    ? '50%'
                    : '100%'
                }
                postId={borrowList.posts_id}
                img_urls={borrowList.posts_img_urls}
                address={borrowList.posts_address}
                title={borrowList.posts_title}
                deposit={borrowList.posts_deposit}
                rental_fee={borrowList.posts_rental_fee}
                reservation_dates={borrowList.reservation_reservation_dates}
                onButtonClick={() =>
                  onButtonClick(
                    borrowList.reservation_id,
                    borrowList.reservation_reservation_status,
                    borrowList.posts_users_id,
                  )
                }
              />
            ))}
          </section>
        )}
      </div>
    </>
  );
}

export default BorrowList;
