import AdminHeader from "../components/AdminHeader";
import AdminSidebar from "../components/AdminSidebar";

const AdminLayout = ({ children }) => {
  return (
    <div className="app">
      <AdminHeader />
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-2 p-0">
            <AdminSidebar />
          </div>
          <div className="col-md-10 py-4">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
