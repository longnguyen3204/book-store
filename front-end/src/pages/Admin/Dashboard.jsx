import AdminLayout from "../../layouts/AdminLayout";
import StatCard from "./StatCard";
import DataTable from "./DataTable";

const Dashboard = () => {
  return (
    <AdminLayout>
      <div className="section-header">
        <h2 className="section-title">Admin Dashboard</h2>
      </div>

      {/* STATS */}
      <div className="row mb-4">
        <StatCard
          title="Users"
          value="1,240"
          icon="icon-user"
          color="#4caf50"
        />
        <StatCard title="Books" value="320" icon="icon-book" color="#2196f3" />
        <StatCard
          title="Orders"
          value="540"
          icon="icon-clipboard"
          color="#ff9800"
        />
        <StatCard
          title="Revenue"
          value="$12,400"
          icon="icon-credit-card"
          color="#e91e63"
        />
      </div>

      {/* ORDERS */}
      <h3 className="section-title divider">Latest Orders</h3>
      <DataTable
        columns={["Order", "User", "Book", "Status", "Total"]}
        data={[
          {
            order: "#1001",
            user: "John",
            book: "Atomic Habits",
            status: "Completed",
            total: "$29",
          },
          {
            order: "#1002",
            user: "Jane",
            book: "Deep Work",
            status: "Pending",
            total: "$19",
          },
        ]}
      />
    </AdminLayout>
  );
};

export default Dashboard;
