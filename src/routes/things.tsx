import { createFileRoute, redirect } from '@tanstack/react-router'
import { TOOLS, toolUrl } from '../components/FreeTools'

// Short link: rothenhall.com/things forwards to the tool, tagged so its traffic is countable.
export const Route = createFileRoute('/things')({
  beforeLoad: () => {
    const tool = TOOLS.find((t) => t.key === 'things')!
    throw redirect({ href: toolUrl(tool.base, 'shortlink'), statusCode: 302 })
  },
})
