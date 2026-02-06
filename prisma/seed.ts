import { prisma } from '../src/lib/prisma'
import 'dotenv/config'
import bcrypt from 'bcryptjs'

async function main() {
    console.log("Seeding database...")

    // Hash the password
    const hashedPassword = await bcrypt.hash('technoday-ramadhan', 10);

    const admin = await prisma.mst_user.upsert({
        where: { username: 'admin' },
        update: {
            password: hashedPassword, // Update password even if user exists
        },
        create: {
            username: 'admin',
            password: hashedPassword,
        },
    })
    console.log("Admin user created/verified:", { ...admin, password: '[HASHED]' })
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error("SEED API ERROR:", e)
        await prisma.$disconnect()
        process.exit(1)
    })
