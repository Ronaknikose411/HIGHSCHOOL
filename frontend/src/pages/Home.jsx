import React from "react";
import { Link } from "react-router-dom";
import useAuth from "../auth/context/useAuth";

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="container-fluid p-0 min-vh-100 d-flex flex-column justify-content-between">
      {/* Hero Section for All Users */}
      <section className="bg-primary text-white py-5">
        <div className="container text-center">
          <h1 className="display-3 fw-bold mb-3 animate__animated animate__fadeIn">
            Student Portal
          </h1>
          <p className="lead mb-4 animate__animated animate__fadeIn animate__delay-1s">
            Empowering education through seamless management and learning tools.
          </p>
        </div>
      </section>

      {/* Conditional Content Based on User State */}
      <main className="container my-5">
        {!user ? (
          // Before Login UI
          <div className="row justify-content-center">
            <div className="col-md-8 col-lg-6">
              <div className="card shadow-lg border-0 animate__animated animate__zoomIn">
                <div className="card-body text-center p-5">
                  <h2 className="fw-bold text-primary mb-3">
                    Get Started Today
                  </h2>
                  <p className="text-muted mb-4">
                    Join our platform to access courses, track progress, and collaborate with peers.
                  </p>
                  <div className="d-flex justify-content-center gap-3">
                    <Link
                      to="/login"
                      className="btn btn-primary btn-lg px-4 py-2"
                    >
                      <i className="bi bi-box-arrow-in-right me-2"></i> Login
                    </Link>
                   
                  </div>
                </div>
               
              </div>
            </div>
          </div>
        ) : user.role === "student" ? (
          // After Login UI (Student)
          <div className="row justify-content-center">
            <div className="col-md-10 col-lg-8">
              <div className="card shadow-lg border-0 animate__animated animate__fadeInUp">
                <div className="card-header bg-success text-white text-center py-4">
                  <h2 className="fw-bold">Welcome, {user.name}!</h2>
                  <p className="mb-0">Your learning journey starts here.</p>
                </div>
                <div className="card-body p-5 text-center">
                  <p className="text-muted mb-4">
                    Explore your courses, submit assignments, and stay on top of deadlines.
                  </p>
                  <div className="d-flex justify-content-center gap-3">
                    <Link
                      to="/dashboard"
                      className="btn btn-success btn-lg px-4 py-2"
                    >
                      Go to Dashboard <i className="bi bi-arrow-right ms-2"></i>
                    </Link>
                    <Link
                      to="/courses"
                      className="btn btn-outline-primary btn-lg px-4 py-2"
                    >
                      View Courses <i className="bi bi-book ms-2"></i>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : user.role === "admin" ? (
          // After Login UI (Admin)
          <div className="row justify-content-center">
            <div className="col-md-10 col-lg-8">
              <div className="card shadow-lg border-0 animate__animated animate__fadeInUp">
                <div className="card-header bg-danger text-white text-center py-4">
                  <h2 className="fw-bold">Welcome, Admin {user.name}!</h2>
                  <p className="mb-0">Take control of the platform.</p>
                </div>
                <div className="card-body p-5 text-center">
                  <p className="text-muted mb-4">
                    Manage users, oversee courses, and configure system settings.
                  </p>
                  <div className="d-flex justify-content-center gap-3">
                    <Link
                      to="/admin-panel"
                      className="btn btn-danger btn-lg px-4 py-2"
                    >
                      Admin Panel <i className="bi bi-gear-fill ms-2"></i>
                    </Link>
                    <Link
                      to="/reports"
                      className="btn btn-outline-warning btn-lg px-4 py-2"
                    >
                      View Reports <i className="bi bi-bar-chart ms-2"></i>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </main>

      {/* Footer */}
      <footer className="bg-dark text-white text-center py-3 mt-auto">
        <p className="mb-0">&copy; 2025 Student Portal. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;