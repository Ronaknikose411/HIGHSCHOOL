import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  addAdmin,
  updateAdmin,
  deleteAdmin,
  createTeacher,
  updateTeacher,
  deleteTeacher,
  getAllAdminsAndTeachers,
} from "../../api/superadminApi";
import useAuth from "../../auth/context/useAuth";

const ViewAllAdminsAndTeachers = () => {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [admins, setAdmins] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showAddAdminModal, setShowAddAdminModal] = useState(false);
  const [showAddTeacherModal, setShowAddTeacherModal] = useState(false);
  const [showUpdateAdminModal, setShowUpdateAdminModal] = useState(false);
  const [showUpdateTeacherModal, setShowUpdateTeacherModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [selectedTeacher, setSelectedTeacher] = useState(null);

  // Role checks
  const isSuperAdmin = user?.role === "superadmin";
  const isAdmin = user?.role === "admin";

  // Fetch admins and teachers on mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getAllAdminsAndTeachers(token);
        setAdmins(data.admins || []);
        setTeachers(data.teachers || []);
      } catch (err) {
        setError(err.message);
        if (err.message.includes("403")) navigate("/login");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token, navigate]);

  // Superadmin-only Functions
  const handleAddAdmin = async (adminData) => {
    if (!isSuperAdmin) return;
    try {
      const response = await addAdmin(adminData, token);
      setSuccess(response.message || "Admin added successfully");
      const data = await getAllAdminsAndTeachers(token);
      setAdmins(data.admins);
      setShowAddAdminModal(false);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdateAdmin = async (adminID, updatedData) => {
    if (!isSuperAdmin) return;
    try {
      await updateAdmin(adminID, updatedData, token);
      const data = await getAllAdminsAndTeachers(token);
      setAdmins(data.admins);
      setSuccess("Admin updated successfully");
      setShowUpdateAdminModal(false);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteAdmin = async (adminID) => {
    if (!isSuperAdmin) return;
    if (window.confirm(`Are you sure you want to delete admin ${adminID}?`)) {
      try {
        await deleteAdmin(adminID, token);
        const data = await getAllAdminsAndTeachers(token);
        setAdmins(data.admins);
        setSuccess("Admin deleted successfully");
        setTimeout(() => setSuccess(""), 3000);
      } catch (err) {
        setError(err.message);
      }
    }
  };

  // Functions available to both admin and superadmin
  const handleAddTeacher = async (teacherData) => {
    try {
      const response = await createTeacher(teacherData, token);
      setSuccess(response.message || "Teacher added successfully");
      const data = await getAllAdminsAndTeachers(token);
      setTeachers(data.teachers);
      setShowAddTeacherModal(false);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdateTeacher = async (teacherID, updatedData) => {
    try {
      await updateTeacher(teacherID, updatedData, token);
      const data = await getAllAdminsAndTeachers(token);
      setTeachers(data.teachers);
      setSuccess("Teacher updated successfully");
      setShowUpdateTeacherModal(false);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteTeacher = async (teacherID) => {
    if (window.confirm(`Are you sure you want to delete teacher ${teacherID}?`)) {
      try {
        await deleteTeacher(teacherID, token);
        const data = await getAllAdminsAndTeachers(token);
        setTeachers(data.teachers);
        setSuccess("Teacher deleted successfully");
        setTimeout(() => setSuccess(""), 3000);
      } catch (err) {
        setError(err.message);
      }
    }
  };

  // Modal Forms (unchanged)
  const AddAdminForm = ({ onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({ name: "", email: "", password: "" });
    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleFormSubmit = (e) => {
      e.preventDefault();
      onSubmit(formData);
    };

    return (
      <div className="modal" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add Admin</h5>
              <button className="btn-close" onClick={onCancel}></button>
            </div>
            <form onSubmit={handleFormSubmit}>
              <div className="modal-body">
                <div className="mb-3">
                  <label>Name</label>
                  <input type="text" name="name" className="form-control" value={formData.name} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                  <label>Email</label>
                  <input type="email" name="email" className="form-control" value={formData.email} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                  <label>Password</label>
                  <input type="password" name="password" className="form-control" value={formData.password} onChange={handleChange} required />
                </div>
              </div>
              <div className="modal-footer">
                <button type="submit" className="btn btn-primary">Add</button>
                <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };

  const UpdateAdminForm = ({ admin, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({ name: admin.name, email: admin.email, password: "" });
    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleFormSubmit = (e) => {
      e.preventDefault();
      onSubmit(admin.adminID, formData);
    };

    return (
      <div className="modal" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Update Admin</h5>
              <button className="btn-close" onClick={onCancel}></button>
            </div>
            <form onSubmit={handleFormSubmit}>
              <div className="modal-body">
                <div className="mb-3">
                  <label>Name</label>
                  <input type="text" name="name" className="form-control" value={formData.name} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                  <label>Email</label>
                  <input type="email" name="email" className="form-control" value={formData.email} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                  <label>Password (leave blank to keep unchanged)</label>
                  <input type="password" name="password" className="form-control" value={formData.password} onChange={handleChange} />
                </div>
              </div>
              <div className="modal-footer">
                <button type="submit" className="btn btn-primary">Update</button>
                <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };

  const AddTeacherForm = ({ onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({ name: "", email: "", password: "" });
    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleFormSubmit = (e) => {
      e.preventDefault();
      onSubmit(formData);
    };

    return (
      <div className="modal" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add Teacher</h5>
              <button className="btn-close" onClick={onCancel}></button>
            </div>
            <form onSubmit={handleFormSubmit}>
              <div className="modal-body">
                <div className="mb-3">
                  <label>Name</label>
                  <input type="text" name="name" className="form-control" value={formData.name} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                  <label>Email</label>
                  <input type="email" name="email" className="form-control" value={formData.email} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                  <label>Password</label>
                  <input type="password" name="password" className="form-control" value={formData.password} onChange={handleChange} required />
                </div>
              </div>
              <div className="modal-footer">
                <button type="submit" className="btn btn-primary">Add</button>
                <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };

  const UpdateTeacherForm = ({ teacher, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({ name: teacher.name, email: teacher.email, password: "" });
    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleFormSubmit = (e) => {
      e.preventDefault();
      onSubmit(teacher.teacherID, formData);
    };

    return (
      <div className="modal" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Update Teacher</h5>
              <button className="btn-close" onClick={onCancel}></button>
            </div>
            <form onSubmit={handleFormSubmit}>
              <div className="modal-body">
                <div className="mb-3">
                  <label>Name</label>
                  <input type="text" name="name" className="form-control" value={formData.name} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                  <label>Email</label>
                  <input type="email" name="email" className="form-control" value={formData.email} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                  <label>Password (leave blank to keep unchanged)</label>
                  <input type="password" name="password" className="form-control" value={formData.password} onChange={handleChange} />
                </div>
              </div>
              <div className="modal-footer">
                <button type="submit" className="btn btn-primary">Update</button>
                <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };

  // Check if user is authorized (either admin or superadmin)
  if (!user || (!isAdmin && !isSuperAdmin)) {
    return <div className="container mt-5">Access Denied</div>;
  }

  return (
    <div className="container mt-5">
      <h1 className="mb-4 text-primary">
        {isSuperAdmin ? "All Admins and Teachers" : "All Teachers"}
      </h1>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      {loading && <p>Loading...</p>}

      {/* Buttons for Adding */}
      <div className="mb-4">
        {isSuperAdmin && (
          <button className="btn btn-primary me-2" onClick={() => setShowAddAdminModal(true)}>
            Add Admin
          </button>
        )}
        {(isSuperAdmin || isAdmin) && (
          <button className="btn btn-primary" onClick={() => setShowAddTeacherModal(true)}>
            Add Teacher
          </button>
        )}
      </div>

      {/* Admins Table - Only for Superadmin */}
      {isSuperAdmin && (
        <>
          <h3>Admins</h3>
          <div className="table-responsive">
            <table className="table table-striped table-bordered">
              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {admins.length > 0 ? (
                  admins.map((admin) => (
                    <tr key={admin.adminID}>
                      <td>{admin.adminID}</td>
                      <td>{admin.name}</td>
                      <td>{admin.email}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-warning me-2"
                          onClick={() => {
                            setSelectedAdmin(admin);
                            setShowUpdateAdminModal(true);
                          }}
                        >
                          Update
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDeleteAdmin(admin.adminID)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center">No admins found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Teachers Table - Visible to both */}
      <h3 className={isSuperAdmin ? "mt-5" : ""}>Teachers</h3>
      <div className="table-responsive">
        <table className="table table-striped table-bordered">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {teachers.length > 0 ? (
              teachers.map((teacher) => (
                <tr key={teacher.teacherID}>
                  <td>{teacher.teacherID}</td>
                  <td>{teacher.name}</td>
                  <td>{teacher.email}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-warning me-2"
                      onClick={() => {
                        setSelectedTeacher(teacher);
                        setShowUpdateTeacherModal(true);
                      }}
                    >
                      Update
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDeleteTeacher(teacher.teacherID)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center">No teachers found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      {isSuperAdmin && showAddAdminModal && (
        <AddAdminForm
          onSubmit={handleAddAdmin}
          onCancel={() => setShowAddAdminModal(false)}
        />
      )}
      {(isSuperAdmin || isAdmin) && showAddTeacherModal && (
        <AddTeacherForm
          onSubmit={handleAddTeacher}
          onCancel={() => setShowAddTeacherModal(false)}
        />
      )}
      {isSuperAdmin && showUpdateAdminModal && selectedAdmin && (
        <UpdateAdminForm
          admin={selectedAdmin}
          onSubmit={handleUpdateAdmin}
          onCancel={() => setShowUpdateAdminModal(false)}
        />
      )}
      {(isSuperAdmin || isAdmin) && showUpdateTeacherModal && selectedTeacher && (
        <UpdateTeacherForm
          teacher={selectedTeacher}
          onSubmit={handleUpdateTeacher}
          onCancel={() => setShowUpdateTeacherModal(false)}
        />
      )}
    </div>
  );
};

export default ViewAllAdminsAndTeachers;