'use client'

import { useState } from 'react'
import { createSale } from '@/actions/sales'
import { closeSession } from '@/actions/sessions'
import { Plus, Minus, Trash2, ShoppingBag } from 'lucide-react'

type Product = { id: string, name: string, price: number }
type CartItem = Product & { quantity: number }

export default function PosInterface({ session, products }: { session: { id: string, initialCash: number, initialBank: number, sales: { totalAmount: number }[] }, products: Product[] }) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [deliveryFee, setDeliveryFee] = useState<string>('0')
  const [loading, setLoading] = useState(false)
  const [closing, setClosing] = useState(false)

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id)
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
      }
      return [...prev, { ...product, quantity: 1 }]
    })
  }

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id))
  }

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQ = item.quantity + delta
        return newQ > 0 ? { ...item, quantity: newQ } : item
      }
      return item
    }))
  }

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const total = subtotal + Number(deliveryFee || 0)

  const handleCheckout = async () => {
    if (cart.length === 0) return
    setLoading(true)
    const items = cart.map(c => ({ productId: c.id, quantity: c.quantity, price: c.price }))
    await createSale(session.id, items, Number(deliveryFee || 0))
    setCart([])
    setDeliveryFee('0')
    setLoading(false)
  }

  const handleCloseSession = async () => {
    if (!confirm('Tem certeza que deseja fechar o caixa?')) return
    setClosing(true)

    // Calculate final cash manually or input? Usually input.
    // For simplicity of this requirement ("exibindo um relatório completo das vendas, somado taxas"),
    // we'll just auto-calculate expected final values based on initial + sales for now,
    // or we can prompt for real values. Let's auto-calculate expected.
    const totalSalesAmount = session.sales.reduce((sum: number, s: { totalAmount: number }) => sum + s.totalAmount, 0)
    // Assume all sales go to bank/card for now or just add to cash.
    // Since we don't have payment methods, let's just add to cash to close.
    const finalCash = session.initialCash + totalSalesAmount
    const finalBank = session.initialBank

    await closeSession(session.id, finalCash, finalBank)
    setClosing(false)
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full">
      {/* Products List */}
      <div className="flex-1 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Produtos</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {products.map(product => (
            <button
              key={product.id}
              onClick={() => addToCart(product)}
              className="p-4 border border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all text-left flex flex-col h-full"
            >
              <span className="font-semibold text-gray-800 line-clamp-2 mb-2">{product.name}</span>
              <span className="text-blue-600 font-bold mt-auto">R$ {product.price.toFixed(2)}</span>
            </button>
          ))}
          {products.length === 0 && (
            <div className="col-span-full text-center py-10 text-gray-500">
              Nenhum produto cadastrado. Vá até a aba Produtos para adicionar.
            </div>
          )}
        </div>
      </div>

      {/* Cart sidebar */}
      <div className="w-full lg:w-96 bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col h-[calc(100vh-6rem)]">
        <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <ShoppingBag size={20}/>
            Carrinho
          </h2>
          <button
            onClick={handleCloseSession}
            disabled={closing}
            className="text-xs bg-red-100 text-red-600 px-3 py-1.5 rounded-lg font-medium hover:bg-red-200"
          >
            {closing ? 'Fechando...' : 'Fechar Caixa'}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto mb-4 space-y-3">
          {cart.length === 0 ? (
            <div className="text-center text-gray-400 py-10">
              Carrinho vazio
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-100">
                <div className="flex-1">
                  <div className="font-medium text-sm text-gray-800 line-clamp-1">{item.name}</div>
                  <div className="text-blue-600 text-sm">R$ {(item.price * item.quantity).toFixed(2)}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => updateQuantity(item.id, -1)} className="p-1 bg-white rounded shadow-sm hover:bg-gray-100">
                    <Minus size={14} />
                  </button>
                  <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, 1)} className="p-1 bg-white rounded shadow-sm hover:bg-gray-100">
                    <Plus size={14} />
                  </button>
                  <button onClick={() => removeFromCart(item.id)} className="p-1 ml-1 text-red-500 hover:bg-red-50 rounded">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="pt-4 border-t border-gray-100 space-y-4">
          <div className="flex justify-between items-center text-sm text-gray-600">
            <span>Subtotal</span>
            <span>R$ {subtotal.toFixed(2)}</span>
          </div>

          <div className="flex items-center justify-between">
            <label className="text-sm text-gray-600">Taxa de Entrega (R$)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={deliveryFee}
              onChange={(e) => setDeliveryFee(e.target.value)}
              className="w-24 border border-gray-300 rounded p-1.5 text-right text-sm outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex justify-between items-center text-lg font-bold text-gray-800 pt-2 border-t border-gray-100">
            <span>Total</span>
            <span>R$ {total.toFixed(2)}</span>
          </div>

          <button
            onClick={handleCheckout}
            disabled={cart.length === 0 || loading}
            className="w-full bg-green-600 text-white font-medium py-3 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Finalizando...' : 'Finalizar Venda'}
          </button>
        </div>
      </div>
    </div>
  )
}