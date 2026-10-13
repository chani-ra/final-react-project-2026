const USER_ROLES = new Set(["student", "teacher", "admin"]);
let sessionVersion = 0;

export const getSessionVersion = () => sessionVersion;

export const getHomePathForRole = (role) => {
  if (role === "admin") return "/admin/dashboard";
  if (role === "teacher") return "/teacher/dashboard";
  return "/dashboard";
};

export const normalizeUser = (rawUser) => {
  const id = rawUser?.id || rawUser?._id || rawUser?.userId;
  if (!id || !USER_ROLES.has(rawUser?.role)) {
    throw new Error("השרת לא החזיר פרטי משתמש תקינים");
  }

  return {
    ...rawUser,
    id,
    _id: rawUser._id || id,
    username: rawUser.username || rawUser.name || "משתמש",
    favoriteHobbies: rawUser.favoriteHobbies || [],
    expectations: rawUser.expectations || [],
    englishLevel: rawUser.englishLevel || "beginner",
  };
};

export const saveAuthSession = (rawUser, token, refreshToken) => {
  if (!token) throw new Error("השרת לא החזיר token להתחברות");

  const user = normalizeUser(rawUser);
  sessionVersion += 1;
  localStorage.setItem("token", token);
  localStorage.setItem("refreshToken", refreshToken || "");
  localStorage.setItem("userRole", user.role);
  localStorage.setItem("user", JSON.stringify(user));
  return user;
};

export const clearAuthStorage = () => {
  sessionVersion += 1;
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("userRole");
  localStorage.removeItem("user");
};
