package hr.ukic.nutrition.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class WeeklyPlanEntryDTO {
    private Long id;
    private LocalDate date;
    private Long mealId;
    private String mealName;
}
