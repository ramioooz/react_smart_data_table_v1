import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar className='flex  gap-2'>
                    {/* <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Smart Data Table
                    </Typography> */}
                    <Box sx={{ flexGrow: 1 }}>
                    <Button color="inherit" variant='outlined' onClick={() => navigate("/")}>ASTUDIO | DATA TABLE</Button>

                    </Box>
                    <div className='flex flex-wrap gap-2'>
                        <Button color="inherit" variant='outlined' onClick={() => navigate("/users")}>Users</Button>
                        <Button color="inherit" variant='outlined' onClick={() => navigate("/products")}>Products</Button>
                    </div>
                </Toolbar>
            </AppBar>
        </Box>
    )
}

export default Navbar