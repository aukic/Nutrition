package hr.ukic.nutrition.service;

import hr.ukic.nutrition.dto.IngredientDetails;
import hr.ukic.nutrition.dto.IngredientDto;
import hr.ukic.nutrition.mapper.IngredientMapper;
import hr.ukic.nutrition.model.Ingredient;
import hr.ukic.nutrition.repository.IngredientRepository;
import hr.ukic.nutrition.repository.specification.PaginationSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class IngredientService {
    private final IngredientRepository ingredientRepository;
    private final IngredientMapper ingredientMapper;
    public List<Ingredient> findAll() {
        return ingredientRepository.findAll();
    }

    public Page<IngredientDto> getIngredientDtoList(String name, Pageable pageable) {
        var spec = PaginationSpecification.hasIngredientNameLike(name);
        Page<Ingredient> ingredients = ingredientRepository.findAll(spec, pageable);
        List<IngredientDto> ingredientDtoList = ingredients.map(ingredientMapper::toIngredientDto).getContent();
        return new PageImpl<>(ingredientDtoList, pageable, ingredients.getTotalElements());
    }

    public Ingredient getIngredientById(Long id) {
        return ingredientRepository.findById(id).orElseThrow(() -> new RuntimeException("Ingredient not found"));
    }

    public IngredientDetails getIngredientDetailsById(Long id) {
        return ingredientMapper.toIngredientDetails(this.getIngredientById(id));
    }

    public Ingredient save(Ingredient ingredient) {
        return ingredientRepository.save(ingredient);
    }

    public void delete(Long id) {
        ingredientRepository.deleteById(id);
    }
}
