import { release } from 'node:os'
import { join } from 'node:path'
import { BrowserWindow, app, dialog, ipcMain, shell } from 'electron'
import { autoUpdater } from 'electron-updater'

process.env.DIST_ELECTRON = join(__dirname, '..')
process.env.DIST = join(process.env.DIST_ELECTRON, '../dist')
process.env.PUBLIC = process.env.VITE_DEV_SERVER_URL
  ? join(process.env.DIST_ELECTRON, '../public')
  : process.env.DIST

// Disable GPU Acceleration for Windows 7
if (release().startsWith('6.1')) app.disableHardwareAcceleration()

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName())

if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}

// Remove electron security warnings
// This warning only shows in development mode
// Read more on https://www.electronjs.org/docs/latest/tutorial/security
// process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

autoUpdater.autoDownload = false
autoUpdater.autoInstallOnAppQuit = true

let win: BrowserWindow | null = null
// Here, you can also use other preload
const preload = join(__dirname, '../preload/index.js')
const url = process.env.VITE_DEV_SERVER_URL
const indexHtml = join(process.env.DIST, 'index.html')

async function createWindow() {
  win = new BrowserWindow({
    title: 'Main window',
    icon: join(process.env.PUBLIC, 'favicon.ico'),
    webPreferences: {
      preload,
      // Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
      // Consider using contextBridge.exposeInMainWorld
      // Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false,

    },
  })

  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(url)
    // Open devTool if the app is not packaged
    win.webContents.openDevTools()
  }
  else {
    win.loadFile(indexHtml)
  }

  // Test actively push message to the Electron-Renderer
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString())
  })

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) shell.openExternal(url)
    return { action: 'deny' }
  })
}
let settingsWindow: BrowserWindow | null = null

ipcMain.on('open-settings-window', (event) => {
  if (settingsWindow === null) {
    settingsWindow = new BrowserWindow({
      title: 'Setting',
      width: 700,
      height: 800,
      x: 600,
      y: 200,
      frame: true,
      titleBarStyle: 'default',
      // modal: true, // 模态窗口，会阻塞父窗口 (macOS 不支持)
      parent: win!,
      resizable: false,
      fullscreenable: false,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
      },
    })
    settingsWindow.on('closed', () => {
      settingsWindow = null
    })
    // const w = BrowserWindow.getFocusedWindow()
    // w!.setWindowButtonVisibility(true)
    if (process.env.VITE_DEV_SERVER_URL) {
      settingsWindow.webContents.openDevTools()
      settingsWindow.loadURL(`${url}#/setting`)
    }

    else { settingsWindow.loadFile(indexHtml, { hash: '/setting' }) }
  }
  else {
    settingsWindow.show()
  }
})

app.on('window-all-closed', () => {
  win = null
  if (process.platform !== 'darwin') app.quit()
})

app.on('second-instance', () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) win.restore()
    win.focus()
  }
})
app.whenReady().then(() => {
  createWindow()
  autoUpdater.checkForUpdates()
})
app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows()
  if (allWindows.length)
    allWindows[0].focus()
  else
    createWindow()
})

// Global exception handler
process.on('uncaughtException', (err) => {
  console.log(err)
})

/* New Update Available */

autoUpdater.on('error', (err) => {
  dialog.showErrorBox('AutoUpdater Error', err.message)
})

autoUpdater.on('update-available', (info) => {
  dialog.showMessageBox({
    type: 'info',
    title: `发现新版本：${info.version}`,
    message: '是否立即后台下载更新?',
    buttons: ['是', '否'],
  }).then(({ response }) => {
    if (response === 0)
      autoUpdater.downloadUpdate() // 下载更新
  })
})

autoUpdater.on('update-downloaded', () => {
  dialog.showMessageBox({
    type: 'info',
    title: '更新已下载',
    message: '是否立即安装并重新启动应用?',
    buttons: ['是', '否'],
  }).then(({ response }) => {
    if (response === 0)
      autoUpdater.quitAndInstall() // 退出并安装更新
  })
})
