package hr.ukic.nutrition.service;

import hr.ukic.nutrition.dto.DishRequestDTO;
import hr.ukic.nutrition.dto.DishResponseDTO;
import hr.ukic.nutrition.dto.IngredientInDishDTO;
import hr.ukic.nutrition.mapper.DishMapper;
import hr.ukic.nutrition.model.Dish;
import hr.ukic.nutrition.model.DishIngredient;
import hr.ukic.nutrition.model.Ingredient;
import hr.ukic.nutrition.repository.DishRepository;
import hr.ukic.nutrition.repository.IngredientRepository;
import hr.ukic.nutrition.repository.specification.PaginationSpecification;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DishService {
    private final DishRepository dishRepository;
    private final IngredientRepository ingredientRepository;
    private final DishMapper dishMapper;
    @Transactional
    public DishResponseDTO createDish(DishRequestDTO dishRequestDTO) {
        Dish dish = new Dish();
        dish.setName(dishRequestDTO.getName());

        dishRequestDTO.getIngredients().forEach(ingredientDTO -> {
            Ingredient ingredient = ingredientRepository.findById(ingredientDTO.getIngredientId())
                    .orElseThrow(() -> new EntityNotFoundException("Ingredient not found with id: " + ingredientDTO.getIngredientId()));

            DishIngredient dishIngredient = new DishIngredient();
            dishIngredient.setDish(dish);
            dishIngredient.setIngredient(ingredient);
            dishIngredient.setWeightInGrams(ingredientDTO.getWeightInGrams());
            dish.getIngredients().add(dishIngredient);
        });

        Dish savedDish = dishRepository.save(dish);
        return dishMapper.mapToDto(savedDish);
    }

    @Transactional(readOnly = true)
    public Page<DishResponseDTO> findAllDishes(String name, Pageable pageable) {
        var spec = PaginationSpecification.hasDishNameLike(name);
        Page<Dish> dishes = dishRepository.findAll(spec, pageable);
        List<DishResponseDTO> dishesDTOList = dishes.map(dishMapper::mapToDto).getContent();
        return new PageImpl<>(dishesDTOList, pageable, dishes.getTotalElements());
    }

    @Transactional(readOnly = true)
    public DishResponseDTO findDishById(Long id) {
        Dish dish = dishRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Dish not found with id: " + id));
        return dishMapper.mapToDto(dish);
    }

    @Transactional
    public DishResponseDTO updateDish(Long id, DishRequestDTO dishRequestDTO) {
        Dish existingDish = dishRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Dish not found with id: " + id));

        existingDish.setName(dishRequestDTO.getName());

        Map<Long, DishIngredient> existingIngredientsMap = existingDish.getIngredients().stream()
                .collect(Collectors.toMap(di -> di.getIngredient().getId(), di -> di));
        Set<Long> dtoIngredientIds = dishRequestDTO.getIngredients().stream()
                .map(IngredientInDishDTO::getIngredientId)
                .collect(Collectors.toSet());
        existingDish.getIngredients().removeIf(dishIngredient ->
                !dtoIngredientIds.contains(dishIngredient.getIngredient().getId())
        );

        dishRequestDTO.getIngredients().forEach(ingredientDTO -> {
            DishIngredient existingDishIngredient = existingIngredientsMap.get(ingredientDTO.getIngredientId());

            if (existingDishIngredient != null) {
                existingDishIngredient.setWeightInGrams(ingredientDTO.getWeightInGrams());
            } else {
                Ingredient ingredient = ingredientRepository.findById(ingredientDTO.getIngredientId())
                        .orElseThrow(() -> new EntityNotFoundException("Ingredient not found with id: " + ingredientDTO.getIngredientId()));

                DishIngredient newDishIngredient = new DishIngredient();
                newDishIngredient.setDish(existingDish);
                newDishIngredient.setIngredient(ingredient);
                newDishIngredient.setWeightInGrams(ingredientDTO.getWeightInGrams());

                existingDish.getIngredients().add(newDishIngredient);
            }
        });

        Dish updatedDish = dishRepository.save(existingDish);
        return dishMapper.mapToDto(updatedDish);
    }

    @Transactional
    public void deleteDish(Long id) {
        if (!dishRepository.existsById(id)) {
            throw new EntityNotFoundException("Dish not found with id: " + id);
        }
        dishRepository.deleteById(id);
    }
}
