import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const especialidades = [
    { nome: 'Psicologia', duracaoPadrao: 50 },
    { nome: 'Nutrição', duracaoPadrao: 40 },
    { nome: 'Odontologia', duracaoPadrao: 30 },
    { nome: 'Cardiologia', duracaoPadrao: 30 },
    { nome: 'Oftalmologia', duracaoPadrao: 30 },
    { nome: 'Dermatologia', duracaoPadrao: 30 },
  ];

  for (const esp of especialidades) {
    await prisma.especialidade.upsert({
      where: { nome: esp.nome },
      update: {},
      create: esp,
    });
  }

  const nutricao = await prisma.especialidade.findUniqueOrThrow({ where: { nome: 'Nutrição' } });
  const odontologia = await prisma.especialidade.findUniqueOrThrow({ where: { nome: 'Odontologia' } });
  const cardiologia = await prisma.especialidade.findUniqueOrThrow({ where: { nome: 'Cardiologia' } });
  const oftalmologia = await prisma.especialidade.findUniqueOrThrow({ where: { nome: 'Oftalmologia' } });
  const dermatologia = await prisma.especialidade.findUniqueOrThrow({ where: { nome: 'Dermatologia' } });

  const profissionais = [
    { nome: 'Dra. Marcele Asevedo', especialidadeId: nutricao.id },
    { nome: 'Dra. Helena Rocha', especialidadeId: odontologia.id },
    { nome: 'Dr. Ricardo Borges', especialidadeId: cardiologia.id },
    { nome: 'Dr. Breno Lopes', especialidadeId: oftalmologia.id },
    { nome: 'Dra. Julia Aguiar', especialidadeId: dermatologia.id },
  ];

  for (const prof of profissionais) {
    const jaExiste = await prisma.profissional.findFirst({ where: { nome: prof.nome } });
    if (!jaExiste) {
      await prisma.profissional.create({ data: prof });
    }
  }

  console.log('Seed concluído!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });