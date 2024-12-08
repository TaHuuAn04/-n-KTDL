// Filter.js
import React from 'react';

function Filter() {
    return (
        <div className="filter">
            <label htmlFor="loai">Loại:</label>
            <select id="loai">
                <option value="">Tất cả</option>
                {/* ... các option khác */}
            </select>

            <label htmlFor="nhacungcap">Nhà cung cấp:</label>
            <select id="cungcap">
                {/* ... các option khác */}
            </select>

            <label htmlFor="sapxep">Sắp xếp</label>
            <select id="sapxep">
                <option value="">Tất cả</option>
                {/* ... các option khác */}
            </select>
            {/* ... các bộ lọc khác */}
        </div>
    );
}

export default Filter;