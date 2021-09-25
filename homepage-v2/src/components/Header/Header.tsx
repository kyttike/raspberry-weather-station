import React from 'react';
import { getSunrise, getSunset } from 'sunrise-sunset-js';
import {
  Moon,
  Hemisphere,
  LunarPhase,
  // @ts-ignore
} from 'lunarphase-js/dist/lunarphase-js.esm';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';

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
    case LunarPhase.WAXING_CRESCENT:
      return 'Noorkuu';
    case LunarPhase.FIRST_QUARTER:
      return 'Poolkuu esimene veerand';
    case LunarPhase.WAXING_GIBBOUS:
      return 'Kasvav kuu';
    case LunarPhase.FULL:
      return 'Täiskuu';
    case LunarPhase.WANING_GIBBOUS:
      return 'Kahanev kuu';
    case LunarPhase.LAST_QUARTER:
      return 'Poolkuu viimane veerand';
    case LunarPhase.WANING_CRESCENT:
      return 'Vanakuu';
  }
};

const Header = () => {
  const sunrise = getSunrise(coordinates[0], coordinates[1]);
  const sunset = getSunset(coordinates[0], coordinates[1]);
  return (
    <>
      <header className="bg-white">
        <div className="container mx-auto flex justify-between items-center py-4 px-2 ">
          <div className="text-center">
            <h1 className="text-3xl font-medium">Värska</h1>
            <p>{dateFormatter.format(Date.now())}</p>
          </div>

          <div>
            <div className="md:flex items-center">
              <span className="flex items-center md:mr-4">
                <p className="flex items-center text-lg">
                  {numberPadder(sunrise.getHours())}:
                  {numberPadder(sunrise.getMinutes())}
                </p>
                <FontAwesomeIcon className={'text-3xl mx-2'} icon={faSun} />
                <p className="flex items-center text-lg">
                  {numberPadder(sunset.getHours())}:
                  {numberPadder(sunset.getMinutes())}
                </p>
              </span>
              <p className="flex items-center">
                <span className="mr-2">
                  <FontAwesomeIcon className={'text-3xl'} icon={faMoon} />
                </span>{' '}
                {lunarPhaseTranslations(Moon.lunarPhase())}
              </p>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
