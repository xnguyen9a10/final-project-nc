import axios from "axios";
import history from "./history";
import { getNewAccessToken } from "./auth";

const accessToken = localStorage.getItem("accessToken");
const headers = {
  Authorization: accessToken ? `Bearer ${accessToken}` : "",
};

const instance = axios.create({
  baseURL: "http://localhost:3001",
  headers,
});
instance.interceptors.request.use(
  (req) => {
    const token = localStorage.getItem("accessToken");
    console.log('old', token)
    req.headers["Authorization"] = `Bearer ${token}`;
    return req;
  },
  (error) => Promise.reject(error)
);

instance.interceptors.response.use(
  (resp) => resp.data,
  (error) => {
    const { response } = error;
    console.log(error.response.config);
    if (response) {
      switch (response.status) {
        case 401:
          // history.push({
          //   pathname: '/login',
          //   state: {
          //     status: 401,
          //     statusText: "You don't have permission to access this feature",
          //   },
          // });
          return getNewAccessToken().then(() => {
            const newtoken = localStorage.getItem("accessToken");
            console.log('old', newtoken)
            error.config.headers["Authorization"] = `Bearer ${newtoken}`;
            Promise.resolve(axios(error.config))
          });
          break;
        case 403:
          history.push({
            pathname: "/login",
            state: {
              status: 403,
              statusText: "You don't have permission to access this feature",
            },
          });
          break;
        case 405:
        case 404:
        case 500:
        case 503:
          history.push({
            pathname: "/login",
            state: {
              status: response.status ? response.status : 500,
              statusText:
                response.data && response.data.message
                  ? response.data.message
                  : "Internal Server Error",
            },
          });
          break;
        default:
          break;
      }
    } else {
      history.push({
        pathname: "/login",
        state: {
          status: 500,
          statusText: "Internal Server Error",
        },
      });
    }

    return Promise.reject(error);
  }
);

export default instance;
