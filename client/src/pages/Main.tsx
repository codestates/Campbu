/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import Product from '../components/Product';
import WritingButton from '../components/WritingButton';
import { rem, relative, host, addressAPI } from '../common';
import SearchGreen from '../assets/SearchGreen.svg';
import SearchInput from '../components/SearchInput';
import Category from '../components/Category';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import {
  posts,
  originalPosts,
  showLoginModal,
  showAlertModal,
  selectAddress,
  showAddressList,
  searchAddress,
} from '../Atom';
import { useEffect, useState } from 'react';
import AlertModal from '../components/AlertModal';
import axios from 'axios';
import Loading from '../assets/Loading.svg';
import emptySearchResult from '../assets/pictures/emptySearchResult.svg';
import { message } from './Lists/tab';
import SelectAddressList from '../components/SelectAddress';

const container = css`
  width: ${rem(1280)};
  margin: 0 auto;
  margin-top: ${rem(36)};
  margin-bottom: ${rem(16)};
  text-align: center;
`;

const button = css`
  background-color: white;
  border: none;
  position: absolute;
  right: ${rem(24)};
  top: ${rem(-3)};
  cursor: pointer;
`;

const section = css`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(20%, auto));
  row-gap: ${rem(26)};
  text-align: left;
  margin-top: ${rem(26)};
`;

const addressListStyle = css`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  z-index: 990;
`;

export interface Posts {
  posts: Post[];
}

export interface Post {
  id: number;
  category: string;
  deposit: number;
  rental_fee: number;
  unavailable_dates: string[];
  title: string;
  content: string;
  longitude: number;
  latitude: number;
  address: string;
  img_urls: string;
  users_id: number;
  reservation_dates: string[];
  likes_count: number;
}

