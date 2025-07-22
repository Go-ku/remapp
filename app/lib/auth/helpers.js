import { getServerSession } from 'next-auth'
import { authOptions } from './options'
import { redirect } from 'next/navigation'

export async function requireAuth() {
  const session = await getServerSession(authOptions)
  console.log("from inside helper:", session)
  if (!session) {
    redirect('/api/auth/signin')
  }
  
  return session
}

export async function requireRole(requiredRole) {
  const session = await requireAuth()
  console.log(session.user.role)
  if (session.user.role !== requiredRole) {
    redirect('/unauthorized')
  }
  
  return session
}

export async function getOptionalSession() {
  return await getServerSession(authOptions)
}