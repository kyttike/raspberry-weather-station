import React from 'react';
import { getSunrise, getSunset } from 'sunrise-sunset-js';
import {
  Moon,
  Hemisphere,
  LunarPhase,
  // @ts-ignore
} from 'lunarphase-js/dist/lunarphase-js.esm';

const coordinates = [57.9547156, 27.6021553];
const dateFormatter = new Intl.DateTimeFormat('et-EE', {
  month: 'long',
  day: 'numeric',
});

const numberPadder = (inputNumber: number) =>
  inputNumber < 10 ? `0${inputNumber}` : String(inputNumber);

const lunarPhaseTranslations = (lunarPhase: string) => {
  switch (lunarPhase) {
    case LunarPhase.NEW:
      return 'Kuu loomine';
    case LunarPhase.WANING_CRESCENT:
      return 'Noorkuu';
    case LunarPhase.FIRST_QUARTER:
      return 'Poolkuu esimene veerand';
    case LunarPhase.WANING_GIBBOUS:
      return 'Kasvav kuu';
    case LunarPhase.FULL:
      return 'Täiskuu';
    case LunarPhase.WAXING_GIBBOUS:
      return 'Kahanev kuu';
    case LunarPhase.LAST_QUARTER:
      return 'Poolkuu viimane veerand';
    case LunarPhase.WAXING_CRESCENT:
      return 'Vanakuu';
  }
};

const Header = () => {
  const sunrise = getSunrise(coordinates[0], coordinates[1]);
  const sunset = getSunset(coordinates[0], coordinates[1]);
  return (
    <header className="bg-white">
      <div className="container mx-auto flex justify-between items-center">
        <div className='text-center'>
          <h1 className="text-3xl font-medium">Värska</h1>
          <p>{dateFormatter.format(Date.now())}</p>
        </div>

        <div>
          <div className="flex">
            <p className="flex items-center text-lg mr-4">
              <span className="text-4xl mr-2">🌅</span>{' '}
              {numberPadder(sunrise.getHours())}:
              {numberPadder(sunrise.getMinutes())}
            </p>
            <p className="flex items-center text-lg mr-4">
              <span className="text-4xl mr-2">🌇</span>{' '}
              {numberPadder(sunset.getHours())}:
              {numberPadder(sunset.getMinutes())}
            </p>
            <p className="flex items-center">
              <span className="text-4xl mr-2">
                {Moon.lunarPhaseEmoji(new Date(), Hemisphere.NORTHERN)}
              </span>{' '}
              {lunarPhaseTranslations(Moon.lunarPhase())}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
