import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header style={{ padding: '10px', backgroundColor: '#f0f0f0' }}>
      <nav>
        <Link to="/">Home</Link> | 
        <Link to="/card"> My Cards</Link> |
        <Link to="/admin"> Admin</Link>
      </nav>
    </header>
  );
};

export default Header;
