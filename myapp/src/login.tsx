import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "./login.css"

function Login() {
  const navigation = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [data, setData] = useState([]);

  const handleLogin = async () => {
    const response = await fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    const result = await response.json();

    if (result.success) {
      navigation('/home'); // ログイン成功時のリダイレクト
    } else {
      alert('Invalid username or password');
    }
  };

  // 他の情報を受け取る際のコード
  useEffect(() => {
    fetch("/home")
      .then((res) => res.json())
      .then((data) => {
        setData(data.top_three);
        console.log(data);
      });
  }, []);

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <h1>Login</h1>
        <input type="text" placeholder="Username" onChange={e => setUsername(e.target.value)} />
        <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
        <button onClick={handleLogin}>Login</button>
      </div>
    </div>
  );
  
  
}

export default Login;
