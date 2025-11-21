package hr.ukic.nutrition.dto;

import lombok.Data;

import java.util.Set;

@Data
public class DishResponseDTO {
    private Long id;
    private String name;
    private Set<IngredientInDishDTO> ingredients;
}
