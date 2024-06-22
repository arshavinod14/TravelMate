import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../reducers/user/userReducer";
import adminReducer from "../reducers/admin/adminReducer";
import agentReducer from "../reducers/agent/agentReducer";
import destinationReducer from "../reducers/destination/destinationReducer";
import packageReducer from "../reducers/tourpackage/packageReducer";
import categoryReducer from "../reducers/category/categoryReducer";

const store = configureStore({
  reducer: {
    user: userReducer,
    admin: adminReducer,
    agent:agentReducer,
    destination: destinationReducer,
    package:packageReducer,
    category:categoryReducer
  },
});

export default store;
