# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end

# db/seeds.rb

# 清理现有数据
puts "Cleaning database..."
CartItem.destroy_all
Favorite.destroy_all
OrderItem.destroy_all
Order.destroy_all
ProductCategory.destroy_all
ProductColor.destroy_all
ProductSize.destroy_all
ProductDesign.destroy_all
Product.destroy_all
Category.destroy_all
Color.destroy_all
Size.destroy_all
Design.destroy_all
User.destroy_all

puts "Creating users..."
# 创建管理员
admin = User.create!(
  email: 'admin@example.com',
  password: 'password123',
  username: 'admin',
  role: 'admin'
)

# 创建普通用户
5.times do |i|
  User.create!(
    email: "user#{i+1}@example.com",
    password: 'password123',
    username: "User #{i+1}",
    role: 'buyer'
  )
end

puts "Creating categories..."
# 创建主分类
categories = {
  "Clothing" => ["T-Shirts", "Shirts", "Pants", "Dresses", "Jackets"],
  "Shoes" => ["Sneakers", "Boots", "Sandals", "Formal Shoes"],
  "Accessories" => ["Bags", "Watches", "Belts", "Hats"]
}

categories.each do |main_category, sub_categories|
  parent = Category.create!(
    name: main_category,
    description: "#{main_category} department"
  )

  sub_categories.each_with_index do |sub_name, index|
    Category.create!(
      name: sub_name,
      description: "#{sub_name} collection",
      parent: parent,
      position: index
    )
  end
end

puts "Creating sizes..."
# 创建尺寸
sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
sizes.each do |size_name|
  Size.create!(
    size_name: size_name,
    description: "#{size_name} size"
  )
end

puts "Creating colors..."
# 创建颜色
colors = {
  "Red" => "#FF0000",
  "Blue" => "#0000FF",
  "Green" => "#00FF00",
  "Black" => "#000000",
  "White" => "#FFFFFF",
  "Yellow" => "#FFFF00"
}

colors.each do |name, rgb|
  Color.create!(
    rgb: rgb,
    description: name
  )
end

puts "Creating designs..."
# 创建设计款式
10.times do |i|
  Design.create!(
    design_number: "D#{format('%03d', i+1)}",
    sales: rand(0..100)
  )
end

puts "Creating products..."
# 创建产品
20.times do |i|
  # 随机选择一个子分类
  category = Category.where.not(parent_id: nil).sample

  product = Product.create!(
    product_name: "Product #{i+1}",
    description: "This is a description for product #{i+1}",
    price: rand(10.0..1000.0).round(2),
    stock_quantity: rand(0..100),
    status: Product.statuses.keys.sample,
    user: admin
  )

  # 添加分类
  ProductCategory.create!(
    product: product,
    category: category
  )

  # 添加尺寸变体
  Size.all.sample(rand(2..4)).each do |size|
    ProductSize.create!(
      product: product,
      size: size,
      stock_quantity: rand(0..50),
      price_adjustment: rand(-10.0..10.0).round(2)
    )
  end

  # 添加颜色变体
  Color.all.sample(rand(2..4)).each do |color|
    ProductColor.create!(
      product: product,
      color: color,
      price_adjustment: rand(-10.0..10.0).round(2)
    )
  end

  # 添加设计变体
  Design.all.sample(rand(1..3)).each do |design|
    ProductDesign.create!(
      product: product,
      design: design,
      price_adjustment: rand(-10.0..10.0).round(2)
    )
  end
end

puts "Creating favorites..."
# 创建收藏
User.where(role: 'buyer').each do |user|
  products = Product.all.sample(rand(3..8))
  products.each do |product|
    Favorite.create!(
      user: user,
      product: product,
      added_at: Time.current - rand(1..30).days
    )
  end
end

puts "Creating cart items..."
# 创建购物车项目
User.where(role: 'buyer').each do |user|
  products = Product.where(status: 'active').sample(rand(1..5))
  products.each do |product|
    CartItem.create!(
      user: user,
      product: product,
      quantity: rand(1..3),
      added_at: Time.current - rand(1..7).days
    )
  end
end

puts "Creating orders..."
# 创建订单
order_statuses = ['pending', 'paid', 'shipped', 'delivered', 'cancelled']

User.where(role: 'buyer').each do |user|
  rand(2..5).times do
    status = order_statuses.sample
    created_at = Time.current - rand(1..60).days

    order = Order.create!(
      user: user,
      recipient_name: user.username,
      shipping_address: "#{rand(100..999)} Main St, City",
      phone_number: "1234567890",
      postal_code: "12345",
      status: status,
      total_amount: 0,
      created_at: created_at,
      paid_at: status == 'pending' ? nil : created_at + 1.day,
      shipped_at: ['shipped', 'delivered'].include?(status) ? created_at + 2.days : nil,
      delivered_at: status == 'delivered' ? created_at + 4.days : nil,
      cancelled_at: status == 'cancelled' ? created_at + 1.day : nil,
      cancellation_reason: status == 'cancelled' ? "Customer cancelled the order" : nil
    )

    # 创建订单项
    total_amount = 0
    rand(1..4).times do
      product = Product.where(status: 'active').sample
      quantity = rand(1..3)
      unit_price = product.price
      item_total = quantity * unit_price

      OrderItem.create!(
        order: order,
        product: product,
        quantity: quantity,
        unit_price: unit_price,
        total_price: item_total
      )

      total_amount += item_total
    end

    # 更新订单总金额
    order.update!(total_amount: total_amount)
  end
end

puts "Seed completed!"
