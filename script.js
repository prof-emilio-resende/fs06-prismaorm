"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient({
    log: ["query", "info", "warn", "error"],
});
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        let allPosts = yield prisma.post.findMany();
        console.log(allPosts);
        allPosts.forEach((p) => __awaiter(this, void 0, void 0, function* () {
            const deletedPosts = yield prisma.post.delete({
                where: {
                    id: p.id,
                },
            });
        }));
        let allUsers = yield prisma.user.findMany();
        console.log(allUsers);
        try {
            const deletedUsers = yield prisma.user.deleteMany({
                where: {
                    id: {
                        gt: 0,
                    },
                },
            });
            console.log(deletedUsers);
        }
        catch (e) {
            console.log(e);
        }
        const newUser = yield prisma.user.create({
            data: {
                name: "emilio",
                email: "emilio@test.com",
            },
        });
        allUsers = yield prisma.user.findMany();
        console.log(allUsers);
        const userWithPosts = yield prisma.user.create({
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
        const usrAndPostLeftJoin = yield prisma.user.findMany({
            include: {
                posts: true,
            },
        });
        console.log(usrAndPostLeftJoin);
        console.log("INNER join");
        const usrAndPostInnerJoin = yield prisma.user.findMany({
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
    });
}
main()
    .then(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.$disconnect();
}))
    .catch((e) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(e);
    yield prisma.$disconnect();
    process.exit(1);
}));
//# sourceMappingURL=script.js.map