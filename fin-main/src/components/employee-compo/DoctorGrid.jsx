import React, { useState, useEffect } from 'react';
import { Button, Modal } from 'antd';
import axios from 'axios';
import AddDoctorForm from './AddDoctorForm';
import EditDoctorForm from './EditDoctorForm';
import { Link, useNavigate } from 'react-router-dom';
import SimplePagination from '../product-compo/Button_Page';

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

  // Hàm này bất đồng bộ, khi nào gọi api xong thì mới return
  const getEmployeeInfo = async (employee) => {
    try {
      const response = await axios.get(
          `http://localhost:3000/employee/Information/${employee.User_Code}`
      );
      return {
        id: employee.User_Code,
        name: employee['First Name'],
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/employee/All', {
          params: {
            page: currentPage,
            limit: itemsPerPage,
          },
        });
        console.log('response', response.data.employees);
        // Chỉ lấy thông tin nhân viên và bỏ qua thông tin phân trang
        if (response.data && Array.isArray(response.data.employees)) {
          const employeesData = response.data.employees;
          const totalEmployees = response.data.totalEmployees;
          const totalPages = Math.ceil(totalEmployees / itemsPerPage);
          setTotalPages(totalPages);

          // Lặp qua danh sách nhân viên và lấy thông tin chi tiết
          const doctorsPromises = employeesData.map((employee) =>
              getEmployeeInfo(employee)
          );
          const doctorsData = await Promise.all(doctorsPromises);

          // Lọc bỏ các kết quả null (nếu có lỗi khi gọi API)
          const validDoctorsData = doctorsData.filter(
              (doctor) => doctor !== null
          );

          // Cập nhật state với danh sách nhân viên đã xử lý
          setDoctors(validDoctorsData);
        } else {
          console.error('Dữ liệu trả về không đúng định dạng:', response.data);
        }
      } catch (error) {
        console.error('Lỗi khi lấy danh sách nhân viên:', error);
      }
    };

    fetchData();
  }, [currentPage]);

  const handleChange = (event) => {
    setSearchVal(event.target.value);
  };

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (searchVal) {
        try {
          const response = await axios.get(
              `http://localhost:3000/employee/Find?keywords=${searchVal}`
          );
          if (response.data && response.data.user) {
            const employee = response.data.user;
            const doctorData = await getEmployeeInfo(employee);
            if (doctorData) {
              setDoctors([doctorData]);
            } else {
              setDoctors([]);
            }
          } else {
            console.error('Không tìm thấy nhân viên với từ khóa:', searchVal);
            setDoctors([]);
          }
        } catch (error) {
          console.error('Lỗi khi tìm kiếm nhân viên:', error);
          setDoctors([]);
        }
      } else {
        // Nếu không có searchVal, gọi lại API để lấy tất cả nhân viên
        try {
          const response = await axios.get('http://localhost:3000/employee/All', {
            params: {
              page: currentPage,
              limit: itemsPerPage,
            },
          });

          if (response.data && Array.isArray(response.data.employees)) {
            const employeesData = response.data.employees;
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
      }
    };

    fetchSearchResults();
  }, [searchVal, currentPage]);

  const handleAddDoctor = async (values) => {
    try {
      // Gọi API để thêm nhân viên
      const response = await axios.post('http://localhost:3000/employee/Add', values);
      if (response.status === 201) {
        // Thêm nhân viên thành công
        console.log('Thêm nhân viên thành công:', response.data);

        // Cập nhật lại danh sách nhân viên
        const updatedResponse = await axios.get('http://localhost:3000/employee/All', {
          params: {
            page: currentPage,
            limit: itemsPerPage,
          },
        });

        if (updatedResponse.data && Array.isArray(updatedResponse.data.employees)) {
          const employeesData = updatedResponse.data.employees;
          const doctorsPromises = employeesData.map((employee) =>
              getEmployeeInfo(employee)
          );
          const doctorsData = await Promise.all(doctorsPromises);
          const validDoctorsData = doctorsData.filter(
              (doctor) => doctor !== null
          );
          setDoctors(validDoctorsData);
        } else {
          console.error('Dữ liệu trả về không đúng định dạng:', updatedResponse.data);
        }

        setVisible(false); // Đóng modal
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
        // Gọi API để xóa nhân viên
        const response = await axios.delete(`http://localhost:3000/employee/Delete/${id}`);
        if (response.status === 200) {
          console.log('Xóa nhân viên thành công:', response.data);

          // Cập nhật lại danh sách nhân viên
          const updatedDoctors = doctors.filter((doctor) => doctor.id !== id);
          setDoctors(updatedDoctors);
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

        // Cập nhật lại danh sách nhân viên
        const updatedDoctors = doctors.map((doctor) =>
            doctor.id === editedDoctor.id ? { ...doctor, ...editedDoctor } : doctor
        );
        setDoctors(updatedDoctors);

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
          <div className="total-doctors">{doctors.length}</div>
          <div className="search-bar">
            <input
                className="search-input"
                type="text"
                placeholder="Tìm kiếm bác sĩ..."
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
            <AddDoctorForm onAddDoctor={handleAddDoctor} />
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
        <div
            className="page-number"
            style={{ textAlign: 'center', bottom: 0, marginTop: '8px' }}
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