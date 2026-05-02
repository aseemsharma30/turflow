import React, { useContext, useState } from 'react';
import { FiSearch, FiX } from 'react-icons/fi';
import { VenueContext } from '../context/VenueContext';
import './SearchBar.css';

function SearchBar() {
  const { setSearchQuery } = useContext(VenueContext);
  const [value, setValue] = useState('');

  const handleChange = (e) => {
    setValue(e.target.value);
    setSearchQuery(e.target.value);
  };

  const handleClear = () => {
    setValue('');
    setSearchQuery('');
  };

  return (
    <div className="search-bar-container">
      <div className="search-bar">
        <FiSearch className="search-icon" />
        <input
          type="text"
          placeholder="Search turf name..."
          className="search-input"
          value={value}
          onChange={handleChange}
        />
        {value && (
          <button className="search-clear" onClick={handleClear} aria-label="Clear search">
            <FiX />
          </button>
        )}
      </div>
    </div>
  );
}

export default SearchBar;