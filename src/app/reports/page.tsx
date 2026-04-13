import ReportFilter from './ReportFilter'

export const dynamic = 'force-dynamic'

export default function ReportsPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Relatórios de Vendas</h1>
      <ReportFilter />
    </div>
  )
}