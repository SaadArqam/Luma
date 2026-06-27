import { redirect } from 'next/navigation'

export default function HomePage() {
  // Redirect to the new Today page as the default landing page
  redirect('/today')
}
