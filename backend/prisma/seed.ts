// backend/prisma/seed.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const especialidades = [
    { nome: "Psicologia", duracaoPadrao: 50 },
    { nome: "Nutrição", duracaoPadrao: 40 },
    { nome: "Odontologia", duracaoPadrao: 30 },
    { nome: "Cardiologia", duracaoPadrao: 30 },
    { nome: "Oftalmologia", duracaoPadrao: 30 },
    { nome: "Dermatologia", duracaoPadrao: 30 },
    { nome: "Pediatria", duracaoPadrao: 30 },
    { nome: "Ginecologia", duracaoPadrao: 30 },
    { nome: "Urologia", duracaoPadrao: 30 },
    { nome: "Otorrinolaringologia", duracaoPadrao: 30 },
    { nome: "Ortopedia", duracaoPadrao: 30 },
    { nome: "Endocrinologia", duracaoPadrao: 30 },
  ];

  for (const esp of especialidades) {
    await prisma.especialidade.upsert({
      where: { nome: esp.nome },
      update: {},
      create: esp,
    });
  }

  const psicologia = await prisma.especialidade.findUniqueOrThrow({
    where: { nome: "Psicologia" },
  });
  const nutricao = await prisma.especialidade.findUniqueOrThrow({
    where: { nome: "Nutrição" },
  });
  const odontologia = await prisma.especialidade.findUniqueOrThrow({
    where: { nome: "Odontologia" },
  });
  const cardiologia = await prisma.especialidade.findUniqueOrThrow({
    where: { nome: "Cardiologia" },
  });
  const oftalmologia = await prisma.especialidade.findUniqueOrThrow({
    where: { nome: "Oftalmologia" },
  });
  const dermatologia = await prisma.especialidade.findUniqueOrThrow({
    where: { nome: "Dermatologia" },
  });
  const pediatria = await prisma.especialidade.findUniqueOrThrow({
    where: { nome: "Pediatria" },
  });
  const ginecologia = await prisma.especialidade.findUniqueOrThrow({
    where: { nome: "Ginecologia" },
  });
  const urologia = await prisma.especialidade.findUniqueOrThrow({
    where: { nome: "Urologia" },
  });
  const otorrino = await prisma.especialidade.findUniqueOrThrow({
    where: { nome: "Otorrinolaringologia" },
  });
  const ortopedia = await prisma.especialidade.findUniqueOrThrow({
    where: { nome: "Ortopedia" },
  });
  const endocrinologia = await prisma.especialidade.findUniqueOrThrow({
    where: { nome: "Endocrinologia" },
  });

  const profissionais = [
    { nome: "Dra. Mirian Barbosa", especialidadeId: psicologia.id },
    { nome: "Dra. Jussara Nunes", especialidadeId: nutricao.id },
    { nome: "Dra. Juliana Passaniante", especialidadeId: odontologia.id },
    { nome: "Dr. Ricardo Borges", especialidadeId: cardiologia.id },
    { nome: "Dr. Breno Lopes", especialidadeId: oftalmologia.id },
    { nome: "Dra. Julia Aguiar", especialidadeId: dermatologia.id },
    { nome: "Dra. Vilma Perez", especialidadeId: pediatria.id },
    { nome: "Dr. Gustavo Carrera", especialidadeId: ginecologia.id },
    { nome: "Dr. Aurélio Torres", especialidadeId: urologia.id },
    { nome: "Dr. Wilson Barcelos", especialidadeId: otorrino.id },
    { nome: "Dra. Silvia Tsukita", especialidadeId: ortopedia.id },
    { nome: "Dr. Julio Borges", especialidadeId: endocrinologia.id },
  ];

  for (const prof of profissionais) {
    const jaExiste = await prisma.profissional.findFirst({
      where: { nome: prof.nome },
    });
    if (!jaExiste) {
      await prisma.profissional.create({ data: prof });
    }
  }

  console.log("Seed concluído!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
