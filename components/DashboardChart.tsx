'use client'

import { useState } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { getCategoryColor } from '@/lib/category-colors'

interface ChartData {
  name: string
  total: number
  icon: string
}

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
    name: item.name,
    icon: item.icon,
    displayName: `${item.icon} ${item.name}`,
    total: item.total,
    color: getCategoryColor(item.name),
  }))

  return (
    <div className="h-[340px] w-full glass-card p-4 rounded-[20px] relative overflow-hidden flex flex-col justify-between">
      <div className="h-[230px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={95}
              paddingAngle={4}
              dataKey="total"
              stroke="none"
              onMouseEnter={(_, index) => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              {chartData.map((entry, index) => {
                const isHovered = activeIndex === index
                return (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    stroke={isHovered ? '#E17A4D' : 'none'}
                    strokeWidth={isHovered ? 2 : 0}
                    className="transition-all duration-200"
                    style={{
                      opacity: activeIndex !== null && !isHovered ? 0.65 : 1,
                      filter: isHovered ? 'drop-shadow(0 0 10px rgba(225, 122, 77, 0.45))' : 'none',
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
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Custom categorical-colored Legend grid */}
      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 pt-2 border-t border-[rgba(255,255,255,0.06)]">
        {chartData.map((item, index) => {
          const isHovered = activeIndex === index
          return (
            <div
              key={item.name}
              className="flex items-center gap-1.5 cursor-pointer text-xs transition-opacity hover:opacity-100"
              style={{ opacity: activeIndex !== null && !isHovered ? 0.5 : 1 }}
              onMouseEnter={() => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0 transition-all duration-200"
                style={{
                  backgroundColor: item.color,
                  boxShadow: isHovered ? '0 0 8px #E17A4D' : 'none',
                }}
              />
              <span className="font-fraunces text-[#F2EFEA] truncate max-w-[110px]">
                {item.icon} {item.name}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
