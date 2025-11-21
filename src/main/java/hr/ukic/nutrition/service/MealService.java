package hr.ukic.nutrition.service;

import hr.ukic.nutrition.dto.DishResponseDTO;
import hr.ukic.nutrition.dto.MealRequestDTO;
import hr.ukic.nutrition.dto.MealResponseDTO;
import hr.ukic.nutrition.mapper.DishMapper;
import hr.ukic.nutrition.mapper.MealMapper;
import hr.ukic.nutrition.model.Dish;
import hr.ukic.nutrition.model.Meal;
import hr.ukic.nutrition.model.MealDish;
import hr.ukic.nutrition.repository.DishRepository;
import hr.ukic.nutrition.repository.MealRepository;
import hr.ukic.nutrition.repository.specification.PaginationSpecification;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MealService {
    private final MealRepository mealRepository;
    private final DishRepository dishRepository;
    private final MealMapper mealMapper;

    @Transactional
    public MealResponseDTO createMeal(MealRequestDTO mealRequestDTO) {
        Meal meal = new Meal();
        meal.setName(mealRequestDTO.getName());
        Set<Dish> dishes = new HashSet<>(dishRepository.findAllById(mealRequestDTO.getDishIds()));

        dishes.forEach(dish -> {
            MealDish mealDish = new MealDish();
            mealDish.setDish(dish);
            mealDish.setMeal(meal);
            meal.getDishes().add(mealDish);
        });

        Meal savedMeal = mealRepository.save(meal);
        return mealMapper.mapToDto(savedMeal);
    }

    @Transactional
    public MealResponseDTO updateMeal(Long id, MealRequestDTO mealRequestDTO) {
        Meal meal = mealRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Meal not found: " + id));
        meal.setName(mealRequestDTO.getName());

        Map<Long, MealDish> existingMealDishesMap = meal.getDishes().stream()
                .collect(Collectors.toMap(md -> md.getDish().getId(), md -> md));
        Set<Long> dtoDishIds = new HashSet<>(mealRequestDTO.getDishIds());
        meal.getDishes().removeIf(md -> !dtoDishIds.contains(md.getDish().getId()));
        mealRequestDTO.getDishIds().forEach(dishId -> {
            if (!existingMealDishesMap.containsKey(dishId)) {
                Dish dish = dishRepository.findById(dishId)
                        .orElseThrow(() -> new EntityNotFoundException("Dish not found with id: " + dishId));
                MealDish mealDish = new MealDish();
                mealDish.setDish(dish);
                mealDish.setMeal(meal);
                meal.getDishes().add(mealDish);
            }
        });
        Meal savedMeal = mealRepository.save(meal);
        return mealMapper.mapToDto(savedMeal);
    }

    @Transactional(readOnly = true)
    public Page<MealResponseDTO> findAllMeals(String name, Pageable pageable) {
        var spec = PaginationSpecification.hasMealNameLike(name);
        Page<Meal> meals = mealRepository.findAll(spec, pageable);
        List<MealResponseDTO> mealesDTOList = meals.map(mealMapper::mapToDto).getContent();
        return new PageImpl<>(mealesDTOList, pageable, meals.getTotalElements());
    }
    @Transactional(readOnly = true)
    public MealResponseDTO findMealById(Long id) {
        Meal meal = mealRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Meal not found with id: " + id));
        return mealMapper.mapToDto(meal);
    }

    @Transactional
    public void deleteMeal(Long id) {
        if (!mealRepository.existsById(id)) {
            throw new EntityNotFoundException("Dish not found with id: " + id);
        }
        mealRepository.deleteById(id);
    }
}
