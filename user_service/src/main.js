import express from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const app = express();
const prisma = new PrismaClient();

app.get("/", async (req, res) => {
  const user = await prisma.user.create({
    data: {
      email: "test@test.com",
      password_hash: await bcrypt.hash("test", 10),
    },
  });
  console.log(user);
  res.send(user);
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
