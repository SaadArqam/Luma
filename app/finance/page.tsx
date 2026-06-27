import { redirect } from 'next/navigation'

export default function FinancePage() {
  // Redirect to the existing dashboard which contains all finance functionality
  redirect('/')
}
