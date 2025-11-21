package hr.ukic.nutrition.controller;

import hr.ukic.nutrition.dto.AddMealToPlanRequestDTO;
import hr.ukic.nutrition.dto.WeeklyPlanEntryDTO;
import hr.ukic.nutrition.service.WeeklyPlanService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/weekly-plan")
@RequiredArgsConstructor
public class WeeklyPlanController {
    private final WeeklyPlanService weeklyPlanService;

    @GetMapping
    public ResponseEntity<List<WeeklyPlanEntryDTO>> getWeekPlan(Principal principal, @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        List<WeeklyPlanEntryDTO> weekPlan = weeklyPlanService.getWeekPlanForUser(principal.getName(), date);
        return ResponseEntity.ok(weekPlan);
    }

    @PostMapping
    public ResponseEntity<WeeklyPlanEntryDTO> addMealToPlan(Principal principal, @RequestBody AddMealToPlanRequestDTO requestDTO) {
        WeeklyPlanEntryDTO newEntry = weeklyPlanService.addMealToPlan(principal.getName(), requestDTO);
        return ResponseEntity.ok(newEntry);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> removeMealFromPlan(@PathVariable Long id) {
        weeklyPlanService.removeMealFromPlan(id);
        return ResponseEntity.noContent().build();
    }
}
