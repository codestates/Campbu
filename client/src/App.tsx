import { BrowserRouter as Router, Link, Routes, Route } from 'react-router-dom';
import Lists from './pages/Lists';
import Intro from './pages/Intro';
import Main from './pages/Main';
import Mypage from './pages/Mypage';
import MainDetail from './pages/MainDetail';

function App() {
  return (
    <Router>
      <Link to="/" style={{ marginRight: 10 }}>
        intro
      </Link>
      <Link to="/main" style={{ marginRight: 10 }}>
        main
      </Link>
      <Link to="/mypage" style={{ marginRight: 10 }}>
        mypage
      </Link>
      <Link to="/lists" style={{ marginRight: 10 }}>
        Lists
      </Link>
      <Routes>
        <Route path="/" element={<Intro />} />
        <Route path="/main" element={<Main />} />
        <Route path="/main/*" element={<MainDetail />} />
        <Route path="/mypage" element={<Mypage />} />
        <Route path="/lists/*" element={<Lists />} />
      </Routes>
    </Router>
    // <>
    //   <List />
    // </>
  );
}

export default App;
