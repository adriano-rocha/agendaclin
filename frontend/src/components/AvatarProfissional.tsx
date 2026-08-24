import { useState } from 'react';

const imagemPorEspecialidade: Record<string, string> = {
  Psicologia: '/profissionais/psi.png',
  Nutrição: '/profissionais/nutri.png',
  Odontologia: '/profissionais/denti.png',
  Cardiologia: '/profissionais/cardio.png',
  Oftalmologia: '/profissionais/ofta.png',
  Dermatologia: '/profissionais/derma.png',
};

function obterIniciais(nome: string): string {
  const partes = nome.trim().split(' ');
  const primeira = partes[0]?.[0] ?? '';
  const ultima = partes.length > 1 ? partes[partes.length - 1][0] : '';
  return (primeira + ultima).toUpperCase();
}

interface AvatarProfissionalProps {
  nome: string;
  especialidade?: string;
  tamanho?: 'sm' | 'md';
}

export function AvatarProfissional({ nome, especialidade, tamanho = 'md' }: AvatarProfissionalProps) {
  const [erroImagem, setErroImagem] = useState(false);
  const src = especialidade ? imagemPorEspecialidade[especialidade] : undefined;
  const classeTamanho = tamanho === 'sm' ? 'w-12 h-12' : 'w-16 h-16';

  if (!src || erroImagem) {
    return (
      <div className={`${classeTamanho} rounded-full bg-blue-100 text-blue-700 font-semibold text-lg flex items-center justify-center`}>
        {obterIniciais(nome)}
      </div>
    );
  }

  return (
    <div className={`${classeTamanho} rounded-full bg-gray-100 overflow-hidden flex items-center justify-center`}>
      <img
        src={src}
        alt={especialidade}
        onError={() => setErroImagem(true)}
        className="w-full h-full object-contain"
      />
    </div>
  );
}