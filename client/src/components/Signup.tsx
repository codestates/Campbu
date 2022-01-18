/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import axios from 'axios';
import { useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { showSignupModal } from '../Atom';
import {
  color,
  rem,
  shadow,
  modalBackgroundStyle,
  flex,
  flexBetween,
  flexVertical,
  host,
} from '../common';
import { Button } from './Button';
import Input from './Input';
import { TermsOfPrivacyPolicy } from './TermsOfPrivacyPoicy';
import TermsOfUse from './TermsOfUse';

export const backgroundStyle = css`
  background-color: white;
  width: ${rem(334)};
  height: ${rem(450)};
  border-radius: ${rem(15)};
  box-shadow: ${shadow};
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: ${rem(12)};
  position: relative;
`;

const verticalAlign = css`
  display: flex;
  flex-direction: column;
`;

const checkStyle = css`
  top: ${rem(353)};
  display: flex;
  justify-content: center;
`;

const validButtonInactive = css`
  color: ${color.border};
  font-weight: 700;
`;
const validButtonActive = css`
  color: ${color.point};
  font-weight: 700;
  :hover {
    color: ${color.point};
    cursor: pointer;
    opacity: 0.8;
  }
  :active {
    opacity: 0.95;
  }
`;
const x = css`
  font-size: ${rem(14)};
  width: ${rem(18)};
  height: ${rem(18)};
  line-height: ${rem(18)};
  text-align: center;
  color: ${color.placeholder};
  top: ${rem(14)};
  right: ${rem(12)};
  position: absolute;
  :hover {
    font-size: ${rem(18)};
    cursor: pointer;
  }
`;

const marginTop12 = css`
  margin-top: ${rem(12)};
`;
const marginTop6 = css`
  margin-top: ${rem(6)};
`;
const alignItemCenter = css`
  align-items: center;
`;
const alignItemFlexEnd = css`
  align-items: center;
`;

const noticeOk = css`
  font-size: ${rem(10)};
  color: ${color.mid};
`;
const noticeNo = css`
  font-size: ${rem(10)};
  color: ${color.point};
`;

const alignLeft = css`
  width: ${rem(113)};
  text-align: left;
  margin-left: ${rem(13.5)};
`;
const padding35 = css`
  padding: ${rem(35)};
`;

const termsStyle = css`
  border: 1px solid ${color.border};
  border-radius: ${rem(5)};
  padding: ${rem(10)};

  font-size: ${rem(12)};
  overflow-y: scroll;
`;
const backgroundNone = css`
  background-color: rgba(0, 0, 0, 0);
`;

function Signup() {
  const setSignupModal = useSetRecoilState(showSignupModal);
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [emailValid, setEmailValid] = useState(false);
  const [passwordValid, setPasswordValid] = useState(false);

  const [nickDuplicateClick, setNickDuplicateClick] = useState(false);
  const [emailDuplicateClick, setEmailDuplicateClick] = useState(false);

  const [nickDupliacte, setNickDupliacte] = useState(false);
  const [emailDupliacte, setEmailDupliacte] = useState(false);

  const [showTermsOfUse, setShowTermsOfUse] = useState(false);
  const [showTermsOfPP, setShowTermsOfPP] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  const nicknameHandler = (e: any) => {
    setNickname(e.target.value);
    if (nickDupliacte) {
      setNickDupliacte(false);
    }
    setNickDuplicateClick(false);
  };
  const emailHandler = (e: any) => {
    const email = e.target.value;
    setEmail(email);
    const emailValidator =
      /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    setEmailValid(emailValidator.test(email));
    if (emailDupliacte) {
      setEmailDupliacte(false);
    }
    setEmailDuplicateClick(false);
  };
  const passwordHandler = (e: any) => {
    const password = e.target.value;
    setPassword(password);
    const passwordValidator = /(?=.*[0-9])(?=.*[A-Za-z]).{8,}/g;
    setPasswordValid(passwordValidator.test(password));
  };

  const confirmPasswordHandler = (e: any) => setConfirmPassword(e.target.value);

  const nicknameDuplicateCheckHandler = () => {
    if (nickname.length > 0) {
      setNickDuplicateClick(true);

      axios
        .get(`${host}/user/signup?nickname=${nickname}`)
        .then((res) => {
          if (res.status === 200) {
          }
        })
        .catch((err) => {
          setNickDupliacte(false);
          console.log('닉네임 중복', setNickDupliacte(false));
        });
    }
  };

  const emailDuplicateCheckHandler = () => {
    if (emailValid) {
      setEmailDuplicateClick(true);

      axios.get(`${host}/user/signup?email=${email}`).then((res) => {
        if (res.status === 200) {
          console.log(`API ${host}/user/signup?email=${email}`);
          console.log('이메일 사용가능', setEmailDupliacte(true));
        } else {
          setEmailDupliacte(false);
          console.log('이메일 중복', setEmailDupliacte(false));
        }
      });
    }
  };

  const showTermsOfUseHandler = () => setShowTermsOfUse(!showTermsOfUse);
  const showTermsOfPPHandler = () => setShowTermsOfPP(!showTermsOfPP);

  const acceptTermsHandler = (e: any) => {
    setAcceptTerms(e.target.checked);
  };
  const signupHandler = () => {
    if (
      nickDupliacte &&
      emailDupliacte &&
      passwordValid &&
      password === confirmPassword &&
      acceptTerms
    ) {
      console.log('회원가입 api 요청 gogo');
      const signUpData: {
        email: string;
        nickname: string;
        password: string;
      } = {
        email: email,
        nickname: nickname,
        password: password,
      };

      console.log('API', `${host}/user/signup`);
      console.log('body', signUpData);
      axios
        .post(`${host}/user/signup`, signUpData, {
          headers: {
            'Content-Type': 'application/json',
          },
        })
        .then((res) => {
          console.log('signup ok');
          setSignupModal(false);
        })
        .catch((err) => console.log(err));
    } else {
      console.log('모든 정보를 입력하세요 api 요청 거절');
    }
  };

  return (
    <div css={modalBackgroundStyle}>
      {showTermsOfUse ? (
        <div css={[modalBackgroundStyle, backgroundNone]}>
          <div css={[backgroundStyle, flexVertical, padding35]}>
            <div css={termsStyle}>
              <TermsOfUse />
            </div>
            <div css={marginTop12}>
              <Button
                text="확인"
                width={rem(70)}
                height={rem(30)}
                background={color.point}
                color={color.white}
                cursor="pointer"
                border="none"
                size={rem(14)}
                onClick={showTermsOfUseHandler}
              />
            </div>
          </div>
        </div>
      ) : null}
      {showTermsOfPP ? (
        <div css={[modalBackgroundStyle, backgroundNone]}>
          <div css={[backgroundStyle, flexVertical, padding35]}>
            <div css={termsStyle}>
              <TermsOfPrivacyPolicy />
            </div>
            <div css={marginTop12}>
              <Button
                text="확인"
                width={rem(70)}
                height={rem(30)}
                background={color.point}
                color={color.white}
                cursor="pointer"
                border="none"
                size={rem(14)}
                onClick={showTermsOfPPHandler}
              />
            </div>
          </div>
        </div>
      ) : null}
      <div className="Singup" css={backgroundStyle}>
        <div css={x} onClick={() => setSignupModal(false)}>
          &times;
        </div>
        <div css={[verticalAlign]}>
          <div css={[flexBetween, alignItemFlexEnd]}>
            <span>닉네임</span>
            <div
              css={css`
                margin-left: ${rem(5)};
              `}
            >
              {nickDuplicateClick ? (
                nickDupliacte ? (
                  <div css={noticeOk}> * 사용가능한 닉네임입니다.</div>
                ) : (
                  <div css={noticeNo}> * 중복된 닉네임입니다.</div>
                )
              ) : null}
            </div>
            <span
              css={
                nickname.length > 0 ? validButtonActive : validButtonInactive
              }
              onClick={nicknameDuplicateCheckHandler}
            >
              중복 검사
            </span>
          </div>
          <div css={marginTop6}>
            <Input
              width={205}
              height={38}
              fontSize={12}
              onChange={nicknameHandler}
              value={nickname}
              type="text"
              placeholder="닉네임을 입력해주세요."
            />
          </div>
          <div css={[flexBetween, marginTop12, alignItemFlexEnd]}>
            <span>이메일</span>
            <div css={alignLeft}>
              {emailDuplicateClick ? (
                emailDupliacte ? (
                  <span css={noticeOk}>* 사용 가능한 이메일 입니다.</span>
                ) : (
                  <span css={noticeNo}>* 중복된 이메일 입니다.</span>
                )
              ) : emailValid ? null : email.length > 0 ? (
                <span css={noticeNo}>* 이메일 형식을 지켜주세요.</span>
              ) : null}
            </div>
            <span
              css={emailValid ? validButtonActive : validButtonInactive}
              onClick={emailDuplicateCheckHandler}
            >
              중복 검사
            </span>
          </div>
          <div css={marginTop6}>
            <Input
              width={205}
              height={38}
              fontSize={12}
              onChange={emailHandler}
              value={email}
              type="text"
              placeholder="이메일을 입력해주세요."
            />
          </div>
          <div css={marginTop12}>
            <div css={[flex, alignItemFlexEnd]}>
              <div>비밀번호</div>
              <div
                css={css`
                  margin-left: ${rem(4)};
                `}
              >
                {confirmPassword.length > 0 && passwordValid ? (
                  password === confirmPassword ? (
                    <div css={noticeOk}>* 사용가능한 비밀번호입니다.</div>
                  ) : (
                    <div css={noticeNo}>* 비밀번호가 일치하지 않습니다.</div>
                  )
                ) : password.length > 0 ? (
                  passwordValid ? null : (
                    <div css={noticeNo}>
                      * 영문, 숫자 조합 8자 이상 입력해주세요.{' '}
                    </div>
                  )
                ) : null}
              </div>
            </div>
          </div>
          <div css={marginTop6}>
            <Input
              width={205}
              height={38}
              fontSize={12}
              onChange={passwordHandler}
              value={password}
              type="password"
              placeholder="비밀번호를 입력해주세요."
            />
          </div>
          <div css={marginTop6}>
            <Input
              width={205}
              height={38}
              fontSize={12}
              onChange={confirmPasswordHandler}
              value={confirmPassword}
              type="password"
              placeholder="비밀번호를 한 번 더입력해주세요."
            />
          </div>

          <div css={[flexBetween, marginTop12, alignItemCenter]}>
            <span>{`[필수] 이용약관`}</span>
            <Button
              text="보기"
              width={rem(41)}
              height={rem(21)}
              background={color.point}
              color={color.white}
              border="none"
              size={rem(10)}
              hover="0.85"
              cursor="pointer"
              onClick={showTermsOfUseHandler}
            />
          </div>
          <div css={[flexBetween, marginTop6, alignItemCenter]}>
            <span>{`[필수] 개인정보 수집 및 이용`}</span>
            <Button
              text="보기"
              width={rem(41)}
              height={rem(21)}
              background={color.point}
              color={color.white}
              border="none"
              size={rem(10)}
              hover="0.85"
              cursor="pointer"
              onClick={showTermsOfPPHandler}
            />
          </div>
          <div css={[checkStyle, marginTop12]}>
            <input
              css={css`
                width: 0.8125rem;
                height: 0.8125rem;
                margin-right: 0.5625rem;
              `}
              type="checkbox"
              onClick={acceptTermsHandler}
            />
            <span>{`모든 이용약관에 동의합니다.`}</span>
          </div>
          <div css={marginTop12} onClick={signupHandler}>
            <Button
              text="회원가입"
              width={rem(205)}
              height={rem(40)}
              background={
                nickDupliacte &&
                emailDupliacte &&
                passwordValid &&
                password === confirmPassword &&
                acceptTerms
                  ? color.point
                  : color.border
              }
              color={color.white}
              cursor="pointer"
              border="none"
              size={rem(12)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
