const serializeUser = (user) => {
  return {
    state: user.state,
    username: user.username,
    name: user.name,
    email: user.email,
    name: user.name,
    role: user.role,
    id: user.id,
    dealerId: user.dealerId,
    updatedAt: user.updatedAt,
    createdAt: user.createdAt,
  };
};

module.exports = { serializeUser };
