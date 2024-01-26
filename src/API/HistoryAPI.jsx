import axiosClient from "./axiosClient";

const HistoryAPI = {
  getHistoryAPI: (order) => {
    const url = order ? `/order?order=${order}` : `/order`;
    return axiosClient.get(url);
  },
};

export default HistoryAPI;
