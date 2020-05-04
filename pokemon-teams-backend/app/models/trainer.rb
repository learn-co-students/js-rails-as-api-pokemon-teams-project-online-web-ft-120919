class Trainer < ApplicationRecord
  has_many :pokemons

  def team_not_full
    self.pokemons.count < 5
  end
end
