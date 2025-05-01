const useUserData = () => {
  const token = localStorage.getItem("token");

  const user = JSON.parse(atob(token.split(".")[1]));
  return user;
};

export default useUserData;
