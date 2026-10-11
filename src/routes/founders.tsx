import { createFileRoute, redirect } from '@tanstack/react-router'

// /founders used to be the invite-only diagnostic claim page (now /claim-diagnostic).
// The founders themselves live on the About page, so this permanently forwards there.
export const Route = createFileRoute('/founders')({
  beforeLoad: () => {
    throw redirect({ to: '/about', hash: 'team', statusCode: 301 })
  },
})
