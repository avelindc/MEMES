const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function test() {
    try {
        const totalArtists = await prisma.user.count({ where: { role: "ARTIST" } });
        console.log("Total Artists:", totalArtists);
        const totalReleases = await prisma.release.count();
        console.log("Total Releases:", totalReleases);
    } catch(e) {
        console.error("Error:", e);
    }
}
test().finally(()=> prisma.$disconnect());
