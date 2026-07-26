'use client'

import { useState } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'

interface ChartData {
  name: string
  total: number
  icon: string
}

// Desaturated neutral tones from the graphite family, with terracotta accent for top/active category
const GRAPHITE_COLORS = [
  '#E17A4D', // Top category gets terracotta accent highlight
  '#40424E',
  '#4E505E',
  '#5C5E6E',
  '#6B6D7F',
  '#797C90',
  '#888BA1',
]

export function DashboardChart({ data }: { data: ChartData[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  if (!data || data.length === 0) {
    return (
      <div className="flex h-[320px] items-center justify-center text-body-muted-luma glass-card rounded-[20px]">
        No spending data for this month.
      </div>
    )
  }

  const chartData = data.map(item => ({
    name: `${item.icon} ${item.name}`,
    total: item.total
  }))

  return (
    <div className="h-[320px] w-full glass-card p-4 rounded-[20px] relative overflow-hidden">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={65}
            outerRadius={100}
            paddingAngle={4}
            dataKey="total"
            stroke="none"
            onMouseEnter={(_, index) => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(null)}
          >
            {chartData.map((_, index) => {
              const isHovered = activeIndex === index
              const baseColor = GRAPHITE_COLORS[index % GRAPHITE_COLORS.length]
              const fill = isHovered ? '#E17A4D' : baseColor
              return (
                <Cell
                  key={`cell-${index}`}
                  fill={fill}
                  className="transition-all duration-200"
                  style={{
                    filter: isHovered ? 'drop-shadow(0 0 8px rgba(225, 122, 77, 0.4))' : 'none',
                    cursor: 'pointer',
                  }}
                />
              )
            })}
          </Pie>
          <Tooltip 
            formatter={(value: any) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Spent']}
            contentStyle={{
              borderRadius: '14px',
              backgroundColor: '#232429',
              border: '1px solid rgba(255, 255, 255, 0.09)',
              color: '#F2EFEA',
              fontFamily: 'var(--font-inter), sans-serif',
              boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
            }}
            itemStyle={{ color: '#F2EFEA', fontWeight: 600 }}
          />
          <Legend
            wrapperStyle={{ paddingTop: '16px', fontFamily: 'var(--font-inter), sans-serif', fontSize: '12px', color: '#8A8790' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
