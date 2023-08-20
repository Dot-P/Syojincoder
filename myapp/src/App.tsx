import { Link } from "react-router-dom";
import './App.css'

function App() {
  const title: string = "Syojin Coder";

  return (
    <div className="app-container">
      <Link to='/login'>
        {title}
      </Link>
      <h2>あなたの成長を加速。効率的に精進し、次のレベルへ。</h2>
    </div>
  );
}

export default App;
