import { prisma } from '../src/lib/prisma'
import 'dotenv/config'

async function cleanDuplicateNPK() {
    console.log("Checking for duplicate NPKs...")

    // Get all participants
    const allParticipants = await prisma.trn_register.findMany({
        orderBy: { createdAt: 'asc' }
    });

    // Track seen NPKs
    const seenNPKs = new Set<string>();
    const duplicates: number[] = [];

    for (const participant of allParticipants) {
        if (seenNPKs.has(participant.npk)) {
            duplicates.push(participant.id);
            console.log(`Found duplicate NPK: ${participant.npk} (ID: ${participant.id})`);
        } else {
            seenNPKs.add(participant.npk);
        }
    }

    if (duplicates.length > 0) {
        console.log(`\nDeleting ${duplicates.length} duplicate records...`);
        await prisma.trn_register.deleteMany({
            where: {
                id: { in: duplicates }
            }
        });
        console.log("✅ Duplicates removed!");
    } else {
        console.log("✅ No duplicates found!");
    }
}

cleanDuplicateNPK()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error("ERROR:", e)
        await prisma.$disconnect()
        process.exit(1)
    })
