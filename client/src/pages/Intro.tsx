/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';

import {
  color,
  hover,
  rem,
  relative,
  host,
  addressAPI,
  absolute,
  config,
} from '../common';
import { Link, useNavigate } from 'react-router-dom';
import background from '../assets/pictures/background.png';
import Search from '../assets/Search.svg';

import SearchInput from '../components/SearchInput';
import { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import {
  posts,
  selectAddress,
  showAddressList,
  showAlertModal,
  searchAddress,
  originalPosts,
  isLoading,
  isLogin,
  likedProducts,
} from '../Atom';
import axios from 'axios';
import { Post, Posts } from './Main';
import AlertModal from '../components/AlertModal';
import SelectAddressList from '../components/SelectAddress';

const divStyle = css`
  text-align: center;
`;

const img = css`
  width: auto;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;

  @media (min-width: 1600px) {
    width: 100%;
    height: auto;
  }
`;

const pStyle = css`
  font-size: 3rem;
  color: white;
  text-shadow: ${hover};
  padding-top: ${rem(155)};
  z-index: 990;
  cursor: default;
`;

const button = css`
  background-color: white;
  border: none;
  position: absolute;
  right: ${rem(24)};
  top: ${rem(-3)};
  cursor: pointer;
`;

const addressListStyle = css`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
`;

const code = new URL(window.location.href).searchParams.get('code');

if (code) {
  console.log('코드있다');
  console.log('code', code);
  console.log('axios요청 보내기 ?');
}

function Intro() {
  const navigation = useNavigate();
  const searchAddressList = useSetRecoilState<Posts>(posts);
  const setMainSearch = useSetRecoilState<Posts>(originalPosts);
  const [showModal, setShowModal] = useRecoilState(showAlertModal);
  const [searchValue, setSearchValue] = useRecoilState(selectAddress);
  const setSearchAddress = useSetRecoilState(searchAddress);
  const [showAddress, setShowAddress] = useRecoilState(showAddressList);
  const setIsLoading = useSetRecoilState(isLoading);
  const login = useRecoilValue(isLogin);
  const [selected, setSelected] = useState<boolean>(false);
  const setLikedPosts = useSetRecoilState(likedProducts);

  useEffect(() => {
    setSearchValue('');
    setShowAddress(false);
  }, []);

  const onChange = (e: any) => {
    setSearchValue(e.target.value);
  };

  const onSearchClick = async () => {
    if (searchValue.length !== 0) {
      getAddress();
      if (!showAddress && searchValue && selected) {
        setIsLoading(true);
        if (login) {
          await axios
            .get(`${host}/product/address/${searchValue}`, config)
            .then((res) => {
              if (res.status === 200) {
                searchAddressList(res.data);
                setMainSearch(res.data);
                const likes = res.data['likes'].map(
                  (obj: { posts_id: number }) => obj.posts_id,
                );
                setLikedPosts(likes);
                navigation('/main');
              }
            })
            .catch((err) => console.error('에러입니다', err));
        } else {
          await axios
            .get(`${host}/product/address/${searchValue}`)
            .then((res) => {
              if (res.status === 200) {
                searchAddressList(res.data);
                setMainSearch(res.data);
                navigation('/main');
              }
            })
            .catch((err) => console.error('에러입니다', err));
        }
        setSearchAddress([]);
        setShowAddress(false);
      }
    } else {
      setShowModal(true);
    }
  };

  const getAddress = async () => {
    await axios
      .get(
        `https://www.juso.go.kr/addrlink/addrLinkApi.do?currentPage=1&countPerPage=50&keyword=${searchValue}&confmKey=${addressAPI}&resultType=json`,
        { headers: { 'Content-Type': 'application/json' } },
      )
      .then((res) => {
        const address = res.data.results.juso;
        const addressList: string[] = [];
        if (address) {
          const allSearchAddress = address.map(
            (el: any) => `${el.siNm} ${el.sggNm} ${el.emdNm}`,
          );
          allSearchAddress.forEach((el: string, idx: number) => {
            if (allSearchAddress.indexOf(el) === idx) {
              addressList.push(el);
            }
          });
        }
        setSearchAddress(addressList);
        setShowAddress(true);
        setSelected(true);
      });
  };

  const onSearchPress = (e: any) => {
    if (e.key === 'Enter') {
      onSearchClick();
    }
  };

  return (
    <div css={divStyle}>
      <img src={background} alt="뒷배경" css={img} />
      <p css={[pStyle, relative]}>떠나고 싶지 않으세요?</p>
      {showModal && <AlertModal text="검색어를 입력해주세요!" />}
      <span css={relative}>
        <SearchInput
          text="사는 동네를 입력해보세요! (ex. ㅇㅇ동)"
          width={`${rem(636)}`}
          height={`${rem(60)}`}
          border="none"
          size={`${rem(18)}`}
          shadow={`${hover}`}
          placeholder={`${color.placeholder}`}
          padding={`${rem(24)}`}
          margin={`${rem(62)} 0 0 0`}
          onChange={onChange}
          value={searchValue}
          onKeyPress={onSearchPress}
        />
        <button css={button} onClick={onSearchClick}>
          <img src={Search} alt="search" />
        </button>
      </span>
      <div css={addressListStyle}>
        {showAddress && <SelectAddressList width={600} />}
      </div>
    </div>
  );
}
export default Intro;
