import axios from "axios";

const API = axios.create({
  baseURL:
    "http://a90e9d8f889524e2eb0037dbc417b8ba-2015871556.ap-south-1.elb.amazonaws.com:5000/api",
});

export default API;