import { useContext, createContext, useReducer} from "react";
import axios from "axios"
import reducer from "./reducer";

const token = localStorage.getItem('token');
const user = localStorage.getItem('user');

const initialState = {
    isLoading: false,
    token: token,
    user: user ? JSON.parse(user) : null,
    otherUsers:[]
    
};


