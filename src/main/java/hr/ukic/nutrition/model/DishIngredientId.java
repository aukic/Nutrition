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
public class DishIngredientId implements Serializable {
    private static final long serialVersionUID = -479306643746142293L;
    @NotNull
    @Column(name = "dish_id", nullable = false)
    private Long dishId;

    @NotNull
    @Column(name = "ingredient_id", nullable = false)
    private Long ingredientId;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        DishIngredientId entity = (DishIngredientId) o;
        return Objects.equals(this.ingredientId, entity.ingredientId) &&
                Objects.equals(this.dishId, entity.dishId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(ingredientId, dishId);
    }

}
