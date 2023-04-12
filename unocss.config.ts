import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetUno,
  presetWebFonts,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

export default defineConfig({
  shortcuts: [
    ['btn', ' border-0 px-4 py-1 flex items-center rounded inline-block bg-teal-700 text-white cursor-pointer hover:bg-teal-800 disabled:cursor-default disabled:bg-gray-600 disabled:opacity-50'],
    ['gray-btn', 'px-4 flex items-center text-xl text-white rounded bg-gray-500 hover:shadow-md duration-300 cursor-pointer border-0 font-sans disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500'],
    ['loading-btn', ' cursor-not-allowed animate-pulse w-full h-full px-3 flex items-center justify-center text-slate-900/70 bg-slate-300/50 dark:text-slate-400 dark:bg-slate-500/40'],
    ['icon-btn', 'text-[0.9em] inline-block cursor-pointer select-none opacity-75 transition duration-200 ease-in-out hover:opacity-100 !outline-none'],
    ['chat-btn', 'bg-gray-100/20 bg-gray-400/20  cursor-pointer rounded-lg w-4 py-1 px-3 center'],
    ['center', 'flex items-center justify-center'],
    ['center-y', 'flex items-center'],
    ['center-x', 'flex justify-center'],
    ['input', ' flex-1 text-gray-500 dark:text-gray-400 bg-transparent border-0 border-b border-gray-500 focus:border-gray-600 dark:focus:border-gray-400 text-left overflow-hidden overflow-ellipsis pr-1 outline-none'],
    ['input-box', 'bg-slate-300/50 dark:text-slate-400 dark:placeholder:text-slate-400 dark:placeholder:opacity-30 dark:bg-slate-500/40 border-0 text-lg outline-none rounded px-3;'],
    ['chat-box', ' bg-slate/30 dark:bg-slate-500/40 dark:text-slate-200 rounded'],
    ['nav-item', 'flex h-6 cursor-pointer items-center gap-3 rounded-md py-2 px-3  transition-colors duration-200 hover:bg-gray-500/10'],
    ['base-shadow', 'shadow-pink/10 shadow'],
    ['select-settings', 'p2 border border-base rounded w-full block bg-base'],
  ],
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
      warn: true,
    }),
    presetTypography(),
    presetWebFonts({
      fonts: {
        sans: 'DM Sans',
        serif: 'DM Serif Display',
        mono: 'DM Mono',
      },
    }),
  ],
  transformers: [
    transformerDirectives(),
    transformerVariantGroup(),
  ],
})
