import React, { useState, useEffect} from 'react'
import { useNavigate ,Link } from "react-router-dom";
import "./help.css"

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
      <span className="material-icons">
      build
      </span>
      </Link>
        <Link to='/help'>
        <span className="material-icons home-icon">
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
  
  
  function Help() {
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
            <h1>hello</h1>
          </div>
        </div>
      </div>
  
    );
  }
  
  export default Help;