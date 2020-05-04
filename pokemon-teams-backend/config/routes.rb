Rails.application.routes.draw do
  resources :pokemons
  resources :trainers do 
    resources :pokemons, only: [:create]
  end

  delete '/pokemon/:id', to: 'pokemons#destroy'
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
