package hr.ukic.nutrition.dto;

import lombok.Data;
import java.util.Set;

@Data
public class MealRequestDTO {
    private String name;
    private Set<Long> dishIds;
}
