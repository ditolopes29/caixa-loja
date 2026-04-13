'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function createCategory(data: { name: string }) {
  await prisma.category.create({ data })
  revalidatePath('/products')
  return { success: true }
}

export async function getCategories() {
  return await prisma.category.findMany({
    orderBy: { createdAt: 'desc' }
  })
}

export async function updateCategory(id: string, data: { name: string }) {
  await prisma.category.update({
    where: { id },
    data
  })
  revalidatePath('/products')
  return { success: true }
}

export async function deleteCategory(id: string) {
  try {
    await prisma.category.delete({
      where: { id }
    })
    revalidatePath('/products')
    return { success: true }
  } catch (_error) {
    return { success: false, error: 'Cannot delete category with products' }
  }
}