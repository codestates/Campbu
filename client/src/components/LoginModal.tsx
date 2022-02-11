/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { color, host, modalBackgroundStyle, rem, shadow } from '../common';
import { Button } from './Button';
import Input from './Input';
import kakaoimg from '../assets/kakao.png';
import googleimg from '../assets/google.png';
import { useSetRecoilState, useRecoilState, useResetRecoilState } from 'recoil';
import {
  isLogin,
  loginUserInfo,
  showLoginModal,
  showSignupModal,
  allChatRoomId,
  showModal,
  navbarOn,
  jwtToken,
} from '../Atom';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import KakaoLogin from './KakaoLogin';
import io from 'socket.io-client';
import { chatsNum } from '../Atom';

const backgroundStyle = css`
  background-color: white;
  width: ${rem(380)};
  height: ${rem(485)};
  border-radius: ${rem(15)};
  box-shadow: ${shadow};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const x = css`
  font-size: ${rem(20)};
  width: ${rem(18)};
  height: ${rem(18)};
  line-height: ${rem(18)};
  text-align: center;
  color: ${color.placeholder};
  top: ${rem(14)};
  right: ${rem(18)};
  position: absolute;
  :hover {
    font-size: ${rem(18)};
    cursor: pointer;
  }
`;

const oauth = css`
  border: 1px solid ${color.border};
  border-radius: ${rem(5)};
  background-color: ${color.white};
  width: ${rem(240)};
  height: ${rem(48)};
  font-size: ${rem(14)};
  position: relative;
  transition: 0.1s;
  :hover {
    opacity: 0.5;
  }
  :active {
    opacity: 95%;
  }
`;
const oauthIcon = css`
  width: ${rem(22)};
  height: ${rem(22)};
  position: absolute;
  left: ${rem(15)};
  top: ${rem(11)};
`;

const marginTop6 = css`
  margin-top: ${rem(6)};
`;

const topLine = css`
  width: ${rem(240)};
  border: 1px solid ${color.border};
  border-style: solid none none none;
  margin-top: ${rem(20)};
  padding-top: ${rem(20)};
  position: relative;
`;
const floatingTextBox = css`
  width: ${rem(240)};
  display: flex;
  justify-content: center;
`;
const floatingText = css`
  text-align: center;
  position: absolute;
  background-color: ${color.white};
  color: ${color.placeholder};
  font-size: ${rem(11)};
  line-height: ${rem(10)};
  top: ${rem(-5)};
`;

const reqMsgStyle = css`
  height: ${rem(18)};
  line-height: ${rem(18)};
  font-size: ${rem(12)};
  color: ${color.point};
  margin-left: ${rem(12)};
  margin-top: ${rem(5)};
