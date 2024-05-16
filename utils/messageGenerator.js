export const msg = {
    "user_profile": (username, height, weight, age, gender, waterBalance, calories, proteins, fat, carbohydrates, timezone) => {
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
            `${proteins}/${fat}/${carbohydrates}\n` +
            `<b>Часовой пояс:</b> ${timezone}\n` +
            `~~~~~~~~~~~~~~~~~~~~~~~~~~\n`
        )
    },
    "vizual_percentage": (totalAmount, currentAmount) => {
        let progress = "\n▪️▪️▪️▪️▪️▪️ - -1%";
        let currentPercentage = (currentAmount * 100 / totalAmount).toFixed(2);

        if (currentAmount < totalAmount / 6) {
            progress = `▪️▪️▪️▪️▪️▪️ - ${currentPercentage}%`;
        } else if (currentAmount < totalAmount / 6 * 2) {
            progress = `🟩▪️▪️▪️▪️▪️ - ${currentPercentage}%`;
        } else if (currentAmount < totalAmount / 6 * 3) {
            progress = `🟩🟩▪️▪️▪️▪️ - ${currentPercentage}%`;
        } else if (currentAmount < totalAmount / 6 * 4) {
            progress = `🟩🟩🟩▪️▪️▪️ - ${currentPercentage}%`;
        } else if (currentAmount < totalAmount / 6 * 5) {
            progress = `🟩🟩🟩🟩▪️▪️ - ${currentPercentage}%`;
        } else if (currentAmount < totalAmount) {
            progress = `🟩🟩🟩🟩🟩▪️ - ${currentPercentage}%`;
        } else if (currentAmount <= totalAmount + totalAmount / 10) {
            progress = `🟩🟩🟩🟩🟩🟩 - ${currentPercentage}%`;
        } else {
            progress = `🟩🟩🟩🟩🟩🟩🟧 - ${currentPercentage}%`;
        }

        return progress;
    }

}