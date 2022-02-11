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
  forceRender,
  loginUserInfo,
  showCompleteModal,
  showConfirmModal,
  showReviewModal,
  showSubmitModal,
  chattingRoomId,
  jwtToken,
} from '../../Atom';
import io from 'socket.io-client';
import axios from 'axios';
import Reservation from '../../components/Reservation';
import ConfirmBorrow from '../../components/ConfirmBorrow';
import ConfirmLend from '../../components/ConfirmLend';
import Complete from '../../components/Complete';
import ReviewModal from '../../components/ReviewModal';
import BackButton from '../../components/BackButton';
import silentMessage from '../../assets/pictures/silentMessage.svg';
import selectMessageRoom from '../../assets/pictures/selectMessageRoom.svg';

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
  text-align: left;
  font-size: ${rem(18)};
  font-weight: 700;
  padding: ${rem(18)} ${rem(35)};
  border-bottom: ${rem(1)} solid #f0f0f0;
`;

const imgStyle = css`
  width: ${rem(40)};
  height: ${rem(40)};
  border: 2px solid ${color.point};
  border-radius: 50%;
  background-size: cover;
  margin: ${rem(10)} ${rem(12)} 0 ${rem(12)};
`;

const selectMessage = css`
  font-size: ${rem(20)};
  color: ${color.mid};
  line-height: ${rem(28)};
  margin-top: ${rem(15)};
`;

const chatImg = css`
  max-width: ${rem(250)};
  font-size: ${rem(16)};
  margin-top: ${rem(5)};
  text-align: left;
  border-radius: ${rem(5)};
  padding: ${rem(13)};
