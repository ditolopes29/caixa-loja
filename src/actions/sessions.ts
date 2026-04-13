'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function openSession(initialCash: number, initialBank: number) {
  const existingSession = await prisma.session.findFirst({
    where: { closedAt: null }
  })

  if (existingSession) {
    return { success: false, error: 'There is already an open session' }
  }

  await prisma.session.create({
    data: {
      initialCash,
      initialBank
    }
  })

  revalidatePath('/pos')
  return { success: true }
}

export async function closeSession(id: string, finalCash: number, finalBank: number) {
  const session = await prisma.session.findUnique({
    where: { id },
    include: { sales: true }
  })

  if (!session) return { success: false, error: 'Session not found' }

  const totalDeliveryFees = session.sales.reduce((sum, sale) => sum + sale.deliveryFee, 0)

  await prisma.session.update({
    where: { id },
    data: {
      closedAt: new Date(),
      finalCash,
      finalBank,
      totalDeliveryFees
    }
  })

  revalidatePath('/pos')
  revalidatePath('/reports')
  return { success: true }
}

export async function getCurrentSession() {
  return await prisma.session.findFirst({
    where: { closedAt: null },
    include: {
      sales: {
        include: {
          items: {
            include: {
              product: true
            }
          }
        }
      }
    }
  })
}