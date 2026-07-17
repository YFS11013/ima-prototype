import { ConfigProvider } from 'tdesign-react'
import 'tdesign-react/dist/reset.css'
import '../../design-tokens/index.css'
import Shell from './Shell'
import { createRoot } from 'react-dom/client'

createRoot(document.getElementById('root')!).render(
  <ConfigProvider globalConfig={{}}>
    <Shell />
  </ConfigProvider>
)
