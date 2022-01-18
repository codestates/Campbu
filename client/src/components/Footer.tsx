/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import Logo from '../assets/Logo.svg';
import { color, rem, textDecorationNone } from '../common';

const footerStyle = css`
  background-color: #eeefcb;
  margin-top: ${rem(60)};
`;

const divStyle = css`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: stretch;
  color: ${color.deep};
  margin: 0 auto;
  padding-top: ${rem(30)};
`;

const textStyle = css`
  font-size: ${rem(12)};
  margin-right: ${rem(150)};
`;

const visit = css`
  :visited {
    color: ${color.deep};
  }
  :active {
    color: ${color.deep};
  }
`;

const ulStyle = css`
  list-style: none;
  padding: 0;
  margin: 0 ${rem(100)} ${rem(30)} 0;
`;

const titleStyle = css`
  font-size: ${rem(14)};
  font-weight: 700;
`;

const listStyle = css`
  font-weight: 400;
  margin: ${rem(8)} 0;
`;

const lineStyle = css`
  border: 1px solid ${color.deep};
  width: ${rem(700)};
  margin: 0 auto;
`;

const underStyle = css`
  display: block;
  text-align: center;
  padding-top: 0;
`;

const copyright = css`
  margin-top: ${rem(6)};
  margin-right: 0;
  padding-bottom: ${rem(25)};
`;

function Footer() {
  return (
    <footer css={footerStyle}>
      <div css={divStyle}>
        <div style={{ marginLeft: `${rem(80)}` }}>
          <img src={Logo} className="CampBu-logo" alt="logo" />
          <p css={textStyle}>서울특별시 강남구 논현동 384-2</p>
        </div>
        <ul css={ulStyle}>
          <li css={titleStyle}>서비스 소개</li>
          <li css={[titleStyle, listStyle]}>
            <a
              href="https://github.com/codestates/Campbu/wiki"
              css={[textDecorationNone, visit]}
            >
              Wiki
            </a>
          </li>
          <li css={[titleStyle, listStyle]}>
            <a
              href="https://github.com/codestates/Campbu"
              css={[textDecorationNone, visit]}
            >
              Github
            </a>
          </li>
        </ul>
        <ul css={ulStyle}>
          <li css={titleStyle}>Contact</li>
          <li css={[titleStyle, listStyle]}>
            <a
              href="https://github.com/Ohney"
              css={[textDecorationNone, visit]}
            >
              류 현
            </a>
          </li>
          <li css={[titleStyle, listStyle]}>
            <a
              href="https://github.com/YeChan8812"
              css={[textDecorationNone, visit]}
            >
              곽예찬
            </a>
          </li>
          <li css={[titleStyle, listStyle]}>
            <a
              href="https://github.com/bgyoons"
              css={[textDecorationNone, visit]}
            >
              백윤서
            </a>
          </li>
          <li css={[titleStyle, listStyle]}>
            <a
              href="https://github.com/hinyc"
              css={[textDecorationNone, visit]}
            >
              홍인열
            </a>
          </li>
        </ul>
      </div>
      <div css={[divStyle, underStyle]}>
        <div css={lineStyle} />
        <p css={[textStyle, copyright]}>
          © 2021 Copyright CampBu Inc. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
