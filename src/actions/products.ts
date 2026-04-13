'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function createProduct(data: { name: string, description?: string, price: number, categoryId: string }) {
  await prisma.product.create({ data })
  revalidatePath('/products')
  revalidatePath('/pos')
  return { success: true }
}

export async function getProducts() {
  return await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: 'desc' }
  })
}

export async function updateProduct(id: string, data: { name: string, description?: string, price: number, categoryId: string }) {
  await prisma.product.update({
    where: { id },
    data
  })
  revalidatePath('/products')
  revalidatePath('/pos')
  return { success: true }
}

export async function deleteProduct(id: string) {
  try {
    await prisma.product.delete({
      where: { id }
    })
    revalidatePath('/products')
    revalidatePath('/pos')
    return { success: true }
  } catch (_error) {
    return { success: false, error: 'Cannot delete product that has sales' }
  }
}