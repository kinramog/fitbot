const getTodayIntakesSum = async (chat_id) => {
    const url = `http://127.0.0.1:8000/api/today-water-intakes/${chat_id}`;

    try {

        let data = await fetch(url);
        let jsonData = await data.json();
        let waterIntakes = jsonData.water_intakes;
        let intakesSum = Object.values(waterIntakes).reduce((total, item) => {
            return total + item.water_amount
        }, 0);
        console.log(jsonData)
        return intakesSum;
    } catch (error) {
        console.error("Ошибка в getTodayIntakesSum.js\n", error);
    }

}

export default getTodayIntakesSum;
