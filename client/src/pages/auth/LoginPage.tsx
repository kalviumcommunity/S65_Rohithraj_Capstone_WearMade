import { GalleryVerticalEnd } from "lucide-react"
import { LoginForm } from '@/components/auth/LoginForm'

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <a href="#" className="mb-6 flex items-center gap-2 font-medium">
        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <GalleryVerticalEnd className="size-4" />
        </div>
        WearMade
      </a>
      <div className="w-full max-w-xs">
        <LoginForm />
      </div>
    </div>
  )
}
