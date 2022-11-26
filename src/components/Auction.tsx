import {Link, useParams, useNavigate} from "react-router-dom";
import axios from "axios";
import React, {useEffect} from "react";
import CSS from 'csstype';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import ListAltIcon from '@mui/icons-material/ListAlt';
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
    Stack, AlertTitle, Alert, Snackbar, CardContent, CardMedia, Typography, IconButton, CardActions
} from "@mui/material";
import {Delete, Edit} from "@mui/icons-material";
import ResponsiveAppBar from "../components/Navibar";
import EditIcon from "@mui/icons-material/Edit";


const Auction = () => {
    const navigate = useNavigate();
    const {id} = useParams();
    const userId = localStorage.getItem("userId")
    const token = localStorage.getItem("auth_token")
    const [auctionList,setAuctions] = React.useState<Array<auction>>([])
    const [auction, setAuction] = React.useState<auctions>({auctionId:0, sellerFirstName:"", sellerLastName:"", description: "", highestBid:0, numBids:0, title:"", categoryId:0, sellerId:0, reserve:0, endDate: ""})
    const [bidder, setBidder] = React.useState<Array<bid>>([])

    const [bidAmount, setBidAmount] = React.useState(0)
    const [categories, setCategories] = React.useState<Array<category>>([])
    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")
    const [snackOpen, setSnackOpen] = React.useState(false)
    const [snackMessage, setSnackMessage] = React.useState("")

    const [openAddBidDialog, setOpenAddBidDialog] =
        React.useState(false)
    const handleAddBidDialogOpen = (auction:auctions) => {
        setAuction(auction)
        setOpenAddBidDialog(true);
    };
    const handleAddBidDialogClose = () => {
        getAuction()
        getBidder()
        setOpenAddBidDialog(false);
    };

    const handleSnackClose = (event?: React.SyntheticEvent | Event,
                              reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackOpen(false);
    };

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

    const addBid = async() => {
        console.log(bidAmount)
        if (bidAmount <= 0) {
            alert("bid input is in wrong format, please try again")
        } else if (bidAmount <= auction.highestBid && auction.highestBid !== null) {
            alert("bid must be more than highest bid, please try again")
        } else
            return (axios.post('http://localhost:4941/api/v1/auctions/' + id + '/bids', {
                amount: bidAmount
            }, {headers: {"X-Authorization": token!}})
                .then((response) => {
                    setSnackMessage("new bid added successfully")
                    setSnackOpen(true)
                    setErrorFlag(false)
                    setErrorMessage("")
                    getAuction()
                    getBidder()
                    setOpenAddBidDialog(false);
                    navigate('/auctions/' + id)
                }, (error) => {
                    setErrorFlag(true)
                    setErrorMessage(error.toString())
                }))
    }

    const updateUserBidState = (event: any) => {
        setBidAmount(+event.target.value)
    }

    const setUserBidButton = () => {
        return (<span>
            <Button variant="contained" endIcon={<EditIcon/>} onClick={() =>
            {handleAddBidDialogOpen(auction)}} style={{marginTop:"10px"}} disabled={Math.floor((new Date(auction.endDate).getTime() - new Date().getTime()) / (86400 * 1000)) < 0? true:false}>make a bid</Button>
                    <Dialog
                        open={openAddBidDialog}
                        onClose={handleAddBidDialogClose}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description">
                        <DialogTitle id="alert-dialog-title">
                            {"update user last name?"}
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                Current highest bid is {auction.highestBid === null? 0:auction.highestBid}<br/>
                                <TextField id="outlined-basic" label="Enter your bid amount" variant="outlined"
                                           onChange={updateUserBidState} />
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleAddBidDialogClose}>Cancel</Button>
                            <Button variant="contained" color="error" onClick={() =>
                            {addBid()}} autoFocus>
                                add bid
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

    const getCate = () => {
        axios.get('http://localhost:4941/api/v1/auctions/categories')
            .then((response) => {
                setErrorMessage("")
                setCategories(response.data)
            }, (error) => {
                setErrorFlag(true)
                setErrorMessage(error.toString())
            })
    }

    const getDefaultImg = (x:any) => {
        x.target.src = "https://tse3.explicit.bing.net/th?id=OIP.ruat7whad9-kcI8_1KH_tQHaGI&pid=Api&P=0&w=197&h=163"
    }

    const setBidderImg = (x:any) => {
        return (<img src={"http://localhost:4941/api/v1/users/" + x.bidderId + "/image"} alt={""} width="25px" height="25px" onError={getDefaultImg} style={{margin:"5px"}}/>)
    }

    const setAuctionImg = (x:any) => {
        return (<img src={"http://localhost:4941/api/v1/auctions/" + x.auctionId + "/image"} alt={""} width="25px" height="25px" onError={getDefaultImg} style={{margin:"5px"}}/>)
    }

    const setBidderButton = () => {
        if (auction.highestBid !== null) {
            return (<span><Button variant="contained" endIcon={<ListAltIcon/>} type="button" className="btn btn-primary"
                                  data-toggle="modal" data-target="#bidderModal">
                Bidder List
            </Button>
            <div className="modal fade" id="bidderModal" tabIndex={-1}
                 role="dialog"
                 aria-labelledby="bidderModalLabel" aria-hidden="true">
                <div className="modal-dialog" role="textbox">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="bidderModalLabel">Bidder List</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th scope="col">profile image</th>
                                        <th scope="col">user id</th>
                                        <th scope="col">username</th>
                                        <th scope="col">amount</th>
                                        <th scope="col">timestamp</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {list_of_bidders()}
                                </tbody>
                            </table>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary"
                                    data-dismiss="modal">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div></span>)
        } else {
            return (<span><Button variant="contained" endIcon={<ListAltIcon/>} type="button" className="btn btn-primary"
                                  data-toggle="modal" data-target="#bidderModal" disabled>
                Bidder List
            </Button></span>)
        }
    }

    const checkDate = (x:any) => {
        return new Date(x.endDate).toLocaleString()
    }

    const user_rows = () => {
        return (
            <div>
                <TableRow>
                    <TableCell align="left" style={{fontStyle: "bold", fontSize: "18px"}}>
                        Title:
                    </TableCell>
                    <TableCell align="left" width="1000px">{auction.title}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell align="left" style={{fontStyle: "bold", fontSize: "18px"}}>
                        Description:
                    </TableCell>
                    <TableCell align="left" width="1000px">{auction.description}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell align="left" style={{fontStyle: "bold", fontSize: "18px"}}>
                        Category:
                    </TableCell>
                    <TableCell align="left" width="1000px">{categories.filter(function checkCate(id:any) {
                        return id.categoryId === auction.categoryId
                    }).map((x:category) => x.name)}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell align="left" style={{fontStyle: "bold", fontSize: "18px"}}>
                        End date:
                    </TableCell>
                    <TableCell align="left" width="1000px">{checkDate(auction)}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell align="left" style={{fontStyle: "bold", fontSize: "18px"}}>
                        Seller name:
                    </TableCell>
                    <TableCell align="left" width="1000px"> {auction.sellerFirstName} {auction.sellerLastName} <img src={"http://localhost:4941/api/v1/users/" + auction.sellerId + "/image"} alt={""} width="25px" height="25px" onError={getDefaultImg} style={{margin:"5px"}}/></TableCell>
                </TableRow>
                <TableRow>
                    <TableCell align="left" style={{fontStyle: "bold", fontSize: "18px"}}>
                        Highest bid:
                    </TableCell>
                    <TableCell align="left" width="1000px">{auction.highestBid === null? "None ":auction.highestBid + "$ from " + bidder.filter(function checkBidder(id:any) {
                        return id.amount === auction.highestBid
                    }).map((x:bid) => x.firstName + " " + x.lastName) + " "} {setBidderButton()}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell align="left" style={{fontStyle: "bold", fontSize: "18px"}}>
                        Number of bids:
                    </TableCell>
                    <TableCell align="left" width="1000px">{auction.numBids === 0? 0:auction.numBids}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell align="left" style={{fontStyle: "bold", fontSize: "18px"}}>
                        Reserve:
                    </TableCell>
                    <TableCell align="left" width="1000px">{auction.reserve === null? 0:auction.reserve + "$"}</TableCell>
                </TableRow>
            </div>
        )
    }

    const list_of_bidders = () => {
        return bidder.map((item: bid) =>
            <tr>
                <th scope="row">{setBidderImg(item)}</th>
                <td>{item.bidderId}</td>
                <td>{item.firstName} {item.lastName}</td>
                <td>{item.amount}</td>
                <td>{new Date(item.timestamp).toLocaleString()}</td>
            </tr>
        )
    }

    const getAuctions = () => {
        axios.get('http://localhost:4941/api/v1/auctions')
            .then((response) => {
                setErrorFlag(false)
                setErrorMessage("")
                setAuctions(response.data.auctions)
            }, (error) => {
                setErrorFlag(true)
                setErrorMessage(error.toString())
            })
    }

    const getSim = () => {
        return auctionList.filter(function checkSim(id:any) {
            // return (id.sellerId === auction.sellerId || id.categoryId === auction.categoryId) && id.auctionId !== auction.auctionId
            return id.categoryId === auction.categoryId && id.auctionId !== auction.auctionId
        }).map((x:auction) =>
            <tr style={{fontSize:"10px"}}>
                <th scope="row" style={{padding:"5px"}}>{setAuctionImg(x)}</th>
                <td>{x.auctionId}</td>
                <td>{x.sellerFirstName} {x.sellerLastName}</td>
                <td>{categories.filter(function checkCate(id:any) {
                    return id.categoryId === x.categoryId
                }).map((y:category) => y.name)}</td>
                <td>{new Date(x.endDate).toLocaleString()}</td>
                <td>{x.reserve + "$"}</td>
                <td><Button variant="contained" type="button" className="btn btn-secondary" data-dismiss="modal" background-colour="#1976d2"
                            onClick={() => navigate("/auctions/" + x.auctionId)}>
                    View
                </Button></td>
            </tr>
        )
    }

    const setSimilarButton = () => {
        if ((auctionList.filter(function checkSim(id:any) {
            return (id.sellerId === auction.sellerId || id.categoryId === auction.categoryId) && id.auctionId !== auction.auctionId
        })).length !== 0){
            return (<span><Button variant="contained" endIcon={<ListAltIcon/>} type="button" className="btn btn-primary"
                                  data-toggle="modal" data-target="#similarModal">
                Similar Auctions
            </Button>
            <div className="modal fade" id="similarModal" tabIndex={-1}
                 role="dialog"
                 aria-labelledby="similarModalLabel" aria-hidden="true">
                <div className="modal-dialog" role="textbox">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="similarModalLabel">Similar Auctions</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <table className="table">
                                <thead style={{fontSize:"10px", padding:"0px"}}>
                                    <tr>
                                        <th scope="col" style={{padding:"5px"}}>auction image</th>
                                        <th scope="col" style={{padding:"5px"}}>auction id</th>
                                        <th scope="col" style={{padding:"5px"}}>seller name</th>
                                        <th scope="col" style={{padding:"5px"}}>category</th>
                                        <th scope="col" style={{padding:"5px"}}>end date</th>
                                        <th scope="col" style={{padding:"5px"}}>reserve</th>
                                        <th scope="col" style={{padding:"5px"}}>link</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {getSim()}
                                </tbody>
                            </table>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary"
                                    data-dismiss="modal">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div></span>)
        } else {
            return (<span><Button variant="contained" endIcon={<ListAltIcon/>} type="button" className="btn btn-primary"
                                  data-toggle="modal" data-target="#similarModal" disabled>
                Similar Auctions
            </Button>
            </span>)
        }
    }

    const getBidder = () => {
        axios.get('http://localhost:4941/api/v1/auctions/' + id + '/bids')
            .then((response) => {
                setErrorFlag(false)
                setErrorMessage("")
                setBidder(response.data)
                navigate('/auctions/' + id)
            }, (error) => {
                setErrorFlag(true)
                setErrorMessage(error.toString())
            })
    }

    const getAuction = () => {
        axios.get('http://localhost:4941/api/v1/auctions/'+id)
            .then((response) => {
                setErrorFlag(false)
                setErrorMessage("")
                setAuction(response.data)
            }, (error) => {
                setErrorFlag(true)
                setErrorMessage(error.toString)
            })
    }
    React.useEffect(() => {

        getAuctions()
        getAuction()
        getBidder()
        getCate()
    }, [id])



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
                    <h3 style={{margin:"5px", marginBottom:"20px", color:"white"}}> {auction.title + "'s detail"} </h3>
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
                    {setSimilarButton()}
                </Stack>
                <Stack direction="row" spacing={110} justifyContent="right">
                    {setUserBidButton()}</Stack>
                <img src={"http://localhost:4941/api/v1/auctions/" + auction.auctionId + "/image"} alt={""} width="auto" height="300px"/>
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
            </Paper>
            </div>
        )
    }
}
export default Auction;