# flex-grow & flex-shrink

## flex-grow

`flex-grow`属性定义项目的放大比例，默认为0，即如果存在剩余空间，也不放大。如果所有项目的`flex-grow`属性都为1，则它们将等分剩余空间。

## flex-shrink

`flex-shrink`属性定义项目的缩小比例，默认为1，即如果空间不足，该项目将缩小。如果所有项目的`flex-shrink`属性都为1，当空间不足时，都将等比例缩小。

## 示例

```html
<div class="container">
  <div class="item">1</div>
  <div class="item">2</div>
  <div class="item">3</div>
</div>
```


```css
.container {
  display: flex;
  justify-content: space-between;

}

.item {
  width: 100px;
  height: 100px;
  background-color: #f00;
  color: #fff;
  font-size: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  text-align: center;
}

.item:nth-child(1) {
  flex-grow: 1;
  flex-shrink: 1;
}

.item:nth-child(2) {
  flex-grow: 2;
  flex-shrink: 0;
}

.item:nth-child(3) {
  flex-grow: 1;
  flex-shrink: 1;
}
```