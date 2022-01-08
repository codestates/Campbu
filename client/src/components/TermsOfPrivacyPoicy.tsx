/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';

import { color, rem } from '../common';

export function TermsOfPrivacyPolicy() {
  return (
    <div>
      <ul>
        <p> (제1항) 수집하는 개인정보 항목</p>
        <br />
        <p>
          회사는 회원가입, 상담, 서비스 신청 등등을 위해 아래와 같은 개인정보를
          수집하고 있습니다.
        </p>

        <p>*수집항목 : 이메일, 비밀번호, 서비스 이용기록</p>
        <br />
        <br />
        <p> (제2항) 개인정보의 수집 및 이용목적</p>
        <br />
        <p>회사는 수집한 개인정보를 다음의 목적을 위해 활용합니다.</p>
        <p>
          서비스 제공에 관한 계약 이행 및 서비스 제공에 따른 회원 관리, 회원제
          서비스 이용에 따른 본인확인, 개인 식별, 회원의 서비스 이용에 대한 통계
        </p>
        <br />
        <br />
        <p> (제3항) 개인정보의 보유 및 이용기간</p>
        <br />
        <p>
          회사는 개인정보 수집 및 이용목적이 달성된 후에는 예외 없이 해당 정보를
          지체 없이 파기합니다.
        </p>
      </ul>
    </div>
  );
}
