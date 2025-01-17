import prisma from "../configs/database.js";

const createUser = async (email, password_hash) => {
  return await prisma.user.create({
    data: {
      email,
      password_hash,
    },
  });
};

const findUserByConditions = async (conditions) => {
  return await prisma.user.findFirst({ where: conditions });
};

export { createUser, findUserByConditions };
