import { Button } from '@mui/joy'
import React from 'react'
import { useNavigate } from 'react-router-dom'

const NotFound = () => {
  const navigate = useNavigate();
  
  return (
    <div className='flex flex-col justify-center items-center gap-2' style={{height: "85vh"}}>
      <h1>NotFound</h1>
      <Button variant='outlined' onClick={() => navigate("/")}>Return home</Button>
    </div>
  )
}

export default NotFound