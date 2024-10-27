import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CardList, { Card } from './CardList';
import Header from './Header';
import Home from './Home';
import Admin, { useWallet } from './Admin';


const App = () => {
  return (
    <Router >
      <Header /> {/* This header will remain on every page */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/card" element={<CardList/>} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
};

export default App;