const StatCard = ({ title, value, icon, color }) => {
  return (
    <div className="col-md-3">
      <div className="product-item text-center">
        <i className={`icon ${icon}`} style={{ fontSize: 30, color }}></i>
        <h3 className="mt-2">{value}</h3>
        <p>{title}</p>
      </div>
    </div>
  );
};

export default StatCard;
