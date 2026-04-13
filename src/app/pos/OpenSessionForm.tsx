'use client'

import { useState } from 'react'
import { openSession } from '@/actions/sessions'

export default function OpenSessionForm() {
  const [cash, setCash] = useState('')
  const [bank, setBank] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleOpen = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await openSession(Number(cash), Number(bank))
    if (!res.success && res.error) {
      setError(res.error)
    }
    setLoading(false)
  }

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-100 mt-10">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Abrir Caixa</h2>

      {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">{error}</div>}

      <form onSubmit={handleOpen} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Valor inicial em Dinheiro (R$)</label>
          <input
            type="number"
            step="0.01"
            min="0"
            required
            value={cash}
            onChange={(e) => setCash(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            placeholder="0.00"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Valor inicial na Conta Bancária (R$)</label>
          <input
            type="number"
            step="0.01"
            min="0"
            required
            value={bank}
            onChange={(e) => setBank(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            placeholder="0.00"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white font-medium py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 mt-6"
        >
          {loading ? 'Abrindo...' : 'Abrir Caixa'}
        </button>
      </form>
    </div>
  )
}