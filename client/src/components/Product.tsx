/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import {
  rem,
  absolute,
  flexBetween,
  textDecorationNone,
  host,
} from '../common';
import LikeSymbol from './LikeSymbol';
import Here from '../assets/Here.svg';
import {
  post,
  img,
  textContainer,
  span,
  addressStyle,
  moneyTitle,
} from './post';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { isLogin, post_id, showLoginModal, showSignupModal } from '../Atom';
import { useEffect, useState } from 'react';

interface Props {
  isFill: boolean;
  display?: string;
  img_urls: string;
  address: string;
  title: string;
  deposit: number;
  rental_fee: number;
  count: number;
  postId: number;
}

function Product(props: Props) {
  const {
    isFill,
    display,
    img_urls,
    address,
    title,
    deposit,
    rental_fee,
    count,
    postId,
  } = props;

  const setGetPostId = useSetRecoilState(post_id);
  const navigation = useNavigate();
  const onPostClick = () => {
    setGetPostId(postId);
    localStorage.setItem('postId', `${postId}`);
    navigation(`/main/${postId}`);
  };

  return (
    <div css={post}>
      <div
        css={[
          absolute,
          css`
            top: ${rem(23)};
            right: ${rem(23)};
          `,
        ]}
      >
        <LikeSymbol
          postId={postId}
          isFill={isFill}
          fontSize={13}
          count={count}
          width={46}
          height={24}
          display={display}
        />
      </div>
      <div css={textDecorationNone} onClick={onPostClick}>
        <img src={img_urls} alt="product" css={img} draggable="false" />
        <div css={textContainer}>
          <span css={[span, moneyTitle, addressStyle]}>
            <img src={Here} alt="위치" style={{ marginRight: '4px' }} />
            {address}
          </span>
          <span css={span}>{title}</span>
          <div css={flexBetween}>
            <span>
              <div css={[span, moneyTitle]}>보증금</div>
              <div css={[span, `margin-bottom: ${rem(15)}`]}>{deposit}원</div>
            </span>
            <span>
              <div css={[span, moneyTitle]}>대여비</div>
              <div css={span}>{rental_fee}원</div>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Product;
