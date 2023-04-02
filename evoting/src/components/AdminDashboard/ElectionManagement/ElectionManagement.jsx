import React from "react";
import { useEffect } from "react";

const ElectionManagement = ({setSelectedLink, link}) => {
  useEffect(()=>{
    setSelectedLink(link)
  },[])
  return (
    <>
      <div>ElectionManagement</div>
    </>
  );
};

export default ElectionManagement;
