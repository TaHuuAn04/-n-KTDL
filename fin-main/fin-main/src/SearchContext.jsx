import { useState, createContext, useContext } from "react";
import React from 'react';

const SearchContext = createContext();
export const SearchProvider = ({children}) =>{
    const [searchItem, setSearchItem] = useState('');

    return (
        <SearchContext.Provider value={{searchItem, setSearchItem}} >
            {children}
        </SearchContext.Provider>
    )
}

export const useSearch = () => useContext(SearchContext);