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

# 清除现有数据
# puts "Cleaning database..."
# User.destroy_all
# Product.destroy_all

# # 创建管理员用户
# puts "Creating admin user..."
# admin = User.create!(
#   username: "admin",
#   email: "admin@example.com",
#   password: "password123",
#   role: "admin",
#   phone: "13800138000",
#   address: "123 Admin Street",
#   bio: "System administrator"
# )

# # 创建普通用户
# puts "Creating regular users..."
# 5.times do |i|
#   User.create!(
#     username: "user#{i+1}",
#     email: "user#{i+1}@example.com",
#     password: "password123",
#     role: "buyer",
#     phone: "1380013#{format('%04d', i+1)}",
#     address: "#{i+1} User Street, City",
#     bio: "Regular user #{i+1}"
#   )
# end

puts "Starting seeding process..."


# test1 1@test.com  test1111 test1111
# test2 2@test.com  test2222 test2222
# 创建管理员用户
admin_data = {
  username: "admin",
  email: "admin@example.com",
  password: "password123",
  role: "admin",
  phone_number: "13800138000",
  address: "123 Admin Street"
  # bio: "System administrator"
}

if User.find_by(email: admin_data[:email])
  puts "Admin user already exists, skipping..."
else
  User.create!(admin_data)
  puts "Created admin user"
end

# 创建普通用户
5.times do |i|
  user_data = {
    username: "user#{i+1}",
    email: "user#{i+1}@example.com",
    password: "password123",
    role: "buyer",
    phone_number: "1380013#{format('%04d', i+1)}",
    address: "#{i+1} User Street, City"
    # bio: "Regular user #{i+1}"
  }

  if User.find_by(email: user_data[:email])
    puts "User #{user_data[:email]} already exists, skipping..."
  else
    User.create!(user_data)
    puts "Created user: #{user_data[:email]}"
  end
end


# 产品数据
electronic_products = [
  {
    product_name: "MacBook Pro 14-inch",
    description: "Apple M2 Pro chip, 16GB RAM, 512GB SSD, Space Gray",
    price: 1999.99,
    stock_quantity: 50,
    sales_count: 200,
    status: "active"
  },
  {
    product_name: "iPhone 14 Pro",
    description: "A16 Bionic chip, 256GB Storage, Dynamic Island, Deep Purple",
    price: 1099.99,
    stock_quantity: 0,
    sales_count: 500,
    status: "active"
  },
  {
    product_name: "Sony WH-1000XM4",
    description: "Wireless Noise Cancelling Headphones, Black",
    price: 349.99,
    stock_quantity: 100,
    sales_count: 300,
    status: "active"
  }
]

clothing_products = [
  {
    product_name: "Nike Air Max 270",
    description: "Men's Running Shoes, Black/White",
    price: 150.00,
    stock_quantity: 75,
    sales_count: 150,
    status: "active"
  },
  {
    product_name: "Levi's 501 Original Fit Jeans",
    description: "Men's Regular Fit Jeans, Dark Blue Wash",
    price: 69.99,
    stock_quantity: 200,
    sales_count: 80,
    status: "active"
  },
  {
    product_name: "Champion Hoodie",
    description: "Classic Pullover Hoodie, Gray",
    price: 45.00,
    stock_quantity: 0,
    sales_count: 250,
    status: "inactive"
  }
]

home_products = [
  {
    product_name: "Philips Hue Starter Kit",
    description: "Smart LED Bulb Starter Kit, White and Color",
    price: 199.99,
    stock_quantity: 30,
    sales_count: 120,
    status: "active"
  },
  {
    product_name: "Dyson V11 Absolute",
    description: "Cordless Vacuum Cleaner, Gold",
    price: 599.99,
    stock_quantity: 15,
    sales_count: 90,
    status: "active"
  },
  {
    product_name: "IKEA BILLY Bookcase",
    description: "Bookshelf, White",
    price: 79.99,
    stock_quantity: 150,
    sales_count: 200,
    status: "inactive"
  }
]

# 合并所有产品并创建
all_products = electronic_products + clothing_products + home_products

all_products.each do |product_data|
  existing_product = Product.find_by(product_name: product_data[:product_name])
  
  if existing_product
    puts "Product '#{product_data[:product_name]}' already exists, skipping..."
    next
  end

  # 开启事务以确保数据完整性
  Product.transaction do
    product = Product.create!(product_data)
    puts "Created product: #{product.product_name}"
    
    # 为产品添加示例图片
    image_path = Rails.root.join("lib", "assets", "seed_images", "#{product.product_name.parameterize}.jpg")
    if File.exist?(image_path)
      unless product.image.attached?
        product.image.attach(
          io: File.open(image_path),
          filename: "#{product.product_name.parameterize}.jpg",
          content_type: "image/jpeg"
        )
        puts "Attached image for: #{product.product_name}"
      end
    else
      puts "No image found for: #{product.product_name}"
    end
  end
end

# 输出统计信息
puts "\nSeeding completed!"
puts "Current database status:"
puts "- #{User.count} total users"
puts "- #{User.where(role: 'admin').count} admins"
puts "- #{User.where(role: 'buyer').count} buyers"
puts "- #{Product.count} total products"
puts "- #{Product.where(status: 'active').count} active products"
puts "- #{Product.where(stock_quantity: 0).count} out-of-stock products"
