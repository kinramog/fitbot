export const msg = {
    "user_profile": (username, height, weight, age, gender, waterBalance, calories, proteins, fat, carbohydrate, timezone) => {
        return (
            `<b>Ваш профиль</b>, ${username}\n` +
            `~~~~~~~~~~~~~~~~~~~~~~~~~~\n` +
            `<b>Рост:</b> ${height} см\n` +
            `<b>Вес:</b> ${weight} кг\n` +
            `<b>Возраст:</b> ${age}\n` +
            `<b>Пол:</b> ${gender}\n` +
            `~~~~~~~~~~~~~~~~~~~~~~~~~~\n` +
            `<b>Норма воды в день:</b> ${waterBalance} мл\n` +
            `<b>Суточная норма калорий:</b> ${calories} ккал\n` +
            `<b>Суточная норма\nБелков/Жиров/Углеводов:</b>\n` +
            `${proteins}/${fat}/${carbohydrate}\n` +
            `<b>Часовой пояс:</b> ${timezone}\n` +
            `~~~~~~~~~~~~~~~~~~~~~~~~~~\n`
        )
    },

}