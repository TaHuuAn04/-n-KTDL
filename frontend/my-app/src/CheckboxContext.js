import React, { createContext, useState, useContext } from "react";

// Tạo context để quản lý các checkbox
const CheckboxContext = createContext();

// Tạo custom hook để sử dụng context này
export const useCheckboxContext = () => {
    return useContext(CheckboxContext);
};

export const CheckboxProvider = ({ children }) => {
    // Sử dụng mảng để lưu các category được chọn
    const [filters, setFilters] = useState({
        kurta: false,
        dress: false,
        blouse: false,
        pants: false,
        top: false,
    });

    // Hàm để thay đổi trạng thái của checkbox
    const toggleFilter = (category) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            [category]: !prevFilters[category],
        }));
    };

    return (
        <CheckboxContext.Provider value={{ filters, toggleFilter }}>
            {children}
        </CheckboxContext.Provider>
    );
};
