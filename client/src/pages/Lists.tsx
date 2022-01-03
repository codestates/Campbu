import { Link, Route, Routes } from 'react-router-dom';
import BorrowList from './Lists/BorrowList';
import LendList from './Lists/LendList';
import ResistList from './Lists/ResistList';
import LikeList from './Lists/LikeList';

function Lists() {
  return (
    <>
      <div>List</div>
      <header>
        <Link to="borrowlist" style={{ marginRight: 10 }}>
          대여한 목록
        </Link>
        <Link to="lendlist" style={{ marginRight: 10 }}>
          대여해준 목록
        </Link>
        <Link to="resistlist" style={{ marginRight: 10 }}>
          등록된 목록
        </Link>
        <Link to="likelist" style={{ marginRight: 10 }}>
          찜한 목록
        </Link>
      </header>
      <Routes>
        <Route path="borrowlist" element={<BorrowList />} />
        <Route path="lendlist" element={<LendList />} />
        <Route path="resistlist" element={<ResistList />} />
        <Route path="likelist" element={<LikeList />} />
      </Routes>
    </>
  );
}

export default Lists;
