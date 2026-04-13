/**
 * Prisma Seed Script for I-Goal
 *
 * Populates: 5 domains, 22 strength themes, ~110 question items.
 *
 * Usage:
 *   npx tsx prisma/seed.ts
 *
 * Or add to package.json:
 *   "prisma": { "seed": "tsx prisma/seed.ts" }
 */

import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { DOMAINS } from "../src/lib/strengths-framework";
import { THEMES } from "../src/lib/strengths-framework";
import { QUESTIONS } from "../src/lib/question-bank";
import * as dotenv from "dotenv";

dotenv.config();

function createPrismaClient() {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
  return new PrismaClient({ adapter });
}

const prisma = createPrismaClient();

async function main() {
  console.log("🌱 Seeding I-Goal database...\n");

  // -------------------------------------------------------------------------
  // 1. Seed domains
  // -------------------------------------------------------------------------
  console.log("📦 Seeding 5 strength domains...");
  const domainMap = new Map<string, string>(); // name → id

  for (const domain of DOMAINS) {
    const created = await prisma.strengthDomain.upsert({
      where: { name: domain.name },
      update: {
        description: domain.description,
        color: domain.color,
      },
      create: {
        name: domain.name,
        description: domain.description,
        color: domain.color,
      },
    });
    domainMap.set(domain.name, created.id);
    console.log(`  ✓ ${domain.name} (${created.id})`);
  }

  // -------------------------------------------------------------------------
  // 2. Seed themes
  // -------------------------------------------------------------------------
  console.log("\n📦 Seeding 22 strength themes...");
  const themeMap = new Map<string, string>(); // name → id

  for (let i = 0; i < THEMES.length; i++) {
    const theme = THEMES[i];
    const domainId = domainMap.get(theme.domain);
    if (!domainId) {
      throw new Error(`Domain '${theme.domain}' not found for theme '${theme.name}'`);
    }

    const created = await prisma.strengthTheme.upsert({
      where: { name: theme.name },
      update: {
        domainId,
        definition: theme.definition,
        behavioralIndicators: theme.behavioralIndicators,
        growthActions: theme.growthActions,
        blindSpots: theme.blindSpots,
        rank: i + 1,
      },
      create: {
        name: theme.name,
        domainId,
        definition: theme.definition,
        behavioralIndicators: theme.behavioralIndicators,
        growthActions: theme.growthActions,
        blindSpots: theme.blindSpots,
        rank: i + 1,
      },
    });
    themeMap.set(theme.name, created.id);
    console.log(`  ✓ ${theme.name} → ${theme.domain} (${created.id})`);
  }

  // -------------------------------------------------------------------------
  // 3. Seed questions
  // -------------------------------------------------------------------------
  console.log(`\n📦 Seeding ${QUESTIONS.length} question items...`);
  let questionCount = 0;

  for (const question of QUESTIONS) {
    const themeId = themeMap.get(question.theme);
    if (!themeId) {
      console.warn(`  ⚠ Theme '${question.theme}' not found, skipping question`);
      continue;
    }

    // Upsert by matching on theme + positive text (unique enough for seed)
    const existing = await prisma.questionItem.findFirst({
      where: {
        themeId,
        textPositive: question.textPositive,
      },
    });

    if (existing) {
      await prisma.questionItem.update({
        where: { id: existing.id },
        data: {
          textNegative: question.textNegative,
          weight: question.weight,
        },
      });
    } else {
      await prisma.questionItem.create({
        data: {
          themeId,
          textPositive: question.textPositive,
          textNegative: question.textNegative,
          weight: question.weight,
        },
      });
    }
    questionCount++;
  }

  console.log(`  ✓ ${questionCount} questions seeded`);

  // -------------------------------------------------------------------------
  // Summary
  // -------------------------------------------------------------------------
  const domainCount = await prisma.strengthDomain.count();
  const themeCount = await prisma.strengthTheme.count();
  const totalQuestions = await prisma.questionItem.count();

  console.log("\n✅ Seed complete!");
  console.log(`   Domains:   ${domainCount}`);
  console.log(`   Themes:    ${themeCount}`);
  console.log(`   Questions: ${totalQuestions}`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
