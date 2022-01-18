/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useResetRecoilState, useSetRecoilState, useRecoilState } from 'recoil';
import { isLogin, loginUserInfo } from '../Atom';
import { host, rem, shadow, textDecorationNone } from '../common';
import { chatsNum } from '../Atom';

const box = css`
  width: ${rem(205)};
  border-radius: ${rem(10)};
  position: absolute;
  top: ${rem(83)};
  right: 0;
  background-color: white;
  box-shadow: ${shadow};
`;

const ulStyle = css`
  list-style: none;
  padding: 0;
  font-size: ${rem(16)};
  margin: ${rem(14)} 0 ${rem(8)} 0;
`;

const li = css`
  color: black;
  padding: ${rem(11)} 0 ${rem(11)} ${rem(19)};
  :hover {
    background-color: #f0f0f0;
  }
`;

const line = css`
  border: 1px solid #f0f0f0;
  margin: ${rem(5)} 0;
`;

function ProfileDropdown() {
  const setIsLogin = useSetRecoilState(isLogin);
  const navigate = useNavigate();
  const resetLoginUserInfo = useResetRecoilState(loginUserInfo);
  const [chatNum, setChatNum] = useRecoilState(chatsNum);

  const logout = () => {
    setIsLogin(false);
    axios
      .get(`${host}/user/logout`, { withCredentials: true })
      .then((res: any) => {
        console.log(res);
        localStorage.removeItem('isLogin');
        localStorage.removeItem('userInfo');
        resetLoginUserInfo();
        navigate('/');
      })
      .catch((err) => console.error(err));
  };

  return (
    <div css={box}>
      <ul css={ulStyle}>
        <Link to="/lists/chat" css={textDecorationNone}>
          <li
            css={[
              li,
              css`
                display: flex;
              `,
            ]}
          >
            메시지
            {chatNum.total !== 0 ? (
              <div
                css={[
                  css`
                    width: ${rem(25)};
                    height: ${rem(25)};
                    border-radius: 50%;
                    border: ${rem(2)} solid #ed662c;
                    text-align: center;
                    margin-left: ${rem(10)};
                    font-size: ${rem(15)};
                    line-height: ${rem(20)};
                  `,
                ]}
              >
                {chatNum.total}
              </div>
            ) : (
              <div></div>
            )}
          </li>
        </Link>
        <Link to="/lists/borrowlist" css={textDecorationNone}>
          <li css={li}>빌린 목록</li>
        </Link>
        <Link to="/lists/lendlist" css={textDecorationNone}>
          <li css={li}>빌려준 목록</li>
        </Link>
        <Link to="/lists/likelist" css={textDecorationNone}>
          <li css={li}>찜한 목록</li>
        </Link>
        <Link to="/lists/resistlist" css={textDecorationNone}>
          <li css={li}>내가 쓴 글</li>
        </Link>
        <div css={line} />
        <Link to="mypage" css={textDecorationNone}>
          <li css={li}>계정</li>
        </Link>

        <li css={li} onClick={logout}>
          로그아웃
        </li>
      </ul>
    </div>
  );
}

export default ProfileDropdown;
