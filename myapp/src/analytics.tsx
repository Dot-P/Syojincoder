import React, { useState, useEffect} from 'react'
import { useNavigate ,Link } from "react-router-dom";
import "./analytics.css"

function MyGraph() {
  return (
    <div>
      <img src="http://localhost:5000/images/plot.png" alt="My Plot" style={{ width: '500px', height: '330px' }} />
    </div>
  );
}

type Question = {
  id: number;
  question_text: string;
  Not_good: number;
};

function Main() {
  const [questions, setQuestions] = useState<string[]>([]);

  useEffect(() => {
    // サーバーからデータを取得
    fetch('/get_questions')
      .then((res) => res.json())
      .then((data) => {
        setQuestions(data);
        console.log(data);
      });
  }, []);

  return (
    <div>
      <h1>Analytics</h1>
      <h2>あなたの精進数</h2>
      <MyGraph />
      <h2>あなたの苦手分野 Top3</h2>
      <ul>
        {questions.map((question, index) => (
          <li key={index}>{question}</li>
        ))}
      </ul>
    </div>
  );
}

function Sidebar() {
    return(
      <div className="sidebar-icons">
        <Link to='/home'>
        <span className="material-icons"> 
          home
        </span>
        </Link>
        <Link to='/record'>
        <span className="material-icons">
          note_add
        </span>
        </Link>
        <Link to='/analytics'>
        <span className="material-icons home-icon">
          leaderboard
        </span>
        </Link>
        <Link to='/option'>
      <span className="material-icons">
      build
      </span>
      </Link>
        <Link to='/help'>
        <span className="material-icons">
          help_outline
        </span>
        </Link>
        <Link to='/'>
        <span className="material-icons">
          logout
        </span>
        </Link>
      </div>
    );
  }
  
  
  function Analytics() {
    return (
      <div className="home-container analytics-container">
        <div className="container">
          <Sidebar></Sidebar>
          <div className="content analytics">
            <Main></Main>
          </div>
        </div>
      </div>
    );
  }
  
  
  export default Analytics;