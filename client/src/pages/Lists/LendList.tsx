/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { color, rem, flex, config } from '../../common';
import ListTab from '../../components/ListTab';
import { Button } from '../../components/Button';
import emptyLend from '../../assets/pictures/emptyLend.svg';
import { Link } from 'react-router-dom';
import { link, visit } from './tab';
import Reservation from '../../components/Reservation';
import { container, section, message } from './tab';
import YesOrNo from '../../components/ConfirmLend';
import { useRecoilState, useRecoilValue } from 'recoil';
import {
  showCompleteModal,
  showConfirmModal,
  showReviewModal,
  showSubmitModal,
} from '../../Atom';
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import { host } from '../../common';
import Complete from '../../components/Complete';
import ReviewModal from '../../components/ReviewModal';
import { List } from './interface';

export interface Lend {
  lend: List[];
}

const lends = {
  lend: [
    {
      reservation_id: 3,
      reservation_reservation_dates: ['2022.01.12', '2022.01.13', '2022.01.14'],
      reservation_reservation_status: 1,
      reservation_created_at: '2022-01-12T06:54:09.862Z',
      reservation_updated_at: '2022-01-12T06:54:09.862Z',
      reservation_users_id: 1,
      reservation_posts_id: 4,
      posts_id: 4,
      posts_category: '그릴/버너',
      posts_deposit: 50000,
      posts_rental_fee: 100000,
      posts_unavailable_dates: ['2022.01.11', '2022.01.12', '2022.01.13'],
      posts_title: '튼튼한 그릴입니다',
      posts_content: '절대 쓰러지지 않아요',
      posts_longitude: '128.638149961102',
      posts_latitude: '35.84398924816',
      posts_address: '수성구 황금동',
      posts_img_urls:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfS8nqLKyNTIEtZkMcjSOwGyopmHw8M1HllQ&usqp=CAU',
      posts_created_at: '2022-01-11T06:17:48.489Z',
      posts_updated_at: '2022-01-11T06:17:48.489Z',
      posts_users_id: 2,
    },
  ],
};

function LendList() {
  const [lendLists, setLendLists] = useState<Lend>(lends);
  const [confirm, setConfirm] = useRecoilState(showConfirmModal);
  const [complete, setComplete] = useRecoilState(showCompleteModal);
  const [review, setReview] = useRecoilState(showReviewModal);
  const [submit, setSubmit] = useRecoilState(showSubmitModal);
  const [reservationId, setReservationId] = useState(0);
  const [reservationStatus, setReservationStatus] = useState(0);
  const [userId, setUserId] = useState(0);
  const button = ['예약 수락', '반납 대기 중', '반납 확인', '회수 완료'];
  const printStatusText = (status: number) => button[status - 1];
  const onButtonClick = (id: number, status: number, userId: number) => {
    setReservationId(id);
    setReservationStatus(status);
    setUserId(userId);
    setConfirm(true);
  };

  const onCompleteClick = () => {
    setComplete(false);
    if (reservationStatus === 3) {
      setReview(true);
    }
  };

  const onReviewCompleteClick = async () => {
    setSubmit(false);
    await axios
      .get(`${host}/userinfo/product/lend`, config)
      .then((res) => {
        const sortedData = res.data['lend'].sort(
          (a: any, b: any) => b.reservation_id - a.reservation_id,
        );
        setLendLists({ lend: sortedData });
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    axios
      .get(`${host}/userinfo/product/lend`, config)
      .then((res) => {
        const sortedData = res.data['lend'].sort(
          (a: any, b: any) => b.reservation_id - a.reservation_id,
        );
        setLendLists({ lend: sortedData });
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <>
      <ListTab />
      <nav css={[container, flex]}>
        <Link to="/lists/borrowlist" css={link}>
          빌린 목록
        </Link>
        <Link to="/lists/lendlist" css={[link, visit]}>
          빌려준 목록
        </Link>
        <Link to="/lists/likelist" css={link}>
          찜한 목록
        </Link>
        <Link to="/lists/resistlist" css={link}>
          내가 쓴 글{' '}
        </Link>
      </nav>
      <div css={container}>
        {confirm &&
          ((reservationStatus === 1 && (
            <YesOrNo
              reservationId={reservationId}
              reservation_status={1}
              text={'예약 수락'}
              title={'예약 수락'}
              text1={`예약을 수락하시겠습니까?`}
              text2={`예약 일정 확인 후 수락 버튼을 눌러주세요.`}
            />
          )) ||
            (reservationStatus === 3 && (
              <YesOrNo
                reservationId={reservationId}
                reservation_status={3}
                text={'반납 확인'}
                title={'반납 확인'}
                text1={`대여자에게서 물품을 잘 받으셨나요?`}
                text2={`반납 확인 시 회수 처리가 완료됩니다.`}
              />
            )))}
        {complete &&
          (reservationStatus === 1 ? (
            <Complete text="예약이 수락되었습니다" onClick={onCompleteClick} />
          ) : (
            <Complete text="반납이 확인되었습니다" onClick={onCompleteClick} />
          ))}
        {review && <ReviewModal userId={userId} />}
        {submit && (
          <Complete
            text="리뷰가 등록되었습니다."
            onClick={onReviewCompleteClick}
          />
        )}
        {lendLists['lend'].length === 0 ? (
          <div style={{ padding: `${rem(100)} 0` }}>
            <img src={emptyLend} alt="camping" />
            <p css={message}>
              빌려준 목록이 없어요! <br />
              캠핑 용품이 있다면 대여 게시글을 올려보세요!
            </p>
            <Button
              text="캠핑 용품 보러 가기"
              width={`${rem(180)}`}
              height={`${rem(43)}`}
              background="white"
              color={`${color.mid}`}
              border={`1px solid ${color.mid}`}
              size={`${rem(14)}`}
            />
          </div>
        ) : (
          <section css={section}>
            {lendLists['lend'].map((lendList: List, index: number) => (
              <Reservation
                key={index}
                text={printStatusText(lendList.reservation_reservation_status)}
                background={
                  lendList.reservation_reservation_status !== 4
                    ? `${color.point}`
                    : `${color.mid}`
                }
                color="white"
                cursor={
                  lendList.reservation_reservation_status === 1 ||
                  lendList.reservation_reservation_status === 3
                    ? 'pointer'
                    : 'not-allowed'
                }
                hover={
                  lendList.reservation_reservation_status === 4
                    ? '100%'
                    : lendList.reservation_reservation_status === 2
                    ? '50%'
                    : '80%'
                }
                opacity={
                  lendList.reservation_reservation_status === 2 ? '50%' : '100%'
                }
                postId={lendList.posts_id}
                img_urls={lendList.posts_img_urls}
                address={lendList.posts_address}
                title={lendList.posts_title}
                deposit={lendList.posts_deposit}
                rental_fee={lendList.posts_rental_fee}
                reservation_dates={lendList.reservation_reservation_dates}
                onButtonClick={() =>
                  onButtonClick(
                    lendList.reservation_id,
                    lendList.reservation_reservation_status,
                    lendList.reservation_users_id,
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

export default LendList;