`;

//! ------------ interface -------------------

interface chatRoom {
  id: number;
  recipient_nickname: string;
  recipient_img: string;
  sender_nickname: string;
  sender_img: string;
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
  const [chatRoomId, setChatRoomId] = useRecoilState<number>(chattingRoomId);
  const [chatNickName, setChatNickName] = useState<string>('');
  const [chatting, setChatting] = useState<object[]>([]);
  const [chatRooms, setChatRooms] = useState([]);
  const [userNickName, setUserNickName] = useState<string>('');
  const [posts, setPosts] = useState<any>({});
  const [socket, setSocket] = useState<any>();
  const [chatCount, setChatCount] = useRecoilState<chatNum>(chatsNum);
  const token = useRecoilValue(jwtToken);
  const [loginUser, setLoginUser] = useRecoilState(loginUserInfo);
  const [postUserId, setPostUserId] = useState(0);
  const [reservationUserId, setReservationUserId] = useState(0);
  const [partnerImage, setPartnerImage] = useState('');
  const borrowButton = [
    '예약 취소',
    '반납하기',
    '반납 확인 대기 중',
    '반납 완료',
  ];
  const lendButton = ['예약 수락', '반납 대기 중', '반납 확인', '회수 완료'];
  const [confirm, setConfirm] = useRecoilState(showConfirmModal);
  const [complete, setComplete] = useRecoilState(showCompleteModal);
  const [review, setReview] = useRecoilState(showReviewModal);
  const [submit, setSubmit] = useRecoilState(showSubmitModal);
  const forceRerender = useRecoilValue(forceRender);
  const [chatRoomImage, setChatRoomImage] = useState<
    { nickname: string; img: string }[]
  >([]);

  //? 유저 아이디 === 포스트 유저 아이디 (빌려준 사람)
  useEffect(() => {
    const userInfo: any = localStorage.getItem('userInfo');
    if (userInfo) {
      setLoginUser(JSON.parse(userInfo));
    }
  }, [chatRoomId, setLoginUser]);

  const userLend =
    loginUser?.id !== reservationUserId && loginUser?.id === postUserId;

  const userBorrow =
    loginUser?.id === reservationUserId && loginUser?.id !== postUserId;

  const printStatusText = (status: number) => {
    if (userLend) {
      return lendButton[status - 1];
    } else {
      return borrowButton[status - 1];
    }
  };

  const onButtonClick = () => {
    setConfirm(true);
  };

  const onCompleteClick = () => {
    setComplete(false);
    if (
      (userLend && posts.reservation_status === 3) ||
      (userBorrow && posts.reservation_status === 2)
    ) {
      setReview(true);
    } else if (userBorrow && posts.reservation_status === 1) {
      setChatNickName('');
      setChatting([]);
      setChatRoomId(0);
      setPosts({});
    }
  };

  const onReviewCompleteClick = () => {
    setSubmit(false);
  };

  useEffect(() => {
    if (token) {
      axios
        .get(`${host}/chat/chatRoom`, {
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        })
        .then((res: any) => {
          const chatIds = res.data.chat.map((chat: any) => {
            return chat.id;
          });
          const ids = JSON.stringify(chatIds);
          const newSocket = io(host, {
            query: { ids },
          });
          setSocket(newSocket);
          const sortedData = res.data.chat.sort(
            (a: any, b: any) => b.id - a.id,
          );
          setChatRooms(sortedData);
          setUserNickName(res.data.nickName);

          const saveRecipientInfo = sortedData.map((obj: any) => {
            return {
              nickname: obj.recipient_nickname,
              img: obj.recipient_img,
            };
          });

          const saveSenderInfo = saveRecipientInfo.concat(
            sortedData.map((obj: any) => {
              return {
                nickname: obj.sender_nickname,
                img: obj.sender_img,
              };
            }),
          );

          const saveImageInfo = saveSenderInfo.reduce((acc: any, cur: any) => {
            if (
              acc.findIndex(
                ({ nickname }: any) => nickname === cur.nickname,
              ) === -1
            ) {
              acc.push(cur);
            }
            return acc;
          }, []);

          setChatRoomImage(saveImageInfo);
        });
    }
  }, [forceRerender, token]);

  // useEffect((): any => {
  //   const newSocket = io('http://localhost:5050', {
  //     query: { chatRoomId },
  //   });
  //   setSocket(newSocket);
  // }, [chatRoomId]);

  useEffect(() => {
    socket?.on('receive-message', (message: any) => {
      if (message.id === chatRoomId) {
        setChatting([...chatting, message]);
      }
    });
    return () => socket?.off('receive-message');
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
      const clickRoomId = `Room${id}`;
      if (chatCount[clickRoomId]) {
        const newChat = {
          ...chatCount,
          [clickRoomId]: 0,
          total: chatCount.total - chatCount[clickRoomId],
        };
        setChatCount((chatCount) => ({
          ...chatCount,
          [clickRoomId]: 0,
          total: chatCount.total - chatCount[clickRoomId],
        }));
        const chatsNum = JSON.stringify(newChat);
        localStorage.setItem('chatNum', chatsNum);
      }
      setChatRoomId(id);
      setChatNickName(nickName);
      axios
        .get(`${host}/chat/message/${id}`, {
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        })
        .then((res: any) => {
          setChatting(res.data.chat);
          setPosts(res.data.post);
          setPostUserId(res.data.userId.users_id);
          setReservationUserId(res.data.post.users_id.id);
          setPartnerImage(res.data.post.users_id.users_img);
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
      {confirm && userLend && posts.reservation_status === 1 && (
        <ConfirmLend
          reservationId={posts.id}
          reservation_status={1}
          text={'예약 수락'}
          title={'예약 수락'}
          text1={`예약을 수락하시겠습니까?`}
          text2={`예약 일정 확인 후 수락 버튼을 눌러주세요.`}
        />
      )}
      {confirm && userLend && posts.reservation_status === 3 && (
        <ConfirmLend
          reservationId={posts.id}
          reservation_status={3}
          text={'반납 확인'}
          title={'반납 확인'}
          text1={`대여자에게서 물품을 잘 받으셨나요?`}
          text2={`반납 확인 시 회수 처리가 완료됩니다.`}
        />
      )}
      {complete &&
        userLend &&
        (posts.reservation_status === 1 ? (
          <Complete text="예약이 수락되었습니다" onClick={onCompleteClick} />
        ) : (
          <Complete text="반납이 확인되었습니다" onClick={onCompleteClick} />
        ))}
      {confirm && userBorrow && posts.reservation_status === 1 && (
        <ConfirmBorrow
          reservationId={posts.id}
          reservation_status={1}
          text={'예약 취소'}
          title={'예약 취소'}
          text1={`예약을 취소하시겠습니까?`}
          text2={`대여자가 예약을 수락하기 전까지 취소할 수 있습니다.`}
        />
      )}
      {confirm && userBorrow && posts.reservation_status === 2 && (
        <ConfirmBorrow
          reservationId={posts.id}
          reservation_status={2}
          text={'반납하기'}
          title={'반납하기'}
          text1={`반납하시겠습니까?`}
          text2={`대여자가 상품 회수 후 반납 확인 시 최종 반납 처리가 됩니다.`}
        />
      )}
      {complete &&
        userBorrow &&
        (posts.reservation_status === 1 ? (
          <Complete text="예약이 취소되었습니다" onClick={onCompleteClick} />
        ) : (
          <Complete text="반납이 완료되었습니다" onClick={onCompleteClick} />
        ))}

      {review && userLend && <ReviewModal userId={reservationUserId} />}
      {review && userBorrow && <ReviewModal userId={postUserId} />}
      {submit && (
        <Complete
          text="리뷰가 등록되었습니다."
          onClick={onReviewCompleteClick}
        />
      )}
      <BackButton />
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
              border: ${rem(1)} solid #f0f0f0;
              border-radius: ${rem(15)} 0 0 ${rem(15)};
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
                    padding-top: ${rem(10)};
                    display: flex;
                    :hover {
                      background-color: #f0f0f0;
                    }
                    background-color: ${chatRoom.id === chatRoomId
                      ? '#F4F4F4'
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
                      background-image: ${loginUser.nickname ===
                      chatRoom.recipient_nickname
                        ? `url(${
                            chatRoomImage.filter(
                              (obj: any) =>
                                obj.nickname === chatRoom.sender_nickname,
                            )[0]?.img
                          })`
                        : `url(${
                            chatRoomImage.filter(
                              (obj: any) =>
                                obj.nickname === chatRoom.recipient_nickname,
                            )[0]?.img
                          })`};
                      background-position: 50% 50%;
                      background-size: cover;
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
                    {chatCount[`Room${chatRoom.id}`] === 0 ||
                    chatCount[`Room${chatRoom.id}`] === undefined ? (
                      <div />
                    ) : (
                      <div
                        css={[
                          css`
                            position: absolute;
                            right: ${rem(10)};
                            width: ${rem(22)};
                            height: ${rem(22)};
                            top: ${rem(0)};
                            background-color: #ed662c;
                            color: white;
                            text-align: center;
                            border-radius: 50%;
                            font-size: ${rem(12)};
                            padding-top: ${rem(4)};
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
                        font-size: ${rem(14)};
                        margin-left: ${rem(10)};
                        margin-top: ${rem(-23)};
                      `,
                    ]}
                  >{`${chatRoom.reservation_id.reservation_dates[0]} ~ ${
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
              border: ${rem(1)} solid #f0f0f0;
            `,
          ]}
        >
          <div
            css={[
              css`
                text-align: left;
                font-size: ${rem(18)};
                font-weight: 700;
                padding: ${rem(18)} ${rem(35)};
                border-bottom: ${chatNickName === ''
                  ? ''
                  : `${rem(1)} solid #f0f0f0`};
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
            {chatRooms.length === 0 ? (
              <div style={{ padding: `${rem(50)} 0 ${rem(100)} 0` }}>
                <img
                  src={silentMessage}
                  alt="no message room"
                  css={[img, `margin-top: ${rem(50)}`]}
                />
                <p css={selectMessage}>메시지함이 비어있어요.</p>
              </div>
            ) : chatting.length === 0 ? (
              <div style={{ padding: `${rem(50)} 0 ${rem(100)} 0` }}>
                <img
                  src={selectMessageRoom}
                  alt="select message room"
                  css={[img, `margin-top: ${rem(30)}`]}
                />
                <p css={selectMessage}>
                  메시지함을 선택해서 대화를 나눠보세요!
                </p>
              </div>
            ) : (
              chatting.map((chats: any, index: number) => (
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
                              margin-left: ${rem(5)};
                            `,
                          ]}
                        >
                          {getTime(chats.date)}
                        </div>
                      </div>
                      <div>
                        <div
                          css={[
                            chatImg,
                            css`
                              margin-right: ${rem(12)};
                              background-color: #ed662c;
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
                            width: ${rem(40)};
                            height: ${rem(40)};
                            border: 2px solid ${color.point};
                            border-radius: 50%;
                            background-size: cover;
                            margin-top: ${rem(10)};
                            background-image: ${`url(${loginUser.users_img})`};
                            background-position: 50% 50%;
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
                            width: ${rem(40)};
                            height: ${rem(40)};
                            border: 2px solid ${color.point};
                            border-radius: 50%;
                            background-size: cover;
                            margin-top: ${rem(10)};
                            background-image: ${`url(${partnerImage})`};
                            background-position: 50% 50%;
                          `,
                        ]}
                      ></div>
                      <div>
                        <div
                          css={[
                            chatImg,
                            css`
                              margin-left: ${rem(12)};
                              border: 1px solid #ed662c;
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
              ))
            )}
            <div ref={scrollLastMessage}></div>
          </div>
          {chatting.length !== 0 && (
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
          )}
        </div>
        <div
          css={[
            css`
              width: ${rem(320)};
              display: flex;
              flex-direction: column;
              align-items: center;
              border: ${rem(1)} solid #f0f0f0;
              padding: ${rem(30)};
              border-radius: 0 ${rem(15)} ${rem(15)} 0;
              text-align: left;
            `,
          ]}
        >
          {'id' in posts && (
            <Reservation
              postId={posts.posts_id.id}
              img_urls={posts.posts_id.img_urls}
              address={posts.posts_id.address}
              title={posts.posts_id.title}
              deposit={posts.posts_id.deposit}
              rental_fee={posts.posts_id.rental_fee}
              reservation_dates={posts.reservation_dates}
              onButtonClick={onButtonClick}
              text={printStatusText(posts.reservation_status)}
              background={
                posts.reservation_status !== 4 ? color.point : color.mid
              }
              color="white"
              opacity={
                (userLend && posts.reservation_status === 2) ||
                (userBorrow && posts.reservation_status === 3)
                  ? '50%'
                  : '100%'
              }
              cursor={
                posts.reservation_status === 4 ||
                (userLend && posts.reservation_status === 2) ||
                (userBorrow && posts.reservation_status === 3)
                  ? 'not-allowed'
                  : 'pointer'
              }
              hover={
                posts.reservation_status === 4
                  ? '100%'
                  : (userLend && posts.reservation_status === 2) ||
                    (userBorrow && posts.reservation_status === 3)
                  ? '50%'
                  : '80%'
              }
            />
          )}
        </div>
      </div>
    </>
  );
}

export default Chat;
