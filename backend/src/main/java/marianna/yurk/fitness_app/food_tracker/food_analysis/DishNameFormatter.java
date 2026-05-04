package marianna.yurk.fitness_app.food_tracker.food_analysis;

import org.springframework.stereotype.Component;
import java.util.HashMap;
import java.util.Map;

@Component
public class DishNameFormatter {

    private static final Map<String, String> DISH_NAMES = new HashMap<>();

    static {
        DISH_NAMES.put("apple_pie", "Яблочный пирог");
        DISH_NAMES.put("baby_back_ribs", "Ребрышки по-домашнему");
        DISH_NAMES.put("baklava", "Пахлава");
        DISH_NAMES.put("beef_carpaccio", "Карпаччо из говядины");
        DISH_NAMES.put("beef_tartare", "Тартар из говядины");
        DISH_NAMES.put("beet_salad", "Салат из свеклы");
        DISH_NAMES.put("beignets", "Биньеты (пончики)");
        DISH_NAMES.put("bibimbap", "Пибимпап");
        DISH_NAMES.put("bread_pudding", "Хлебный пудинг");
        DISH_NAMES.put("breakfast_burrito", "Завтрак-буррито");
        DISH_NAMES.put("bruschetta", "Брускетта");
        DISH_NAMES.put("caesar_salad", "Салат Цезарь");
        DISH_NAMES.put("cannoli", "Канноли");
        DISH_NAMES.put("caprese_salad", "Салат Капрезе");
        DISH_NAMES.put("cappuccino", "Капучино");
        DISH_NAMES.put("carrot_cake", "Морковный торт");
        DISH_NAMES.put("ceviche", "Севиче");
        DISH_NAMES.put("cheesecake", "Чизкейк");
        DISH_NAMES.put("cheese_plate", "Сырная тарелка");
        DISH_NAMES.put("chicken_curry", "Карри из курицы");
        DISH_NAMES.put("chicken_quesadilla", "Кесадилья с курицей");
        DISH_NAMES.put("chicken_wings", "Куриные крылышки");
        DISH_NAMES.put("chocolate_cake", "Шоколадный торт");
        DISH_NAMES.put("chocolate_mousse", "Шоколадный мусс");
        DISH_NAMES.put("churros", "Чуррос");
        DISH_NAMES.put("clam_chowder", "Суп из моллюсков");
        DISH_NAMES.put("club_sandwich", "Клубный сэндвич");
        DISH_NAMES.put("crab_cakes", "Крабовые котлеты");
        DISH_NAMES.put("creme_brulee", "Крем-брюле");
        DISH_NAMES.put("croque_madame", "Крок-мадам");
        DISH_NAMES.put("cup_cakes", "Капкейки");
        DISH_NAMES.put("deviled_eggs", "Фаршированные яйца");
        DISH_NAMES.put("donuts", "Пончики");
        DISH_NAMES.put("dumplings", "Пельмени / Вонтоны");
        DISH_NAMES.put("eggs_benedict", "Яйца Бенедикт");
        DISH_NAMES.put("escargots", "Улитки");
        DISH_NAMES.put("falafel", "Фалафель");
        DISH_NAMES.put("filet_mignon", "Филе-миньон");
        DISH_NAMES.put("fish_and_chips", "Рыба с картофелем фри");
        DISH_NAMES.put("foie_gras", "Фуа-гра");
        DISH_NAMES.put("french_fries", "Картофель фри");
        DISH_NAMES.put("french_onion_soup", "Французский луковый суп");
        DISH_NAMES.put("french_toast", "Гренки по-французски");
        DISH_NAMES.put("fried_calamari", "Жареные кальмары");
        DISH_NAMES.put("fried_rice", "Жареный рис");
        DISH_NAMES.put("frozen_yogurt", "Замороженный йогурт");
        DISH_NAMES.put("garlic_bread", "Чесночный хлеб");
        DISH_NAMES.put("gnocchi", "Ньокки");
        DISH_NAMES.put("greek_salad", "Греческий салат");
        DISH_NAMES.put("grilled_cheese_sandwich", "Сэндвич с расплавленным сыром");
        DISH_NAMES.put("grilled_salmon", "Лосось на гриле");
        DISH_NAMES.put("guacamole", "Гуакамоле");
        DISH_NAMES.put("gyoza", "Гёдза (японские пельмени)");
        DISH_NAMES.put("hamburger", "Гамбургер");
        DISH_NAMES.put("hot_and_sour_soup", "Кисло-острый суп");
        DISH_NAMES.put("hot_dog", "Хот-дог");
        DISH_NAMES.put("huevos_rancheros", "Яйца по-мексикански (уэвос ранчерос)");
        DISH_NAMES.put("hummus", "Хумус");
        DISH_NAMES.put("ice_cream", "Мороженое");
        DISH_NAMES.put("lasagna", "Лазанья");
        DISH_NAMES.put("lobster_bisque", "Биск из омара");
        DISH_NAMES.put("lobster_roll_sandwich", "Сэндвич с омаром");
        DISH_NAMES.put("macaroni_and_cheese", "Макароны с сыром");
        DISH_NAMES.put("macarons", "Макаронс");
        DISH_NAMES.put("miso_soup", "Мисо-суп");
        DISH_NAMES.put("mussels", "Мидии");
        DISH_NAMES.put("nachos", "Начос");
        DISH_NAMES.put("omelette", "Омлет");
        DISH_NAMES.put("onion_rings", "Луковые кольца");
        DISH_NAMES.put("oysters", "Устрицы");
        DISH_NAMES.put("pad_thai", "Пад-тай");
        DISH_NAMES.put("paella", "Паэлья");
        DISH_NAMES.put("pancakes", "Блины / Панкейки");
        DISH_NAMES.put("panna_cotta", "Панна-котта");
        DISH_NAMES.put("peking_duck", "Утка по-пекински");
        DISH_NAMES.put("pho", "Фо-бо (суп с лапшой)");
        DISH_NAMES.put("pizza", "Пицца");
        DISH_NAMES.put("pork_chop","Свиная отбивная");
        DISH_NAMES.put("poutine","Поутин");
        DISH_NAMES.put("prime_rib","Ростбиф");
        DISH_NAMES.put("pulled_pork_sandwich","Сэндвич со свининой");
        DISH_NAMES.put("ramen","Рамен");
        DISH_NAMES.put("ravioli","Равиоли");
        DISH_NAMES.put("red_velvet_cake","Торт «Красный бархат»");
        DISH_NAMES.put("risotto","Ризотто");
        DISH_NAMES.put("samosa","Самоса");
        DISH_NAMES.put("sashimi","Сашими");
        DISH_NAMES.put("scallops","Морские гребешки");
        DISH_NAMES.put("seaweed_salad","Салат из водорослей");
        DISH_NAMES.put("shrimp_and_grits","Креветки с кашей");
        DISH_NAMES.put("spaghetti_bolognese","Спагетти Болоньезе");
        DISH_NAMES.put("spaghetti_carbonara","Спагетти Карбонара");
        DISH_NAMES.put("spring_rolls","Спринг-роллы");
        DISH_NAMES.put("steak","Стейк");
        DISH_NAMES.put("strawberry_shortcake","Клубничный пирог");
        DISH_NAMES.put("sushi","Суши");
        DISH_NAMES.put("tacos","Тако");
        DISH_NAMES.put("takoyaki","Такояки");
        DISH_NAMES.put("tiramisu","Тирамису");
        DISH_NAMES.put("tuna_tartare","Тартар из тунца");
        DISH_NAMES.put("waffles","Вафли");
    }


    public static String format(String englishKey) {
        if (englishKey == null || englishKey.isBlank()) {
            return "Блюдо";
        }
        if (DISH_NAMES.containsKey(englishKey)) {
            return DISH_NAMES.get(englishKey);
        }
        return autoFormat(englishKey);
    }

    private static String autoFormat(String englishKey) {
        String withSpaces = englishKey.replace('_', ' ');
        if (withSpaces.isEmpty()) return "";
        String[] words = withSpaces.split(" ");
        StringBuilder result = new StringBuilder();
        for (String word : words) {
            if (!word.isEmpty()) {
                result.append(Character.toUpperCase(word.charAt(0)))
                        .append(word.substring(1).toLowerCase())
                        .append(" ");
            }
        }
        return result.toString().trim();
    }
}