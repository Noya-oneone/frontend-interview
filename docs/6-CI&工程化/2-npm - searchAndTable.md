# Search and Table

* 基于 Element-Plus 的表格组件，实现了搜索功能，可以根据条件查询订单信息。
* `InputItem`
  * 文本
  * 批量文本
  * 数字
  * 数字区间
  * 日期
  * 级联
  * 单选
  * 多选
  * 标签
  * 下拉
  * 下拉(带远程搜索)
  * 地址
  * AM下拉选择 (每一个AM都有自己的客户列表)
  * BD下拉选择 (每一个BD都有自己的客户列表)
  * 搜素弹出框

* `SearchAndTable`
  * 搜索条件
  * 按钮折叠区域
  * 操作区域
  * 统计区域
  * 表格列
  * 表格数据
  * 表格分页
  * 表格展开详情
  * 表格合并，表格拆分 （拆单功能、合并订单功能）

## 目录结构
```javascript
// api.js // 接口请求
// search.js // 搜索所需要的数据
// table.js // 表格所需要的数据
// handle.js // 处理数据
// data.js // 静态枚举数据
```

## 代码示例
<!-- search.js -->
```javascript 
import { PURCHASE_STATUS_LIST, SUB_WAREHOUSE } from './data.js'

import InitApi from '@/api/init.js'

export const SEARCH_LIST = [
  { code: 'purchaseCodes', type: 'batchInput', placeholder: '采购号（批量精准查询）', value: '' },
  {
    code: 'suppliersId',
    type: 'select',
    placeholder: '供应商',
    value: '',
    remoteMethod: InitApi.searchSupplier,
    remoteFormat: { label: 'supplierName', value: 'id' },
    remoteParams: { name: 'supplierName', pageNum: 'pageNum', pageSize: 'pageSize' }
  },
  { code: ['startOrderInTime', 'endOrderInTime'], type: 'date', dateType: 'datetimerange', num: 2, placeholder: '下单日期', value: [], width: '415px' },
  { code: 'depotId', type: 'select', placeholder: '分仓', data: SUB_WAREHOUSE, value: '' },
  {
    code: 'status',
    type: 'select',
    placeholder: '订单状态',
    width: '200px',
    multiple: true,
    value: '',
    remoteMethod: InitApi.searchPurchaseOrderStatus,
    remoteFormat: { label: 'label', value: 'value' },
    remoteParams: {}
  },
  { code: ['startSendTime', 'endSendTime'], type: 'date', dateType: 'datetimerange', num: 2, placeholder: '推送日期', value: [], width: '415px' },
  { code: 'productId', placeholder: '商品ID（精准查询）', value: '' },
  { code: 'skuCode', placeholder: 'SKU编号（精准查询）', value: '' },
  { code: 'stockSku', placeholder: '马帮SKU（精准查询）', value: '' },
  { code: 'mbPurchaseCode', placeholder: '马帮采购单号（精准查询）', value: '' },
  { code: 'sendStatus', type: 'select', placeholder: '马帮采购同步状态', data: PURCHASE_STATUS_LIST, value: '' },
  { code: 'showOrderId', placeholder: '业务订单号（精准查询）', value: '' },
  { code: 'logisticsNo', placeholder: '物流单号（精准查询）', value: '' }
]
```

<!-- table.js -->
```javascript 
import { ElMessage } from 'element-plus'
import { formatDepotId, transNewLine } from './handle'
export const COLUMN_LIST = [
  { name: '采购单号</br>供应商', code: ['purchaseCode', 'suppliersName'], type: 'multiple', align: 'center', width: '120px' },
  { name: '下单时间/下单人</br>推送时间/推送人', code: ['orderInStr', 'sendStr'], type: 'multiple', align: 'center', width: '160px' },
  { name: '采购/已入/未入</br>数量', code: ['numStr'], type: 'multiple', align: 'center' },
  { name: '总金额</br>(RMB)', code: 'amount', align: 'center' },
  { name: '状态</br>状态历史', code: ['statusName', 'statusHistory'], linkCode: 'statusHistory', type: 'multiple', align: 'center' },
  { name: '马帮采购单号</br>物流号', code: ['mbPurchaseCode', 'logisticsChannelAndNo'], type: 'multiple', align: 'center', width: '146px' },
  { name: '采购备注', code: 'purchaseRemark', align: 'center' },
  { name: '仓库', code: 'depotId', align: 'center', width: '48px' }
]

// 展开信息表格列表
export const EXPAND_TABLE_COLUMN_LIST = [
  { name: 'SKU图片', code: 'skuImageUrl', type: 'img', align: 'center' },
  { name: '商品名称</br>SKU规格', type: 'multiple', code: ['productName', 'supplierSku'], width: '80px', align: 'center' },
  { name: '商品ID</br>TD-SPU-ID', code: ['productId', 'spuId'], type: 'multiple', linkCode: 'spuId', width: '60px', align: 'center' },
  { name: 'SKU编号</br>TD-SKU-ID', code: ['skuCode', 'skuId'], type: 'multiple', width: '60px', align: 'center' },
  { name: '数量X单价</br>金额(RMB)</br>', code: ['numAndPrice', 'amount', 'editPrice'], type: 'multiple', linkCode: 'editPrice', align: 'center' },
  { name: '入库/在途/待发</br>', code: ['numDetail', 'orderDistributionDetail'], type: 'multiple', linkCode: 'orderDistributionDetail', align: 'center' },
  { name: '采购链接', code: 'purchaseUrl', type: 'click', width: '100px', align: 'center' },
  { name: '商品备注', code: 'goodsRemark', align: 'center' }
]
```

<!-- handle.js -->
```javascript 
export const HANDLE_TABLE = (res) => {
  try {
    let result = res.data.rows || []
    return {
      total: res.data.total,
      rows: result.map((item) => {
        return {
          ...item,
          orderInStr: `${item.orderInTime || '-'}/${item.orderInByName || '-'}`,
          sendStr: `${item.sendTime || '-'}/${item.sendByName || '-'}`,
          numStr: `${item.purchaseCount}/${item.inStockCount}/${item.unInStockCount}`,
          statusHistory: '状态历史',
          logisticsChannelAndNo: transNewLine(';', item),
          mbPurchaseCode: `${item.mbPurchaseCode ? (item.mbStatus === 1 ? `${item.mbPurchaseCode}<br /><span style="color:red">马帮已作废</span>` : item.mbPurchaseCode) : '-'}`,
          purchaseRemark: item.purchaseRemark || '-',
          depotId: formatDepotId(item.depotId)
        }
      })
    }
  } catch (e) {
    ElMessage.warning(String(e))
  }
}
```
