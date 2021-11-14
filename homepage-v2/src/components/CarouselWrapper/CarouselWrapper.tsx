import 'react-responsive-carousel/lib/styles/carousel.min.css';

import { Carousel } from 'react-responsive-carousel';
import React, { useEffect, useState } from 'react';
import { getApiUrl } from '../../utils';

const CarouselWrapper = () => {
  const [pictures, setPictures] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const apiResult: string[] = await fetch(getApiUrl('api/pictures')).then(
        (res) => res.json(),
      );
      console.log(apiResult);
      setPictures(
        apiResult.filter((pictureUrl) => pictureUrl.indexOf('.html') === -1),
      );
    };
    fetchData();
  }, []);

  console.log(pictures);
  if (pictures.length === 0) {
    return null;
  }

  if (pictures.length === 1) {
    return (
      <div>
        <img src={getApiUrl(pictures[0])} />
      </div>
    );
  }

  return (
    <Carousel dynamicHeight={true} showThumbs={false} showStatus={false}>
      {pictures.map((picture) => (
        <img key={picture} src={getApiUrl(picture)} />
      ))}
    </Carousel>
  );
};

export default CarouselWrapper;
