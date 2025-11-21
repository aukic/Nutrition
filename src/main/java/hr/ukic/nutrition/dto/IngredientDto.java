package hr.ukic.nutrition.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class IngredientDto implements Serializable {
    Long id;
    String name;
    BigDecimal energyKj;
    BigDecimal energyKcal;
    BigDecimal carbohydrates;
    BigDecimal protein;
    BigDecimal fat;
    BigDecimal water;
    BigDecimal sugars;
    BigDecimal fiber;
}
