import prisma from "../configs/database.js";

const createSession = async (
  userId,
  accessToken,
  refreshToken,
  ipAddress,
  userAgent
) => {
  return await prisma.session.create({
    data: {
      user_id: userId,
      token: accessToken,
      refresh_token: refreshToken,
      ip_address: ipAddress,
      user_agent: userAgent,
    },
  });
};

const findSessionByConditions = async (conditions) => {
  return await prisma.session.findFirst({ where: conditions });
};

const updateSession = async (id, data) => {
  return await prisma.session.update({ where: { id }, data });
};

export { createSession, findSessionByConditions, updateSession };
