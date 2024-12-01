// Filter.js
import React from 'react';
function Filter(props) {
    const handleLoaiChange = (event) => {
        props.onLoaiChange(event.target.value); // Gọi hàm onLoaiChange từ props và truyền giá trị
    };

    const handleNhaCungCapChange = (event) => {
        props.onNhaCungCapChange(event.target.value); // Gọi hàm onNhaCungCapChange từ props và truyền giá trị
    };

    const handleSapXepChange = (event) => {
        props.onSapXepChange(event.target.value); // Gọi hàm onSapXepChange từ props và truyền giá trị
    };
    return (
        <div className="filter">
            <label htmlFor="loai">Loại:</label>
            <select id="loai" onChange={handleLoaiChange}>
                <option value="">Tất cả</option>
                <option value="AN : LEGGINGS">AN : LEGGINGS</option>
                <option value="BLOUSE">BLOUSE</option>
                <option value="BOTTOM">BOTTOM</option>
                <option value="CARDIGAN">CARDIGAN</option>
                <option value="CROP TOP">CROP TOP</option>
                <option value="CROP TOP WITH PLAZZO">CROP TOP WITH PLAZZO</option>
                <option value="DRESS">DRESS</option>
                <option value="JUMPSUIT">JUMPSUIT</option>
                <option value="KURTA">KURTA</option>
                <option value="KURTA SET">KURTA SET</option>
                <option value="KURTI">KURTI</option>
                <option value="LEHENGA CHOLI">LEHENGA CHOLI</option>
                <option value="NIGHT WEAR">NIGHT WEAR</option>
                <option value="PANT">PANT</option>
                <option value="PLAZZO">PLAZZO</option>
                <option value="SAREE">SAREE</option>
                <option value="SET">SET</option>
                <option value="SHARARA">SHARARA</option>
                <option value="SKIRT">SKIRT</option>
                <option value="TOP">TOP</option>
                <option value="TUNIC">TUNIC</option>
            </select>

            <label htmlFor="nhacungcap">Nhà cung cấp:</label>
            <select id="nhacungcap" onChange={handleNhaCungCapChange}>
                <option value="">Tất cả</option>
                <option value="1">Nhà cung cấp A</option>
                <option value="2">Nhà cung cấp B</option>
                <option value="3">Nhà cung cấp C</option>
                <option value="4">Nhà cung cấp D</option>
                <option value="5">Nhà cung cấp E</option>
            </select>

            <label htmlFor="sapxep">Sắp xếp</label>
            <select id="sapxep" onChange={handleSapXepChange}>
                <option value="">Tất cả</option>
                <option value="price_asc">Giá: Tăng dần</option>
                <option value="price_desc">Giá: Giảm dần</option>
                <option value="date_asc">Mới nhất</option>
                <option value="date_desc">Cũ nhất</option>
                {/* ... các option khác */}
            </select>
            {/* ... các bộ lọc khác */}
        </div>
    );
}

export default Filter;