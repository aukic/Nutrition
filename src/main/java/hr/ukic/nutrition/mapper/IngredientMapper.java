package hr.ukic.nutrition.mapper;

import com.fasterxml.jackson.databind.ObjectMapper;
import hr.ukic.nutrition.dto.IngredientDetails;
import hr.ukic.nutrition.dto.IngredientDto;
import hr.ukic.nutrition.model.Ingredient;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class IngredientMapper {
    private final ObjectMapper objectMapper;
    public IngredientDto toIngredientDto(Ingredient ingredient) {
        return objectMapper.convertValue(ingredient, IngredientDto.class);
    }

    public IngredientDetails toIngredientDetails(Ingredient ingredient) {
        return objectMapper.convertValue(ingredient, IngredientDetails.class);
    }
}
