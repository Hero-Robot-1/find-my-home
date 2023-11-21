import * as React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import IconButton from '@mui/material/IconButton';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import {styled} from '@mui/material/styles'
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';
import FindInPageIcon from '@mui/icons-material/FindInPage';

const Item = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(1),
}));
const PropertyCard = ({ item }) => {
    return (
        <Card sx={{ maxWidth: 345, maxHeight: 400}}>
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
                    <FavoriteIcon />
                </IconButton>
                <IconButton aria-label="share">
                    <ShareIcon />
                </IconButton>
                <IconButton aria-label="clean">
                    <CleaningServicesIcon />
                </IconButton>
            </CardActions>
        </Card>
    );
}

export default PropertyCard;