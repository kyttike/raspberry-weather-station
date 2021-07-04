import React from 'react';
import Header from './Header';
import Overview from './Overview';

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
