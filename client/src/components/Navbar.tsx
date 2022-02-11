/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import Logo from '../assets/Logo.svg';
import Menu from '../assets/Menu.svg';
import Profile from '../assets/Profile.svg';

import {
  isLogin,
  loginUserInfo,
  post_id,
  showLoginModal,
  showModal,
  showSignupModal,
  chattingRoomId,
  chatsNum,
  selectAddress,
  selectCategory,
  navbarOn,
  jwtToken,
} from '../Atom';
import { color, host, hover, rem, shadow } from '../common';

import { Button } from './Button';
import LoginModal from './LoginModal';
import ProfileDropdown from './ProfileDropdown';
import Signup from './Signup';
import io from 'socket.io-client';
import { host } from '../common';

const headerStyle = css`
  height: ${rem(99)};
  display: flex;
  justify-content: space-between;
  width: 100vw;
  max-width: ${rem(1280)};
  margin: 0 auto;
  align-items: center;
  position: relative;
  z-index: 999;
`;

function Navbar() {
  const [isShowModal, setIsShowModal] = useRecoilState(showModal);
  const [login, setIsLogin] = useRecoilState(isLogin);
  const [showLogin, setShowLogin] = useRecoilState(showLoginModal);
  const [chatNum, setChatNum] = useRecoilState(chatsNum);
  const [socket, setSocket] = useState<any>();
  const [messageDate, setMessageDate] = useState<number>(1000);
  const [userInfo, setLoginUserInfo] = useRecoilState(loginUserInfo);
  const setPostId = useSetRecoilState(post_id);
  const chatRoomId = useRecoilValue(chattingRoomId);
  const [roomId, setRoomId] = useState<string>('');
  const [mesId, setMesId] = useState<number>();
  const [mesDate, setMesDate] = useState<Date>();
  const setSelectAddress = useSetRecoilState(selectAddress);
  const setSelectCategory = useSetRecoilState(selectCategory);
  const showSignup = useRecoilValue(showSignupModal);
  const setNavOn = useSetRecoilState(navbarOn);
  const setToken = useSetRecoilState(jwtToken);
  const token = useRecoilValue(jwtToken);

  const onClick = () => {
    setIsShowModal(!isShowModal);
  };

  useEffect(() => {
    if (localStorage.getItem('isLogin')) {
      setIsLogin(true);
    }
    if (localStorage.getItem('userInfo')) {
      const userInfo = localStorage.getItem('userInfo');
      if (userInfo) {
        setLoginUserInfo(JSON.parse(userInfo));
      }
    }
  }, [setIsLogin, setLoginUserInfo]);

  useEffect(() => {
    if (localStorage.getItem('postId')) {
      const postId = localStorage.getItem('postId');
      setPostId(Number(postId));
    }
  }, [setPostId]);

  useEffect(() => {
    const address = localStorage.getItem('address');
    if (address) {
      setSelectAddress(address);
    }
  }, [setSelectAddress]);
  useEffect(() => {
    const category = localStorage.getItem('category');
    if (category) {
      setSelectCategory(category);
    }
  }, [setSelectCategory]);

  useEffect(() => {
    const newSocket = io(host);
    setSocket(newSocket);
  }, [setIsLogin]);

  useEffect(() => {
    if (mesId !== chatRoomId && roomId !== '' && mesId !== undefined) {
      setChatNum((chatNum) => ({
        ...chatNum,
        total: chatNum.total + 1,
        [roomId]: chatNum[roomId] + 1,
      }));
    }
  }, [mesDate]);

  useEffect(() => {
    const isToken = localStorage.getItem('token');
    if (isToken) {
      setToken(isToken);
    }
  }, [setToken]);

  socket?.on('receive-message', (message: any) => {
    const roomId = 'Room' + String(message.id);
    setRoomId(roomId);
    setMesId(message.id);
    setMesDate(message.date);
  });

  return (
    <header css={headerStyle}>
      {showSignup ? <Signup /> : null}
      {showLogin ? <LoginModal /> : null}
      <div>
        <Link to="/" draggable="false">
          <img
            src={Logo}
            className="CampBu-logo"
            alt="logo"
            draggable="false"
            onClick={() => {
              setNavOn(false);
            }}
          />
        </Link>
      </div>
      <div>
        {login ? (
          <>
            <Button
              width={`${rem(83)}`}
              height={`${rem(36)}`}
              background={`${color.point}`}
              color="white"
              border="none"
              size={`${rem(13)}`}
              cursor="pointer"
              onClick={onClick}
              shadow={`${shadow}`}
              hoverBackground="#F18556"
            >
              <div
                css={[
                  css`
                    display: flex;
                    justify-content: center;
                  `,
                ]}
              >
                <img
                  src={Menu}
                  className="CampBu-logo"
                  alt="logo"
                  draggable="false"
                />
                {isShowModal || chatNum.total === 0 ? (
                  <img
                    css={css`
                      width: ${rem(20)};
                      height: ${rem(20)};
                      border-radius: 50%;
                      margin-left: 0.8rem;
                    `}
                    src={userInfo.users_img || Profile}
                    className="CampBu-logo"
                    alt="logo"
                    draggable="false"
                  />
                ) : (
                  <div
                    css={[
                      css`
                        background-color: white;
                        width: ${rem(20)};
                        height: ${rem(20)};
                        color: ${color.point};
                        border-radius: 50%;
                        margin-left: 0.8rem;
                        font-size: ${rem(15)};
                        line-height: ${rem(20)};
                      `,
                    ]}
                  >
                    {chatNum.total}
                  </div>
                )}
              </div>
            </Button>
            {isShowModal && <ProfileDropdown />}
          </>
        ) : (
          <Button
            text="Login"
            width={`${rem(83)}`}
            height={`${rem(36)}`}
            background={`${color.point}`}
            color="white"
            border="none"
            size={`${rem(14)}`}
            hoverBackground="#F18556"
            cursor="pointer"
            onClick={() => setShowLogin(true)}
          />
        )}
      </div>
    </header>
  );
}

export default Navbar;
