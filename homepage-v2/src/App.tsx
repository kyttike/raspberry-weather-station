import React from 'react';
import Header from './components/Header/Header';
import Overview from './components/Overview/Overview';
import CarouselWrapper from './components/CarouselWrapper/CarouselWrapper';
import Highcharts from 'highcharts';

Highcharts.setOptions({
  lang: {
    weekdays: [
      'Pühapäev',
      'Esmaspäev',
      'Teisipäev',
      'Kolmapäev',
      'Neljapäev',
      'Reede',
      'Laupäev',
    ],
    months: [
      'jaanuar',
      'veebruar',
      'märts',
      'aprill',
      'mai',
      'juuni',
      'juuli',
      'august',
      'september',
      'oktoober',
      'november',
      'detsember',
    ],
  },
})

function App() {
  return (
    <>
      <Header />
      <main className="relative">
        <div className="bg-gradient-to-b absolute from-blue-100 to-transparent py-32 w-full" />
        <div className="container mx-auto isolate pt-8">
          <Overview />
          <CarouselWrapper />
        </div>
      </main>
    </>
  );
}

export default App;
