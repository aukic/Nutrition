package hr.ukic.nutrition.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "dish", schema = "nutrition")
public class Dish {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @Size(max = 255)
    @NotNull
    @Column(name = "name", nullable = false)
    private String name;

    @OneToMany(mappedBy = "dish", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<DishIngredient> ingredients = new HashSet<>();

    public void addIngredient(Ingredient ingredient, int weightInGrams) {
        DishIngredient dishIngredient = new DishIngredient();
        dishIngredient.setDish(this);
        dishIngredient.setIngredient(ingredient);
        dishIngredient.setWeightInGrams(weightInGrams);
        dishIngredient.getId().setDishId(this.getId());
        dishIngredient.getId().setIngredientId(ingredient.getId());
        this.ingredients.add(dishIngredient);
    }
}
