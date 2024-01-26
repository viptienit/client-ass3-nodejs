import React, { useEffect, useState } from "react";
import CartAPI from "../API/CartAPI";
import convertMoney from "../convertMoney";
import "./Checkout.css";

import { useDispatch, useSelector } from "react-redux";
import { orderCart } from "../Redux/Action/ActionCart";
import ProductAPI from "../API/ProductAPI";

function Checkout(props) {
  const listCart = useSelector((state) => state.Cart.listCart);
  const dispatch = useDispatch();
  const [fullname, setFullname] = useState("");
  const [fullnameError, setFullnameError] = useState(false);
  const [products, setProduct] = useState([]);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);

  const [emailRegex, setEmailRegex] = useState(false);

  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState(false);

  const [address, setAddress] = useState("");
  const [addressError, setAddressError] = useState(false);
  useEffect(() => {
    const ProductApi = async () => {
      const response = await ProductAPI.getAPI();
      setProduct(response);
    };
    ProductApi();
  }, []);

  //Check Validation
  const handlerSubmit = (e) => {
    e.preventDefault();
    if (!fullname) {
      setFullnameError(true);
      setEmailError(false);
      setPhoneError(false);
      setAddressError(false);
      return;
    } else {
      if (!email) {
        setFullnameError(false);
        setEmailError(true);
        setPhoneError(false);
        setAddressError(false);
        return;
      } else {
        setPhoneError(false);
        setAddressError(false);
        setFullnameError(false);

        if (!validateEmail(email)) {
          setEmailRegex(true);
          setFullnameError(false);
          setEmailError(false);
          setPhoneError(false);
          setAddressError(false);
          return;
        } else {
          setEmailRegex(false);

          if (!phone) {
            setFullnameError(false);
            setEmailError(false);
            setPhoneError(true);
            setAddressError(false);
            return;
          } else {
            setFullnameError(false);
            setEmailError(false);
            setPhoneError(false);
            setAddressError(false);

            if (!address) {
              setFullnameError(false);
              setEmailError(false);
              setPhoneError(false);
              setAddressError(true);
            } else {
              let ok = [];
              for (let x = 0; x < listCart.length; x++) {
                if (
                  products.filter((mov) => mov._id === listCart[x].idProduct)[0]
                    .sl < listCart[x].count
                ) {
                  ok.push(listCart[x].nameProduct);
                }
              }
              if (!ok.length) {
                const data = {
                  email: email,
                  phone: phone,
                  address: address,
                  total: listCart.reduce(
                    (cur, mov) => cur + mov.priceProduct * mov.count,
                    0
                  ),
                  cart: listCart.map((mov) => {
                    mov.priceProduct = convertMoney(mov.priceProduct);
                    mov.total = convertMoney(mov.total);
                    return mov;
                  }),

                  time: new Date(),
                };
                //đặt hàng
                const fetchCart = async () => {
                  const response = await CartAPI.postAddToCart(data);
                  if (response) {
                    const action = orderCart("");
                    dispatch(action);
                    alert("Đã đặt hàng thành công");
                    window.location.replace("/shop");
                  } else {
                    alert("đã có sản phẩm vượt quá số lượng trong kho");
                  }
                };
                fetchCart();
              } else {
                alert(
                  `Bạn cần giảm số lượng của ${ok.join(
                    " , "
                  )}. Do bên cung cấp không đủ số lượng sản phẩm`
                );
              }
            }
          }
        }
      }
    }
  };

  const onChangeName = (e) => {
    setFullname(e.target.value);
  };

  const onChangeEmail = (e) => {
    setEmail(e.target.value);
  };

  const onChangePhone = (e) => {
    setPhone(e.target.value);
  };

  const onChangeAddress = (e) => {
    setAddress(e.target.value);
  };

  function validateEmail(email) {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  return (
    <div>
      <div className="container">
        <section className="py-5 bg-light">
          <div className="container">
            <div className="row px-4 px-lg-5 py-lg-4 align-items-center">
              <div className="col-lg-6">
                <h1 className="h2 text-uppercase mb-0">Checkout</h1>
              </div>
              <div className="col-lg-6 text-lg-right">
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb justify-content-lg-end mb-0 px-0">
                    <li className="breadcrumb-item">
                      <a href="index.html">Home</a>
                    </li>
                    <li className="breadcrumb-item">
                      <a href="cart.html">Cart</a>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      Checkout
                    </li>
                  </ol>
                </nav>
              </div>
            </div>
          </div>
        </section>

        <section className="py-5">
          <h2 className="h5 text-uppercase mb-4">Billing details</h2>
          <div className="row">
            <div className="col-lg-8">
              <form>
                <div className="row">
                  <div className="col-lg-12 form-group">
                    <label
                      className="text-small text-uppercase"
                      htmlFor="Fullname"
                    >
                      Full Name:
                    </label>
                    <input
                      className="form-control form-control-lg"
                      value={fullname}
                      onChange={onChangeName}
                      type="text"
                      placeholder="Enter Your Full Name Here!"
                    />
                    {fullnameError && (
                      <span className="text-danger">
                        * Please Check Your Full Name!
                      </span>
                    )}
                  </div>
                  <div className="col-lg-12 form-group">
                    <label
                      className="text-small text-uppercase"
                      htmlFor="Email"
                    >
                      Email:{" "}
                    </label>
                    <input
                      className="form-control form-control-lg"
                      value={email}
                      onChange={onChangeEmail}
                      type="text"
                      placeholder="Enter Your Email Here!"
                    />
                    {emailError && (
                      <span className="text-danger">
                        * Please Check Your Email!
                      </span>
                    )}
                    {emailRegex && (
                      <span className="text-danger">
                        * Incorrect Email Format
                      </span>
                    )}
                  </div>
                  <div className="col-lg-12 form-group">
                    <label
                      className="text-small text-uppercase"
                      htmlFor="Phone"
                    >
                      Phone Number:{" "}
                    </label>
                    <input
                      className="form-control form-control-lg"
                      value={phone}
                      onChange={onChangePhone}
                      type="text"
                      placeholder="Enter Your Phone Number Here!"
                    />
                    {phoneError && (
                      <span className="text-danger">
                        * Please Check Your Phone Number!
                      </span>
                    )}
                  </div>
                  <div className="col-lg-12 form-group">
                    <label
                      className="text-small text-uppercase"
                      htmlFor="Address"
                    >
                      Address:{" "}
                    </label>
                    <input
                      className="form-control form-control-lg"
                      value={address}
                      onChange={onChangeAddress}
                      type="text"
                      placeholder="Enter Your Address Here!"
                    />
                    {addressError && (
                      <span className="text-danger">
                        * Please Check Your Address!
                      </span>
                    )}
                  </div>
                  <div className="col-lg-12 form-group">
                    <a
                      className="btn btn-dark"
                      style={{ color: "white" }}
                      type="submit"
                      onClick={handlerSubmit}
                      href="/#"
                    >
                      Place order
                    </a>
                  </div>
                </div>
              </form>
            </div>
            <div className="col-lg-4">
              <div className="card border-0 rounded-0 p-lg-4 bg-light">
                <div className="card-body">
                  <h5 className="text-uppercase mb-4">Your order</h5>
                  <ul className="list-unstyled mb-0">
                    {listCart &&
                      listCart.map((value, stt) => (
                        <div key={stt}>
                          <li className="d-flex align-items-center justify-content-between">
                            <strong className="small font-weight-bold">
                              {value.nameProduct}
                            </strong>
                            <br></br>
                            <span className="text-muted small">
                              {convertMoney(value.priceProduct)} VND x{" "}
                              {value.count}
                            </span>
                          </li>
                          <li className="border-bottom my-2"></li>
                        </div>
                      ))}
                    <li className="d-flex align-items-center justify-content-between">
                      <strong className="text-uppercase small font-weight-bold">
                        Total
                      </strong>
                      <span>
                        {convertMoney(
                          listCart.reduce(
                            (cur, mov) => cur + mov.priceProduct * mov.count,
                            0
                          )
                        )}{" "}
                        VND
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Checkout;
