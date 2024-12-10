class Blog < ApplicationRecord
    has_many :comments
    validates :title, :content, presence: true
end
