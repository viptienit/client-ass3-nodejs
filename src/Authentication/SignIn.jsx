import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import UserAPI from "../API/UserAPI";
import { importCart } from "../Redux/Action/ActionCart";
import "./Auth.css";

function SignIn(props) {
  //listCart được lấy từ redux
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errorEmail, setErrorEmail] = useState(false);
  const [emailRegex, setEmailRegex] = useState(false);
  const [errorPassword, setErrorPassword] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const dispatch = useDispatch();
  const [user, setUser] = useState([]);
  const onChangeEmail = (e) => {
    setEmail(e.target.value);
  };

  const onChangePassword = (e) => {
    setPassword(e.target.value);
  };

  const onSubmit = async () => {
    if (!email) {
      setErrorEmail(true);
      return;
    } else {
      if (!password) {
        setErrorEmail(false);
        setErrorPassword(true);
        return;
      } else {
        setErrorPassword(false);

        if (!validateEmail(email)) {
          setEmailRegex(true);
          return;
        } else {
          setEmailRegex(false);
          // kiểm trA xem có trùng với email nào không
          const users = await UserAPI.getAllData();
          let findUser;
          for (let x = 0; x < users.length; x++) {
            if (users[x].email === email) {
              findUser = users[x];
            }
          }
          // không trùng thì sẽ trả về là email ko chính xác
          if (!findUser) {
            setErrorEmail(true);
            return;
          } else {
            // đưa id và mk lên server để kiểm tra
            const response = await UserAPI.postCheckUser({
               id: findUser._id,
              password: password,
            });
            if (response.id) {
              alert("thanh cong");
              //được thì thông báo cho người dùng
              setErrorEmail(false);
              setErrorPassword(false);
              localStorage.setItem("id_user", response.id);
              localStorage.setItem("name_user", response.fullname);
              localStorage.setItem("cart_user", response.cart);
              localStorage.setItem("jwt", response.token);
              // và lưu id , cart lên local state
              const addCart = importCart({
                cart: response.cart,
                user: response.id,
              });
              // đưa người dùng về trang chủ
              setRedirect(true);
              dispatch(addCart);
            } else {
              alert(response.message);
              setErrorPassword(true);
            }
          }
        }
      }
    }
  };

  function validateEmail(email) {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  return (
    <div className="limiter">
      <div className="container-login100">
        <div className="wrap-login100 p-l-55 p-r-55 p-t-65 p-b-50">
          <span className="login100-form-title p-b-33">Sign In</span>

          <div className="d-flex justify-content-center pb-5">
            {emailRegex && (
              <span className="text-danger">* Incorrect Email Format</span>
            )}
            {errorEmail && (
              <span className="text-danger">* Please Check Your Email</span>
            )}
            {errorPassword && (
              <span className="text-danger">* Please Check Your Password</span>
            )}
          </div>

          <div className="wrap-input100 validate-input">
            <input
              className="input100"
              type="text"
              placeholder="Email"
              value={email}
              onChange={onChangeEmail}
            />
          </div>

          <div className="wrap-input100 rs1 validate-input">
            <input
              className="input100"
              type="password"
              placeholder="Password"
              value={password}
              onChange={onChangePassword}
            />
          </div>

          <div className="container-login100-form-btn m-t-20">
            {redirect && <Redirect to={`/`} />}
            <button className="login100-form-btn" onClick={onSubmit}>
              Sign in
            </button>
          </div>

          <div className="text-center p-t-45 p-b-4">
            <span className="txt1">Create an account?</span>
            &nbsp;
            <Link to="/signup" className="txt2 hov1">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
