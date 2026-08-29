const CONSELHO_POR_ESPECIALIDADE: Record<string, string> = {
  Cardiologia: 'CRM',
  'Clínica Geral': 'CRM',
  Ortopedia: 'CRM',
  Ginecologia: 'CRM',
  Urologia: 'CRM',
  Endocrinologia: 'CRM',
  Dermatologia: 'CRM',
  Oftalmologia: 'CRM',
  Pediatria: 'CRM',
  Otorrinolaringologia: 'CRM',
  Psicologia: 'CRP',
  Odontologia: 'CRO',
  Enfermagem: 'COREN',
  Nutrição: 'CRN',
};

export function registroFicticio(especialidade?: string) {
  const conselho = CONSELHO_POR_ESPECIALIDADE[especialidade ?? ''] ?? 'Registro';
  return `${conselho} 123456-SP`;
}