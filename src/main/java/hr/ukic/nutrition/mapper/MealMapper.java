package hr.ukic.nutrition.mapper;

import hr.ukic.nutrition.dto.MealResponseDTO;
import hr.ukic.nutrition.model.Meal;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;
@Component
@RequiredArgsConstructor
public class MealMapper {
    private final DishMapper dishMapper;
    public MealResponseDTO mapToDto(Meal meal) {
        MealResponseDTO dto = new MealResponseDTO();
        dto.setId(meal.getId());
        dto.setName(meal.getName());
        dto.setDishes(meal.getDishes().stream()
                .map(mealDish -> dishMapper.mapToDto(mealDish.getDish()))
                .collect(Collectors.toSet()));
        return dto;
    }
}
