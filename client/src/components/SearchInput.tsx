/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { rem } from '../common';

interface Props {
  width: string;
  height: string;
  border: string;
  size: string;
  shadow: string;
  text: string;
  placeholder: string;
  padding: string;
  margin: string;
  onChange: (e: any) => void;
  value: string;
  onKeyPress: (e: any) => void;
}
function SearchInput(props: Props) {
  const {
    width,
    height,
    border,
    size,
    shadow,
    text,
    placeholder,
    padding,
    margin,
    onChange,
    value,
    onKeyPress,
  } = props;
  return (
    <input
      css={css`
        font-size: ${size};
        width: ${width};
        height: ${height};
        border-radius: ${rem(10)};
        border: ${border};
        box-shadow: ${shadow};
        padding-left: ${padding};
        margin: ${margin};
        outline: none;

        ::-webkit-input-placeholder {
          color: ${placeholder};
        } /* Chrome/Opera/Safari */
        ::-moz-placeholder {
          color: ${placeholder};
        } /* Firefox 19+ */
        :-ms-input-placeholder {
          color: ${placeholder};
        } /* IE 10+ */
        :-moz-placeholder {
          color: ${placeholder};
        } /* Firefox 18- */
      `}
      placeholder={text}
      onChange={onChange}
      value={value}
      onKeyPress={onKeyPress}
    />
  );
}
export default SearchInput;
