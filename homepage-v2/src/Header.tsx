import React from 'react';
import { getSunrise, getSunset } from 'sunrise-sunset-js';
// @ts-ignore
import { Moon, Hemisphere } from 'lunarphase-js/dist/lunarphase-js.esm';

const coordinates = [57.9547156, 27.6021553];
const dateFormatter = new Intl.DateTimeFormat('et-EE', {
  month: 'long',
  day: 'numeric',
});
const numberPadder = (inputNumber: number) =>
  inputNumber < 10 ? `0${inputNumber}` : String(inputNumber);

const Header = () => {
  const sunrise = getSunrise(coordinates[0], coordinates[1]);
  const sunset = getSunset(coordinates[0], coordinates[1]);
  return (
    <header className="bg-white">
      <div className="container mx-auto">
        <h1 className="text-3xl font-medium">Värska</h1>
        <p>{dateFormatter.format(Date.now())}</p>
        <p>
          Päikesetõus: {numberPadder(sunrise.getHours())}:
          {numberPadder(sunrise.getMinutes())}
        </p>
        <p>
          Päikeseloojang: {numberPadder(sunset.getHours())}:
          {numberPadder(sunset.getMinutes())}
        </p>
        <p>{Moon.lunarPhaseEmoji(new Date() , Hemisphere.NORTHERN)}</p>
      </div>
    </header>
  );
};

export default Header;
