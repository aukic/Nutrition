package hr.ukic.nutrition.dto;

import lombok.Data;
import java.time.LocalDate;
@Data
public class AddMealToPlanRequestDTO {
    private LocalDate date;
    private Long mealId;
}
