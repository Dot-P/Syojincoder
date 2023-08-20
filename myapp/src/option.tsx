import React, { useState, useEffect} from 'react'
import { useNavigate ,Link } from "react-router-dom";
import "./option.css"
import Switch from "react-switch";


function ToggleSwitch({ option, onChange }: { option: boolean; onChange: (value: boolean) => void }) {
    const [checked, setChecked] = useState(option);
  
    const handleChange = (checkedValue: boolean) => {
      setChecked(checkedValue);
      onChange(checkedValue); // 親コンポーネントに変更を通知
    };
  
    return (
      <Switch onChange={handleChange} checked={checked} />
    );
  }
  

function Main () {

    const [toggleOptions, setToggleOptions] = useState({
        option1: true,
        option2: true,
      });
    
      const handleToggleChange = (optionName: keyof typeof toggleOptions, value: boolean) => {
        setToggleOptions({
          ...toggleOptions,
          [optionName]: value,
        });
      };

      const handleProcessData = async () => {
        const dataToSend = {
          checked: checked,
          toggleOptions: toggleOptions,
        };
      
        try {
          const response = await fetch('http://localhost:3000/process-data', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataToSend), // 送信するデータ
          });
          const data = await response.json();
          if (data.message === 'Success') { // タイポを修正して "Success" にしてください
            alert('データの処理が成功しました！');
          } else {
            alert('何か問題が発生しました。');
          }
        } catch (error) {
          alert('エラーが発生しました: ' + error);
        }
      };      

        const [checked, setChecked] = useState({
          checked1: true,
          checked2: true,
          checked3: true,
          checked4: true,
          checked5: true,
          checked6: true,
          checked7: true,
          checked15: true,
          checked8: true,
          checked9: true,
          checked10: true,
          checked11: true,
          checked12: true,
          checked13: true,
          checked14: true,
        });
    
        const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
          const name = event.target.name as keyof typeof checked;
          setChecked({
            ...checked,
            [name]: event.target.checked,
          });
        };

    return (
        <div className="container123">
          <div className="sections-container">
            <div className="section">
              <h1 className="header">特定の分野のみの出題を有効にする</h1>
              <div className="option">
                <input type="checkbox" name="checked1"  checked={checked.checked1} onChange={handleChange} />
                <label>
                全探索
                </label>
                </div>
                <div className="option">
                <input type="checkbox" name="checked2"  checked={checked.checked2} onChange={handleChange} />
                <label>
                累積和及びimos法
                </label>
                </div>
                <div className="option">
                <input type="checkbox" name="checked3"  checked={checked.checked3} onChange={handleChange} />
                <label>
                二分探索
                </label>
                </div>
                <div className="option">
                <input type="checkbox" name="checked4"  checked={checked.checked4} onChange={handleChange} />
                <label>
                座標圧縮及びランレングス圧縮
                </label>
                </div>
                <div className="option">
                <input type="checkbox" name="checked5"  checked={checked.checked5} onChange={handleChange} />
                <label>
                動的計画法
                </label>
                </div>
                <div className="option">
                <input type="checkbox" name="checked6"  checked={checked.checked6} onChange={handleChange} />
                <label>
                しゃくとり法
                </label>
                </div>
                <div className="option">
                <input type="checkbox" name="checked7"  checked={checked.checked7} onChange={handleChange} />
                <label>
                BFS
                </label>
                </div>
                <div className="option">
                <input type="checkbox" name="checked15"  checked={checked.checked15} onChange={handleChange} />
                <label>
                DFS
                </label>
                </div>
                <div className="option">
                <input type="checkbox" name="checked8"  checked={checked.checked8} onChange={handleChange} />
                <label>
                Union-Find
                </label>
                </div>
                <div className="option">
                <input type="checkbox" name="checked9"  checked={checked.checked9} onChange={handleChange} />
                <label>
                ワーシャルフロイド法
                </label>
                </div>
                <div className="option">
                <input type="checkbox" name="checked10"  checked={checked.checked10} onChange={handleChange} />
                <label>
                ユークリッドの互除法
                </label>
                </div>
                <div className="option">
                <input type="checkbox" name="checked11"  checked={checked.checked11} onChange={handleChange} />
                <label>
                エラトステネスの篩、素数問題
                </label>
                </div>
                <div className="option">
                <input type="checkbox" name="checked12"  checked={checked.checked12} onChange={handleChange} />
                <label>
                セグ木
                </label>
                </div>
                <div className="option">
                <input type="checkbox" name="checked13"  checked={checked.checked13} onChange={handleChange} />
                <label>
                論理演算
                </label>
                </div>
                <div className="option">
                <input type="checkbox" name="checked14"  checked={checked.checked14} onChange={handleChange} />
                <label>
                包除原理
                </label>
                </div>
            </div>
            <div className="section">
              <h1 className="header">詳細オプション</h1>
              <div className="toggle-container">
                    <div className="toggle-option">
                    <label>一度間違えた問題は再度出題する</label>
                    <ToggleSwitch option={toggleOptions.option1} onChange={(value) => handleToggleChange('option1', value)} />
                    </div>
                    <div className="toggle-option">
                    <label>最近の問題を出題しやすくする</label>
                    <ToggleSwitch option={toggleOptions.option2} onChange={(value) => handleToggleChange('option2', value)} />
                    </div>
              </div>
            </div>
          </div>
          <button className="change" onClick={handleProcessData}>変更</button>
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
        <span className="material-icons">
          leaderboard
        </span>
        </Link>
        <Link to='/option'>
      <span className="material-icons home-icon">
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
  
  
  function Option() {
  
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
  
  export default Option;