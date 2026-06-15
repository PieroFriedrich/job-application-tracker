import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? "file:./dev.db",
});
const prisma = new PrismaClient({ adapter });

const applications = [
  {
    company: "Acme Corp",
    role: "Frontend Developer",
    jobUrl: "https://acme.example.com/careers/frontend-developer",
    status: "wishlist",
    notes: "Referral from a friend, need to update resume before applying.",
  },
  {
    company: "Globex",
    role: "Junior Software Engineer",
    jobUrl: "https://globex.example.com/jobs/123",
    status: "applied",
    appliedDate: new Date("2026-05-20"),
    notes: "Applied via LinkedIn Easy Apply.",
  },
  {
    company: "Initech",
    role: "Full Stack Developer",
    jobUrl: "https://initech.example.com/careers/456",
    status: "interview",
    appliedDate: new Date("2026-05-10"),
    notes: "Phone screen scheduled for next week.",
  },
  {
    company: "Umbrella Inc",
    role: "React Developer",
    jobUrl: "https://umbrella.example.com/jobs/react-dev",
    status: "interview",
    appliedDate: new Date("2026-05-05"),
    notes: "Completed first round, waiting on take-home assignment.",
  },
  {
    company: "Soylent Corp",
    role: "Software Engineer I",
    jobUrl: "https://soylent.example.com/careers/swe1",
    status: "offer",
    appliedDate: new Date("2026-04-15"),
    notes: "Offer received, negotiating start date.",
  },
  {
    company: "Hooli",
    role: "Junior Web Developer",
    jobUrl: "https://hooli.example.com/jobs/789",
    status: "rejected",
    appliedDate: new Date("2026-04-01"),
    notes: "Rejected after final round, asked for feedback.",
  },
];

async function main() {
  await prisma.application.deleteMany();
  await prisma.application.createMany({ data: applications });
  console.log(`Seeded ${applications.length} applications.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
