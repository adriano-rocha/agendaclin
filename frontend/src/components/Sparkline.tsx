import { AreaChart, Area, ResponsiveContainer } from 'recharts';

interface SparklineProps {
  dados: number[];
  cor: string; 
}

export function Sparkline({ dados, cor }: SparklineProps) {
  const pontos = dados.map((valor, indice) => ({ indice, valor }));
  const gradienteId = `sparkline-gradiente-${cor.replace('#', '')}`;

  return (
    <div className="h-10 w-20 shrink-0">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={pontos} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id={gradienteId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={cor} stopOpacity={0.35} />
              <stop offset="100%" stopColor={cor} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="valor"
            stroke={cor}
            strokeWidth={2}
            fill={`url(#${gradienteId})`}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}