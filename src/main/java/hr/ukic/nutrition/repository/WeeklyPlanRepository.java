package hr.ukic.nutrition.repository;

import hr.ukic.nutrition.model.User;
import hr.ukic.nutrition.model.WeeklyPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.time.LocalDate;
import java.util.List;

public interface WeeklyPlanRepository extends JpaRepository<WeeklyPlan, Long>, JpaSpecificationExecutor<WeeklyPlan> {
    List<WeeklyPlan> findByUserAndDateBetween(User user, LocalDate startDate, LocalDate endDate);
}
