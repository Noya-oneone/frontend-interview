# Case富文本Quill

## 富文本 quill： 视频回显、图片回显、表情包

* 我自己基于Quill 封装了一个富文本编辑器，支持视频、图片、表情包的回显，并且支持上传图片、视频、表情包。
* 踩坑还比较多

```javascript
import Quill from 'quill';
import 'react-quill/dist/quill.snow.css';

import QuillBetterTable from 'quill-better-table';
import 'quill-better-table/dist/quill-better-table.css';

import ImageResize from 'quill-image-resize-module';
import { ImageDrop } from 'quill-image-drop-module';

import './index.less';

import CustomVideo from '../CustomVideo';
import CustomHtml from '../CustomHtml';

import { UploadFile } from '@Utils/upload.js';

Quill.register('modules/imageResize', ImageResize);
Quill.register('modules/imageDrop', ImageDrop);
Quill.register({ 'modules/better-table': QuillBetterTable }, true);

Quill.register(CustomVideo, true);
Quill.register(CustomHtml, true);

export const QUILL_FORMATS = ['header', 'bold', 'italic', 'underline', 'strike', 'blockquote', 'list', 'bullet', 'indent', 'link', 'image', 'align', 'color', 'background'];


export const QUILL_TOOLBAR_CON = [
  [{ font: [] }],
  [{ header: [1, 2, false] }],
  ['bold', 'italic', 'underline', 'strike', 'blockquote'],
  [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
  [{ align: [] }, { color: [] }, { background: [] }], // dropdown with defaults from theme
  ['brush'],
  ['clean'],
  ['link', 'image', 'video2'],
  ['table2'],
  ['undo', 'redo'],
  // ['code-block'],
  // ['emoji'],
];
```