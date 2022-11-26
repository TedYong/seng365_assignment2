import React from "react";
import axios from 'axios';
import CSS from 'csstype';
import {Link, useNavigate} from "react-router-dom";
import ArticleIcon from '@mui/icons-material/Article'
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
    Stack, AlertTitle, Alert, Snackbar, CardContent, CardMedia, Typography, IconButton, CardActions, Pagination
} from "@mui/material";
import {Delete, Edit, Search} from "@mui/icons-material";
import SearchAppBar from "./Navibar";
import SearchIcon from "@mui/icons-material/Search";
import {styled} from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import ResponsiveAppBar from "./Navibar";


const Auctions = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = React.useState<Array<category>>([])
    const [auctions, setAuctions] = React.useState<Array<auction>>([])
    const [count]=React.useState(10)
    const [startindex, setStartIndex]= React.useState(0)
    const [totalpage, setTotalPage] = React.useState(0)
    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")
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

    const userCardStyles: CSS.Properties = {
        display: "inline-block",
        height: "420px",
        width: "300px",
        margin: "5px",
        padding: "0px",
    }

    const card: CSS.Properties = {
        padding: "10px",
        margin: "50px"
    }

    React.useEffect(() => {
        getAuctions()
        getCate()
    }, [count, startindex, totalpage])

    const getPage = (event: React.ChangeEvent<unknown>, value: number) => {
        setStartIndex((value*count)-count)
        getAuctions()
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

    const checkDate = (x:any) => {
        if (Math.floor((new Date(x.endDate).getTime() - new Date().getTime()) / (86400 * 1000)) < 0) {
            return ("Auction closed")
        } else {
            return ("Close in: " + Math.floor((new Date(x.endDate).getTime() - new Date().getTime())/(86400 * 1000)) + ' day ' + Math.floor(24 - new Date().getHours()) + " hour")
        }
    }

    const checkBid = (x:any) => {
        if (x.highestBid === null) {
            return (0 + " NZD")
        } else {
            return (x.highestBid + " NZD")
        }
    }

    const checkReserve = (x:any) => {
        if (x.highestBid >= x.reserve) {
            return (<span style={{display: "inline-block", fontStyle:"italic" ,fontSize:"12px", color:"green", textAlign:"right"}}>{"reserve reached"}</span>)
        } else {
            return (<span style={{display: "inline-block", fontStyle:"italic" ,fontSize:"12px", color:"red", textAlign:"right"}}>{"reserve not reached"}</span>)
        }
    }

    const getDefaultImg = (x:any) => {
        x.target.src = "https://tse3.explicit.bing.net/th?id=OIP.ruat7whad9-kcI8_1KH_tQHaGI&pid=Api&P=0&w=197&h=163"
    }

    const getAuctions = () => {
        axios.get('http://localhost:4941/api/v1/auctions?count=' + count + "&startIndex=" + startindex)
        .then((response) => {
            setErrorFlag(false)
            setErrorMessage("")
            setAuctions(response.data.auctions)
            setTotalPage(Math.round(response.data.count/count))
        }, (error) => {
            setErrorFlag(true)
            setErrorMessage(error.toString())
        })
    }

    const auction_rows = () => {
        return auctions.map((row: auction) =>
            <Card sx={userCardStyles}>
                <CardMedia
                    component="img"
                    height="200px"
                    width="100px"
                    sx={{objectFit:"fill"}}
                    image={"http://localhost:4941/api/v1/auctions/" + row.auctionId + "/image"}
                    alt="User hero image"
                />
                <CardContent>
                    <div style={{display:"inline-block",
                        float:"left",
                        width: "280px",
                        textAlign:"left"}}>
                        <div style={{display:"inline-block", width: "290px"}}><h6 style={{fontSize: "16px"}}>{row.title}</h6></div>
                        <div style={{display:"inline-block", fontSize: "14px"}}>{checkDate(row)}</div>
                        <div style={{fontSize: "14px"}}> Category: {categories.filter(function checkCate(id:any) {
                            return id.categoryId === row.categoryId
                        }).map((x:category) => x.name)}</div>
                        <div style={{fontSize:"14px"}}> <img src={"http://localhost:4941/api/v1/users/" + row.sellerId + "/image"} alt={""} width="25px" height="25px" onError={getDefaultImg} style={{margin:"5px"}}/>
                         {row.sellerFirstName} {row.sellerLastName}</div>
                        <span style={{fontSize:"16px", float: "left", width: '160px'}}>Amount: {checkBid(row)}</span>
                        {checkReserve(row)}</div>
                        <div>
                            <Button variant="contained" endIcon={<ArticleIcon/>} onClick={() => navigate("/auctions/" + row.auctionId)} style={{margin:"10px"}}>
                                View
                            </Button>
                        </div>
                </CardContent>
            </Card>
        )
    }
 if(errorFlag) {
  return (
      <div>
       <h1>Users</h1>
       <div style={{color:"red"}}>
        {errorMessage}
       </div>
      </div>
  )
 } else {
  return (
      <div>
          <div>
            {<ResponsiveAppBar/>}
          </div>
          <Stack direction="row" spacing={60} justifyContent="center" style={{background:"blue", marginBottom:"40px"}}>
              <h3 style={{margin:"5px", marginBottom:"20px", color:"white"}}> Auctions </h3>
          </Stack>
          <Paper elevation={3} style={card}>
              <div style={{display:"inline-block", maxWidth:"965px",
                  minWidth:"320"}}>
                  {errorFlag?
                      <Alert severity="error">
                          <AlertTitle>Error</AlertTitle>
                          {errorMessage}
                      </Alert>
                      :""}
                  {auction_rows()}
              </div>
              <Stack direction="row" spacing={2} justifyContent="center">
              <Typography>Page: {(startindex/count)+1}</Typography>
              <Pagination count={totalpage} onChange={getPage}/></Stack>
          </Paper>
      </div>
  )
 }
}
export default Auctions;