/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { searchAddress, selectAddress, showAddressList } from '../Atom';
import { color, rem, shadow } from '../common';

const addressListStyle = css`
  background-color: ${color.white};
  box-shadow: ${shadow};
  border-radius: 0.3125rem;
  padding: 0.35rem 0;
  margin-top: 0.3rem;
`;

const contentStyle = css`
  font-size: 0.875rem;
  padding: 0.7rem 0.75rem;
  transition: 0.1s;
  :hover {
    background-color: #f0f0f0;
    cursor: pointer;
  }
`;

const fontSize14 = css`
  font-size: 0.875rem;
`;

interface SelectAddressListPropsType {
  width?: number;
  barogagi?: boolean;
}

export default function SelectAddressList({
  width,
  barogagi,
}: SelectAddressListPropsType) {
  const setSelectAddress = useSetRecoilState(selectAddress);
  const setSearchAddress = useSetRecoilState(searchAddress);
  const setShowAddress = useSetRecoilState(showAddressList);

  const navigate = useNavigate();

  const selectAddressHandler = (e: any) => {
    setSelectAddress(e.target.textContent);
    setSearchAddress([]);
    setShowAddress(false);
  };

  const selectAddressGoHandler = (e: any) => {
    setSelectAddress(e.target.textContent);
    setSearchAddress([]);
    setShowAddress(false);
    navigate(`/main`);
    // setSelectAddress('');
  };
  const addressList = useRecoilValue(searchAddress);
  return (
    <div
      css={[
        addressListStyle,
        css`
          width: ${width ? rem(width) : rem(372)};
        `,
      ]}
    >
      {addressList.length > 0 ? null : (
        <div
          css={[fontSize14, contentStyle]}
          onClick={() => setShowAddress(false)}
        >
          검색 결과가 없습니다.
        </div>
      )}
      <div
        css={css`
          max-height: 13.5rem;
          overflow: scroll;
        `}
      >
        {addressList.map((el, idx) => (
          <div
            key={idx}
            css={contentStyle}
            onClick={barogagi ? selectAddressGoHandler : selectAddressHandler}
          >
            {el}
          </div>
        ))}
      </div>
    </div>
  );
}
