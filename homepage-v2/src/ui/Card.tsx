import React from 'react';

const Card = ({ children }: { children: React.ReactNode}) => {
  return <div className="bg-white p-4 mb-4 rounded shadow">{children}</div>;
};

export default Card;
