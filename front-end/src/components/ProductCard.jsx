import { Link } from "react-router-dom";

function ProductCard({ book }) {
  return (
    <div className="card mb-3">
      <div className="col-md-4">
        <img src={book.image} className="card-img-top" alt={book.title} />
      </div>
      <div className="col-md-8">
        <div className="card-body">
          <h6>{book.title}</h6>
          <p className="text-muted mb-1">{book.author}</p>
          <p className="text-danger fw-bold">{book.price} đ</p>
        </div>
        <Link to={`/books/${book.id}`} className="btn btn-primary btn-sm w-100">
          Xem chi tiết
        </Link>
      </div>
    </div>
  );
}

export default ProductCard;
