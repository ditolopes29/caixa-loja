'use client'

import { useState } from 'react'
import { createCategory, deleteCategory } from '@/actions/categories'
import { Trash2 } from 'lucide-react'

type Category = { id: string, name: string }

export default function CategoryManager({ categories }: { categories: Category[] }) {
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    setLoading(true)
    await createCategory({ name })
    setName('')
    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza?')) return
    const res = await deleteCategory(id)
    if (!res.success && res.error) {
      setError(res.error)
      setTimeout(() => setError(''), 3000)
    }
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Categorias</h2>

      {error && <div className="bg-red-50 text-red-600 p-2 rounded text-sm mb-4">{error}</div>}

      <form onSubmit={handleCreate} className="flex gap-2 mb-6">
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Nova categoria"
          className="flex-1 border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50">
          Adicionar
        </button>
      </form>

      <div className="space-y-2">
        {categories.map(cat => (
          <div key={cat.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
            <span className="text-gray-700">{cat.name}</span>
            <button onClick={() => handleDelete(cat.id)} className="text-red-500 hover:bg-red-50 p-1.5 rounded">
              <Trash2 size={16} />
            </button>
          </div>
        ))}
        {categories.length === 0 && <div className="text-sm text-gray-500 text-center py-4">Nenhuma categoria.</div>}
      </div>
    </div>
  )
}