const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const employees = [
    { name: "Alice Johnson" },
    { name: "Bob Smith" },
    { name: "Charlie Brown" },
    { name: "David Wilson" },
    { name: "Emma Watson" },
    { name: "Frank Castle" },
    { name: "Grace Harper" },
    { name: "Hank Pym" },
    { name: "Ivy Adams" },
    { name: "Jack Daniels" },
  ];

  await prisma.employee.createMany({ data: employees });
  console.log("✅ Database seeded with 10 employees.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
