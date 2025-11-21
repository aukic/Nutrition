package hr.ukic.nutrition.dto;

import lombok.Value;

import java.io.Serializable;
import java.math.BigDecimal;

/**
 * DTO for {@link hr.ukic.nutrition.model.Ingredient}
 */
@Value
public class IngredientDetails implements Serializable {
    Long id;
    String name;
    BigDecimal energyKj;
    BigDecimal energyKcal;
    BigDecimal carbohydrates;
    BigDecimal protein;
    BigDecimal fat;
    BigDecimal water;
    BigDecimal sugars;
    BigDecimal fiber;
    BigDecimal histidine;
    BigDecimal isoleucine;
    BigDecimal leucine;
    BigDecimal lysine;
    BigDecimal methionine;
    BigDecimal phenylalanine;
    BigDecimal threonine;
    BigDecimal tryptophan;
    BigDecimal valine;
    BigDecimal vitaminCMg;
    BigDecimal vitaminDMcg;
    BigDecimal vitaminEMg;
    BigDecimal vitaminKMcg;
    BigDecimal vitaminB6Mg;
    BigDecimal vitaminAiu;
    BigDecimal vitaminB1ThiamineMg;
    BigDecimal vitaminB2RiboflavinMg;
    BigDecimal vitaminB3NiacinMg;
    BigDecimal vitaminB5PantothenicMcg;
    BigDecimal vitaminB7BiotinMcg;
    BigDecimal vitaminB9FolateMcg;
    BigDecimal vitaminK1PhylloquinoneMcg;
    BigDecimal vitaminK2MenaquinoneMcg;
    BigDecimal ironMg;
    BigDecimal calciumMg;
    BigDecimal sodiumMg;
    BigDecimal magnesiumMg;
    BigDecimal potassiumMg;
    BigDecimal zincMg;
}
