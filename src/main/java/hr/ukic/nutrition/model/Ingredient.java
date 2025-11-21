package hr.ukic.nutrition.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@Entity
@Table(name = "ingredient", schema = "nutrition")
public class Ingredient {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "energy_kj", precision = 10, scale = 2)
    private BigDecimal energyKj;

    @Column(name = "energy_kcal", precision = 10, scale = 2)
    private BigDecimal energyKcal;

    @Column(name = "carbohydrates", precision = 10, scale = 2)
    private BigDecimal carbohydrates;

    @Column(name = "protein", precision = 10, scale = 2)
    private BigDecimal protein;

    @Column(name = "fat", precision = 10, scale = 2)
    private BigDecimal fat;

    @Column(name = "water", precision = 10, scale = 2)
    private BigDecimal water;

    @Column(name = "sugars", precision = 10, scale = 2)
    private BigDecimal sugars;

    @Column(name = "fiber", precision = 10, scale = 2)
    private BigDecimal fiber;

    @Column(name = "histidine", precision = 10, scale = 2)
    private BigDecimal histidine;

    @Column(name = "isoleucine", precision = 10, scale = 2)
    private BigDecimal isoleucine;

    @Column(name = "leucine", precision = 10, scale = 2)
    private BigDecimal leucine;

    @Column(name = "lysine", precision = 10, scale = 2)
    private BigDecimal lysine;

    @Column(name = "methionine", precision = 10, scale = 2)
    private BigDecimal methionine;

    @Column(name = "phenylalanine", precision = 10, scale = 2)
    private BigDecimal phenylalanine;

    @Column(name = "threonine", precision = 10, scale = 2)
    private BigDecimal threonine;

    @Column(name = "tryptophan", precision = 10, scale = 2)
    private BigDecimal tryptophan;

    @Column(name = "valine", precision = 10, scale = 2)
    private BigDecimal valine;

    @Column(name = "vitamin_c_mg", precision = 10, scale = 2)
    private BigDecimal vitaminCMg;

    @Column(name = "vitamin_d_mcg", precision = 10, scale = 2)
    private BigDecimal vitaminDMcg;

    @Column(name = "vitamin_e_mg", precision = 10, scale = 2)
    private BigDecimal vitaminEMg;

    @Column(name = "vitamin_k_mcg", precision = 10, scale = 2)
    private BigDecimal vitaminKMcg;

    @Column(name = "vitamin_b6_mg", precision = 10, scale = 2)
    private BigDecimal vitaminB6Mg;

    @Column(name = "vitamin_aiu", precision = 10, scale = 2)
    private BigDecimal vitaminAiu;

    @Column(name = "vitamin_b1_thiamine_mg", precision = 10, scale = 2)
    private BigDecimal vitaminB1ThiamineMg;

    @Column(name = "vitamin_b2_riboflavin_mg", precision = 10, scale = 2)
    private BigDecimal vitaminB2RiboflavinMg;

    @Column(name = "vitamin_b3_niacin_mg", precision = 10, scale = 2)
    private BigDecimal vitaminB3NiacinMg;

    @Column(name = "vitamin_b5_pantothenic_mcg", precision = 10, scale = 2)
    private BigDecimal vitaminB5PantothenicMcg;

    @Column(name = "vitamin_b7_biotin_mcg", precision = 10, scale = 2)
    private BigDecimal vitaminB7BiotinMcg;

    @Column(name = "vitamin_b9_folate_mcg", precision = 10, scale = 2)
    private BigDecimal vitaminB9FolateMcg;

    @Column(name = "vitamin_k1_phylloquinone_mcg", precision = 10, scale = 2)
    private BigDecimal vitaminK1PhylloquinoneMcg;

    @Column(name = "vitamin_k2_menaquinone_mcg", precision = 10, scale = 2)
    private BigDecimal vitaminK2MenaquinoneMcg;

    @Column(name = "iron_mg", precision = 10, scale = 2)
    private BigDecimal ironMg;

    @Column(name = "calcium_mg", precision = 10, scale = 2)
    private BigDecimal calciumMg;

    @Column(name = "sodium_mg", precision = 10, scale = 2)
    private BigDecimal sodiumMg;

    @Column(name = "magnesium_mg", precision = 10, scale = 2)
    private BigDecimal magnesiumMg;

    @Column(name = "potassium_mg", precision = 10, scale = 2)
    private BigDecimal potassiumMg;

    @Column(name = "zinc_mg", precision = 10, scale = 2)
    private BigDecimal zincMg;

}
