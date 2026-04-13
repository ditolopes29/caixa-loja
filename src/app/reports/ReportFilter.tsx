'use client'

import { useState, useEffect } from 'react'
import { getSalesByDateRange } from '@/actions/sales'
import { format, startOfDay } from 'date-fns'
import { Search } from 'lucide-react'

import { useCallback } from 'react'

type SaleItem = { quantity: number; product: { name: string } }
type SaleType = { id: string, totalAmount: number, deliveryFee: number, items: SaleItem[], createdAt: Date | string }

export default function ReportFilter() {
  const [startDate, setStartDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [endDate, setEndDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [sales, setSales] = useState<SaleType[]>([])
  const [loading, setLoading] = useState(false)

  const fetchSales = useCallback(async () => {
    setLoading(true)
    const data = await getSalesByDateRange(startOfDay(new Date(startDate)), new Date(endDate))
    setSales(data)
    setLoading(false)
  }, [startDate, endDate])

  useEffect(() => {
    fetchSales()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const totalSales = sales.reduce((sum, sale) => sum + sale.totalAmount, 0)
  const totalDeliveryFees = sales.reduce((sum, sale) => sum + sale.deliveryFee, 0)
  const totalItems = sales.reduce((sum, sale) => sum + sale.items.reduce((s: number, i: SaleItem) => s + i.quantity, 0), 0)

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-wrap gap-4 items-end">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Data Inicial</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border border-gray-300 rounded-lg p-2 outline-none focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Data Final</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border border-gray-300 rounded-lg p-2 outline-none focus:border-blue-500"
          />
        </div>
        <button
          onClick={fetchSales}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Search size={18} />
          Filtrar
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="text-gray-500 text-sm font-medium">Total em Vendas</div>
          <div className="text-3xl font-bold text-gray-800 mt-2">R$ {totalSales.toFixed(2)}</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="text-gray-500 text-sm font-medium">Taxas de Entrega</div>
          <div className="text-3xl font-bold text-gray-800 mt-2">R$ {totalDeliveryFees.toFixed(2)}</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="text-gray-500 text-sm font-medium">Itens Vendidos</div>
          <div className="text-3xl font-bold text-gray-800 mt-2">{totalItems}</div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="p-4 font-medium text-gray-600">Data/Hora</th>
              <th className="p-4 font-medium text-gray-600">Itens</th>
              <th className="p-4 font-medium text-gray-600 text-right">Taxa Entrega</th>
              <th className="p-4 font-medium text-gray-600 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {sales.map((sale) => (
              <tr key={sale.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                <td className="p-4 text-sm text-gray-800">
                  {format(new Date(sale.createdAt), 'dd/MM/yyyy HH:mm')}
                </td>
                <td className="p-4 text-sm text-gray-600">
                  {sale.items.map((item: SaleItem) => `${item.quantity}x ${item.product.name}`).join(', ')}
                </td>
                <td className="p-4 text-sm text-gray-800 text-right">
                  R$ {sale.deliveryFee.toFixed(2)}
                </td>
                <td className="p-4 text-sm font-medium text-blue-600 text-right">
                  R$ {sale.totalAmount.toFixed(2)}
                </td>
              </tr>
            ))}
            {sales.length === 0 && !loading && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-gray-500">
                  Nenhuma venda encontrada no período.
                </td>
              </tr>
            )}
            {loading && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-gray-500">
                  Carregando...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}