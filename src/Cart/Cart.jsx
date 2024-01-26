import alertify from "alertifyjs";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import UserAPI from "../API/UserAPI";
import { deleteCart, updateCart } from "../Redux/Action/ActionCart";
import convertMoney from "../convertMoney";
import ListCart from "./Component/ListCart";
import ProductAPI from "../API/ProductAPI";

function Cart(props) {
  //listCart được lấy từ redux
  const listCart = useSelector((state) => state.Cart.listCart);
  const [products, setProduct] = useState([]);

  const dispatch = useDispatch();

  //State dùng để Load dữ liệu từ Redux
  const [loadRedux, setLoadRedux] = useState({
    idProduct: "",
    count: "",
  });

  useEffect(() => {
    const ProductApi = async () => {
      const response = await ProductAPI.getAPI();
      setProduct(response);
    };
    ProductApi();
  }, []);
  //Hàm này dùng để truyền xuống cho component con xử và trả ngược dữ liệu lại component cha
  const onDeleteCart = (getUser, getProduct) => {
    console.log("idUser: " + getUser + ", idProduct: " + getProduct);
    const data = {
      idProduct: getProduct,
      idUser: getUser,
    };

    //Đưa dữ liệu vào Redux
    const action = deleteCart(data);
    dispatch(action);

    alertify.set("notifier", "position", "bottom-left");
    alertify.error("Bạn Đã Xóa Hàng Thành Công!");

    //set state loadRedux để nó load lại hàm useEffect để tiếp tục lấy dữ liệu từ redux
    setLoadRedux({
      idProduct: getProduct,
      count: "",
    });
    const fetchCart = async () => {
      const response = await UserAPI.updateUser(listCart);
      console.log(response);
    };
    fetchCart();
  };

  //Hàm này dùng để truyền xuống cho component con xử và trả ngược dữ liệu lại component cha
  const onUpdateCount = (getUser, getProduct, getCount) => {
    const data = {
      idProduct: getProduct,
      idUser: getUser,
      count: getCount,
    };

    //Đưa dữ liệu vào Redux
    const action = updateCart(data);
    dispatch(action);

    alertify.set("notifier", "position", "bottom-left");
    alertify.success("Bạn Đã Sửa Hàng Thành Công!");

    //set state loadRedux để nó load lại hàm useEffect để tiếp tục lấy dữ liệu từ redux
    setLoadRedux({
      idProduct: getProduct,
      count: getCount,
    });
    const fetchCart = async () => {
      const response = await UserAPI.updateUser(listCart);
      console.log(response);
    };
    fetchCart();
  };

  //Hàm này dùng để redirect đến page checkout
  const [redirect, setRedirect] = useState(false);

  const onCheckout = () => {
    let ok = [];
    for (let x = 0; x < listCart.length; x++) {
      // sản phẩm nào có số lượng lớn hơn của người bán sé thêm tên vào arr ok
      if (
        products.filter((mov) => mov._id === listCart[x].idProduct)[0].sl <
        listCart[x].count
      ) {
        ok.push(listCart[x].nameProduct);
      }
    }
    // nếu có thì thông báo cho người dùng nên giảm sản phẩm nào
    if (ok.length) {
      alert(
        `Bạn cần giảm số lượng của ${ok.join(
          " , "
        )}. Do bên cung cấp không đủ số lượng sản phẩm`
      );
      return;
    }

    if (!localStorage.getItem("id_user")) {
      alertify.set("notifier", "position", "bottom-left");
      alertify.error("Vui Lòng Kiểm Tra Lại Đăng Nhập!");
      return;
    }

    if (listCart.length === 0) {
      alertify.set("notifier", "position", "bottom-left");
      alertify.error("Vui Lòng Kiểm Tra Lại Giỏ Hàng!");
      return;
    }

    setRedirect(true);
  };

  return (
    <div className="container">
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row px-4 px-lg-5 py-lg-4 align-items-center">
            <div className="col-lg-6">
              <h1 className="h2 text-uppercase mb-0">Cart</h1>
            </div>
            <div className="col-lg-6 text-lg-right">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb justify-content-lg-end mb-0 px-0">
                  <li className="breadcrumb-item active" aria-current="page">
                    Cart
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </section>
      <section className="py-5">
        <h2 className="h5 text-uppercase mb-4">Shopping cart</h2>
        <div className="row">
          <div className="col-lg-8 mb-4 mb-lg-0">
            <ListCart
              listCart={listCart}
              onDeleteCart={onDeleteCart}
              onUpdateCount={onUpdateCount}
            />

            <div className="bg-light px-4 py-3">
              <div className="row align-items-center text-center">
                <div className="col-md-6 mb-3 mb-md-0 text-md-left">
                  <Link
                    className="btn btn-link p-0 text-dark btn-sm"
                    to={`/shop`}
                  >
                    <i className="fas fa-long-arrow-alt-left mr-2"> </i>
                    Continue shopping
                  </Link>
                </div>
                <div className="col-md-6 text-md-right">
                  {redirect && <Redirect to={"/checkout"} />}
                  <span
                    className="btn btn-outline-dark btn-sm"
                    onClick={onCheckout}
                  >
                    Proceed to checkout
                    <i className="fas fa-long-arrow-alt-right ml-2"></i>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="card border-0 rounded-0 p-lg-4 bg-light">
              <div className="card-body">
                <h5 className="text-uppercase mb-4">Cart total</h5>
                <ul className="list-unstyled mb-0">
                  <li className="d-flex align-items-center justify-content-between">
                    <strong className="text-uppercase small font-weight-bold">
                      Subtotal
                    </strong>
                    <span className="text-muted small">
                      {listCart &&
                        convertMoney(
                          listCart.reduce(
                            (cur, mov) => cur + mov.priceProduct * mov.count,
                            0
                          )
                        )}
                      VND
                    </span>
                  </li>
                  <li className="border-bottom my-2"></li>
                  <li className="d-flex align-items-center justify-content-between mb-4">
                    <strong className="text-uppercase small font-weight-bold">
                      Total
                    </strong>
                    <span>
                      {listCart &&
                        convertMoney(
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
  );
}

export default Cart;
