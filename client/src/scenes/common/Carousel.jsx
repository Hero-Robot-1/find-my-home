import { Carousel } from "react-responsive-carousel";
import "./Carousel.scss";

const ImageCarousel = ({ images}) => {
    return (
        <Carousel className="carousel-style"
                  showThumbs={false}>
            { images.map(i => (
                <div>
                    <img
                        src={i}
                        style={{height:215, width:"auto"}}
                    />
                </div>
            )) }
        </Carousel>
    );
}

export default ImageCarousel;
