import React from 'react';

const Avatar = ({ name }) => {
  const getInitials = (name) => {
    if (!name) return '';
    const initials = name
      .split(' ')
      .map(part => part.charAt(0).toUpperCase())
      .join('');
    return initials;
  };

  return (
    <div className="w-10 h-10 flex items-center justify-center bg-gray-500 text-white rounded-full">
      {getInitials(name)}
    </div>
  );
};

export default Avatar;
