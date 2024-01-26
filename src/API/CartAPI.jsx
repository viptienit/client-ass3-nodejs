import axiosClient from "./axiosClient";

const CartAPI = {
  getCarts: (query) => {
    const url = `/carts${query}`;
    return axiosClient.get(url);
  },

  postAddToCart: (query) => {
    const url = `/order`;
    return axiosClient.post(url, query);
  },

  deleteToCart: (query) => {
    const url = `/carts/delete${query}`;
    return axiosClient.delete(url);
  },

  putToCart: (query) => {
    const url = `/carts/update${query}`;
    return axiosClient.put(url);
  },
};

export default CartAPI;
