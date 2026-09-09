import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface DonutStatusAgendamentosProps {
  pendentes: number;
  confirmadosHoje: number;
  faltaram: number;
  total: number;
}

export function DonutStatusAgendamentos({
  pendentes,
  confirmadosHoje,
  faltaram,
  total,
}: DonutStatusAgendamentosProps) {
  const outros = Math.max(total - (pendentes + confirmadosHoje + faltaram), 0);

  const dados = [
    { nome: 'Pendentes', valor: pendentes, cor: '#ca8a04' },
    { nome: 'Confirmados hoje', valor: confirmadosHoje, cor: '#16a34a' },
    { nome: 'Faltaram', valor: faltaram, cor: '#dc2626' },
    { nome: 'Outros', valor: outros, cor: '#9ca3af' },
  ];

  const semDados = total === 0;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-sm font-semibold text-gray-900">Distribuição de status</h2>

      {semDados ? (
        <p className="py-10 text-center text-sm text-gray-400">Sem agendamentos para exibir.</p>
      ) : (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={dados}
                dataKey="valor"
                nameKey="nome"
                innerRadius="60%"
                outerRadius="85%"
                paddingAngle={2}
              >
                {dados.map((item) => (
                  <Cell key={item.nome} fill={item.cor} stroke="none" />
                ))}
              </Pie>
              <Tooltip formatter={(valor) => [valor ?? 0, 'Agendamentos']} />
              <Legend
                verticalAlign="bottom"
                height={36}
                iconType="circle"
                wrapperStyle={{ fontSize: 12, color: '#4b5563' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}