'use client'
import { FrequencyType } from '../types'

interface FrequencySelectorProps {
  value: FrequencyType
  onChange: (value: FrequencyType) => void
}

const frequencies: { value: FrequencyType; label: string }[] = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' },
]

export const FrequencySelector: React.FC<FrequencySelectorProps> = ({ value, onChange }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {frequencies.map((freq) => (
        <button
          key={freq.value}
          onClick={() => onChange(freq.value)}
          className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
            value === freq.value 
              ? 'border-blue-500 bg-blue-50 text-blue-700' 
              : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          {freq.label}
        </button>
      ))}
    </div>
  )
}
