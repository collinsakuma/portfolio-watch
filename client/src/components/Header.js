import TrendingUpIcon from '@mui/icons-material/TrendingUp';

function Header() {
  return (
    <div className="header-container">
      <h1 className="header-title">Portfolio Watch<TrendingUpIcon style={{fontSize:"75px", marginBottom:"-20px"}}/></h1>
    </div>
  );
}

export default Header;