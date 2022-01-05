/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { rem, color } from '../common';
import Back from '../assets/Back.svg';

const backButton = css`
  border: none;
  align-items: center;
  background-color: white;
  cursor: pointer;
`;

const text = css`
  color: ${color.point};
  font-weight: 700;
  font-size: ${rem(16)};
  margin-left: ${rem(8)};
`;

function BackButton() {
  return (
    <button css={backButton}>
      <img src={Back} alt="뒤로가기" />
      <span css={text}>목록으로 돌아가기</span>
    </button>
  );
}

export default BackButton;
