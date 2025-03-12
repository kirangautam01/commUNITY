import React from 'react';
import MainLogin from './components/MainLogin';

function Home() {
  return (
    <div className="flex justify-center items-center h-screen bg-primaryBlue text-sky-500 text-4xl font-bold">
      <MainLogin/>
    </div>
  );
}

export default Home;
