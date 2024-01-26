import axiosClient from "./axiosClient";

const UserAPI = {
  getAllData: async () => {
    const url = `/user`;
    return axiosClient.get(url);
  },
  postCheckUser: async (data) => {
    const url = `/user/checkuser`;
    return axiosClient.post(url, data);
  },

  postSignUp: async (info) => {
    const url = `/user`;
    return axiosClient.post(url, info);
  },
  checkLogin: async (token) => {
    const url = `user/checklogin?token=${token}`;
    return axiosClient.get(url);
  },
  checkLogout: async () => {
    const url = `user/logout`;
    return axiosClient.delete(url);
  },
  // thêm sản phẩm vào database
  updateUser: async (cart) => {
    const url = `user/updateCart`;
    return axiosClient.put(url, cart);
  },
};

export default UserAPI;
