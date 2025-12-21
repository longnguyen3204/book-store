import AdminHeader from "../components/AdminHeader";
import AdminSidebar from "../components/AdminSidebar";

const AdminLayout = ({ children }) => {
  return (
    <div
      className="admin-wrapper"
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      {/* Header cố định phía trên */}
      <AdminHeader />

      <div style={{ display: "flex", flex: 1 }}>
        {/* Sidebar cố định bên trái */}
        <div style={{ width: "260px", flexShrink: 0 }}>
          <AdminSidebar />
        </div>

        {/* Nội dung chính bên phải */}
        <main
          style={{
            flex: 1,
            padding: "30px",
            backgroundColor: "#f8f9fa",
            overflowY: "auto",
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
