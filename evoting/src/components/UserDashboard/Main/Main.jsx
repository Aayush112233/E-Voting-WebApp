import React, { useEffect } from "react";

const Main = ({ setSelectedLink, link }) => {
  useEffect(() => {
    setSelectedLink(link);
  }, []);

  return (
    <>
    <h3>Hi, Welcome back</h3>
    </>
  );
};

export default Main;
