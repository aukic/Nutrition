package hr.ukic.nutrition.controller;

import hr.ukic.nutrition.dto.IngredientDetails;
import hr.ukic.nutrition.dto.IngredientDto;
import hr.ukic.nutrition.service.IngredientService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ingredients")
@RequiredArgsConstructor
public class IngredientController {
    private final IngredientService ingredientService;

    @GetMapping
    public ResponseEntity<Page<IngredientDto>> getAll(@RequestParam(required = false) String name, Pageable pageable) {
        return ResponseEntity.ok(ingredientService.getIngredientDtoList(name, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<IngredientDetails> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ingredientService.getIngredientDetailsById(id));
    }
}