`;

function LoginModal() {
  const setShowLogin = useSetRecoilState(showLoginModal);
  const setIsLogin = useSetRecoilState(isLogin);
  const setShowSignup = useSetRecoilState(showSignupModal);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [reqMsgState, setReqMsgState] = useState('ok');
  const setLoginUserInfo = useSetRecoilState(loginUserInfo);
  const [chatNum, setChatNum] = useRecoilState(chatsNum);
  const resetIsNavOn = useResetRecoilState(navbarOn);
  const setToken = useSetRecoilState(jwtToken);
  const navigate = useNavigate();
  const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.REACT_APP_KAKAO_CLIENT_ID}&redirect_uri=${process.env.REACT_APP_KAKAO_REDIRECT_URI}&response_type=code`;
  const GOOGLE_AUTH_URL = `https://accounts.google.com/o/oauth2/v2/auth?scope=openid%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile%20&response_type=code&redirect_uri=${process.env.REACT_APP_GOOGLE_REDIRECT_URI}&client_id=${process.env.REACT_APP_GOOGLE_CLIENT_ID}`;
  const setChatIds = useSetRecoilState(allChatRoomId);
  const setIsShowModal = useSetRecoilState(showModal);

  const emailHandler = (e: any) => {
    setEmail(e.target.value);
  };

  const passwordHandler = (e: any) => {
    setPassword(e.target.value);
  };

  interface reqMsgType {
    [key: string]: string;
  }

  const reqMsg: reqMsgType = {
    ok: '',
    email: '* 이메일을 입력해주세요.',
    password: '* 비밀번호를 입력해주세요.',
    conflict: '* 아이디와 비밀번호를 확인해주세요',
  };

  const loginHandler = () => {
    interface loginType {
      email: string;
      password: string;
    }

    const loginInfo: loginType = {
      email,
      password,
    };

    if (!email) return setReqMsgState('email');
    if (!password) {
      return setReqMsgState('password');
    } else {
      setReqMsgState('ok');
    }

    axios
      .post(`${host}/user/login`, loginInfo, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      })
      .then((res) => {
        if (res.status === 200) {
          setShowLogin(false);
          setIsLogin(true);
          interface loginUserInfoType {
            created_at: string;
            email: string;
            id: number;
            nickname: string;
            updated_at: string;
            users_img: string;
          }

          const userinfo: loginUserInfoType = res.data.user;
          setLoginUserInfo(userinfo);
          const newToken: string = res.data.token;
          setToken(newToken);
          localStorage.setItem('token', newToken);

          localStorage.setItem('isLogin', 'true');
          localStorage.setItem('userInfo', JSON.stringify(userinfo));

          axios
            .get(`${host}/chat/chatRoom`, {
              headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${newToken}`,
              },
              withCredentials: true,
            })
            .then((res: any) => {
              const chatIds = res.data.chat.map((chat: any) => {
                const roomId = 'Room' + String(chat.id);
                if (!(roomId in chatNum)) {
                  const newChat = {
                    ...chatNum,
                    [roomId]: 0,
                  };
                  setChatNum((chatNum) => ({
                    ...chatNum,
                    [roomId]: 0,
                  }));
                  const chatsNum = JSON.stringify(newChat);
                  localStorage.setItem('chatNum', chatsNum);
                }
                return chat.id;
              });
              const ids = JSON.stringify(chatIds);
              setChatIds(ids);
              io(host, {
                query: { ids },
              });
            });
          setIsShowModal(false);
          resetIsNavOn();
          navigate('/main');
        }
      })
      .catch((res) => {
        setReqMsgState('conflict');
      });
  };

  const onLoginPress = (e: any) => {
    if (e.key === 'Enter') {
      loginHandler();
    }
  };

  return (
    <div css={modalBackgroundStyle}>
      <div css={backgroundStyle}>
        <div css={x} onClick={() => setShowLogin(false)}>
          &times;
        </div>
        <div className="login">
          <div>
            <Input
              width={240}
              height={48}
              borderRadius={5}
              placeholder="이메일을 입력해주세요."
              fontSize={14}
              onChange={emailHandler}
              value={email}
            />
          </div>
          <div css={marginTop6}>
            <Input
              width={240}
              height={48}
              borderRadius={5}
              placeholder="비밀번호를 입력해주세요."
              fontSize={14}
              onChange={passwordHandler}
              value={password}
              type="password"
              onKeyPress={onLoginPress}
            />
          </div>
          <div css={reqMsgStyle}>
            <div>{reqMsg[reqMsgState]}</div>
          </div>

          <div>
            <Button
              text="로그인"
              width={rem(240)}
              height={rem(48)}
              background={color.point}
              color={color.white}
              border="none"
              size={rem(14)}
              hover=".85"
              onClick={loginHandler}
            />
          </div>
        </div>
        <div className="OAuth" css={topLine}>
          <div css={floatingTextBox}>
            <div
              css={[
                floatingText,
                css`
                  width: ${rem(25)};
                `,
              ]}
            >
              또는
            </div>
          </div>
          <a href={GOOGLE_AUTH_URL} draggable="false">
            <button css={oauth}>
              <img
                css={[oauthIcon, `width: ${rem(24)}`, `height: ${rem(24)}`]}
                src={googleimg}
                alt="google login"
                draggable="false"
              />
              <div>구글로 로그인하기</div>
            </button>
          </a>
          <a href={KAKAO_AUTH_URL} draggable="false">
            <button css={[oauth, marginTop6]}>
              <img
                css={oauthIcon}
                src={kakaoimg}
                alt="kakao login"
                draggable="false"
              />
              <div>카카오로 로그인하기</div>
            </button>
          </a>
        </div>
        <div className="singUp" css={topLine}>
          <div css={floatingTextBox}>
            <div
              css={[
                floatingText,
                css`
                  width: ${rem(75)};
                `,
              ]}
            >
              회원이 아니라면?
            </div>
          </div>
          <Button
            text="회원가입"
            width={rem(240)}
            height={rem(48)}
            background={color.white}
            color={color.point}
            border={`1px solid ${color.point}`}
            size={rem(14)}
            fontWeight={700}
            hover=".7"
            onClick={() => {
              setShowSignup(true);
              setShowLogin(false);
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default LoginModal;
