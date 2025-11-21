package hr.ukic.nutrition.controller;

import hr.ukic.nutrition.dto.MealRequestDTO;
import hr.ukic.nutrition.dto.MealResponseDTO;
import hr.ukic.nutrition.service.MealService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/meals")
@RequiredArgsConstructor
public class MealController {
    private final MealService mealService;

    @PostMapping
    public ResponseEntity<MealResponseDTO> createMeal(@RequestBody MealRequestDTO mealRequestDTO) {
        return ResponseEntity.ok(mealService.createMeal(mealRequestDTO));
    }

    @GetMapping
    public ResponseEntity<Page<MealResponseDTO>> getAllMeals(@RequestParam(required = false) String name, Pageable pageable) {
        Page<MealResponseDTO> meals = mealService.findAllMeals(name, pageable);
        return ResponseEntity.ok(meals);
    }

    @GetMapping("/{id}")
    public ResponseEntity<MealResponseDTO> getMealById(@PathVariable Long id) {
        MealResponseDTO meal = mealService.findMealById(id);
        return ResponseEntity.ok(meal);
    }

    @PutMapping("/{id}")
    public ResponseEntity<MealResponseDTO> updateMeal(@PathVariable Long id, @RequestBody MealRequestDTO mealRequestDTO) {
        MealResponseDTO updatedMeal = mealService.updateMeal(id, mealRequestDTO);
        return ResponseEntity.ok(updatedMeal);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMeal(@PathVariable Long id) {
        mealService.deleteMeal(id);
        return ResponseEntity.noContent().build();
    }
}
