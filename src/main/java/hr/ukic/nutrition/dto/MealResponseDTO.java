package hr.ukic.nutrition.dto;

import lombok.Data;
import java.util.Set;

@Data
public class MealResponseDTO {
    private Long id;
    private String name;
    private Set<DishResponseDTO> dishes;
}
