import { Carousel } from "react-responsive-carousel";

const ImageCarousel = ({ images }) => {
    if (!images?.length) {
        return (
            <div style={{ height: 200 }} className="flex items-center justify-center bg-muted text-muted-foreground text-sm">
                No images
            </div>
        );
    }

    return (
        <Carousel showThumbs={false} showStatus={false} infiniteLoop useKeyboardArrows>
            {images.map((src, i) => (
                <div key={i} style={{ height: 200, overflow: 'hidden', background: 'hsl(210 40% 96.1%)' }}>
                    <img
                        src={src}
                        alt=""
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                </div>
            ))}
        </Carousel>
    );
};

export default ImageCarousel;
