/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useResetRecoilState, useSetRecoilState } from 'recoil';
import { isLogin, loginUserInfo } from '../Atom';
import { host, rem, shadow, textDecorationNone } from '../common';

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

  const logout = () => {
    setIsLogin(false);
    axios
      .get(`${host}/user/logout`, { withCredentials: true })
      .then((res: any) => {
        console.log(res);
        localStorage.removeItem('isLogin');
        resetLoginUserInfo();
        navigate('/');
      })
      .catch((err) => console.error(err));
  };

  return (
    <div css={box}>
      <ul css={ulStyle}>
        <Link to="/lists/Chat" css={textDecorationNone}>
          <li css={li}>메시지</li>
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
