import React from 'react';
import Header from './components/Header/Header';
import Overview from './components/Overview/Overview';
import CarouselWrapper from './components/CarouselWrapper/CarouselWrapper';

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
