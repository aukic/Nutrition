package hr.ukic.nutrition.controller;

import hr.ukic.nutrition.dto.DishRequestDTO;
import hr.ukic.nutrition.dto.DishResponseDTO;
import hr.ukic.nutrition.service.DishService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dishes")
@RequiredArgsConstructor
public class DishController {
    private final DishService dishService;

    @PostMapping
    public ResponseEntity<DishResponseDTO> createDish(@RequestBody DishRequestDTO dishRequestDTO) {
        return ResponseEntity.ok(dishService.createDish(dishRequestDTO));
    }

    @GetMapping
    public ResponseEntity<Page<DishResponseDTO>> getAllDishes(@RequestParam(required = false) String name, Pageable pageable) {
        Page<DishResponseDTO> dishes = dishService.findAllDishes(name, pageable);
        return ResponseEntity.ok(dishes);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DishResponseDTO> getDishById(@PathVariable Long id) {
        DishResponseDTO dish = dishService.findDishById(id);
        return ResponseEntity.ok(dish);
    }

    @PutMapping("/{id}")
    public ResponseEntity<DishResponseDTO> updateDish(@PathVariable Long id, @RequestBody DishRequestDTO dishRequestDTO) {
        DishResponseDTO updatedDish = dishService.updateDish(id, dishRequestDTO);
        return ResponseEntity.ok(updatedDish);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDish(@PathVariable Long id) {
        dishService.deleteDish(id);
        return ResponseEntity.noContent().build();
    }
}
