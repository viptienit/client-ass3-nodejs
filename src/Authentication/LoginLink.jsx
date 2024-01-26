import React from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import UserAPI from "../API/UserAPI";
import { deleteAllCart } from "../Redux/Action/ActionCart";

function LoginLink(props) {
  const dispatch = useDispatch();
  const onRedirect = async () => {
    //đăng xuất
    localStorage.clear();
    document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
    // goi lên server để xóa token
    await UserAPI.checkLogout();
    //xóa local state
    const action = deleteAllCart("");
    dispatch(action);
  };
  return (
    <li className="nav-item" onClick={onRedirect}>
      <Link className="nav-link" to="/signin">
        ( Logout )
      </Link>
    </li>
  );
}

export default LoginLink;
