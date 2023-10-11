import { Box, Button } from '@mui/joy'
import React from 'react'
import { useNavigate } from 'react-router-dom'

const Home = () => {
  const navigate = useNavigate();
  return (
    <Box className="p-3">
    <h1 className='font-bold'>Smart Data Table - for ASTUDIO</h1>
    <h1 className='font-bold'>By Eng. Rami Mohamed</h1>
    <div className='flex flex-col justify-center items-center gap-2' style={{height: "55vh"}}>
      <p>Select table:</p>
      <Button onClick={() => navigate("/users")}>Users</Button>
      <Button onClick={() => navigate("/products")}>Products</Button>
    </div>
    </Box>
  )
}

export default Home