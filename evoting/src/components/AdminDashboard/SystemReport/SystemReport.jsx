import React from 'react'
import { useEffect } from 'react'

const SystemReport = ({setSelectedLink, link}) => {
  useEffect(()=>{
    setSelectedLink(link)
  },[])
  return (
    <div>SystemReport</div>
  )
}

export default SystemReport