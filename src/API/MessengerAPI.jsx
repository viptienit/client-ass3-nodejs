import axiosClient from "./axiosClient";

const MessengerAPI = {
  getMessage: (query) => {
    const url = query ? `/session?room=${query}` : `/session`;
    return axiosClient.get(url);
  },

  postMessage: (query) => {
    const url = `/messenger/send${query}`;
    return axiosClient.post(url);
  },

  postConversation: (query) => {
    const url = `/messenger/conversation${query}`;
    return axiosClient.post(url);
  },
};

export default MessengerAPI;
