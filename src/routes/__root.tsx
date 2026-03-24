import {
  ComponentsProvider,
  createTokenStyles,
  defaultLightTheme,
} from '@g4rcez/components'
import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import Footer from '../components/Footer'
import Header from '../components/Header'
import TanStackQueryProvider from '../integrations/tanstack-query/root-provider'
import TanStackQueryDevtools from '../integrations/tanstack-query/devtools'
import { getLocale } from '#/paraglide/runtime'
import appCss from '../styles.css?url'

import type { QueryClient } from '@tanstack/react-query'

interface MyRouterContext {
  queryClient: QueryClient
}

const tokenRemap: TokenRemap = {
  colors: (t) => {
    t.value = t.value.replace('hsla(', '').replace(/\)$/, '')
    return t
  },
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  beforeLoad: async () => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('lang', getLocale())
    }
  },
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Free Gaming' },
    ],
    links: [{ rel: 'stylesheet', href: appCss }],
    styles: [
      {
        id: 'default-theme',
        children: createTokenStyles(defaultLightTheme, tokenRemap),
      },
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <ComponentsProvider>
      <html
        lang={getLocale()}
        data-theme="dark"
        className="dark"
        suppressHydrationWarning
      >
        <head>
          <HeadContent />
        </head>
        <body className="antialiased [overflow-wrap:anywhere]">
          <TanStackQueryProvider>
            <Header />
            {children}
            <Footer />
            <TanStackDevtools
              config={{
                position: 'bottom-right',
              }}
              plugins={[
                {
                  name: 'Tanstack Router',
                  render: <TanStackRouterDevtoolsPanel />,
                },
                TanStackQueryDevtools,
              ]}
            />
          </TanStackQueryProvider>
          <Scripts />
        </body>
      </html>
    </ComponentsProvider>
  )
}