function Main() {
  const [products, searchAddressList] = useRecoilState<Posts>(posts);
  const [loading, setLoading] = useState<boolean>(false);
  const [showModal, setShowModal] = useRecoilState(showAlertModal);
  const [searchValue, setSearchValue] = useRecoilState(selectAddress);
  const [addressList, setSearchAddress] = useRecoilState(searchAddress);
  const [showAddress, setShowAddress] = useRecoilState(showAddressList);
  const setMainSearch = useSetRecoilState<Posts>(originalPosts);
  const onChange = (e: any) => {
    setSearchValue(e.target.value);
  };

  const onSearchClick = () => {
    if (searchValue.length !== 0) {
      getAddress();
      if (searchValue.length > 5) {
        // TODO: 로딩 컴포넌트 띄우기
        // setLoading(true);
        // console.log('1st', loading);
        axios
          .get(`${host}/product/address/${searchValue}`)
          .then((res) => {
            if (res.status === 200) {
              setMainSearch({
                // TODO: 검색 결과를 여기에 추가
                // posts: [],
                posts: [
                  {
                    id: 1,
                    category: 'Etc',
                    deposit: 30000,
                    rental_fee: 25000,
                    unavailable_dates: [
                      '2021-12-20',
                      '2021-12-21',
                      '2021-12-22',
                    ],
                    title: '검색했을 때 새로 나오는거',
                    content: '쉽게 설치할 수 있는 3~4인용 텐트입니다.',
                    longitude: 126.99597295767953,
                    latitude: 35.97664845766847,
                    address: '서울특별시 동작구 신대방동',
                    img_urls:
                      'https://paperbarkcamp.com.au/wp-content/uploads/2019/07/paperbark_flash-camp_news_1218x650.jpg',
                    users_id: 1,
                    reservation_dates: [
                      '2021-12-29',
                      '2021-12-30',
                      '2021-12-31',
                    ],
                    likes_count: 15,
                  },
                  {
                    id: 1,
                    category: 'Pot',
                    deposit: 30000,
                    rental_fee: 25000,
                    unavailable_dates: [
                      '2021-12-20',
                      '2021-12-21',
                      '2021-12-22',
                    ],
                    title: '메인페이지 검색',
                    content: '쉽게 설치할 수 있는 3~4인용 텐트입니다.',
                    longitude: 126.99597295767953,
                    latitude: 35.97664845766847,
                    address: '서울특별시 동작구 신대방동',
                    img_urls:
                      'https://paperbarkcamp.com.au/wp-content/uploads/2019/07/paperbark_flash-camp_news_1218x650.jpg',
                    users_id: 1,
                    reservation_dates: [
                      '2021-12-29',
                      '2021-12-30',
                      '2021-12-31',
                    ],
                    likes_count: 15,
                  },
                ],
              });
              searchAddressList({
                // TODO: 검색 결과를 여기에 추가
                // posts: [],
                posts: [
                  {
                    id: 1,
                    category: 'Tent',
                    deposit: 30000,
                    rental_fee: 25000,
                    unavailable_dates: [
                      '2021-12-20',
                      '2021-12-21',
                      '2021-12-22',
                    ],
                    title: '검색했을 때 새로 나오는거',
                    content: '쉽게 설치할 수 있는 3~4인용 텐트입니다.',
                    longitude: 126.99597295767953,
                    latitude: 35.97664845766847,
                    address: '서울특별시 동작구 신대방동',
                    img_urls:
                      'https://paperbarkcamp.com.au/wp-content/uploads/2019/07/paperbark_flash-camp_news_1218x650.jpg',
                    users_id: 1,
                    reservation_dates: [
                      '2021-12-29',
                      '2021-12-30',
                      '2021-12-31',
                    ],
                    likes_count: 15,
                  },
                  {
                    id: 1,
                    category: 'Tent',
                    deposit: 30000,
                    rental_fee: 25000,
                    unavailable_dates: [
                      '2021-12-20',
                      '2021-12-21',
                      '2021-12-22',
                    ],
                    title: '메인페이지 검색',
                    content: '쉽게 설치할 수 있는 3~4인용 텐트입니다.',
                    longitude: 126.99597295767953,
                    latitude: 35.97664845766847,
                    address: '서울특별시 동작구 신대방동',
                    img_urls:
                      'https://paperbarkcamp.com.au/wp-content/uploads/2019/07/paperbark_flash-camp_news_1218x650.jpg',
                    users_id: 1,
                    reservation_dates: [
                      '2021-12-29',
                      '2021-12-30',
                      '2021-12-31',
                    ],
                    likes_count: 15,
                  },
                ],
              });
            }
          })
          .catch((err) => console.error(err));
        // TODO: 로딩 컴포넌트
        setSearchValue('');
        // setLoading(false);
        // console.log('2nd', loading);
        setShowAddress(false);
      }
    } else {
      console.log('input text please');
      // TODO: false로 초기화 시키기
      setShowModal(true);
    }
  };

  const getAddress = () => {
    axios
      .get(
        `https://www.juso.go.kr/addrlink/addrLinkApi.do?currentPage=1&countPerPage=50&keyword=${searchValue}&confmKey=${addressAPI}&resultType=json`,
        { headers: { 'Content-Type': 'application/json' } },
      )
      .then((res) => {
        const address = res.data.results.juso;
        const addressList: string[] = [];
        if (address) {
          const allSearchAddress = address.map((el: any) => {
            return `${el.siNm} ${el.sggNm} ${el.emdNm}`;
          });
          allSearchAddress.forEach((el: string, idx: number) => {
            if (allSearchAddress.indexOf(el) === idx) {
              addressList.push(el);
            }
          });
        }
        setSearchAddress(addressList);
        setShowAddress(true);
      });
  };

  return (
    <div css={container}>
      <Category />
      {showModal && <AlertModal text="검색어를 입력해주세요!" />}
      <span css={relative}>
        <SearchInput
          text="지역을 검색해보세요!"
          width={`${rem(450)}`}
          height={`${rem(50)}`}
          border="1px solid #afc89b"
          size={`${rem(16)}`}
          shadow={`0px 2px 10px rgba(0, 0, 0, 0.1)`}
          placeholder={`#afc89b`}
          padding={`${rem(18)}`}
          margin={`${rem(26)} 0 0 0`}
          onChange={onChange}
          value={searchValue}
        />
        <button css={button} onClick={onSearchClick}>
          <img src={SearchGreen} alt="search" />
        </button>
      </span>
      <div css={addressListStyle}>
        {showAddress && <SelectAddressList width={450} />}
      </div>
      {/* // TODO: 로딩 컴포넌트 추가 */}
      {loading ? (
        <img src={Loading} alt="loading..." />
      ) : products['posts'].length === 0 ? (
        <div style={{ marginTop: `${rem(26)}` }}>
          <img src={emptySearchResult} alt="camping" />
          <p css={[message, `font-weight: 700`]}>
            검색 결과가 없어요! 다시 검색해주세요.
          </p>
        </div>
      ) : (
        <section css={section}>
          {products['posts'].map((product: Post, index) => (
            <Product
              key={index}
              count={product.likes_count}
              // TODO: 좋아요 눌렀는지 안눌렀는지 상태 변경
              isFill={false}
              postId={product.id}
              img_urls={product.img_urls}
              address={product.address}
              title={product.title}
              deposit={product.deposit}
              rental_fee={product.rental_fee}
            />
          ))}
        </section>
      )}
      <WritingButton />
    </div>
  );
}

export default Main;
