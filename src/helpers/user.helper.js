const transfromUsers = (users) => {
  if (!users.length) {
    return [];
  }

  const result = users.map((user) => {
    const { password, refreshToken, ...rest } = user;
    return rest;
  });

  return result;
};

export const userHelper = {
  transfromUsers,
};
