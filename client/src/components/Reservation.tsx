/** @jsxImportSource @emotion/react */
import { Link } from 'react-router-dom';
import { rem, textDecorationNone, flexBetween } from '../common';
import Here from '../assets/Here.svg';
import { Button } from './Button';
import {
  post,
  img,
  textContainer,
  span,
  addressStyle,
  moneyTitle,
} from './post';

interface Props {
  text: string;
  background: string;
  color: string;
  opacity?: string;
  cursor: string;
  hover?: string;
  postId: number;
  img_urls: string;
  address: string;
  title: string;
  deposit: number;
  rental_fee: number;
  reservation_dates: string[];
  onButtonClick: () => void;
}

function Reservation(props: Props) {
  const {
    text,
    background,
    color,
    opacity,
    cursor,
    hover,
    postId,
    img_urls,
    address,
    title,
    deposit,
    rental_fee,
    reservation_dates,
    onButtonClick,
  } = props;

  const length = reservation_dates.length;
  const thumbnail = img_urls.split(',');

  return (
    <div css={post}>
      <Link to={`/main/${postId}`} css={textDecorationNone}>
        <img src={thumbnail[0]} alt="product" css={img} />
        <div css={textContainer}>
          <span css={[span, moneyTitle, addressStyle]}>
            <img src={Here} alt="위치" style={{ marginRight: '4px' }} />
            {address}
          </span>
          <span css={span}>{title}</span>
          <div css={flexBetween}>
            <span>
              <div css={[span, moneyTitle]}>보증금</div>
              <div css={span}>{deposit}원</div>
            </span>
            <span>
              <div css={[span, moneyTitle]}>대여비</div>
              <div css={span}>{rental_fee}원</div>
            </span>
          </div>
          <div css={[span, moneyTitle]}>대여날짜</div>
          <div css={span}>{`${reservation_dates[0]} ~ ${
            reservation_dates[length - 1]
          }`}</div>
        </div>
      </Link>
      <Button
        text={text}
        width={`${rem(205)}`}
        height={`${rem(40)}`}
        background={background}
        color={color}
        border="none"
        size={`${rem(14)}`}
        margin={`${rem(8)} 0 ${rem(15)} ${rem(15)}`}
        opacity={opacity}
        cursor={cursor}
        hover={hover}
        onClick={onButtonClick}
      />
    </div>
  );
}

export default Reservation;
