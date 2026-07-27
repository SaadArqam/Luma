import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: '/',
    name: 'PaisaTrack - Personal Expense Manager',
    short_name: 'PaisaTrack',
    description: 'Track your daily expenses, manage your balance, set budgets, and keep an eye on your daily spending — all in one place.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait',
    // The PWA manifest is serialized to JSON, so these can't be var(--luma-canvas)
    // like everything else — they must stay literal. Keep them equal to
    // --luma-canvas in app/globals.css, or the splash/status bar will not match
    // the app background.
    background_color: '#1B1C21',
    theme_color: '#1B1C21',
    categories: ['finance', 'productivity'],
    lang: 'en',
    dir: 'ltr',
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        // Maskable icon: used on Android adaptive icon slots
        // Same image but declared as maskable so Android applies its own shape
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    screenshots: [
      {
        src: '/screenshot-wide.png',
        sizes: '1280x720',
        type: 'image/png',
        // @ts-ignore – form_factor is valid but not yet in all TS types
        form_factor: 'wide',
        label: 'PaisaTrack Dashboard — desktop view',
      },
      {
        src: '/screenshot-narrow.png',
        sizes: '750x1334',
        type: 'image/png',
        // @ts-ignore
        form_factor: 'narrow',
        label: 'PaisaTrack Dashboard — mobile view',
      },
    ],
    shortcuts: [
      {
        name: 'Add Expense',
        short_name: 'Add',
        description: 'Quickly log a new expense',
        url: '/expenses',
        icons: [{ src: '/icon-192x192.png', sizes: '192x192' }],
      },
      {
        name: 'View Balance',
        short_name: 'Balance',
        description: 'Check your current balance',
        url: '/balance',
        icons: [{ src: '/icon-192x192.png', sizes: '192x192' }],
      },
    ],
  }
}
