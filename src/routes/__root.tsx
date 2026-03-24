import { getLocale } from '#/paraglide/runtime'
import {
  type TokenRemap,
  ComponentsProvider,
  createTokenStyles,
  defaultLightTheme,
} from '@g4rcez/components'
import { TanStackDevtools } from '@tanstack/react-devtools'
import {
  HeadContent,
  Scripts,
  createRootRoute,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import Footer from '../components/Footer'
import Header from '../components/Header'
import TanStackQueryDevtools from '../integrations/tanstack-query/devtools'
import TanStackQueryProvider from '../integrations/tanstack-query/root-provider'
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

export const Route = createRootRoute({
  ssr: false,
  shellComponent: RootDocument,
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
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <ComponentsProvider>
      <html lang={getLocale()} data-theme="dark" className="dark">
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
