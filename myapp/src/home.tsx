import React, { useState, useEffect, PureComponent} from 'react'
import { useNavigate ,Link } from "react-router-dom";
import "./home.css"
import coming from './img/coming.jpg'
import user from './User.jpg'
import contact from './img/contact.jpg'

function Head() {
  return (
    <div className="Head">
      <h1>Home</h1>
      <div className="user-info">
        <img src={user} alt="icon" className="user-icon" />
        <p>Dot-P</p>
      </div>
    </div>
  );
}

function MyGraph() {
  return (
    <div>
      <img src="http://localhost:5000/images/plot.png" alt="My Plot" style={{ width: '500px', height: '330px' }} />
    </div>
  );
}



function LeftApper() {
  return(
    <div className="left-upper">
      <h2>Analytics</h2>
      <MyGraph />
    </div>
  );
}

function RightApper() {
  return (
    <div className="right-upper-container">
      <h2>News</h2>
      <div className="right-upper">
        <div className="news-item">
          <a href="https://example.com/news1">β版を現在開発中</a>
        </div>
        <div className="news-item">
          <a href="https://example.com/news2">開発者よりメッセージ</a>
        </div>
        <div className="news-item">
          <a href="https://example.com/news3">本サイトの使い方について</a>
        </div>
        <div className="news-item">
          <a href="https://example.com/news4">今後のアップデートについて</a>
        </div>
        {/* 他のニュース項目もここに追加 */}
      </div>
    </div>
  );
}

type QBoxProps = {
  data: {
    diff: string;
    title: string;
    url: string; // ここを更新
    total_attempts: number; // ここを更新
  };
};


function QBox({ data }: QBoxProps) {
  const titleSuffix = data.title.slice(-3); // titleの下3桁
  const difficulty = data.diff.toLowerCase(); // diffを小文字に変換

  const questionUrl = `https://atcoder.jp/contests/abc${titleSuffix}/tasks/abc${titleSuffix}_${difficulty}`;

  return (
    <React.Fragment>
      <td>{data.diff}</td>
      <td>{data.title}</td>
      <td><a href={questionUrl}>問題</a></td> {/* URLを生成した変数を使用 */}
      <td><a href={data.url}>答え</a></td>
      <td>{data.total_attempts}</td>
    </React.Fragment>
  );
}


function MyTable() {

  type TopThreeData = {
    difficulty: string;
    title: string;
    url: string;
    total_attempts: number;
  };

  
  const [data, setData] = useState<TopThreeData[]>([]);


  useEffect(() => {
    fetch("/home")
      .then((res) => res.json())
      .then((data) => {
        setData(data.top_three);
        console.log(data);
      });
  }, []);

  const qBoxData = data;

  return (
    <table>
      <thead>
        <tr>
          <th>Difficulty</th>
          <th>Title</th>
          <th>Question</th>
          <th>Answer</th>
          <th>Total Attempts</th>
        </tr>
      </thead>
      <tbody>
        {qBoxData.map((data, index) => (
          <tr key={index}>
            <QBox data={{
              diff: data.difficulty,
              title: data.title,
              url: data.url,
              total_attempts: data.total_attempts
            }} />
          </tr>
        ))}
      </tbody>
    </table>
  );
}


function LeftLower() {
  const navigation = useNavigate();

  const handleClick1 = () => {
    navigation("/option");
  };

  const handleClick2 = () => {
    navigation("/record");
  };

  return (
    <div className="left-lower">
      <div className="header-section">
        <h2>Recommendation</h2>
        <button onClick={handleClick1}>Option</button>
        <button onClick={handleClick2}>Record</button>
      </div>
      <MyTable />
    </div>
  );
}

function RightLower() {
  return(
    <div className="right-lower">
      <img src={contact} alt="contact" className="contact" />
      <a href="https://twitter.com/DotP_engineer" target="_blank" rel="noreferrer">
        <button>Link is here</button>
      </a>
    </div>
  );
}

function Sidebar() {
  return(
    <div className="sidebar-icons">
      <Link to='/home'>
      <span className="material-icons home-icon"> 
        home
      </span>
      </Link>
      <Link to='/record'>
      <span className="material-icons">
        note_add
      </span>
      </Link>
      <Link to='/analytics'>
      <span className="material-icons">
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




function Home() {
  return (
    <div className="home-container">
      <div className="container">
        <Sidebar></Sidebar>
        <div className="content">
          <Head></Head>
          <div className="upper-content">
            <LeftApper></LeftApper>
            <RightApper></RightApper>
          </div>
          <div className="lower-content">
            <LeftLower></LeftLower>
            <RightLower></RightLower>
          </div>
        </div>
      </div>
    </div>

  );
}

export default Home;
