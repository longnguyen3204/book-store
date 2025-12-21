import { Link } from "react-router-dom";
import { brandAssets } from "../pages/Home/content";

const AdminHeader = () => {
  return (
    <header id="header" className="fixed-top bg-white shadow-sm">
      <div className="container-fluid">
        <div className="row align-items-center">
          <div className="col-md-2">
            <img src={brandAssets.logo} alt="logo" height={40} />
          </div>
          <div className="col-md-10 text-end">
            <Link to="/" className="btn btn-outline-accent btn-sm">
              View Website
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
