import React, {useRef} from "react";
import axios from 'axios';
import CSS from 'csstype';
import {Link, useNavigate} from "react-router-dom";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import HelpIcon from '@mui/icons-material/Help';
import {
    Button,
    Card,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,
    Paper,
    Table,
    TableBody,
    TableContainer,
    TableRow,
    TableCell,
    TableHead,
    Stack,
    AlertTitle,
    Alert,
    Snackbar,
    CardContent,
    CardMedia,
    Typography,
    IconButton,
    CardActions,
    Pagination,
    SvgIcon,
    InputAdornment, OutlinedInput, FormControl, InputLabel, Input
} from "@mui/material";
import {Delete, Edit, Search, Visibility, VisibilityOff} from "@mui/icons-material";
import SearchAppBar from "./Navibar";
import SearchIcon from "@mui/icons-material/Search";
import {styled} from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import ResponsiveAppBar from "./Navibar";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import logo from "../photos/logo.png";
import {State} from "zustand";




const Register = () => {
    const userRef = useRef<HTMLInputElement>(null);
    const errRef = useRef<HTMLInputElement>(null);

    const USER_REGEX = /^[a-zA-Z][a-zA-Z0-9-_]*$/
    const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
    const PSW_REGEX = /^.{6,}$/

    const navigate = useNavigate();
    const [firstName, setFirstName] = React.useState("")
    const [validFirstName, setValidFirstName] = React.useState(false)
    const [FirstNameFocus, setFirstNameFocus] = React.useState(false)

    const [lastName, setLastName] = React.useState("")
    const [validLastName, setValidLastName] = React.useState(false)
    const [LastNameFocus, setLastNameFocus] = React.useState(false)

    const [psw, setPsw] = React.useState({
        password: "",
        showPassword: false
    })
    const [validPsw, setValidPsw] = React.useState(false)
    const [pswFocus, setPswFocus] = React.useState(false)

    const handleChange =
        (prop: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
            setPsw({ ...psw, [prop]: event.target.value });
        };

    const handleClickShowPassword = () => {
        setPsw({
            ...psw,
            showPassword: !psw.showPassword,
        });
    };

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const [email, setEmail] = React.useState("")
    const [validEmail, setValidEmail] = React.useState(false)
    const [emailFocus, setEmailFocus] = React.useState(false)

    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")

    React.useEffect(() => {
        userRef.current?.focus();
    }, [])

    React.useEffect(() => {
        const result = USER_REGEX.test(firstName);
        console.log(firstName);
        console.log(result);
        setValidFirstName(result);
    }, [firstName])

    React.useEffect(() => {
        const result = USER_REGEX.test(lastName);
        console.log(lastName);
        console.log(result);
        setValidLastName(result);
    }, [lastName])

    React.useEffect(() => {
        const result = PSW_REGEX.test(psw.password);
        console.log(psw.password);
        console.log(result);
        setValidPsw(result);
    }, [psw.password])

    React.useEffect(() => {
        const result = EMAIL_REGEX.test(email);
        console.log(email);
        console.log(result);
        setValidEmail(result);
    }, [email])

    React.useEffect(() => {
        setErrorMessage("")
    }, [firstName,lastName,email,psw.password])

    const card: CSS.Properties = {
        padding: "100px",
        paddingLeft:"0px",
        paddingRight:"0px",
        paddingTop:"0px",
        margin: "200px",
        marginLeft: "500px",
        marginRight:"500px"
    }

    const valid: CSS.Properties = {
        color: "limegreen",
        marginLeft: "0.25rem"
    }

    const invalid: CSS.Properties = {
        color: "red",
        marginLeft: "0.25rem"
    }

    const offscreen: CSS.Properties = {
        position: "absolute",
        left: "-9999px"
    }

    const instructions: CSS.Properties = {
        marginRight: "0.25rem"
    }

    const hide: CSS.Properties = {
        display:"none"
    }

    const error: CSS.Properties = {
        background: "lightpink",
        color: "firebrick",
        fontWeight: "bold",
        padding: "0.5rem",
        marginBottom: "0.5rem"
    }

    const falign: CSS.Properties = {
        width:"180px",
        marginRight:"10px",
        display:"inline-block"
    }

    const registerUser = async (e:any) => {
        e.preventDefault();
        if (firstName === "" || lastName === "" || email === "" || psw.password === "") {
            setErrorMessage("Please complete all information")
            setErrorFlag(true)
        } else if (!USER_REGEX.test(firstName)) {
            setErrorMessage("invalid input on first name, please try again")
            setErrorFlag(true)
        } else if (!USER_REGEX.test(lastName)) {
            setErrorMessage("invalid input on last name, please try again")
            setErrorFlag(true)
        } else if (!PSW_REGEX.test(psw.password)) {
            setErrorMessage("invalid input on password, please try again")
            setErrorFlag(true)
        } else if (!EMAIL_REGEX.test(email)) {
            setErrorMessage("invalid input on email, please try again")
            setErrorFlag(true)
        } else {
            axios.post('http://localhost:4941/api/v1/users/register', {
                "firstName": firstName,
                "lastName": lastName,
                "email": email,
                "password": psw.password
            })
                .then(async () => {
                    await axios.post('http://localhost:4941/api/v1/users/login', {
                        "email": email,
                        "password": psw.password
                    })
                        .then((response) => {
                            localStorage.setItem("auth_token", response.data.token)
                            localStorage.setItem("userId", response.data.userId)
                            navigate("/auctions")
                        }, (error) => {
                            setErrorFlag(true)
                            setErrorMessage(error.toString())
                        })
                })
                .catch((error) => {
                    setErrorMessage("Email already in used, please try again")
                    setErrorFlag(true)
                })
        }
    }



    if(errorFlag) {
        return (
            <div>
                <h1>Register</h1>
                <div style={{color: "red"}}>
                    {errorMessage}
                </div>
                <Link to={"/auctions"}>Back to auctions</Link>
            </div>
        )
    } else {
        return (
            <section>
                <Paper elevation={3} style = {card}>
                <p ref={errRef} style={errorMessage ? error:offscreen} aria-live="assertive">{errorMessage} </p>
                    <Stack direction="row" justifyContent="center" style={{background:"blue"}}>
                        <img src={logo} alt={""} width="100px" height="100px" style={{margin:"5px"}} onClick={() => navigate("/auctions/")}/>
                    </Stack>
                    <Stack direction="row" spacing={60} justifyContent="center" style={{background:"blue", marginBottom:"40px"}}>
                        <h3 style={{margin:"5px", marginBottom:"20px", color:"white"}}> Registration </h3>
                    </Stack>
                    <form onSubmit={registerUser} style={{paddingTop:"5px"}}>
                        <label htmlFor="firstName" style={falign}>
                            First name:
                            <span style={validFirstName? valid:hide}><SvgIcon component={CheckCircleIcon} inheritViewBox/></span>
                            <span style={validFirstName || !firstName ? hide:invalid}><SvgIcon component={CancelIcon} inheritViewBox/></span>
                        </label>
                        <OutlinedInput type="text" id="firstName" ref={userRef} autoComplete="off" onChange = {(e) => setFirstName(e.target.value)} required aria-invalid={validFirstName? "false":"true"} aria-describeby="firstnote" onFocus={() => setFirstNameFocus(true)} onBlur={() => setFirstNameFocus(false)} style={{width:"260px", height:"50px"}}/>
                        <p id="firstnote" style={FirstNameFocus && firstName && !validFirstName? instructions:offscreen}>
                            <SvgIcon component={HelpIcon} inheritViewBox/>
                            Cannot be empty.<br/>
                            Must begin with a letter.<br/>
                            Letters, numbers, underscores, hyphens allowed.
                        </p>
                        <br/>
                        <label htmlFor="lastName" style={falign}>
                            Last name:
                            <span style={validLastName? valid:hide}><SvgIcon component={CheckCircleIcon} inheritViewBox/></span>
                            <span style={validLastName || !lastName ? hide:invalid}><SvgIcon component={CancelIcon} inheritViewBox/></span>
                        </label>
                        <OutlinedInput type="text" id="lastName" ref={userRef} autoComplete="off" onChange = {(e) => setLastName(e.target.value)} required aria-invalid={validLastName? "false":"true"} aria-describeby="lastnote" onFocus={() => setLastNameFocus(true)} onBlur={() => setLastNameFocus(false)} style={{width:"260px", height:"50px"}}/>
                        <p id="lastnote" style={LastNameFocus && lastName && !validLastName? instructions:offscreen}>
                            <SvgIcon component={HelpIcon} inheritViewBox/>
                            Cannot be empty.<br/>
                            Must begin with a letter.<br/>
                            Letters, numbers, underscores, hyphens allowed.
                        </p>
                        <br/>
                        <label htmlFor="email" style={falign}>
                            Email:
                            <span style={validEmail? valid:hide}><SvgIcon component={CheckCircleIcon} inheritViewBox/></span>
                            <span style={validEmail || !email ? hide:invalid}><SvgIcon component={CancelIcon} inheritViewBox/></span>
                        </label>
                        <OutlinedInput type="email" id="email" onChange = {(e) => setEmail(e.target.value)} required aria-invalid={validEmail? "false":"true"} aria-describeby="emnote" onFocus={() => setEmailFocus(true)} onBlur={() => setEmailFocus(false)} style={{width:"260px", height:"50px"}}/>
                        <p id="emnote" style={emailFocus && email && !validEmail? instructions:offscreen}>
                            <SvgIcon component={HelpIcon} inheritViewBox/>
                            Cannot be empty.<br/>
                            Must include a special character @ and <br/>
                            uppercase or lowercase letters or numbers.
                        </p>
                        <br/>
                        <label htmlFor="password" style={falign}>
                            Password:
                            <span style={validPsw? valid:hide}><SvgIcon component={CheckCircleIcon} inheritViewBox/></span>
                            <span style={validPsw || !psw.password ? hide:invalid}><SvgIcon component={CancelIcon} inheritViewBox/></span>
                        </label>
                        <OutlinedInput type={psw.showPassword ? 'text' : 'password'} id="password" value={psw.password} onChange = {handleChange('password')} required aria-invalid={validPsw? "false":"true"} aria-describeby="pswnote" onFocus={() => setPswFocus(true)} onBlur={() => setPswFocus(false)} endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowPassword}
                                    onMouseDown={handleMouseDownPassword}
                                    edge="end"
                                >
                                    {psw.showPassword ? <Visibility /> : <VisibilityOff />}
                                </IconButton>
                            </InputAdornment>
                        } style={{height:"50px"}}
                        />
                        <p id="pswnote" style={pswFocus && psw.password && !validPsw? instructions:offscreen}>
                            <SvgIcon component={HelpIcon} inheritViewBox/>
                            Cannot be empty.<br/>
                            Must include at least 6 character long letters<br/>
                            or numbers or symbols.
                        </p>
                        <br/>
                        <Button variant="contained" disabled={!validFirstName || !validLastName || !validEmail || !validPsw ? true : false}
                                type={"submit"} style={{marginTop:"50px", marginBottom:"60px"}}>
                            Sign in
                        </Button>
                    </form>
                    <Stack direction="row" justifyContent="center">
                        <Typography style={{color:"grey"}}>already have a account? <Link to={"/users/login"}>Go to sign in</Link></Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="center">
                        <Typography style={{color:"grey"}}>go back to home page? <Link to={"/auctions"}>Go back</Link></Typography>
                    </Stack>
                </Paper>
            </section>
        )
    }
}
export default Register;

