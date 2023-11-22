import * as React from 'react';
import {useState} from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import IconButton from '@mui/material/IconButton';
import FavoriteIcon from '@mui/icons-material/Favorite';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import {styled} from '@mui/material/styles'
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';
import FindInPageIcon from '@mui/icons-material/FindInPage';
import axios from "axios";
import {serverUrl} from "../../index";

const Item = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(1),
}));
const PropertyCard = ({ item }) => {
    const [id, setId] = useState(item.propertyId);
    const [liked, setLiked] = useState(item.liked);
    const [archived, setArchived] = useState(item.archived);
    const [merchant, setMerchant] = useState(item.merchant);
    const updateArchived = () => {
        setArchived(true)
        axios.patch(`${serverUrl()}/properties/${id}`, {
            fields: ['archived'],
            data: {
                archived: true
            }
        });
    }

    const updateLiked = (status) => {
        setLiked(status)
        axios.patch(`${serverUrl()}/properties/${id}`, {
            fields: ['liked'],
            data: {
                liked: status
            }
        });
    }

    return (
        <Card sx={{ maxWidth: 345, maxHeight: 400}} style={{ backgroundColor: merchant? 'lightyellow': 'lightblue'}}>
            <CardHeader
                action={
                    <IconButton aria-label="settings" onClick={() => { window.open(item.link, "_blank") }}>
                        <FindInPageIcon xlinkHref={item.link}/>
                    </IconButton>
                }
                title={item.title}
                subheader={item.price}
                style={{ textAlign: "right" }}
            />
            <CardMedia
                component="img"
                sx={{ maxWidth: 345, maxHeight: 150}}
                image={item.primaryImage}
                alt={item.title}
            />
            <CardContent
                sx={{ maxWidth: 345, maxHeight: 60}}
            >
                <Stack
                    direction="row-reverse" spacing={3}>
                    <Item>
                        {item.rooms}
                    </Item>
                    <Item>
                        {item.meters}
                    </Item>
                    <Item>
                        {item.floorNumber}
                    </Item>
                </Stack>
            </CardContent>
            <CardActions disableSpacing>
                <IconButton aria-label="add to favorites">
                    <FavoriteIcon style={{color: liked? 'red': 'black'}} onClick={() => {updateLiked(!liked)}}/>
                </IconButton>
                {/*<IconButton aria-label="share">*/}
                {/*    <ShareIcon />*/}
                {/*</IconButton>*/}
                <IconButton aria-label="clean">
                    <CleaningServicesIcon style={{color: archived? 'black': 'green'}} onClick={updateArchived}/>
                </IconButton>
            </CardActions>
        </Card>
    );
}

export default PropertyCard;