import React, { useState, useEffect } from 'react';
import { Button, Modal, Select } from 'antd'; // Import Select từ antd
import axios from 'axios';
import AddDoctorForm from './AddDoctorForm';
import EditDoctorForm from './EditDoctorForm';
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

  // Hàm này bất đồng bộ, khi nào gọi api xong thì mới return
  const getEmployeeInfo = async (employee) => {
    try {
      const response = await axios.get(
          `http://localhost:3000/employee/Information/${employee.User_Code}`
      );
      return {
        id: employee.User_Code,
        name: employee['First_Name'],
        email: employee.Email,
        department: employee.Team,
        branch: employee.branch,
        Team: employee.Team,
        salary: employee.Salary,
      };
    } catch (error) {
      console.error('Lỗi khi lấy thông tin nhân viên:', error);
      return null;
    }
  };

  const handleBranchChange = (value) => {
    setSelectedBranch(value);
    setCurrentPage(1); // Reset về trang 1 khi thay đổi filter
  };

  const handleTeamChange = (value) => {
    setSelectedTeam(value);
    setCurrentPage(1); // Reset về trang 1 khi thay đổi filter
  };

  const handleUpdateSalary = () => {
    // Xử lý logic cập nhật lương ở đây
    console.log("Cập nhật lương...");
  };

  const handleChange = (event) => {
    setSearchVal(event.target.value);

  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3000/employee/SortAndFilter', {
          params: {
            page: currentPage,
            limit: itemsPerPage,
            team: selectedTeam, // Lọc theo team
            branch: selectedBranch, // Lọc theo branch

          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data && Array.isArray(response.data.employees)) {
          const employeesData = response.data.employees;
          setEmployees(response.data.totalEmployees);
          const totalPages = Math.ceil(response.data.totalEmployees / itemsPerPage);
          setTotalPages(totalPages);

          const doctorsPromises = employeesData.map((employee) =>
              getEmployeeInfo(employee)
          );
          const doctorsData = await Promise.all(doctorsPromises);
          const validDoctorsData = doctorsData.filter(
              (doctor) => doctor !== null
          );
          setDoctors(validDoctorsData);
        } else {
          console.error('Dữ liệu trả về không đúng định dạng:', response.data);
        }
      } catch (error) {
        console.error('Lỗi khi lấy danh sách nhân viên:', error);
      }
    };

    fetchData();
  }, [currentPage, selectedBranch, selectedTeam]); // Thêm selectedBranch và selectedTeam vào dependency array

  // useEffect(() => {
  //   const fetchSearchResults = async () => {
  //     if (searchVal) {
  //       try {
  //         const response = await axios.get(
  //             `http://localhost:3000/employee/Find?keywords=${searchVal}`
  //         );
  //         if (response.data && response.data.user) {
  //           const employee = response.data.user;
  //           const doctorData = await getEmployeeInfo(employee);
  //           if (doctorData) {
  //             setDoctors([doctorData]);
  //           } else {
  //             setDoctors([]);
  //           }
  //         } else {
  //           console.error('Không tìm thấy nhân viên với từ khóa:', searchVal);
  //           setDoctors([]);
  //         }
  //       } catch (error) {
  //         console.error('Lỗi khi tìm kiếm nhân viên:', error);
  //         setDoctors([]);
  //       }
  //     } else {
  //       // Nếu không có searchVal, gọi lại API để lấy tất cả nhân viên
  //       try {
  //         const response = await axios.get('http://localhost:3000/employee/All', {
  //           params: {
  //             page: currentPage,
  //             limit: itemsPerPage,
  //           },
  //         });

  //         if (response.data && Array.isArray(response.data.employees)) {
  //           const employeesData = response.data.employees;
  //           const doctorsPromises = employeesData.map((employee) =>
  //               getEmployeeInfo(employee)
  //           );
  //           const doctorsData = await Promise.all(doctorsPromises);
  //           const validDoctorsData = doctorsData.filter(
  //               (doctor) => doctor !== null
  //           );
  //           setDoctors(validDoctorsData);
  //         } else {
  //           console.error('Dữ liệu trả về không đúng định dạng:', response.data);
  //         }
  //       } catch (error) {
  //         console.error('Lỗi khi lấy danh sách nhân viên:', error);
  //       }
  //     }
  //   };

  //   fetchSearchResults();
  // }, [searchVal, currentPage]);

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
    setVisible(true);
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

  const renderDoctorRows = doctors.map((doctor) => (
      <div
          key={doctor.id}
          onClick={() => handleViewDetail(doctor.id)}
          className="doctor-card"
      >
        <h2>{doctor.name}</h2>
        <p>Chi nhánh: {doctor.branch}</p>
        <p>Team: {doctor.Team}</p>
        <p>Email: {doctor.email}</p>
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
  ));

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
      <div>
        <div className="doctor-header">
          <h1 className="doctor-total">Nhân viên hiện có</h1>
          <div className="total-doctors">{totalEmployees}</div>

          {/* Thêm component Select cho branch filter */}
          <Select
              allowClear
              showSearch
              placeholder="Chọn chi nhánh"
              optionFilterProp="children"
              onChange={handleBranchChange}
              value={selectedBranch}
              style={{width: 200, marginRight: '10px'}}
          >
            {branches.map((branch) => (
                <Option key={branch.value} value={branch.value}>
                  {branch.label}
                </Option>
            ))}
          </Select>

          {/* Thêm component Select cho team filter */}
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
          <div className="search-bar">
            <input
                className="search-input"
                type="text"
                placeholder="Tìm kiếm nhân viên..."
                value={searchVal}
                onChange={handleChange}
            />
          </div>

          <Button className="add-button" type="primary" onClick={showModal}>
            Thêm nhân viên
          </Button>
          <Modal
              title="Thêm nhân viên mới"
              visible={visible}
              onOk={handleOk}
              onCancel={handleCancel}
              footer={null}
          >
            <AddDoctorForm onAddDoctor={handleAddDoctor}/>
          </Modal>

          {editMode && selectedDoctor && (
              <Modal
                  title="Chỉnh sửa thông tin nhân viên"
                  visible={editMode}
                  onCancel={handleCancelEdit}
                  footer={null}
              >
                <EditDoctorForm
                    doctor={selectedDoctor}
                    onSave={handleSave}
                    onCancel={() => setVisible(false)}
                />
              </Modal>
          )}
        </div>
        <div className="doctor-grid">{renderDoctorRows}</div>
        <div className="update-salary-button">
          <Button type="primary" onClick={handleUpdateSalary}>
            Cập nhật lương
          </Button>
        </div>
        <div
            className="page-number"
            style={{textAlign: 'center', bottom: 0, marginTop: '8px'}}
        >
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