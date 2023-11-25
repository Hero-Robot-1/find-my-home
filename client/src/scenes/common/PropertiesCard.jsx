import * as React from 'react';
import { useState } from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import IconButton from '@mui/material/IconButton';
import FavoriteIcon from '@mui/icons-material/Favorite';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles'
import FindInPageIcon from '@mui/icons-material/FindInPage';
import axios from "axios";
import { serverUrl } from "../../index";
import ClearIcon from '@mui/icons-material/Clear';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import ImageCarousel from "./Carousel";
import { CardActionArea } from "@mui/material";
import "./Card.scss";
import RestoreIcon from '@mui/icons-material/Restore';
import CallIcon from '@mui/icons-material/Call';
import ExploreIcon from "@mui/icons-material/Explore";


const Item = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(1),
}));
const PropertyCard = ({ mode, item, onDeleteHandler }) => {
    console.log("@@@@ mode " + mode)
    const [id, setId] = useState(item.propertyId);
    const [liked, setLiked] = useState(item.liked);
    const [call, setCall] = useState(item.call);
    const [explore, setExplore] = useState(item.call);
    const [archived, setArchived] = useState(item.archived);
    const [merchant, setMerchant] = useState(item.merchant);

    const updateLiked = () => {
        onDeleteHandler(id)
        setLiked(true)
        axios.patch(`${ serverUrl() }/properties/${ id }`, {
            fields: ['liked'],
            data: {
                liked: true
            }
        });
    }

    const updateArchived = () => {
        onDeleteHandler(id)
        setArchived(true)
        axios.patch(`${ serverUrl() }/properties/${ id }`, {
            fields: ['archived'],
            data: {
                archived: true
            }
        });
    }

    const updateUnArchive = () => {
        onDeleteHandler(id)
        setArchived(false)
        axios.patch(`${ serverUrl() }/properties/${ id }`, {
            fields: ['archived', 'liked', 'call', 'explore'],
            data: {
                archived: false,
                liked: false,
                call: false,
                explore: false
            }
        });
    }

    const updateShouldCall = () => {
        onDeleteHandler(id)
        setCall(true)
        axios.patch(`${ serverUrl() }/properties/${ id }`, {
            fields: ['call'],
            data: {
                call: true
            }
        });
    }

    const updateExplore = () => {
        onDeleteHandler(id)
        setExplore(true)
        axios.patch(`${ serverUrl() }/properties/${ id }`, {
            fields: ['explore'],
            data: {
                explore: true
            }
        });
    }

    const renderActions = () => {
        if (mode === 'trash') {  //trash
            return ((<IconButton aria-label="unarchive">
                <RestoreIcon onClick={ updateUnArchive }/>
            </IconButton>))  //trash
        } else if (mode === 'new') {  //new
            return (<React.Fragment>
                <IconButton aria-label="add to favorites">
                    <FavoriteIcon style={ { color: 'red' } } onClick={ () => {
                        updateLiked(!liked)
                    } }/>
                </IconButton>
                <IconButton aria-label="archive">
                    <ClearIcon style={ { color: 'black'} }
                               onClick={ updateArchived }/>
                </IconButton>
            </React.Fragment>)
        } else if (mode === 'liked') { //liked
            return (<React.Fragment>
                <IconButton aria-label="reach out">
                    <CallIcon style={ { color: 'blue' } } onClick={ () => {
                        updateShouldCall()
                    } }/>
                </IconButton>
                <IconButton aria-label="archive">
                    <ClearIcon style={ { color: 'black' } }
                               onClick={ updateArchived }/>
                </IconButton>
            </React.Fragment>)
        } else if (mode === 'explore') { //liked
            return (<React.Fragment>
                <IconButton aria-label="archive">
                    <ClearIcon style={ { color: 'black' } }
                               onClick={ updateArchived }/>
                </IconButton>
            </React.Fragment>)
        } else {
            return (<React.Fragment>
                <IconButton aria-label="explore">
                    <ExploreIcon style={ { color: 'green' } } onClick={ () => {
                        updateExplore()
                    } }/>
                </IconButton>
                <IconButton aria-label="archive">
                    <ClearIcon style={ { color: 'black' } }
                               onClick={ updateArchived }/>
                </IconButton>
            </React.Fragment>)
        }
    }

    return (
        <Card className={ merchant ? 'merchant-card' : 'non-merchant-card' }>

            <CardHeader className="card-header"
                        title={ item.title }
                        subheader={ item.price }
                        action={
                            <IconButton className="card-header-action" onClick={ () => {
                                window.open(item.link, "_blank")
                            } }>
                                <FindInPageIcon xlinkHref={ item.link }/>
                            </IconButton>
                        }
            />
            <CardMedia>
                <ImageCarousel images={ item.images }/>
            </CardMedia>

            <CardContent className="card-stack">
                <Stack
                    direction="row-reverse" spacing={ 2 }>
                    <Item>
                        { item.rooms }
                    </Item>
                    <Item>
                        { item.meters }
                    </Item>
                    <Item>
                        { item.floorNumber }
                    </Item>
                </Stack>
            </CardContent>

            <CardActionArea className="card-action-area" disableRipple={ true } high>
                <CardActions disableSpacing>
                    {renderActions()}
                </CardActions>
            </CardActionArea>
        </Card>
    );
}

export default PropertyCard;