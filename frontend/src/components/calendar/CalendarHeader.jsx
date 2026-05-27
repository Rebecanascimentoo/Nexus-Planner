import { ChevronLeft, ChevronRight } from 'lucide-react'
import { getMonthName } from '../../utils/date'

export default function CalendarHeader({ year, month, onPrev, onNext }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <button
        onClick={onPrev}
        className="p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/[0.06] transition-all"
      >
        <ChevronLeft size={20} />
      </button>
      <h2 className="text-lg font-semibold text-white capitalize">
        {getMonthName(year, month)} {year}
      </h2>
      <button
        onClick={onNext}
        className="p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/[0.06] transition-all"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  )
}
