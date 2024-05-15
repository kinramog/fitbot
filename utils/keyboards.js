import { Markup } from "telegraf";

export const keyboards = {
    "main": [
        [Markup.button.callback("Записать приём воды", "add_water")],
        [Markup.button.callback("Записать приём пищи", "add_meal")],
        [Markup.button.callback("Статистика", "statistics")],
        [Markup.button.callback("Профиль и настройки", "profile_and_settings")],
    ],
    "profile_and_settings": [
        [Markup.button.callback("Изменить данные профиля", "change_profile")],
        [Markup.button.callback("Настройки", "settings")],
        [Markup.button.callback("Назад", "main")],
    ],
    "change_profile": [
        [Markup.button.callback("Рост", "height"), Markup.button.callback("Вес", "weight")],
        [Markup.button.callback("Пол", "gender"), Markup.button.callback("Возраст", "age")],
        [Markup.button.callback("Назад", "profile_and_settings")],
    ],
    "settings": [
        [Markup.button.callback("Часовой пояс", "changeTimezone")],
        [Markup.button.callback("Суточная норма воды", "setTotalWater")],
        [Markup.button.callback("Суточная норма калорий", "total_calories")],
        [Markup.button.callback("Белки", "total_proteins"), Markup.button.callback("Жиры", "total_fat"), Markup.button.callback("Углеводы", "total_carbohydrates")],
        [Markup.button.callback("Пересчитать дневные нормы", "recalculate")],
        [Markup.button.callback("Назад", "profile_and_settings")],
    ],
    "statistics": [
        [Markup.button.callback("Четотубудет", "btn")],
        [Markup.button.callback("Назад", "main")],
    ],
    "timezones": [
        [Markup.button.callback("Москва (UTC +3)", "Europe/Moscow")],
        [Markup.button.callback("Калининград (GMT+2)", "Europe/Kaliningrad"), Markup.button.callback("Самара (GMT+4)", "Europe/Samara")],
        [Markup.button.callback("Екатеринбург (GMT+5)", "Asia/Yekaterinburg"), Markup.button.callback("Омск (GMT+6)", "Asia/Omsk")],
        [Markup.button.callback("Красноярск (GMT+7)", "Asia/Krasnoyarsk"), Markup.button.callback("Иркутск (GMT+8)", "Asia/Irkutsk")],
        [Markup.button.callback("Якутск (GMT+9)", "Asia/Yakutsk"), Markup.button.callback("Владивосток(GMT+10)", "Asia/Vladivostok")],
        [Markup.button.callback("Магадан (GMT+11)", "Asia/Magadan"), Markup.button.callback("Камчатка (GMT+12)", "Asia/Kamchatka")],
    ],
    "activity_level": [
        [Markup.button.callback("Без учета физической активности", "1")],
        [Markup.button.callback("Сидячий образ жизни", "1.2")],
        [Markup.button.callback("Небольшая активность", "1.375")],
        [Markup.button.callback("Умеренная активность", "1.55")],
        [Markup.button.callback("Высокая активность", "1.725")],
        [Markup.button.callback("Очень высокая активность", "1.9")],
    ],
    'yes_no': [
        Markup.button.callback("Да", "yes"), Markup.button.callback("Нет", "no")
    ],
}
