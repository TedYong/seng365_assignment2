import {Link, useParams, useNavigate} from "react-router-dom";
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import logo from "../photos/logo.png"
import AdbIcon from '@mui/icons-material/Adb';
import axios from "axios";

const pages = ['Auctions', 'Profile'];

const ResponsiveAppBar = () => {
    const navigate = useNavigate();
    const id = localStorage.getItem("userId")
    const token = localStorage.getItem("auth_token")
    const [loginStatus, setLoginStatus] = React.useState(false)
    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")

    React.useEffect(() => {
        const result = id === null && token === null
        setLoginStatus(result)
    }, [id, token])

    const LogoutUser = async() => {
        try {
            await axios.post('http://localhost:4941/api/v1/users/logout',{}, {
                headers:{
                    "X-Authorization": token!
                }
                }
            )
                .then((response) => {
                    localStorage.clear()
                    navigate("/auctions")
                }, (error) => {
                    setErrorFlag(true)
                    setErrorMessage(error.toString())
                })
        } catch {
            setErrorMessage("Email or password does not exist or match the registered data, please try again")
            setErrorFlag(true)
                }
        }

    if (!loginStatus) {
        return (
            <AppBar position="static" style={{background:"blue"}}>
                <Container maxWidth="xl">
                    <Toolbar disableGutters>
                        <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'flex' }}}>
                            {/*<img src={logo} alt={""} width="80px" height="80px" style={{margin:"5px"}} onClick={() => navigate("/auctions/")}/>*/}
                        </Box>
                        <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                        </Box>
                        <img src={logo} alt={""} width="70px" height="70px" style={{margin:"5px"}} onClick={() => navigate("/auctions/")}/>
                        <Typography
                            variant="h5"
                            component="a"
                            href=""
                            sx={{
                                mr: 2,
                                display: { xs: 'flex', md: 'none' },
                                flexGrow: 1,
                                fontFamily: 'monospace',
                                fontWeight: 700,
                                letterSpacing: '.3rem',
                                color: 'inherit',
                                textDecoration: 'none',
                            }}
                        >
                            COOLBEE
                        </Typography>
                        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                            <Button
                                onClick={() => navigate("/auctions/")}
                                sx={{ my: 2, color: 'white', display: 'block' }}
                            >
                                Auctions
                            </Button>
                            <Button
                                onClick={() => navigate("/users/" + id)}
                                sx={{ my: 2, color: 'white', display: 'block' }}
                            >
                                Profile
                            </Button>

                        </Box>
                        <Box sx={{ flexGrow: 0 }}>
                            <Tooltip title="log out">
                                <div>
                                    <Typography textAlign="left" ></Typography><Button
                                    key={"Log out"}
                                    onClick={LogoutUser}
                                    sx={{ my: 2, color: 'white', display: 'block' }}
                                >
                                    Log out
                                </Button>
                                </div>
                            </Tooltip>
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>
        );
    } else {
        return (
            <AppBar position="static" style={{background:"blue"}}>
                <Container maxWidth="xl">
                    <Toolbar disableGutters>
                        <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'flex' }}}>
                            {/*<img src={logo} alt={""} width="80px" height="80px" style={{margin:"5px"}} onClick={() => navigate("/auctions/")}/>*/}
                        </Box>
                        <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                        </Box>
                        <img src={logo} alt={""} width="70px" height="70px" style={{margin:"5px"}} onClick={() => navigate("/auctions/")}/>
                        <Typography
                            variant="h5"
                            // noWrap
                            component="a"
                            href=""
                            sx={{
                                mr: 2,
                                display: { xs: 'flex', md: 'flex' },
                                flexGrow: 1,
                                fontFamily: 'monospace',
                                fontWeight: 700,
                                letterSpacing: '.3rem',
                                color: 'inherit',
                                textDecoration: 'none',
                                justifyContent:"center",
                                width:"10px"
                            }}
                        >
                            COOLBEE
                        </Typography>
                        <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'flex' } }}>
                        </Box>
                        <Box sx={{ flexGrow: 0 }}>
                            <Tooltip title="log in">
                                <div>
                                    <Button
                                    key={"Log in"}
                                    onClick={() => navigate("/users/login")}
                                    sx={{ my: 2, color: 'white', display: 'block' }}
                                >
                                    Log in
                                </Button>
                                </div>
                            </Tooltip>
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>
        );
    }
}
export default ResponsiveAppBar;
