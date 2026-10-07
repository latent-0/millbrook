/* One list for the Products menu. Order is priority: the two flagship
   products first (featured), then the other two. Each entry goes straight to
   its own page; Openkit and Things use the short links that forward to the
   tools with tracking attached. */

export type ProductKey = 'cailyx' | 'motion' | 'openkit' | 'things'

export const PRODUCTS: {
  key: ProductKey
  name: string
  line: string
  short: string
  to: string
  featured?: boolean
  soon?: boolean
}[] = [
  { key: 'cailyx', name: 'Cailyx', line: 'See how AI recommends your brand, then change it.', short: 'AI visibility engine', to: '/cailyx', featured: true },
  { key: 'motion', name: 'Motion', line: 'Plan, pre-flight and automate your social posts.', short: 'Social studio', to: '/motion', featured: true, soon: true },
  { key: 'openkit', name: 'Openkit', line: 'Rehearse the real call out loud, with an AI buyer.', short: 'Sales Call Trainer', to: '/openkit' },
  { key: 'things', name: 'Things', line: 'Plush characters with a job.', short: 'Website mascots', to: '/things' },
]
