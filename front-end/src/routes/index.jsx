import App from "../App";
import DetailProduct from "../pages/Client/BookDetailPage.jsx";
import SearchPage from "../pages/Client/SearchPage.jsx";

const routes = [
  {
    path: "/",
    component: App,
  },
  {
    path: "/product/:id",
    component: DetailProduct,
  },
  { path: "/search", component: SearchPage },
];

export default routes;
