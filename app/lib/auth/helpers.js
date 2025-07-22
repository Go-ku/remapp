// lib/auth.js - Helper functions for server components
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../app/api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'

export async function requireAuth() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/api/auth/signin')
  }
  
  return session
}

export async function requireRole(requiredRole) {
  const session = await requireAuth()
  
  if (session.user.role !== requiredRole) {
    redirect('/unauthorized')
  }
  
  return session
}

export async function getOptionalSession() {
  return await getServerSession(authOptions)
}