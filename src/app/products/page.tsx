import { getCategories } from '@/actions/categories'
import { getProducts } from '@/actions/products'
import CategoryManager from './CategoryManager'
import ProductManager from './ProductManager'

export const dynamic = 'force-dynamic'

export default async function ProductsPage() {
  const categories = await getCategories()
  const products = await getProducts()

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Gestão de Produtos</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <CategoryManager categories={categories} />
        </div>
        <div className="lg:col-span-2">
          <ProductManager products={products} categories={categories} />
        </div>
      </div>
    </div>
  )
}