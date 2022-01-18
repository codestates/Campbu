/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { Link } from 'react-router-dom';
import {
  flex,
  rem,
  color,
  relative,
  host,
  textDecorationNone,
  flexBetween,
} from '../../common';
import { container } from './tab';
import ListTab from '../../components/ListTab';
import Input from '../../components/Input';
import { Button } from '../../components/Button';
import {
  post,
  img,
  textContainer,
  span,
  addressStyle,
  moneyTitle,
} from '../../components/post';
import PaperPlane from '../../assets/PaperPlane.svg';
import Here from '../../assets/Here.svg';
import { useState, useEffect, useRef } from 'react';
import { useRecoilValue, useRecoilState } from 'recoil';
import {
  chatsNum,
  showCompleteModal,
  showConfirmModal,
  showReviewModal,
  showSubmitModal,
} from '../../Atom';
import io from 'socket.io-client';
import axios from 'axios';
import Reservation from '../../components/Reservation';

//! ------------ css -------------------
const button = css`
  background-color: white;
  border: none;
  position: absolute;
  right: ${rem(80)};
  top: ${rem(12)};
  cursor: pointer;
`;

const message = css`
  width: ${rem(318)};
  height: ${rem(66)};
  text-align: left;
  font-size: ${rem(18)};
  font-weight: 700;
  padding-left: ${rem(20)};
  padding-top: ${rem(18)};
  border-bottom: ${rem(1)} solid #dedede;
`;

const imgStyle = css`
  width: ${rem(40)};
  height: ${rem(40)};
  border: 2px solid ${color.point};
  border-radius: 50%;
  background-size: cover;
  margin: ${rem(10)} ${rem(12)} 0 ${rem(12)};
`;

//! ------------ interface -------------------

interface chatRoom {
  id: number;
  recipient_nickname: string;
  recipient_img: string;
  sender_nickname: string;
  chat: object[];
  created_at: Date;
  updated_at: Date;
  reservation_id: {
    id: number;
    reservation_dates: string[];
    reservation_status: number;
    created_at: Date;
    updated_at: Date;
  };
}

interface chatNum {
  [key: string]: number;
}

