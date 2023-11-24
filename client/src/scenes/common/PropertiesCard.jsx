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

const Item = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(1),
}));
const PropertyCard = ({ mode, item }) => {
    const [id, setId] = useState(item.propertyId);
    const [liked, setLiked] = useState(item.liked);
    const [archived, setArchived] = useState(item.archived);
    const [merchant, setMerchant] = useState(item.merchant);
    const updateArchived = () => {
        setArchived(true)
        axios.patch(`${ serverUrl() }/properties/${ id }`, {
            fields: ['archived'],
            data: {
                archived: true
            }
        });
    }

    const updateLiked = (status) => {
        setLiked(status)
        axios.patch(`${ serverUrl() }/properties/${ id }`, {
            fields: ['liked'],
            data: {
                liked: status
            }
        });
    }

    const updateUnArchive = () => {
        setArchived(false)
        axios.patch(`${ serverUrl() }/properties/${ id }`, {
            fields: ['archived'],
            data: {
                archived: false
            }
        });
    }

    return (
        <Card className={ merchant ? 'merchant-card' : 'non-merchant-card'}>

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
                    direction="row-reverse" spacing={ 2 } >
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

            <CardActionArea className="card-action-area" disableRipple={true} high>
                <CardActions disableSpacing>
                    { archived === false ?
                        (<React.Fragment>
                            <IconButton aria-label="add to favorites">
                                <FavoriteIcon style={ { color: liked ? 'red' : 'black' } } onClick={ () => {
                                    updateLiked(!liked)
                                } }/>
                            </IconButton>
                            <IconButton aria-label="archive">
                                <ClearIcon style={ { color: archived ? 'black' : 'green' } }
                                           onClick={ updateArchived }/>
                            </IconButton>
                        </React.Fragment>) :
                        (<IconButton aria-label="unarchive">
                            <ClearIcon onClick={ updateUnArchive }/>
                        </IconButton>)
                    }

                </CardActions>
            </CardActionArea>
        </Card>
    );
}

export default PropertyCard;