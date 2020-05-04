class PokemonsController < ApplicationController
  def create 
    if params[:trainer_id]
      trainer = Trainer.find_by(id: params[:trainer_id])
      if trainer && trainer.team_not_full
        @pokemon = trainer.pokemons.build
        @pokemon.nickname = Faker::Name.first_name
        @pokemon.species = Faker::Games::Pokemon.name
        render json: @pokemon.to_json(:except => [:created_at, :updated_at]) if @pokemon.save
      else 
        render json: { message: "TEAM FULL" }
      end
    end
  end

  def destroy
    pokemon = Pokemon.find_by(id: params[:id])
    if pokemon
      pokemon.destroy
      render json: pokemon.to_json(:only => [:id])
    else 
      render json: { message: "THAT POKEMON IS ALREADY WILD" }
    end
  end
end
