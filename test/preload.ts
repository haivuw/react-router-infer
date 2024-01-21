import { GlobalRegistrator } from '@happy-dom/global-registrator'

// https://github.com/oven-sh/bun/issues/6044#issuecomment-1743414281
const oldConsole = console
GlobalRegistrator.register()
window.console = oldConsole
