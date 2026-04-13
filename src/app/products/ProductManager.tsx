'use client'

import { useState } from 'react'
import { createProduct, deleteProduct } from '@/actions/products'
import { Trash2 } from 'lucide-react'

type Category = { id: string, name: string }
type Product = { id: string, name: string, price: number, description: string | null, category: Category }

export default function ProductManager({ products, categories }: { products: Product[], categories: Category[] }) {
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [description, setDescription] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !price || !categoryId) return
    setLoading(true)
    await createProduct({ name, price: Number(price), description, categoryId })
    setName('')
    setPrice('')
    setDescription('')
    setCategoryId('')
    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza?')) return
    const res = await deleteProduct(id)
    if (!res.success && res.error) {
      setError(res.error)
      setTimeout(() => setError(''), 3000)
    }
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Produtos</h2>

      {error && <div className="bg-red-50 text-red-600 p-2 rounded text-sm mb-4">{error}</div>}

      <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 bg-gray-50 p-4 rounded-xl border border-gray-100">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
          <input required type="text" value={name} onChange={e => setName(e.target.value)} className="w-full border border-gray-300 rounded-lg p-2 outline-none focus:border-blue-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Preço (R$)</label>
          <input required type="number" step="0.01" min="0" value={price} onChange={e => setPrice(e.target.value)} className="w-full border border-gray-300 rounded-lg p-2 outline-none focus:border-blue-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
          <select required value={categoryId} onChange={e => setCategoryId(e.target.value)} className="w-full border border-gray-300 rounded-lg p-2 outline-none focus:border-blue-500">
            <option value="">Selecione...</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
          <input type="text" value={description} onChange={e => setDescription(e.target.value)} className="w-full border border-gray-300 rounded-lg p-2 outline-none focus:border-blue-500" />
        </div>
        <div className="md:col-span-2 flex justify-end">
          <button type="submit" disabled={loading} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50">
            Adicionar Produto
          </button>
        </div>
      </form>

      <div className="space-y-3">
        {products.map(p => (
          <div key={p.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100 gap-4">
            <div className="flex-1">
              <div className="font-semibold text-gray-800">{p.name}</div>
              <div className="text-sm text-gray-500">{p.category.name} {p.description && `• ${p.description}`}</div>
            </div>
            <div className="flex items-center gap-4">
              <div className="font-bold text-blue-600">R$ {p.price.toFixed(2)}</div>
              <button onClick={() => handleDelete(p.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg">
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
        {products.length === 0 && <div className="text-sm text-gray-500 text-center py-4">Nenhum produto cadastrado.</div>}
      </div>
    </div>
  )
}