function Chat() {
  const [chatMessage, setChatMessage] = useState<string>('');
  const [chatRoomId, setChatRoomId] = useState<number>();
  const [chatNickName, setChatNickName] = useState<string>('');
  const [chatting, setChatting] = useState<object[]>([]);
  const [chatRooms, setChatRooms] = useState([]);
  const [userNickName, setUserNickName] = useState<string>('');
  const [posts, setPosts] = useState<any>({});
  const [socket, setSocket] = useState<any>();
  const [chatCount, setChatCount] = useRecoilState<chatNum>(chatsNum);

  // ? 예약 관리 상태들 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
  // const [buttonClick, setButtonClick] = useState<boolean>(false);
  // const [reservationId, setReservationId] = useState(0);
  // const [reservationStatus, setReservationStatus] = useState(0);
  // const [userId, setUserId] = useState(0);
  // const borrowButton = ['예약 취소', '반납하기', '반납 확인 대기 중', '반납 완료'];
  // const lendButton = ['예약 수락', '반납 대기 중', '반납 확인', '회수 완료'];
  // const [confirm, setConfirm] = useRecoilState(showConfirmModal);
  // const [complete, setComplete] = useRecoilState(showCompleteModal);
  // const [review, setReview] = useRecoilState(showReviewModal);
  // const [submit, setSubmit] = useRecoilState(showSubmitModal);
  // const printStatusText = (status: number) => {
  // return 유저 아이디 === 포스트 유저 아이디 ? lendButton[status - 1] : borrowButton[status - 1]
  // };
  // const onButtonClick = (id: number, status: number, userId: number) => {
  //   setReservationId(id);
  //   setReservationStatus(status);
  //   setUserId(userId);
  //   setConfirm(true);
  //   setButtonClick(true);
  // };

  // const onCompleteClick = () => {
  //   setComplete(false);
  //   if (reservationStatus === 3) { // && 유저 아이디 === 포스트 유저 아이디
  //     setReview(true);
  //   }
  // else if
  // reservationStatus === 2 && 유저 아이디 !== 포스트 유저 아이디
  // setReview(true);
  // };

  // const onReviewCompleteClick = () => {
  //   setSubmit(false);
  // };
  // ? * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

  useEffect(() => {
    axios
      .get(`${host}/chat/chatRoom`, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      })
      .then((res: any) => {
        const chatIds = res.data.chat.map((chat: any) => {
          const roomId = 'Room' + String(chat.id);
          if (!(roomId in chatCount)) {
            setChatCount((chatCount) => ({
              ...chatCount,
              [roomId]: 0,
            }));
          }
          return chat.id;
        });
        const newSocket = io('http://localhost:5050');
        newSocket.emit('open-room', chatIds);
        setSocket(newSocket);
        setChatRooms(res.data.chat);
        setUserNickName(res.data.nickName);
      });
  }, []);

  // useEffect((): any => {
  //   const newSocket = io('http://localhost:5050', {
  //     query: { chatRoomId },
  //   });
  //   setSocket(newSocket);
  // }, [chatRoomId]);

  useEffect(() => {
    if (socket == null) return;

    socket.on('receive-message', (message: any) => {
      if (message.id !== chatRoomId) {
        const roomId = 'Room' + String(message.id);
        setChatCount((chatCount) => ({
          ...chatCount,
          total: chatCount.total + 1,
          [roomId]: chatCount[roomId] + 1,
        }));
      } else if (message.id === chatRoomId) {
        setChatting([...chatting, message]);
      }
    });
    return () => socket.off('receive-message');
  });

  const handleOnChange = (e: any) => {
    setChatMessage(e.target.value);
  };

  const handleKeyPress = (e: any) => {
    if (e.key === 'Enter') {
      socket.emit('send-message', { chatRoomId, chatMessage, userNickName });
      setChatMessage('');
    }
  };

  const handleOnClick = (e: any) => {
    socket.emit('send-message', { chatRoomId, chatMessage, userNickName });
    setChatMessage('');
  };

  const handleChatRoomClick = (e: any, id: number, nickName: string) => {
    if (chatRoomId !== id) {
      setChatCount((chatCount) => ({
        ...chatCount,
        total: chatCount.total - chatCount[`Room${id}`],
        [`Room${id}`]: 0,
      }));
      setChatRoomId(id);
      setChatNickName(nickName);
      axios
        .get(`${host}/chat/message/${id}`, {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        })
        .then((res: any) => {
          setChatting(res.data.chat);
          setPosts(res.data.post);
          console.log(res.data);
          console.log(res.data.post);
        });
    } else {
      setChatRoomId(0);
      setChatNickName('');
      setChatting([]);
      setPosts({});
    }
  };

  const getTime = (inDate: any) => {
    const date = new Date(inDate);
    const hour = date.getHours();
    const min = date.getMinutes();
    if (hour > 12) {
      return `오후 ${hour - 12}시 ${min}분`;
    } else {
      return `오전 ${hour}시 ${min}분`;
    }
  };

  const checkDate = (date: Date, lastDate: Date) => {
    const currentDate = new Date(date);
    const pastDate = new Date(lastDate);
    const nowYear = currentDate.getFullYear();
    const lastYear = pastDate.getFullYear();
    const nowMonth = currentDate.getMonth();
    const lastMonth = pastDate.getMonth();
    const nowDay = currentDate.getDay();
    const lastDay = pastDate.getDay();
    if (nowDay > lastDay) {
      return true;
    } else if (nowMonth > lastMonth) {
      return true;
    } else if (nowYear > lastYear) {
      return true;
    } else {
      return false;
    }
  };

  const getDayLine = (inDate: any) => {};

  const scrollLastMessage: any = useRef(null);
  useEffect(() => {
    scrollLastMessage.current.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'start',
    });
  }, [chatting]);

  return (
    <>
      {/* {confirm &&
        ((reservationStatus === 1 && ( // user id !== post user id
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
          {confirm &&
          ((reservationStatus === 1 && (  // user id === post user id
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
        (reservationStatus === 1 ? ( // user id !== post user id
          <Complete text="예약이 취소되었습니다" onClick={onCompleteClick} />
        ) : (
          <Complete text="반납이 완료되었습니다" onClick={onCompleteClick} />
        ))}
        {complete &&
          (reservationStatus === 1 ? ( // user id === post user id
            <Complete text="예약이 수락되었습니다" onClick={onCompleteClick} />
          ) : (
            <Complete text="반납이 확인되었습니다" onClick={onCompleteClick} />
          ))}
      {review && <ReviewModal userId={userId} />} 
      // user id === post user id ? 예약한 사람의 아이디 : 포스트 쓴 사람 아이디
      {submit && (
        <Complete
          text="리뷰가 등록되었습니다."
          onClick={onReviewCompleteClick}
        />
      )} */}
      <ListTab />
      <div
        css={[
          container,
          flex,
          css`
            height: ${rem(600)};
          `,
        ]}
      >
        <div
          css={[
            css`
              width: ${rem(320)};
              display: flex;
              flex-direction: column;
              align-items: center;
              border: ${rem(1)} solid #dedede;
            `,
          ]}
        >
          <div css={[message]}>메시지</div>
          <div
            css={[
              css`
                height: ${rem(534)};
                overflow: auto;
                ::-webkit-scrollbar {
                  display: none;
                }
              `,
            ]}
          >
            {chatRooms.map((chatRoom: chatRoom) => (
              <div
                css={[
                  css`
                    width: ${rem(318)};
                    height: ${rem(90)};
                    display: flex;
                    :hover {
                      background-color: #f0f0f0;
                    }
                    background-color: ${chatRoom.id === chatRoomId
                      ? '#f0f0f0'
                      : '#ffffff'};
                  `,
                ]}
                onClick={(e) => {
                  handleChatRoomClick(
                    e,
                    chatRoom.id,
                    chatRoom.recipient_nickname === userNickName
                      ? chatRoom.sender_nickname
                      : chatRoom.recipient_nickname,
                  );
                }}
                key={chatRoom.id}
              >
                <div
                  css={[
                    imgStyle,
                    css`
                      background-image: ${`url(${chatRoom.recipient_img})`};
                    `,
                  ]}
                ></div>
                <div
                  css={[
                    css`
                      text-align: center;
                      width: ${rem(230)};
                      height: ${rem(90)};
                      display: flex;
                      flex-direction: column;
                    `,
                  ]}
                >
                  <div
                    css={[
                      css`
                        text-align: left;
                        height: ${rem(50)};
                        font-size: ${rem(20)};
                        margin-left: ${rem(10)};
                        margin-top: ${rem(10)};
                        position: relative;
                      `,
                    ]}
                  >
                    {chatRoom.recipient_nickname === userNickName
                      ? chatRoom.sender_nickname
                      : chatRoom.recipient_nickname}
                    {chatCount[`Room${chatRoom.id}`] === 0 ? (
                      <div></div>
                    ) : (
                      <div
                        css={[
                          css`
                            position: absolute;
                            right: ${rem(10)};
                            width: ${rem(30)};
                            top: ${rem(0)};
                            border: ${rem(2)} solid #ed662c;
                            text-align: center;
                            border-radius: 50%;
                          `,
                        ]}
                      >
                        {chatCount[`Room${chatRoom.id}`]}
                      </div>
                    )}
                  </div>
                  <div
                    css={[
                      css`
                        height: ${rem(40)};
                        text-align: left;
                        margin-left: ${rem(10)};
                        margin-top: ${rem(-10)};
                      `,
                    ]}
                  >{`${chatRoom.reservation_id.reservation_dates[0]}~${
                    chatRoom.reservation_id.reservation_dates[
                      chatRoom.reservation_id.reservation_dates.length - 1
                    ]
                  }`}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div
          css={[
            css`
              width: ${rem(640)};
              display: flex;
              flex-direction: column;
              border: ${rem(1)} solid #dedede;
            `,
          ]}
        >
          <div
            css={[
              css`
                height: ${rem(66)};
                text-align: left;
                font-size: ${rem(18)};
                font-weight: 700;
                padding-left: ${rem(20)};
                padding-top: ${rem(18)};
                border-bottom: ${chatNickName === ''
                  ? ''
                  : `${rem(1)} solid #dedede`};
              `,
            ]}
          >
            {chatNickName}
          </div>
          <div
            css={[
              css`
                height: ${rem(470)};
                overflow: auto;
                ::-webkit-scrollbar {
                  display: none;
                }
              `,
            ]}
          >
            {chatting.map((chats: any, index: number) => (
              <>
                {chats.sender === userNickName ? (
                  <div
                    css={[
                      flex,
                      css`
                        justify-content: right;
                        margin: ${rem(10)};
                      `,
                    ]}
                    key={chats.date}
                  >
                    <div
                      css={[
                        css`
                          width: ${rem(70)};
                          position: relative;
                        `,
                      ]}
                    >
                      <div
                        css={[
                          css`
                            font-size: ${rem(10)};
                            text-align: left;
                            color: #7d7d7d;
                            position: absolute;
                            bottom: ${rem(10)};
                          `,
                        ]}
                      >
                        {getTime(chats.date)}
                      </div>
                    </div>
                    <div>
                      <div
                        css={[
                          css`
                            max-width: ${rem(250)};
                            font-size: ${rem(16)};
                            margin-right: ${rem(12)};
                            margin-top: ${rem(5)};
                            text-align: left;
                            background-color: #ed662c;
                            border-radius: ${rem(5)};
                            padding: ${rem(13)};
                            color: #ffffff;
                          `,
                        ]}
                      >
                        {chats.message}
                      </div>
                    </div>
                    <div
                      css={[
                        css`
                          width: ${rem(50)};
                          height: ${rem(50)};
                          border: 2px solid ${color.point};
                          border-radius: 50%;
                          background-size: cover;
                        `,
                      ]}
                    ></div>
                  </div>
                ) : (
                  <div
                    css={[
                      flex,
                      css`
                        margin: ${rem(10)};
                      `,
                    ]}
                    key={chats.date}
                  >
                    <div
                      css={[
                        css`
                          width: ${rem(50)};
                          height: ${rem(50)};
                          border: 2px solid ${color.point};
                          border-radius: 50%;
                          background-size: cover;
                        `,
                      ]}
                    ></div>
                    <div>
                      <div
                        css={[
                          css`
                            max-width: ${rem(250)};
                            font-size: ${rem(16)};
                            margin-left: ${rem(12)};
                            margin-top: ${rem(5)};
                            text-align: right;
                            border: 1px solid #ed662c;
                            border-radius: ${rem(5)};
                            padding: ${rem(13)};
                          `,
                        ]}
                      >
                        {chats.message}
                      </div>
                    </div>
                    <div
                      css={[
                        css`
                          width: ${rem(70)};
                          position: relative;
                        `,
                      ]}
                    >
                      <div
                        css={[
                          css`
                            font-size: ${rem(10)};
                            text-align: right;
                            color: #7d7d7d;
                            position: absolute;
                            bottom: ${rem(10)};
                            margin-left: ${rem(5)};
                          `,
                        ]}
                      >
                        {getTime(chats.date)}
                      </div>
                    </div>
                  </div>
                )}
              </>
            ))}
            <div ref={scrollLastMessage}></div>
          </div>
          <span css={[relative]}>
            <Input
              type="text"
              width={500}
              height={50}
              font-size={18}
              placeholder="메시지를 입력해주세요"
              value={chatMessage}
              onChange={handleOnChange}
              onKeyPress={handleKeyPress}
            />
            <button css={button} onClick={handleOnClick}>
              <img src={PaperPlane} alt="PaperPlane"></img>
            </button>
          </span>
        </div>
        <div
          css={[
            css`
              width: ${rem(320)};
              display: flex;
              flex-direction: column;
              align-items: center;
              border: ${rem(1)} solid #dedede;
              padding: ${rem(30)};
            `,
          ]}
        >
          {'id' in posts && (
            // <Reservation
            //   postId={posts.posts_id.id}
            //   img_urls={posts.posts_id.img_urls}
            //   address={posts.posts_id.address}
            //   title={posts.posts_id.title}
            //   deposit={posts.posts_id.deposit}
            //   rental_fee={posts.posts_id.rental_fee}
            //   reservation_dates={posts.reservation_dates}
            //   onButtonClick={() => {
            //     onButtonClick(posts.id, posts.reservation_status) //? 예약 아이디, 예약 상태
            //   }}
            // />
            <div css={post}>
              <Link to={`/main/${posts.posts_id.id}`} css={textDecorationNone}>
                <img src={posts.posts_id.img_urls} alt="product" css={img} />
                <div css={textContainer}>
                  <span css={[span, moneyTitle, addressStyle]}>
                    <img src={Here} alt="위치" style={{ marginRight: '4px' }} />
                    {posts.posts_id.address}
                  </span>
                  <span css={span}>{posts.posts_id.title}</span>
                  <div css={flexBetween}>
                    <span>
                      <div css={[span, moneyTitle]}>보증금</div>
                      <div css={span}>{posts.posts_id.deposit}원</div>
                    </span>
                    <span>
                      <div css={[span, moneyTitle]}>대여비</div>
                      <div css={span}>{posts.posts_id.rental_fee}원</div>
                    </span>
                  </div>
                  <div css={[span, moneyTitle]}>대여날짜</div>
                  <div css={span}>{`${posts.reservation_dates[0]} ~ ${
                    posts.reservation_dates[posts.reservation_dates.length - 1]
                  }`}</div>
                </div>
              </Link>
              <Button
                text={'캠핑'}
                width={`${rem(205)}`}
                height={`${rem(40)}`}
                background={'white'}
                color={color.mid}
                border={`1px solid ${color.mid}`}
                size={`${rem(14)}`}
                cursor={'pointer'}
                hover={'80%'}
                // onClick={onButtonClick}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Chat;
