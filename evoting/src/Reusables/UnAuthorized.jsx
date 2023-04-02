import React from "react";
import "../assets/customCss/accessDenied.css";
import AccessDenied from "../assets/images/AccessDenied.png";
import { useNavigate } from "react-router-dom";
export const UnAuthorized = () => {
  const navigate = useNavigate();
  return (
    <>
      <div className="mainContainer">
        <div style={{height:"100%"}}>
          <div>
            <img src={AccessDenied} alt="AccessDenied" />
          </div>
          <div className="text-wrapper">
            <div className="title" data-content="404">
              403 - ACCESS DENIED
            </div>

            <div className="subtitle">
              Oops, You don't have permission to access this page.
            </div>

            <div className="buttons" onClick={() => navigate("/")}>
              Go Back to Home Page
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
