import axios from 'axios';

const url = "http://localhost:3001/"
const ACCESS_TOKEN = 'accessToken';
const REFRESH_TOKEN = 'refreshToken';
const USER_ID = 'userId'

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
  return localStorage.getItem('userId');
}

export const isLogin = () => {
  if(!getAccessToken()) {
    return false;
  }
  return true;
}

export const setSession = (userId, accessToken, refreshToken) => {
  localStorage.setItem(USER_ID, userId);
  localStorage.setItem(ACCESS_TOKEN, accessToken);
  localStorage.setItem(REFRESH_TOKEN, refreshToken);
}

export const removeSession = () => {
  localStorage.removeItem(USER_ID);
  localStorage.removeItem(ACCESS_TOKEN);
  localStorage.removeItem(REFRESH_TOKEN);
}

export const getNewAccessToken = async () => {
  const result = await axios.get(url + "user/me/access-token",{
    headers:{
      refreshToken: getRefreshToken(),
      userId: getUserId()
    }
  })

  if(result.data.status === 'successful') {
    setAccessToken(result.data.data.accessToken)
  } else {
    throw Error("Cannot refresh your authentication");
  }
}