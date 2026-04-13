'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function createSale(sessionId: string, items: { productId: string, quantity: number, price: number }[], deliveryFee: number) {
  const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0) + deliveryFee

  await prisma.sale.create({
    data: {
      sessionId,
      totalAmount,
      deliveryFee,
      items: {
        create: items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price
        }))
      }
    }
  })

  revalidatePath('/pos')
  return { success: true }
}

export async function getSalesByDateRange(startDate: Date, endDate: Date) {
  // set end date to end of day
  const endOfDay = new Date(endDate)
  endOfDay.setHours(23, 59, 59, 999)

  const sales = await prisma.sale.findMany({
    where: {
      createdAt: {
        gte: startDate,
        lte: endOfDay
      }
    },
    include: {
      items: {
        include: {
          product: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  return sales
}