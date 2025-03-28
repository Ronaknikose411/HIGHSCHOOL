import React from "react";

const SearchBar = ({ value, onChange, onSearch, placeholder }) => {
    return (
        <div className="input-group mb-3">
            <input
                type="text"
                className="form-control"
                value={value}
                onChange={onChange}
                placeholder={placeholder || "Search..."}
            />
            <button className="btn btn-primary" onClick={onSearch}>Search</button>
        </div>
    );
};

export default SearchBar;