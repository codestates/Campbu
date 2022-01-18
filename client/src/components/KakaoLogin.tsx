import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { isLogin, showLoginModal } from '../Atom';

export default function KakaoLogin() {
  const setShowLogin = useSetRecoilState(showLoginModal);
  const setIsLogin = useSetRecoilState(isLogin);
  const [accessToken, setAccessToken] = useState('');
  const [refreshToken, setRefreshToken] = useState('');
  const navigate = useNavigate();
  const host = 'http://localhost:5050';

  useEffect(() => {
    const url = new URL(window.location.href);
    const authorizationCode = url.searchParams.get('code');
    if (authorizationCode) {
      getAccessToken(authorizationCode);
    }
    return () => {};
  }, []);

  useEffect(() => {
    getUserInfo(accessToken);
    return () => {};
  }, [accessToken]);

  const getAccessToken = async (authorizationCode: unknown) => {
    await axios
      .post(
        `${host}/user/kakao`,
        { authorizationCode },
        { withCredentials: true },
      )
      .then((res) => {
        setAccessToken(res.data.access_token);
        if (!refreshToken) {
          setRefreshToken(res.data.refresh_token);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const getUserInfo = async (accessToken: unknown) => {
    if (accessToken !== '') {
      await axios
        .get(`${host}/user/kakao`, {
          headers: { Authorization: `Bearer ${accessToken}` },
          withCredentials: true,
        })
        .then((res) => {
          console.log(res);
          if (res.status === 200) {
            setShowLogin(false);
            setIsLogin(true);
            navigate('/');
            return;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };
  return <div></div>;
}
