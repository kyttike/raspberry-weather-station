import React from 'react';

const ToggleButton = ({
  isActive = false,
  onClick,
  children,
}: {
  isActive?: boolean;
  children: React.ReactNode;
  onClick: any;
}) => {
  return (
    <button onClick={onClick} className={`hover:text-blue-600 px-4 py-1 rounded-md ${isActive ? 'bg-white shadow-md' : 'text-gray-700'}`}>
      {children}
    </button>
  );
};

export default ToggleButton;
