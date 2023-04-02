import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/customCss/NotFound.css"
const NotFound = () => {
  const navigate = useNavigate();
  const [count, setCount] = useState(5)  
  useEffect(() => {
    count > 0 && setTimeout(() => setCount(count - 1), 1000);
    if(count == 0){
      setTimeout(() => navigate("/"), 1000)
    }
  }, [count]);
  return (
    <>
      <h1 style={{textAlign:"center"}}>404 Error Page</h1>
      <p className="zoom-area">This page is missing. </p>
      <section className="error-container">
        <span className="four">
          <span className="screen-reader-text">4</span>
        </span>
        <span className="zero">
          <span className="screen-reader-text">0</span>
        </span>
        <span className="four">
          <span className="screen-reader-text">4</span>
        </span>
      </section>
      <div className="link-container">
        <a
          target="_blank"
          className="more-link"          
        >
          Redireting to home in {count}
        </a>
      </div>
    </>
  );
};

export default NotFound;
