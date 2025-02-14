const { app, BrowserWindow } = require('electron');
const { autoUpdater } = require('electron-updater');
const log = require('electron-log');
const path = require('path');
const url = require('url');

// Thêm log chi tiết
log.transports.file.level = 'debug';
autoUpdater.logger = log;

// Cấu hình auto-updater
autoUpdater.setFeedURL({
  provider: 'github',
  owner: 'vinhnk',
  repo: 'test_auto_updater',
  private: false, // true nếu là private repo
});

// Thêm cấu hình cho certificate
autoUpdater.allowUnknownCertificates = true;
autoUpdater.disableWebInstaller = true;
autoUpdater.autoDownload = true;
autoUpdater.autoInstallOnAppQuit = true;
autoUpdater.allowDowngrade = false;
autoUpdater.allowPrerelease = false;
autoUpdater.forceDevUpdateConfig = true;
autoUpdater.verifyUpdateCodeSignature = false;

// Log version hiện tại
log.info('App starting... Version:', app.getVersion());

// Thêm vào đầu file sau khi khởi tạo log
console.log('Log file path:', log.transports.file.getFile().path);

// Sửa hàm checkForUpdates để thêm log trực tiếp
function checkForUpdates() {
  log.info('Bắt đầu kiểm tra cập nhật...');
  autoUpdater.checkForUpdatesAndNotify().catch(err => {
    log.error('Lỗi trong quá trình kiểm tra cập nhật:', err);
  });
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

  // Sửa lại phần cấu hình CORS
  win.webContents.session.webRequest.onBeforeSendHeaders(
    { urls: ['file:///*', 'http://*/*', 'https://*/*'] },  // Sửa URL patterns
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
    { urls: ['file:///*', 'http://*/*', 'https://*/*'] },  // Sửa URL patterns
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
  log.info('Đang kiểm tra cập nhật...');
  log.info('Current version:', app.getVersion());
});

autoUpdater.on('update-available', (info) => {
  log.info('Có bản cập nhật mới. Current version:', app.getVersion());
  log.info('New version:', info.version);
});

autoUpdater.on('update-not-available', (info) => {
  log.info('Không có bản cập nhật mới. Current version:', app.getVersion());
  log.info('Latest version:', info ? info.version : 'unknown');
});

autoUpdater.on('error', (err) => {
  log.error('Lỗi khi cập nhật:', err);
  log.error('Error details:', err.stack);
});

autoUpdater.on('download-progress', (progressObj) => {
  let log_message = `Tốc độ tải: ${progressObj.bytesPerSecond}`;
  log_message = `${log_message} - Đã tải ${progressObj.percent}%`;
  log_message = `${log_message} (${progressObj.transferred}/${progressObj.total})`;
  log.info(log_message);
});

autoUpdater.on('update-downloaded', (info) => {
  log.info('Đã tải xong bản cập nhật. Chuẩn bị cài đặt...');
  // Thêm delay trước khi cài đặt
  setTimeout(() => {
    autoUpdater.quitAndInstall(false, true);
  }, 3000);
});

// Sửa phần khởi tạo app
app.whenReady().then(() => {
  // Đảm bảo log được khởi tạo trước
  log.info('=== KHỞI ĐỘNG ỨNG DỤNG ===');
  log.info('Phiên bản hiện tại:', app.getVersion());
  
  createWindow();
  
  // Thêm try-catch để bắt lỗi
  try {
    log.info('Khởi tạo autoUpdater...');
    // Kiểm tra update ngay khi khởi động
    setTimeout(() => {
      checkForUpdates();
    }, 1000);
  } catch (error) {
    log.error('Lỗi khi khởi tạo autoUpdater:', error);
  }
  
  // Kiểm tra update định kỳ (mỗi 30 phút)
  setInterval(checkForUpdates, 30 * 60 * 1000);
});

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