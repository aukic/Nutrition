package hr.ukic.nutrition.service;

import hr.ukic.nutrition.dto.AddMealToPlanRequestDTO;
import hr.ukic.nutrition.dto.WeeklyPlanEntryDTO;
import hr.ukic.nutrition.model.Meal;
import hr.ukic.nutrition.model.User;
import hr.ukic.nutrition.model.WeeklyPlan;
import hr.ukic.nutrition.repository.MealRepository;
import hr.ukic.nutrition.repository.UserRepository;
import hr.ukic.nutrition.repository.WeeklyPlanRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WeeklyPlanService {
    private final WeeklyPlanRepository weeklyPlanRepository;
    private final UserRepository userRepository;
    private final MealRepository mealRepository;

    @Transactional(readOnly = true)
    public List<WeeklyPlanEntryDTO> getWeekPlanForUser(String username, LocalDate dateInWeek) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        LocalDate startOfWeek = dateInWeek.with(DayOfWeek.MONDAY);
        LocalDate endOfWeek = dateInWeek.with(DayOfWeek.SUNDAY);

        List<WeeklyPlan> planEntries = weeklyPlanRepository.findByUserAndDateBetween(user, startOfWeek, endOfWeek);

        return planEntries.stream()
                .map(this::mapToDto)
                .toList();
    }

    @Transactional
    public WeeklyPlanEntryDTO addMealToPlan(String username, AddMealToPlanRequestDTO requestDTO) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));
        Meal meal = mealRepository.findById(requestDTO.getMealId())
                .orElseThrow(() -> new EntityNotFoundException("Meal not found"));

        WeeklyPlan newEntry = new WeeklyPlan();
        newEntry.setUser(user);
        newEntry.setMeal(meal);
        newEntry.setDate(requestDTO.getDate());

        WeeklyPlan savedEntry = weeklyPlanRepository.save(newEntry);
        return mapToDto(savedEntry);
    }

    @Transactional
    public void removeMealFromPlan(Long weeklyPlanId) {
        // Add security check here to ensure the user owns this plan entry
        weeklyPlanRepository.deleteById(weeklyPlanId);
    }

    private WeeklyPlanEntryDTO mapToDto(WeeklyPlan entry) {
        WeeklyPlanEntryDTO dto = new WeeklyPlanEntryDTO();
        dto.setId(entry.getId());
        dto.setDate(entry.getDate());
        dto.setMealId(entry.getMeal().getId());
        dto.setMealName(entry.getMeal().getName());
        return dto;
    }
}
