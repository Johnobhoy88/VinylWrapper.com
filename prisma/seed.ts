import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Create sample wrapper
  const wrapper1 = await prisma.wrapper.upsert({
    where: { email: 'john@manchesterwraps.com' },
    update: {},
    create: {
      name: 'Manchester Wraps',
      email: 'john@manchesterwraps.com',
      phone: '07700 900123',
      bio: 'Professional vinyl wrapping service with over 10 years of experience. Specializing in vehicle wraps, color changes, and custom designs. We use only premium materials and offer a satisfaction guarantee on all our work.',
      areasServed: ['M1', 'M2', 'M3', 'M4', 'Salford', 'Trafford'],
      portfolioImages: [
        'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800',
        'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800',
      ],
    },
  })

  const wrapper2 = await prisma.wrapper.upsert({
    where: { email: 'sarah@elitewraps.co.uk' },
    update: {},
    create: {
      name: 'Elite Wraps',
      email: 'sarah@elitewraps.co.uk',
      phone: '07700 900456',
      bio: 'Boutique vinyl wrapping studio offering premium services for luxury and exotic vehicles. Expert in chrome deletes, PPF installation, and custom graphics. Book your consultation today!',
      areasServed: ['M20', 'M21', 'M22', 'Stockport', 'Wilmslow'],
      portfolioImages: [
        'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800',
        'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800',
      ],
    },
  })

  const wrapper3 = await prisma.wrapper.upsert({
    where: { email: 'mike@northwestwraps.com' },
    update: {},
    create: {
      name: 'Northwest Wraps',
      email: 'mike@northwestwraps.com',
      phone: '07700 900789',
      bio: 'Affordable and professional vinyl wrapping for all vehicles. From commercial fleets to personal cars, we deliver quality results at competitive prices. Free quotes available.',
      areasServed: ['M6', 'M7', 'M8', 'M9', 'Bolton', 'Bury'],
      portfolioImages: [
        'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=800',
      ],
    },
  })

  console.log('Seed data created:', { wrapper1, wrapper2, wrapper3 })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
