import React from 'react';
import { FiSearch } from 'react-icons/fi';
import './SearchBar.css';

function SearchBar() {
  return (
    <div className="search-bar-container">
      <div className="search-bar">
        <FiSearch className="search-icon" />
        <input
          type="text"
          placeholder="Search turf name..."
          className="search-input"
        />
      </div>
    </div>
  );
}

export default SearchBar;

