
import '../styles/globals.css'
import type { AppProps /*, AppContext */ } from 'next/app'

function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

export default App


// import '../styles/globals.css'

// function SafeHydrate({ children }) {
//   return (
//     <div suppressHydrationWarning>
//       {typeof window === 'undefined' ? null : children}
//     </div>
//   )
// }

// function MyApp({ Component, pageProps }) {
//   return <SafeHydrate><Component {...pageProps} /></SafeHydrate>
// }

// export default MyApp