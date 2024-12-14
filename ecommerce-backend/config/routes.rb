Rails.application.routes.draw do
  devise_for :users,
    path: "",
    path_names: {
      sign_in: "login",
      sign_out: "logout",
      registration: "signup"
    },
    controllers: {
      sessions: "users/sessions",
      registrations: "users/registrations"
    }
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Defines the root path route ("/")
  # root "posts#index"

  namespace :api do
    namespace :v1 do

      resource :profile, only: [ :show, :update ]
      resource :password, only: [ :update ]
      resources :sizes
      resources :designs
      resources :colors
      resources :categories
      resources :products do
        resources :product_sizes, path: "sizes"
        resources :product_designs, path: "designs"
        resources :product_colors, path: "colors"
        member do
          post :manage_stock
        end
      end
      resources :favorites, only: [ :index, :create, :destroy ] do
        collection do
          get "check", to: "favorites#check"
        end
      end
      resources :orders do
        member do
          post :cancel
        end
      end
      resources :products do
        resources :product_categories, only: [:create, :destroy], path: 'categories'
      end
      resources :cart_items do
        collection do
          delete :clear
          get :count
          get :total
        end
      end
    end
  end
end
