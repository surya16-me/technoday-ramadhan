const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const models = Object.keys(prisma).filter(k => !k.startsWith('$') && !k.startsWith('_'));
        console.log('Available models:', models);

        if (prisma.trn_group) {
            console.log('✅ trn_group model found!');
        } else {
            console.log('❌ trn_group model NOT found!');
        }
    } catch (err) {
        console.error('Error:', err);
    } finally {
        await prisma.$disconnect();
    }
}

main();
