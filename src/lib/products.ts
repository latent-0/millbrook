/* One list for the Products menu, the /products hub and the footer. Order is
   priority: the platform first, then the free tools. Each entry goes straight
   to its own page. `status` is the honest state of the product today, and the
   same wording is used everywhere it appears. */

export type ProductKey = 'cailyx' | 'motion' | 'openkit' | 'things'

export type ProductGroup = 'platform' | 'tool'

export const PRODUCTS: {
  key: ProductKey
  name: string
  line: string
  short: string
  to: string
  group: ProductGroup
  /** The product's state today, shown as a badge. */
  status: string
  /** `live` runs now, `soon` is not yet open to clients, `free` is open to anyone. */
  state: 'live' | 'soon' | 'free'
  /** Three short facts shown in the menu card and on the hub. */
  facts: string[]
  featured?: boolean
  soon?: boolean
}[] = [
  {
    key: 'cailyx',
    name: 'Cailyx',
    line: 'See how AI recommends your brand, then change it.',
    short: 'AI visibility engine',
    to: '/cailyx',
    group: 'platform',
    status: 'In every engagement',
    state: 'live',
    facts: [
      'Measures how answer engines describe you',
      'Audits your site and tracks each fix to done',
      'Run by our team, with client access to follow',
    ],
    featured: true,
  },
  {
    key: 'motion',
    name: 'Motion',
    line: 'Plan, pre-flight and automate your social posts.',
    short: 'Social studio',
    to: '/motion',
    group: 'platform',
    status: 'Coming later',
    state: 'soon',
    facts: [
      'Planner and pre-flight check for each post',
      'Content lab and comment-to-DM automations',
      'Early access list is open',
    ],
    featured: true,
    soon: true,
  },
  {
    key: 'openkit',
    name: 'Openkit',
    line: 'Rehearse the real call out loud, with an AI buyer.',
    short: 'Sales Call Trainer',
    to: '/openkit',
    group: 'tool',
    status: 'Free to use',
    state: 'free',
    facts: ['Voice practice with an AI buyer', 'No account needed'],
  },
  {
    key: 'things',
    name: 'Things',
    line: 'Plush characters with a job.',
    short: 'Website mascots',
    to: '/things',
    group: 'tool',
    status: 'Free to use',
    state: 'free',
    facts: ['Build a plush mascot character', 'No account needed'],
  },
]
