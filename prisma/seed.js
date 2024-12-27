const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const rewards = [
    {
      name: 'Réduction 10%',
      description: '10% de réduction sur votre prochaine prestation',
      pointsRequired: 100,
      type: 'DISCOUNT',
      value: 10
    },
    {
      name: 'Pose offerte',
      description: 'Une pose complète offerte',
      pointsRequired: 200,
      type: 'FREE_SERVICE',
      value: 45
    },
    {
      name: 'Nail Art gratuit',
      description: 'Une décoration Nail Art gratuite',
      pointsRequired: 50,
      type: 'FREE_SERVICE',
      value: 15
    }
  ];

  for (const reward of rewards) {
    await prisma.rewardTemplate.create({
      data: reward
    });
  }

  console.log('Base de données initialisée avec les récompenses');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });