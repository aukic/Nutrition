package hr.ukic.nutrition.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.Hibernate;

import java.io.Serializable;
import java.util.Objects;

@Getter
@Setter
@Embeddable
public class MealDishId implements Serializable {
    private static final long serialVersionUID = 5543462096654080002L;
    @NotNull
    @Column(name = "meal_id", nullable = false)
    private Long mealId;

    @NotNull
    @Column(name = "dish_id", nullable = false)
    private Long dishId;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        MealDishId entity = (MealDishId) o;
        return Objects.equals(this.mealId, entity.mealId) &&
                Objects.equals(this.dishId, entity.dishId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(mealId, dishId);
    }

}
