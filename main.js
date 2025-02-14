const { app, BrowserWindow } = require('electron');
const { autoUpdater } = require('electron-updater');
const path = require('path');
const url = require('url');

// Thêm log cho auto-updater
autoUpdater.logger = require('electron-log');
autoUpdater.logger.transports.file.level = 'info';

// Cấu hình auto-updater
autoUpdater.setFeedURL({
  provider: 'github',
  owner: 'vinhnk',
  repo: 'test_auto_updater',
  private: false, // true nếu là private repo
});

// Kiểm tra update
function checkForUpdates() {
  autoUpdater.checkForUpdatesAndNotify();
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false,
      allowRunningInsecureContent: true,
      cors: true,
      webviewTag: true,
      permissions: [
        'clipboard-read',
        'clipboard-write',
        'media',
        'display-capture',
        'mediaKeySystem',
        'geolocation',
        'notifications'
      ]
    }
  });

  // Trong môi trường development
  if (process.env.NODE_ENV === 'development') {
    win.loadURL('http://localhost:4200');
  } else {
    // Trong môi trường production
    const indexPath = path.resolve(__dirname, 'dist/xe_web_crm/browser/index.html');
    console.log('Loading file from:', indexPath); // Để debug đường dẫn
    win.loadFile(indexPath);
  }

  // Thêm headers CORS cho cả file local
  win.webContents.session.webRequest.onBeforeSendHeaders(
    { urls: ['file://*', 'http://*', 'https://*'] },  // Thêm file:// protocol
    (details, callback) => {
      callback({
        requestHeaders: {
          ...details.requestHeaders,
          'Origin': '*'
        }
      });
    }
  );

  win.webContents.session.webRequest.onHeadersReceived(
    { urls: ['file://*', 'http://*', 'https://*'] },  // Thêm file:// protocol
    (details, callback) => {
      callback({
        responseHeaders: {
          ...details.responseHeaders,
          'Access-Control-Allow-Origin': ['*'],
          'Access-Control-Allow-Methods': ['*'],
          'Access-Control-Allow-Headers': ['*']
        }
      });
    }
  );

  // Kiểm tra update khi khởi động
  checkForUpdates();
}

// Xử lý các sự kiện update
autoUpdater.on('checking-for-update', () => {
  console.log('Đang kiểm tra cập nhật...');
});

autoUpdater.on('update-available', (info) => {
  console.log('Có bản cập nhật mới:', info);
});

autoUpdater.on('update-not-available', (info) => {
  console.log('Không có bản cập nhật mới');
});

autoUpdater.on('error', (err) => {
  console.log('Lỗi khi cập nhật:', err);
});

autoUpdater.on('download-progress', (progressObj) => {
  let log_message = `Tốc độ tải: ${progressObj.bytesPerSecond}`;
  log_message = `${log_message} - Đã tải ${progressObj.percent}%`;
  log_message = `${log_message} (${progressObj.transferred}/${progressObj.total})`;
  console.log(log_message);
});

autoUpdater.on('update-downloaded', (info) => {
  console.log('Đã tải xong bản cập nhật');
  // Cài đặt và khởi động lại ứng dụng
  autoUpdater.quitAndInstall();
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
}); 