import { Prisma, PrismaClient, User } from "@prisma/client";

const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"],
});

async function main() {
  let allPosts = await prisma.post.findMany();
  console.log(allPosts);

  allPosts.forEach(async (p) => {
    const deletedPosts = await prisma.post.delete({
      where: {
        id: p.id,
      },
    });
  });

  let allUsers = await prisma.user.findMany();
  console.log(allUsers);

  try {
    const deletedUsers = await prisma.user.deleteMany({
      where: {
        id: {
          gt: 0,
        },
      },
    });
    console.log(deletedUsers);
  } catch (e) {
    console.log(e);
  }

  const newUser = await prisma.user.create({
    data: {
      name: "emilio",
      email: "emilio@test.com",
    },
  });

  allUsers = await prisma.user.findMany();
  console.log(allUsers);

  const userWithPosts = await prisma.user.create({
    data: {
      name: "Emilio Dois",
      email: "emilio@dois.com",
      posts: {
        create: {
          title: "Emilio Dois Post Title",
          text: "Emilio Dois Post text!!!",
        },
      },
    },
  });
  console.log(userWithPosts);

  console.log("==================================================");
  console.log("                        queries                   ");
  console.log("==================================================");
  console.log("LEFT join");
  const usrAndPostLeftJoin = await prisma.user.findMany({
    include: {
      posts: true,
    },
  });
  console.log(usrAndPostLeftJoin);

  console.log("INNER join");
  const usrAndPostInnerJoin = await prisma.user.findMany({
    include: {
      posts: true,
    },
    where: {
      posts: {
        some: {
          NOT: {
            id: 0,
          },
        },
      },
    },
  });
  console.log(usrAndPostInnerJoin);

  console.log("Repository...");
  class PostRepository {
    public async findByTitleAndText(title: string, text: string) {
      return await prisma.post.findMany({
        where: {
          title: title,
          text: {
            contains: text,
          },
        },
      });
    }
  }

  const posts = await new PostRepository().findByTitleAndText(
    "Emilio Dois Post Title",
    "!"
  );
  console.log(posts);

  console.log("query nativa!!!");
  const usrs = await prisma.$queryRaw<User[]>(Prisma.sql`select * from user`);

  console.log(usrs);
  usrs.forEach((u) => console.log(u.email));
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.log(e);
    await prisma.$disconnect();
    process.exit(1);
  });
