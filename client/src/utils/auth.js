import axios from 'axios';

const url = "http://localhost:3001/"
const ACCESS_TOKEN = 'accessToken';
const REFRESH_TOKEN = 'refreshToken';
const USER_ID = 'userId';
const USER_NAME = 'userName';
const ROLE = "role";
const EMAIL = "email";

export const setAccessToken = (accessToken) => {
  localStorage.setItem(ACCESS_TOKEN, accessToken)
}

export const getAccessToken = () => {
  return localStorage.getItem(ACCESS_TOKEN)
}

export const getRefreshToken = () => {
  return localStorage.getItem(REFRESH_TOKEN)
}

export const getUserId = () => {
  return localStorage.getItem(USER_ID);
}

export const getUserName = () => {
  return localStorage.getItem(USER_NAME);
}

export const getEmail = () => {
  return localStorage.getItem(EMAIL);
}

export const isLogin = () => {
  if(!getAccessToken()) {
    return false;
  }
  return true;
}

export const isRole = (role) => {
  return localStorage.getItem(ROLE) === role;
}

export const setSession = (userId, userName, accessToken, refreshToken,role, email) => {
  localStorage.setItem(USER_ID, userId);
  localStorage.setItem(ACCESS_TOKEN, accessToken);
  localStorage.setItem(REFRESH_TOKEN, refreshToken);
  localStorage.setItem(ROLE, role);
  localStorage.setItem(USER_NAME, userName);
  localStorage.setItem(EMAIL, email);

}

export const removeSession = () => {
  localStorage.removeItem(USER_ID);
  localStorage.removeItem(ACCESS_TOKEN);
  localStorage.removeItem(REFRESH_TOKEN);
  localStorage.removeItem(ROLE);
  localStorage.removeItem(USER_NAME);
  localStorage.removeItem(EMAIL);
}

export const getNewAccessToken = async () => {
  const result = await axios.get(url + "user/me/access-token",{
    headers:{
      refreshToken: getRefreshToken(),
      userId: getUserId(),
    }
  })

  if(result.data.status === 'successful') {
    setAccessToken(result.data.data.accessToken)
  } else {
    throw Error("Cannot refresh your authentication");
  }
}
