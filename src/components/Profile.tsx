import {Link, useParams, useNavigate} from "react-router-dom";
import axios from "axios";
import React, {ReactNode, useRef} from "react";
import CSS from 'csstype';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import EditIcon from '@mui/icons-material/Edit';
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
    SvgIcon,
    OutlinedInput, InputAdornment, InputLabel, FormControl, Input
} from "@mui/material";
import {Delete, Edit, Visibility, VisibilityOff} from "@mui/icons-material";
import ResponsiveAppBar from "../components/Navibar";
import ListAltIcon from "@mui/icons-material/ListAlt";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import HelpIcon from "@mui/icons-material/Help";


const Profile = () => {
    const userRef = useRef<HTMLInputElement>(null);
    const errRef = useRef<HTMLInputElement>(null);

    interface State {
        password: string;
        showPassword: boolean;
    }

    const [openUpdateDialog, setOpenUpdateDialog] =
        React.useState(false)
    const handleUpdateDialogOpen = (user:userPatch) => {
        setUser(user)
        setOpenUpdateDialog(true);
    };
    const handleUpdateDialogClose = () => {
        // setUser({id:0, firstName:"", lastName:"", email: "", password: "", imageFilename: "", authToken:""})
        getUser()
        setOpenUpdateDialog(false);
    };

    const handleSnackClose = (event?: React.SyntheticEvent | Event,
                              reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackOpen(false);
    };

    const [user, setUser] = React.useState<userPatch>({firstName:"", lastName:"", email: "", password: "", currentPassword:""})
    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")
    const [snackOpen, setSnackOpen] = React.useState(false)
    const [snackMessage, setSnackMessage] = React.useState("")

    const [editFlag, setEditFlag] = React.useState(false);
    const [editMessage, setEditMessage] = React.useState("");

    const navigate = useNavigate();
    const id = localStorage.getItem("userId")
    const token = localStorage.getItem("auth_token")

    const USER_REGEX = /^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,}$/
    const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/

    const [firstName, setFirstName] = React.useState("")
    const [validFirstName, setValidFirstName] = React.useState(false)

    const [lastName, setLastName] = React.useState("")
    const [validLastName, setValidLastName] = React.useState(false)

    const [email, setEmail] = React.useState("")
    const [validEmail, setValidEmail] = React.useState(false)

    const [newPassword, setNewPassword] = React.useState<State>({
        password: '',
        showPassword: false,
    });
    const handleChangeNewPassword =
        (prop: keyof State) => (event: React.ChangeEvent<HTMLInputElement>) => {
            setNewPassword({ ...password, [prop]: event.target.value });
        };
    const handleClickShowNewPassword = () => {
        setNewPassword({
            ...password,
            showPassword: !password.showPassword,
        });
    };
    const handleMouseDownNewPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const [password, setPassword] = React.useState<State>({
        password: '',
        showPassword: false,
    });
    const handleChangePassword =
        (prop: keyof State) => (event: React.ChangeEvent<HTMLInputElement>) => {
            setPassword({ ...password, [prop]: event.target.value });
        };
    const handleClickShowPassword = () => {
        setPassword({
            ...password,
            showPassword: !password.showPassword,
        });
    };
    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

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

    React.useEffect(() => {
        userRef.current?.focus();
    }, [])

    React.useEffect(() => {
        const result = USER_REGEX.test(firstName);
        setValidFirstName(result);
    }, [firstName])

    React.useEffect(() => {
        const result = USER_REGEX.test(lastName);
        setValidLastName(result);
    }, [lastName])

    React.useEffect(() => {
        const result = EMAIL_REGEX.test(email);
        setValidEmail(result);
    }, [email])

    React.useEffect(() => {
        setErrorMessage("")
    }, [firstName,lastName,email,password.password])

    interface HeadCell {
        id: string;
        label: string;
        numeric: boolean;
    }

    const headCells: readonly HeadCell[] = [
        { id: 'ID', label: 'id', numeric: true },
        { id: 'username', label: 'Username', numeric: false },
        { id: 'link', label: 'Link', numeric: false },
        { id: 'actions', label: 'Actions', numeric: false }
    ];

    const getDefaultImg = (x:any) => {
        x.target.src = "https://tse3.explicit.bing.net/th?id=OIP.ruat7whad9-kcI8_1KH_tQHaGI&pid=Api&P=0&w=197&h=163"
    }

    const setUserImg = (x:any) => {
        return (<img src={"http://localhost:4941/api/v1/users/" + id + "/image"} alt={""} width="auto" height="300px" onError={getDefaultImg} style={{margin:"5px"}}/>)
    }

    const user_rows = () => {
        return (
            <div>
                <TableRow>
                    <TableCell align="left" style={{fontStyle: "bold", fontSize: "18px"}}>
                        First name:
                    </TableCell>
                    <TableCell align="left" width="1000px">{user.firstName} {setFirstNameButton()}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell align="left" style={{fontStyle: "bold", fontSize: "18px"}}>
                        Last name:
                    </TableCell>
                    <TableCell align="left" width="1000px">{user.lastName} {setLastNameButton()}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell align="left" style={{fontStyle: "bold", fontSize: "18px"}}>
                        email:
                    </TableCell>
                    <TableCell align="left" width="1000px">{user.email} {setEmailButton()}</TableCell>
                </TableRow>
            </div>
        )
    }

    const updateFirstName = async () => {
        if (firstName === "") {
            alert("new first name cannot be empty")
        } else if (!validFirstName) {
            alert("new first name is in wrong format, please try again")
        } else {
            await axios.patch('http://localhost:4941/api/v1/users/' + id, {"firstName": firstName}, {headers: {"X-Authorization": token!}})
                .then((response) => {
                    setSnackMessage("user first name updated successfully")
                    setSnackOpen(true)
                    handleUpdateDialogClose()
                    getUser()
                }, (error) => {
                    setErrorFlag(true)
                    setErrorMessage(error.toString())
                })
        }
    }
    const updateFirstNameState = (event: any) => {
        setFirstName(event.target.value)
    }

    const setFirstNameButton = () => {
        return (<span>
            <Button variant="contained" endIcon={<EditIcon/>} onClick={() =>
            {handleUpdateDialogOpen(user)}}>Edit</Button>
                    <Dialog
                        open={openUpdateDialog}
                        onClose={handleUpdateDialogClose}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description">
                        <DialogTitle id="alert-dialog-title">
                            {"update user first name?"}
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                <TextField id="outlined-basic" label="Enter new first name" variant="outlined"
                                           onChange={updateFirstNameState} />
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleUpdateDialogClose}>Cancel</Button>
                            <Button variant="contained" color="error" onClick={() =>
                            {updateFirstName()}} autoFocus>
                                confirm update
                            </Button>
                        </DialogActions>
                    </Dialog>
                    <Snackbar
                        autoHideDuration={6000}
                        open={snackOpen}
                        onClose={handleSnackClose}
                        key={snackMessage}
                    >
                        <Alert onClose={handleSnackClose} severity="success" sx={{
                            width: '100%' }}>
                            {snackMessage}
                        </Alert>
                    </Snackbar>
        </span>)
    }

    const updateLastName = async () => {
        if (lastName === "") {
            alert("new last name cannot be empty")
        } else if (!validLastName) {
            alert("new last name is in wrong format, please try again")
        } else {
            await axios.patch('http://localhost:4941/api/v1/users/' + id, {"lastName": lastName}, {headers: {"X-Authorization": token!}})
                .then((response) => {
                    setSnackMessage("user last name updated successfully")
                    setSnackOpen(true)
                    handleUpdateDialogClose()
                    getUser()
                }, (error) => {
                    setErrorFlag(true)
                    setErrorMessage(error.toString())
                })
        }
    }
    const updateLastNameState = (event: any) => {
        setLastName(event.target.value)
    }

    const setLastNameButton = () => {
        return (<span>
            <Button variant="contained" endIcon={<EditIcon/>} onClick={() =>
            {handleUpdateDialogOpen(user)}}>Edit</Button>
                    <Dialog
                        open={openUpdateDialog}
                        onClose={handleUpdateDialogClose}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description">
                        <DialogTitle id="alert-dialog-title">
                            {"update user last name?"}
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                <TextField id="outlined-basic" label="Enter new last name" variant="outlined"
                                           onChange={updateLastNameState} />
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleUpdateDialogClose}>Cancel</Button>
                            <Button variant="contained" color="error" onClick={() =>
                            {updateLastName()}} autoFocus>
                                confirm update
                            </Button>
                        </DialogActions>
                    </Dialog>
                    <Snackbar
                        autoHideDuration={6000}
                        open={snackOpen}
                        onClose={handleSnackClose}
                        key={snackMessage}
                    >
                        <Alert onClose={handleSnackClose} severity="success" sx={{
                            width: '100%' }}>
                            {snackMessage}
                        </Alert>
                    </Snackbar>
        </span>)
    }

    const updateEmail = async () => {
        if (email === "") {
            alert("new email cannot be empty")
        } else if (!validEmail) {
            alert("new email is in wrong format, please try again")
        } else {
            await axios.patch('http://localhost:4941/api/v1/users/' + id, {"email": email}, {headers: {"X-Authorization": token!}})
                .then((response) => {
                    setSnackMessage("user email updated successfully")
                    setSnackOpen(true)
                    handleUpdateDialogClose()
                    getUser()
                }, (error) => {
                    setErrorFlag(true)
                    setErrorMessage(error.toString())
                })
        }
    }
    const updateEmailState = (event: any) => {
        setEmail(event.target.value)
    }

    const setEmailButton = () => {
        return (<span>
            <Button variant="contained" endIcon={<EditIcon/>} onClick={() =>
            {handleUpdateDialogOpen(user)}}>Edit</Button>
                    <Dialog
                        open={openUpdateDialog}
                        onClose={handleUpdateDialogClose}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description">
                        <DialogTitle id="alert-dialog-title">
                            {"update user email?"}
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                <TextField id="outlined-basic" label="Enter new email" variant="outlined"
                                           onChange={updateEmailState} />
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleUpdateDialogClose}>Cancel</Button>
                            <Button variant="contained" color="error" onClick={() =>
                            {updateEmail()}} autoFocus>
                                confirm update
                            </Button>
                        </DialogActions>
                    </Dialog>
                    <Snackbar
                        autoHideDuration={6000}
                        open={snackOpen}
                        onClose={handleSnackClose}
                        key={snackMessage}
                    >
                        <Alert onClose={handleSnackClose} severity="success" sx={{
                            width: '100%' }}>
                            {snackMessage}
                        </Alert>
                    </Snackbar>
        </span>)
    }

    const updatePsw = async () => {
        if (password.password === "" || newPassword.password === "") {
            alert("both boxes have to be completed to update password, please try again")
        } else if (newPassword.password.length < 6) {
            alert("new password has to be more than or equal to six characters")
        } else {
            await axios.patch('http://localhost:4941/api/v1/users/' + id, {"password": newPassword.password, "currentPassword":password.password}, {headers: {"X-Authorization": token!}})
                .then((response) => {
                    setSnackMessage("user password updated successfully")
                    setSnackOpen(true)
                    handleUpdateDialogClose()
                    getUser()
                }, (error) => {
                    setEditFlag(true)
                    setEditMessage("current password is incorrect, please try again")
                })
        }
    }

    const setPswButton = () => {
        return (<span>
            <Button variant="contained" endIcon={<EditIcon/>} onClick={() =>
            {handleUpdateDialogOpen(user)}} >Edit Password</Button>
                    <Dialog
                        open={openUpdateDialog}
                        onClose={handleUpdateDialogClose}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description">
                        <DialogTitle id="alert-dialog-title">
                            {"update user password?"}
                        </DialogTitle>
                        {editFlag?
                            <Alert severity="error" variant="filled">
                                {editMessage}
                            </Alert>
                            :""}
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                            <FormControl variant="standard">
                                                <InputLabel htmlFor="standard-adornment-password">Password</InputLabel>
                                                <Input fullWidth
                                                       id="standard-adornment-password"
                                                       type={password.showPassword ? 'text' : 'password'}
                                                       value={password.password}
                                                       onChange={handleChangePassword('password')}
                                                       endAdornment={
                                                           <InputAdornment position="end">
                                                               <IconButton
                                                                   aria-label="toggle password visibility"
                                                                   onClick={handleClickShowPassword}
                                                                   onMouseDown={handleMouseDownPassword}>
                                                                   {password.showPassword ? <VisibilityOff /> : <Visibility />}
                                                               </IconButton>
                                                           </InputAdornment>
                                                       }
                                                />
                                            </FormControl><br/>
                                <FormControl variant="standard">
                                                <InputLabel htmlFor="standard-adornment-password">New Password</InputLabel>
                                                <Input fullWidth
                                                       id="standard-adornment-password"
                                                       type={newPassword.showPassword ? 'text' : 'password'}
                                                       value={newPassword.password}
                                                       onChange={handleChangeNewPassword('password')}
                                                       endAdornment={
                                                           <InputAdornment position="end">
                                                               <IconButton
                                                                   aria-label="toggle password visibility"
                                                                   onClick={handleClickShowNewPassword}
                                                                   onMouseDown={handleMouseDownNewPassword}>
                                                                   {newPassword.showPassword ? <VisibilityOff /> : <Visibility />}
                                                               </IconButton>
                                                           </InputAdornment>
                                                       }
                                                />
                                            </FormControl>
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleUpdateDialogClose}>Cancel</Button>
                            <Button variant="contained" color="error" onClick={() =>
                            {updatePsw()}} autoFocus>
                                confirm update
                            </Button>
                        </DialogActions>
                    </Dialog>
                    <Snackbar
                        autoHideDuration={6000}
                        open={snackOpen}
                        onClose={handleSnackClose}
                        key={snackMessage}
                    >
                        <Alert onClose={handleSnackClose} severity="success" sx={{
                            width: '100%' }}>
                            {snackMessage}
                        </Alert>
                    </Snackbar>
        </span>)
    }

    const getUser = () => {
        axios.get('http://localhost:4941/api/v1/users/'+id, {headers: {"X-Authorization": token!}})
            .then((response) => {
                setErrorFlag(false)
                setErrorMessage("")
                setUser(response.data)
            }, (error) => {
                setErrorFlag(true)
                setErrorMessage(error.toString)
            })
    }

    React.useEffect(() => {
        getUser()
    }, [])



    if(errorFlag) {
        return (
            <div>
                <h1>Auction</h1>
                <div style={{color: "red"}}>
                    {errorMessage}
                </div>
                <Link to={"/auctions"}>Back to auctions</Link>
            </div>
        )
    } else {
        return (
            <div>
                <div>
                    {<ResponsiveAppBar/>}
                </div>
                <Stack direction="row" spacing={60} justifyContent="center" style={{background:"blue", marginBottom:"40px"}}>
                    <h3 style={{margin:"5px", marginBottom:"20px", color:"white"}}> My profile page </h3>
                </Stack>
                <Paper elevation={3} style={{
                    display:"inline-block",
                    height: "auto",
                    width: "1200px",
                    margin: "40px",
                    padding: "10px"}}>
                    <Stack direction="row" spacing={110} justifyContent="left">
                        <Button variant="contained" endIcon={<ExitToAppIcon/>} onClick={() => navigate("/auctions")}>
                            Go back
                        </Button>
                    </Stack>
                    {setUserImg(user)}
                    <Paper elevation={3} style={{
                        display:"inline-block",
                        height: "auto",
                        width: "1000px",
                        margin: "20px",
                        padding: "10px"}}>
                        <TableContainer component={Paper}>
                            <Table>
                                <TableBody>
                                    {user_rows()}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                    <Stack direction="row" spacing={2} justifyContent="center">{setPswButton()}</Stack>
                </Paper>
            </div>
        )
    }
}
export default Profile;