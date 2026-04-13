import { getCurrentSession } from '@/actions/sessions'
import { getProducts } from '@/actions/products'
import OpenSessionForm from './OpenSessionForm'
import PosInterface from './PosInterface'

export const dynamic = 'force-dynamic'

export default async function PosPage() {
  const session = await getCurrentSession()
  const products = await getProducts()

  return (
    <div className="h-full">
      {!session ? (
        <OpenSessionForm />
      ) : (
        <PosInterface session={session} products={products} />
      )}
    </div>
  )
}