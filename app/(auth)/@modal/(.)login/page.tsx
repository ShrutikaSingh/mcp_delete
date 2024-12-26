'use client'

import { useRouter } from 'next/navigation'
import { LoginForm } from '@/components/auth/login-form'
import { Dialog, DialogContent, DialogHeader, DialogTitle, } from '@/components/ui/dialog'

export default function Page() {
  const router = useRouter()

  return (
    <Dialog open onOpenChange={() => router.back()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle> </DialogTitle>
        </DialogHeader>
        <LoginForm />
      </DialogContent>
    </Dialog>
  )
}