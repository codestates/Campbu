import { useNavigate } from 'react-router-dom';

function DetailView() {
  const navigate = useNavigate();
  return (
    <>
      <div>상품상세페이지</div>
      <div>50000원</div>
      <button
        onClick={() => {
          navigate(-1);
        }}
      >
        목록보기
      </button>
    </>
  );
}

export default DetailView;
