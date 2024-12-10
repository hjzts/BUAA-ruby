# 简易电子商务系统

> 10个左右实体
>
> 晋级难度，最高分100分

数据库设计（参考）

- 用户表

  - id, 用户名，密码，角色（买家/管理员）……

  - users:

  - | 字段名       | 字段类型 | 其他             |
    | ------------ | -------- | ---------------- |
    | user_id      | integer  | not null, unique |
    | username     | string   | not null, unique |
    | email        | string   | not null, unique |
    | password     | string   | not null         |
    | role         | string   | admin or buyer   |
    | phone_number | string   |                  |
    | address      | text     |                  |
    | active       | boolean  |                  |

    

- 产品表

  - Id, 名称，描述，价格，销量，图片路径，几个属性（e.g. 产品类型/颜色/尺寸/设计款式）……

  - products:

  - | 字段名         | 字段类型 | 其他            |
    | -------------- | -------- | --------------- |
    | product_id     | integer  | not null        |
    | product_name   | string   | not null        |
    | description    | text     |                 |
    | price          | decimal  | not null        |
    | stock_quantity | integer  |                 |
    | sales_count    | integer  |                 |
    | image_url      | string   |                 |
    | status         | string   | default: active |

- 产品的各种属性表

  - 如颜色表，id, RGB值，颜色名称

  - sizes:

  - | 字段名      | 字段类型 | 其他 |
    | ----------- | -------- | ---- |
    | size_id     | integer  |      |
    | size_name   | string   |      |
    | description | string   |      |

    

  - designs:

  - | 字段名        | 字段类型 | 其他     |
    | ------------- | -------- | -------- |
    | design_id     | integer  | not null |
    | sales         | integer  |          |
    | design_number | string   |          |

  - colors:

  - | 字段名      | 字段类型 | 其他 |
    | ----------- | -------- | ---- |
    | color_id    | integer  |      |
    | rgb         | string   |      |
    | description | string   |      |

- 购物车表

  - 买家id，产品id，数量，添加时间

  - cart_items:

  - | 字段名   | 字段属性   | 其他        |
    | -------- | ---------- | ----------- |
    | user     | references | foreign_key |
    | product  | references | foreign_key |
    | quantity | integer    |             |

    

- 收藏夹表（选做）

  - 买家id，产品id，添加时间

  - favorites:

  - | 字段名   | 字段属性   | 其他        |
    | -------- | ---------- | ----------- |
    | user     | references | foreign_key |
    | product  | references | foreign_key |
    | added_at | datetime   |             |

    

- 订单表

  - 买家Id, 收货人，收货地址，收货电话，邮编，订单状态，添加时间，总额……

  - orders:

  - | 字段名              | 字段属性   | 其他                                     |
    | ------------------- | ---------- | ---------------------------------------- |
    | user                | references | foreign_key                              |
    | recipient_name      | string     |                                          |
    | shipping_address    | string     |                                          |
    | phone_number        | string     |                                          |
    | postal_code         | string     |                                          |
    | status              | string     | pending/paid/shipped/delivered/cancelled |
    | total_amount        | decimal    |                                          |
    | paid_at             | datetime   |                                          |
    | shipped_at          | datetime   |                                          |
    | delivered_at        | datetime   |                                          |
    | cancelled_at        | datetime   |                                          |
    | cancellation_reason | text       |                                          |

    

- 订单项表

  - 产品id，数量，价格，所属订单

  - order_items:

  - | 字段名      | 字段类型   | 其他        |
    | ----------- | ---------- | ----------- |
    | order       | references | foreign_key |
    | product     | references | foreign_key |
    | quantity    | integer    |             |
    | unit_price  | decimal    |             |
    | total_price | decimal    |             |

    
- categories:

  - | 字段名      | 字段类型 | 其他 |
    | ----------- | -------- | ---- |
    | name        | string   |      |
    | description | text     |      |
    | icon_url    | string   |      |
    | parent_id   | integer  |      |
    | position    | integer  |      |

- product_categories

  - | 字段名   | 字段类型   | 其他        |
    | -------- | ---------- | ----------- |
    | product  | references | foreign_key |
    | category | references | foreign_key |

    

**管理员操作**

- 添加/编辑/查看/删除产品
- 查看所有订单列表
- 处理订单（发货/删除）

**买家操作**

- 浏览产品列表 =>  查看单品详情
- 添加到购物
- 车购物车内容生成订单
- 查看自己的订单列表
- 订单操作（付款，确认收货，取消订单）
- 添加产品到收藏夹
- 浏览收藏夹
- 将产品从收藏夹内删除

