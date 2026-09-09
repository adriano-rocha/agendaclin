import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell, ResponsiveContainer } from 'recharts';

interface BarraComparativaAgendamentosProps {
  total: number;
  pendentes: number;
  confirmadosHoje: number;
  faltaram: number;
}

export function BarraComparativaAgendamentos({
  total,
  pendentes,
  confirmadosHoje,
  faltaram,
}: BarraComparativaAgendamentosProps) {
  const dados = [
    { nome: 'Total', valor: total, cor: '#055DF9' },
    { nome: 'Pendentes', valor: pendentes, cor: '#ca8a04' },
    { nome: 'Confirmados', valor: confirmadosHoje, cor: '#16a34a' },
    { nome: 'Faltaram', valor: faltaram, cor: '#dc2626' },
  ];

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-sm font-semibold text-gray-900">Comparativo geral</h2>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={dados} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
            <XAxis
              dataKey="nome"
              tick={{ fontSize: 12, fill: '#6b7280' }}
              axisLine={{ stroke: '#e5e7eb' }}
              tickLine={false}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fontSize: 12, fill: '#6b7280' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip formatter={(valor) => [valor ?? 0, 'Agendamentos']} cursor={{ fill: '#f9fafb' }} />
            <Bar dataKey="valor" radius={[6, 6, 0, 0]} maxBarSize={48}>
              {dados.map((item) => (
                <Cell key={item.nome} fill={item.cor} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}