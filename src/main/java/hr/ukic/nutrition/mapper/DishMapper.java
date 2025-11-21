package hr.ukic.nutrition.mapper;

import hr.ukic.nutrition.dto.DishResponseDTO;
import hr.ukic.nutrition.dto.IngredientInDishDTO;
import hr.ukic.nutrition.model.Dish;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
public class DishMapper {
    public DishResponseDTO mapToDto(Dish dish) {
        DishResponseDTO dto = new DishResponseDTO();
        dto.setId(dish.getId());
        dto.setName(dish.getName());
        dto.setIngredients(dish.getIngredients().stream().map(dishIngredient -> {
            IngredientInDishDTO ingredientDto = new IngredientInDishDTO();
            ingredientDto.setIngredientId(dishIngredient.getIngredient().getId());
            ingredientDto.setWeightInGrams(dishIngredient.getWeightInGrams());
            return ingredientDto;
        }).collect(Collectors.toSet()));
        return dto;
    }
}
