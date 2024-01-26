import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { importCart } from "../../Redux/Action/ActionCart";
import { Link } from "react-router-dom";
import LoginLink from "../../Authentication/LoginLink";
import LogoutLink from "../../Authentication/LogoutLink";
import Name from "../../Authentication/Name";
import UserAPI from "../../API/UserAPI";

function Header(props) {
  const idUser = useSelector((state) => state.Cart.id_user);
  const [active, setActive] = useState("Home");
  const dispatch = useDispatch();
  const [name, setName] = useState("");

  useEffect(() => {
    //kiểm tra xem local người dùng đã login hay chưa
    const fetchAPI = async () => {
      // gửi mã jwt lê server kiểm tra
      const response = await UserAPI.checkLogin(localStorage.getItem("jwt"));
      if (response.id) {
        localStorage.setItem("id_user", response.id);
        localStorage.setItem("name_user", response.fullname);
        localStorage.setItem("cart_user", response.cart);
        setName(response.fullname);
        // đùng thì lưu server và local State
        const addCart = importCart({
          cart: response.cart,
          user: response.id,
        });
        dispatch(addCart);
      } else {
        setName("");
      }
    };
    fetchAPI();
  }, []);
  // lấy tên trên thanh navbar
  useEffect(() => {
    setName(localStorage.getItem("name_user"));
  }, [idUser]);

  const handlerActive = (value) => {
    setActive(value);
    console.log(value);
  };

  return (
    <div className="container px-0 px-lg-3">
      <nav className="navbar navbar-expand-lg navbar-light py-3 px-lg-0">
        <Link className="navbar-brand" to={`/`}>
          <span className="font-weight-bold text-uppercase text-dark">
            Boutique
          </span>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNavAltMarkup"
          aria-controls="navbarNavAltMarkup"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item" onClick={() => handlerActive("Home")}>
              <Link
                className="nav-link"
                to={`/`}
                style={
                  active === "Home" ? { color: "#dcb14a" } : { color: "black" }
                }
              >
                Home
              </Link>
            </li>
            <li className="nav-item" onClick={() => handlerActive("Shop")}>
              <Link
                className="nav-link"
                to={`/shop`}
                style={
                  active === "Shop" ? { color: "#dcb14a" } : { color: "black" }
                }
              >
                Shop
              </Link>
            </li>
          </ul>
          <ul className="navbar-nav ml-auto">
            <li className="nav-item">
              <Link className="nav-link" to={`/cart`}>
                <i className="fas fa-dolly-flatbed mr-1 text-gray"></i>
                Cart
              </Link>
            </li>

            {
              // ẩn hiện tên và login logout
              idUser ? <Name name={name} /> : ""
            }
            {idUser ? <LoginLink /> : <LogoutLink />}
          </ul>
        </div>
      </nav>
    </div>
  );
}

export default Header;
