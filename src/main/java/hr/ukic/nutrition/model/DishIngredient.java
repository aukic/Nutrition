package hr.ukic.nutrition.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Getter
@Setter
@Entity
@Table(name = "dish_ingredient", schema = "nutrition")
public class DishIngredient {
    @EmbeddedId
    private DishIngredientId id;

    @MapsId("dishId")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "dish_id", nullable = false)
    private Dish dish;

    @MapsId("ingredientId")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "ingredient_id", nullable = false)
    private Ingredient ingredient;

    @NotNull
    @ColumnDefault("0")
    @Column(name = "weight_in_grams", nullable = false)
    private Integer weightInGrams;

    public DishIngredient() {
        this.id = new DishIngredientId();
    }
}
