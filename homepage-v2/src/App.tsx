import React from 'react';
import Header from './components/Header/Header';
import Overview from './components/Overview/Overview';

function App() {
  return (
    <>
      <Header />
      <main>
        <div className="container mx-auto">
          <Overview />
        </div>
      </main>
    </>
  );
}

export default App;
