import { NavLink } from "react-router-dom";
import classNames from "classnames";

const AdminSidebar = () => {
  return (
    <aside className="bg-light h-100 border-end">
      <ul className="menu-list p-3">
        <li>
          <NavLink
            to="/admin"
            className={({ isActive }) =>
              classNames("nav-link", { active: isActive })
            }
          >
            <i className="icon icon-dashboard"></i> Dashboard
          </NavLink>
        </li>

        <li>
          <NavLink to="/admin/books" className="nav-link">
            <i className="icon icon-book"></i> Books
          </NavLink>
        </li>

        <li>
          <NavLink to="/admin/orders" className="nav-link">
            <i className="icon icon-clipboard"></i> Orders
          </NavLink>
        </li>

        <li>
          <NavLink to="/admin/users" className="nav-link">
            <i className="icon icon-user"></i> Users
          </NavLink>
        </li>
      </ul>
    </aside>
  );
};

export default AdminSidebar;
