const initialState = {
  idUser: "",
};

const ReducerSession = (state = initialState, action) => {
  switch (action.type) {
    case "ADD_SESSION":
      console.log(action);
      state.idUser = action.data;
      console.log(state);

      return state;

    case "DELETE_SESSION":
      state.idUser = "";
      console.log(state);
      return state;

    default:
      return state;
  }
};

export default ReducerSession;
