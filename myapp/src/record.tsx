import React, { useState, useEffect} from 'react'
import { useNavigate ,Link } from "react-router-dom";
import "./record.css"

function Main() {

  type ButtonValue = 'AC' | 'WA' | 'TLE' | 'CE' | 'RE';
  type OptionValue = 'A' | 'B' | 'C' | 'D';

    const [text, setText] = useState('');
    const [selectedButton, setSelectedButton] = useState<ButtonValue | null>(null);
    const [selectedOption, setSelectedOption] = useState<OptionValue | null>(null);
  
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setText(e.target.value);
    };

    const handleSubmit = () => {
        // 送信するデータをオブジェクトにまとめる
        const sendData = {
          title: text,
          selectedButton: selectedButton,
          selectedOption: selectedOption
        };

          // fetchメソッドを使用してPOSTリクエストを作成
  fetch("/submit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(sendData)
  })
  .then(response => response.json())
  .then(data => {
    // 応答データに基づいてアラートを表示
    if (data.message === 'success') {
      alert("送信成功!");
    } else {
      alert("エラー: " + data.message);
    }
  })
  .catch(error => {
    // エラー処理
    console.error("An error occurred:", error);
  });
};
      
  
    const handleButtonClick = (buttonValue: ButtonValue) => {
      setSelectedButton(buttonValue);
    };
  
    const handleOptionClick = (optionValue: OptionValue) => {
      setSelectedOption(optionValue);
    };
  
    return (
      <div className="main-container">
        <h1>Record</h1>
        <div>
          <label className="label-abc">Title:　ABC</label>
          <input type="text" value={text} onChange={handleInputChange} className="text-input" />
        </div>
        <div className="buttons-container">
          <label className="label-abc">Diff:</label>
          <button className={`button option-button ${selectedOption === 'A' ? 'selected' : ''}`} onClick={() => handleOptionClick('A')}>A</button>
          <button className={`button option-button ${selectedOption === 'B' ? 'selected' : ''}`} onClick={() => handleOptionClick('B')}>B</button>
          <button className={`button option-button ${selectedOption === 'C' ? 'selected' : ''}`} onClick={() => handleOptionClick('C')}>C</button>
          <button className={`button option-button ${selectedOption === 'D' ? 'selected' : ''}`} onClick={() => handleOptionClick('D')}>D</button>
        </div>
        <div className="buttons-container">
        <button
          className={`button ac-button ${selectedButton === 'AC' ? 'selected' : ''}`}
          onClick={() => handleButtonClick('AC')}
        >
          AC
        </button>
        <button
          className={`button wa-button ${selectedButton === 'WA' ? 'selected' : ''}`}
          onClick={() => handleButtonClick('WA')}
        >
          WA
        </button>
        <button
          className={`button tle-button ${selectedButton === 'TLE' ? 'selected' : ''}`}
          onClick={() => handleButtonClick('TLE')}
        >
          TLE
        </button>
        <button
          className={`button ce-button ${selectedButton === 'CE' ? 'selected' : ''}`}
          onClick={() => handleButtonClick('CE')}
        >
          CE
        </button>
        <button
          className={`button re-button ${selectedButton === 'RE' ? 'selected' : ''}`}
          onClick={() => handleButtonClick('RE')}
        >
          RE
        </button>
        </div>
        <button className="send-button" onClick={handleSubmit}>Send</button>
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
        <span className="material-icons record-icon">
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
  
  
  
  
  function Record() {
    const title: string = "Recommendation";
    const [data, setData] = useState([{}])
  
    useEffect(() => {
      fetch("/home").then(
        res => res.json()
      ).then(
        data => {
          setData(data)
          console.log(data)
        }
      )
    }, [])
  
    return (
      <div className="home-container">
        <div className="container">
          <Sidebar></Sidebar>
          <div className="content">
            <Main></Main>
          </div>
        </div>
      </div>
  
    );
  }
  
  export default Record;