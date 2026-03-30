# Canvas 标签

- **影响范围**:
  - 在标签上设置宽高: `影响画布的绘图区域，直接决定画布的像素分辨率`。
  - CSS: 影响画布的显示效果，不改变实际绘图区域的像素尺寸。

- **绘图分辨率**:
  - **在标签上设置宽高**: 高度设置会影响绘图的`清晰度和细节`。
  - CSS: 可能导`致绘图模糊`，因为画布的实际分辨率未改变。

- **浏览器渲染**:
  - **在标签上设置宽高**: 直接影响渲染`输出的质量和性能`。
  - CSS: `浏览器会进行缩放`，可能导致视觉效果不如预期。

- **使用情况**:
  - **在标签上设置宽高**: 用于确保画布具有适当的`绘图分辨率`。
  - CSS: 用于响应式设计和调整`画布在页面上的显示尺寸`。

- **示例**:
  - **在标签上设置宽高**: `<canvas width="500" height="300"></canvas>`
  - CSS: `<canvas style="width: 500px; height: 300px;"></canvas>`

- **代码效果**:
  - **在标签上设置宽高**: 画布在实际像素上为 500x300。
  - CSS: 画布显示为 500x300 像素，但实际像素尺寸未变。

  ## 压缩代码

```javascript
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Canvas Image Compression</title>
</head>
<body>
    <input type="file" id="fileInput" accept="image/*">
    <img id="outputImage" alt="Compressed Image" />
    <script>
        document.getElementById('fileInput').addEventListener('change', function(event) {
            const file = event.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = function(e) {
                const img = new Image();
                img.onload = function() {
                    // Create a canvas element
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    
                    // Set canvas size to image size
                    canvas.width = img.width;
                    canvas.height = img.height;
                    
                    // Draw image on canvas
                    ctx.drawImage(img, 0, 0);
                    
                    // Compress image by reducing quality
                    const quality = 0.7; // Adjust quality between 0 and 1
                    const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
                    
                    // Show compressed image
                    document.getElementById('outputImage').src = compressedDataUrl;
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        });
    </script>
</body>
</html>
```

## SVG VS Canvas