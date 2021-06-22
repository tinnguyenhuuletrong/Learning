const prisma = require("./prisma.client");

async function main() {
  const usrs = await prisma.user.findMany({});
  console.log(usrs);

  const usrA = await prisma.user.findUnique({
    where: {
      id: 1,
    },
    select: {
      id: true,
      email: true,
      name: true,
      // posts: true,
    },
  });

  console.log(usrA);

  await prisma.$disconnect();
}
main();
