export const addUser = (data) => {
  return {
    type: "ADD_USER",
    data,
  };
};

export const addCart = (data) => {
  return {
    type: "ADD_CART",
    data,
  };
};
export const importCart = (data) => {
  return {
    type: "ADD_DATA",
    data,
  };
};

export const updateCart = (data) => {
  return {
    type: "UPDATE_CART",
    data,
  };
};

export const deleteCart = (data) => {
  return {
    type: "DELETE_CART",
    data,
  };
};
export const deleteAllCart = (data) => {
  return {
    type: "DELETE_ALL_CART",
    data,
  };
};
export const orderCart = (data) => {
  return {
    type: "ORDER_CART",
    data,
  };
};
