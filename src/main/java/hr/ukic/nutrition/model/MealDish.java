package hr.ukic.nutrition.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Getter
@Setter
@Entity
@Table(name = "meal_dish", schema = "nutrition")
public class MealDish {
    @EmbeddedId
    private MealDishId id;

    @MapsId("mealId")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "meal_id", nullable = false)
    private Meal meal;

    @MapsId("dishId")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "dish_id", nullable = false)
    private Dish dish;

    public MealDish() {
        this.id = new MealDishId();
    }
}
