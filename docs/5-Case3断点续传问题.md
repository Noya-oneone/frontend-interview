
## 断点续传问题.md
* **断点上传文件、视频: 206 断点续传、大文件加载**
* "206 断点续传" 是指在网络传输过程中，如果因为某些原因导致文件传输中断，可以从中断的地方继续传输，而不是重新开始。这种技术在下载大文件或网络环境不稳定的情况下非常有用。

* 在 HTTP 协议中，我们可以通过 Range 头来请求文件的一部分，服务器会返回 206 Partial Content 状态码和请求的文件部分。如果文件传输中断，我们可以记录**已经接收的字节数**，然后在下次请求时使用 Range 头来请求剩余的部分。

* `文件分块`：将大文件分成多个小块，每个块称为一个分片（chunk）。这样可以逐块上传，方便处理和恢复上传过程。
* `上传过程`：上传每个分片时，记录当前分片的状态（如成功或失败），以便在发生错误时重新上传未成功的分片。
* `断点续传`：上传时保存当前已上传的分片信息。若上传中断，再次开始上传时从最后成功的分片开始续传。
* `合并分片`：所有分片上传完成后，服务器端将这些分片合并成一个完整的文件。


```javascript
  document.getElementById('uploadButton').addEventListener('click', async () => {
      const fileInput = document.getElementById('fileInput');
      const file = fileInput.files[0];
      const chunkSize = 1 * 1024 * 1024; // 1 MB
      const totalChunks = Math.ceil(file.size / chunkSize);
      
      for (let i = 0; i < totalChunks; i++) {
          const start = i * chunkSize;
          const end = Math.min(start + chunkSize, file.size);
          const chunk = file.slice(start, end);
 
          const formData = new FormData();
          formData.append('chunk', chunk);
          formData.append('chunkIndex', i);
          formData.append('totalChunks', totalChunks);
          
          try {
              await fetch('/upload', {
                  method: 'POST',
                  body: formData
              });
              console.log(`Chunk ${i + 1} uploaded`);
          } catch (error) {
              console.error(`Failed to upload chunk ${i + 1}`, error);
              // Optionally retry or handle the error
          }
      }

      console.log('Upload complete');
  });

  // Node.js server example
  const express = require('express');
  const fs = require('fs');
  const path = require('path');
  const multer = require('multer');

  const app = express();
  const upload = multer({ dest: 'uploads/' });

  app.post('/upload', upload.single('chunk'), (req, res) => {
      const chunk = req.file;
      const chunkIndex = parseInt(req.body.chunkIndex, 10);
      const totalChunks = parseInt(req.body.totalChunks, 10);

      const filePath = path.join('uploads', 'uploaded_file.part');
    
      fs.appendFile(filePath, fs.readFileSync(chunk.path), (err) => {
          if (err) {
              return res.status(500).send('Failed to save chunk');
          }

          fs.unlink(chunk.path, (err) => {
              if (err) {
                  console.error('Failed to delete chunk file', err);
              }
          });

          // Check if all chunks are uploaded
          fs.stat(filePath, (err, stats) => {
              if (err) {
                  return res.status(500).send('Failed to get file stats');
              }
              if (stats.size === parseInt(req.headers['content-length'], 10)) {
                  // Rename file to final name
                  fs.rename(filePath, 'uploads/final_file', (err) => {
                      if (err) {
                          return res.status(500).send('Failed to rename file');
                      }
                      res.send('Chunk uploaded successfully');
                  });
              } else {
                  res.send('Chunk uploaded successfully');
              }
          });
      });
  });

  app.listen(3000, () => {
      console.log('Server listening on port 3000');
  });
  ```
