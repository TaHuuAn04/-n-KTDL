import React, { useState, useEffect } from 'react';
import { Button, Modal, Select } from 'antd'; // Import Select từ antd
import axios from 'axios';
import AddDoctorForm from './AddDoctorForm';
import EditDoctorForm from './EditDoctorForm';
import { jwtDecode } from 'jwt-decode';
import { Link, useNavigate } from 'react-router-dom';
import SimplePagination from '../product-compo/Button_Page';
const { Option } = Select; // Destructure Option từ Select


const DoctorGrid = () => {
  const [searchVal, setSearchVal] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [visible, setVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [editMode, setEditMode] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 9;
  const navigate = useNavigate();
  const [totalEmployees, setEmployees] = useState(0);
  const [selectedBranch, setSelectedBranch] = useState(null); // Thêm state cho selectedBranch
  const [selectedTeam, setSelectedTeam] = useState(null); // Thêm state cho selectedTeam
  const [user, setUser] = useState(null);
  // Danh sách chi nhánh (mock data - bạn nên lấy từ API)
  const branches = [
    { value: '1', label: 'Chi nhánh 1' },
    { value: '2', label: 'Chi nhánh 2' },
    { value: '3', label: 'Chi nhánh 3' },
    { value: '4', label: 'Chi nhánh 4' },
  ];

  // Danh sách team (mock data - bạn nên lấy từ API)
  const teams = [
    { value: 'Client Services', label: 'Client Services' },
    { value: 'Distribution', label: 'Distribution' },
    { value: 'Engineering', label: 'Engineering' },
    { value: 'Finance', label: 'Finance' },
    { value: 'Human Resources', label: 'Human Resources' },
    { value: 'Legal', label: 'Legal' },
    { value: 'Marketing', label: 'Marketing' },
    { value: 'Product', label: 'Product' },
    { value: 'Sales', label: 'Sales' },
  ];
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      setUser(decoded);
      console.log('User:', decoded);
      if (decoded.manage === false) {
        setSelectedTeam(decoded.Team)
      }
      if (decoded.role !== 'admin') {
        setSelectedBranch(decoded.branch);
      }

    }
  }, []);
  // Hàm này bất đồng bộ, khi nào gọi api xong thì mới return
  const getEmployeeInfo = async (employee) => {
    try {
      const response = await axios.get(
          `http://localhost:3000/employee/Information/${employee.User_Code}`
      );
      return {
        id: employee.User_Code,
        First_Name: employee['First_Name'],
        Gender: employee.Gender,
        ['Start Date']: employee.Start_Date,
        Email: employee.Email,
        team: employee.Team,
        branch: employee.branch,
        Team: employee.Team,
        Salary: employee.Salary,
      };
    } catch (error) {
      console.error('Lỗi khi lấy thông tin nhân viên:', error);
      return null;
    }
  };

  const handleBranchChange = (value) => {
    setSelectedBranch(value);
    setCurrentPage(1); // Reset về trang 1 khi thay đổi filter
    setSearchVal('');
  };

  const handleTeamChange = (value) => {
    setSelectedTeam(value);
    setCurrentPage(1); // Reset về trang 1 khi thay đổi filter
    setSearchVal('');
  };

  const handleUpdateSalary = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:3000/employee/UpdateTeamSalary', {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        console.log('Cập nhật lương thành công:', response.data);
        // Hiển thị thông báo thành công
        alert('Cập nhật lương thành công!');
      } else {
        console.error('Lỗi khi cập nhật lương:', response.data);
        // Xử lý lỗi, ví dụ: hiển thị thông báo lỗi cho người dùng
        alert(`Lỗi khi cập nhật lương: ${response.data.message}`);
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật lương:', error);
      // Xử lý lỗi, ví dụ: hiển thị thông báo lỗi cho người dùng
      alert('Lỗi khi cập nhật lương!');
    }
  };

  const handleChange = (event) => {
    setSearchVal(event.target.value);
  };

  const handleSearch = async () => {
    setCurrentPage(1); // Reset về trang 1 khi tìm kiếm

    // Gọi API tìm kiếm khi nhấn nút "Tìm kiếm"
    try {
      const token = localStorage.getItem('token');
      let url = 'http://localhost:3000/employee/Find';
      let params = {
        keywords: searchVal,
      };

      const response = await axios.get(url, {
        params,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data && response.data.employees) {
        const employeesData = response.data.employees;
        const doctorsPromises = employeesData.map(employee => getEmployeeInfo(employee));
        const doctorsData = await Promise.all(doctorsPromises);
        const validDoctorsData = doctorsData.filter(doctor => doctor !== null);

        setDoctors(validDoctorsData);
        setEmployees(response.data.totalEmployees);
        setTotalPages(1); // Khi tìm kiếm, chỉ hiển thị 1 trang kết quả
      } else {
        console.error('Dữ liệu trả về không đúng định dạng:', response.data);
      }
    } catch (error) {
      console.error('Lỗi khi tìm kiếm nhân viên:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        let url = 'http://localhost:3000/employee/SortAndFilter';
        let params = {
          page: currentPage,
          limit: itemsPerPage,
          ...(selectedTeam && { team: selectedTeam }),
          ...(selectedBranch && { branch: selectedBranch }),
        };

        const response = await axios.get(url, {
          params,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data && Array.isArray(response.data.employees)) {
          const employeesData = response.data.employees;
          setEmployees(response.data.totalEmployees);
          const totalPages = Math.ceil(response.data.totalEmployees / itemsPerPage);
          setTotalPages(totalPages);

          const doctorsPromises = employeesData.map(employee => getEmployeeInfo(employee));
          const doctorsData = await Promise.all(doctorsPromises);
          const validDoctorsData = doctorsData.filter(doctor => doctor !== null);
          setDoctors(validDoctorsData);
        } else {
          console.error('Dữ liệu trả về không đúng định dạng:', response.data);
        }
        console.log('response', response.data.employees);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách nhân viên:', error);
      }
    };
    console.log('doctor', doctors);
    fetchData();
  }, [currentPage, selectedBranch, selectedTeam]);


  const handleAddDoctor = async (values) => {
    try {
      // Gọi API để thêm nhân viên
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:3000/employee/Add', values, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 201) {
        // Thêm nhân viên thành công
        console.log('Thêm nhân viên thành công:', response.data);

        // Cập nhật lại danh sách nhân viên (không cần thiết vì đã có useEffect)
        // Gọi lại fetchData() trong useEffect để cập nhật danh sách
        // ...

        setVisible(false); // Đóng modal
        setCurrentPage(1);
      } else {
        console.error('Lỗi khi thêm nhân viên:', response.data);
        // Xử lý lỗi, ví dụ: hiển thị thông báo lỗi cho người dùng
      }
    } catch (error) {
      console.error('Lỗi khi thêm nhân viên:', error);
      // Xử lý lỗi, ví dụ: hiển thị thông báo lỗi cho người dùng
    }
  };

  const showModal = () => {
    console.log("showModal called, visible before:", visible); // Log giá trị visible trước khi set
    setVisible(true);
    console.log("showModal called, visible after:", visible); // Log giá trị visible sau khi set
  };


  const handleOk = () => {
    setVisible(false);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(`Bạn có chắc chắn muốn xóa nhân viên này không?`);
    if (confirmed) {
      try {
        const token = localStorage.getItem('token');
        // Gọi API để xóa nhân viên
        const response = await axios.delete(`http://localhost:3000/employee/Delete/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.status === 200) {
          console.log('Xóa nhân viên thành công:', response.data);

          // Cập nhật lại danh sách nhân viên (không cần thiết vì đã có useEffect)
          // Gọi lại fetchData() trong useEffect để cập nhật danh sách
          // ...

          // Nếu xóa thành công và đang ở trang cuối cùng và không còn nhân viên nào, giảm currentPage đi 1
          if (currentPage === totalPages && doctors.length === 1 && currentPage > 1) {
            setCurrentPage(currentPage - 1);
          }
        } else {
          console.error('Lỗi khi xóa nhân viên:', response.data);
          // Xử lý lỗi, ví dụ: hiển thị thông báo lỗi cho người dùng
        }
      } catch (error) {
        console.error('Lỗi khi xóa nhân viên:', error);
        // Xử lý lỗi, ví dụ: hiển thị thông báo lỗi cho người dùng
      }
    }
  };

  const handleEdit = (doctor) => {
    setSelectedDoctor(doctor);
    setEditMode(true);
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setSelectedDoctor(null);
    handleOk();
    handleCancel();
  };

  const handleSave = async (editedDoctor) => {
    try {
      const employeeId = editedDoctor.id;
      console.log('editedDoctor', editedDoctor);
      const token = localStorage.getItem('token'); // Lấy token từ localStorage
      const response = await axios.put(
          `http://localhost:3000/employee/Update/${employeeId}`,
          editedDoctor,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
      );

      if (response.status === 200) {
        console.log('Cập nhật thông tin nhân viên thành công:', response.data);

        // Cập nhật lại danh sách nhân viên (không cần thiết vì đã có useEffect)
        // Gọi lại fetchData() trong useEffect để cập nhật danh sách
        // ...

        // Đóng modal
        setVisible(false);
        setEditMode(false);
      } else {
        console.error('Lỗi khi cập nhật thông tin nhân viên:', response.data);
        // Xử lý lỗi, ví dụ: hiển thị thông báo lỗi cho người dùng
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật thông tin nhân viên:', error);
      // Xử lý lỗi, ví dụ: hiển thị thông báo lỗi cho người dùng
    }
  };

  const handleViewDetail = (id) => {
    navigate(`/info/${id}`);
  };

  const renderDoctorRows = doctors.map((doctor) => {
    const isCurrentUser = user && doctor.id === user.username;
    return (
      <div
          key={doctor.id}
          onClick={() => handleViewDetail(doctor.id)}
          className="doctor-card"
          style={{backgroundColor: isCurrentUser ? '#FFF8DC' : 'white'}} // Thêm màu nền vàng nhạt
      >
        <h2>{doctor.First_Name}</h2>
        <p>Chi nhánh: {doctor.branch}</p>
        <p>Team: {doctor.Team}</p>
        <p>CODE: {doctor.id}</p>
        <div>
          <button
              className="edit-btn"
              onClick={(e) => {
                e.stopPropagation();
                handleEdit(doctor);
              }}
          >
            Sửa
          </button>
          <button
              className="delete-btn"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(doctor.id);
              }}
          >
            Xoá
          </button>
        </div>
      </div>

  );
    });

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
      <div>
        <div className="doctor-header"
             style={{display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px', marginBottom: '20px'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
            <h1 className="doctor-total">Nhân viên hiện có</h1>
            <div className="total-doctors">{totalEmployees}</div>
          </div>

          {/* Ẩn/Hiện Select chi nhánh dựa vào role */}
          {user && user.role === 'admin' && (
              <Select
                  allowClear
                  showSearch
                  placeholder="Chọn chi nhánh"
                  optionFilterProp="children"
                  onChange={handleBranchChange}
                  value={selectedBranch}
                  style={{width: 200}}
              >
                {branches.map((branch) => (
                    <Option key={branch.value} value={branch.value}>
                      {branch.label}
                    </Option>
                ))}
              </Select>
          )}

          {/* Ẩn/Hiện Select team dựa vào role */}
          {user && user.role === 'admin' && (
              <Select
                  allowClear
                  showSearch
                  placeholder="Chọn team"
                  optionFilterProp="children"
                  onChange={handleTeamChange}
                  value={selectedTeam}
                  style={{width: 200}}
              >
                {teams.map((team) => (
                    <Option key={team.value} value={team.value}>
                      {team.label}
                    </Option>
                ))}
              </Select>
          )}

          <div className="search-bar"
               style={{display: 'flex', alignItems: 'center', gap: '10px', flex: '1', minWidth: '300px'}}>
            <input
                className="search-input"
                type="text"
                placeholder="Tìm kiếm nhân viên..."
                value={searchVal}
                onChange={handleChange}
            />
            <Button type="primary" onClick={handleSearch}>
              Tìm kiếm
            </Button>
          </div>

          {/* Nút thêm nhân viên */}
          {user && (user.role === 'admin' || user.manage) && (
              <Button className="add-button" type="primary" onClick={showModal}>
                Thêm nhân viên
              </Button>
          )}
        </div>

        {/* Modal và các phần tử khác giữ nguyên */}

        {/* Phần hiển thị danh sách nhân viên */}
        <div className="doctor-grid">{renderDoctorRows}</div>

        {/* Nút cập nhật lương và phân trang giữ nguyên */}
        <div className="update-salary-button">
          <Button type="primary" onClick={handleUpdateSalary}>
            Cập nhật lương
          </Button>
        </div>

        <div className="page-number" style={{textAlign: 'center', bottom: 0, marginTop: '8px'}}>
          <SimplePagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
          />
        </div>
      </div>
  );
};

export default DoctorGrid;