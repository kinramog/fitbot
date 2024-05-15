const getTodayMealsSum = async (chat_id) => {
    const url = `http://127.0.0.1:8000/api/today-meals/${chat_id}`;

    let data = await fetch(url);
    let jsonData = await data.json();
    let todayMeals = jsonData.today_meals;
    // let todayCalories = jsonData.total_calories;
    // let todayProteins = jsonData.total_proteins;
    // let todayFat = jsonData.total_fat;
    // let todayCarbohydrates = jsonData.total_carbohydrates;

    let caloriesSum = Object.values(todayMeals).reduce((total, item) => {
        return total + item.total_calories;
    }, 0);
    let proteinsSum = Object.values(todayMeals).reduce((total, item) => {
        return total + item.total_proteins;
    }, 0);
    let fatSum = Object.values(todayMeals).reduce((total, item) => {
        return total + item.total_fat;
    }, 0);
    let carbohydratesSum = Object.values(todayMeals).reduce((total, item) => {
        return total + item.total_carbohydrates;
    }, 0);

    let response = {
        "calories_sum": caloriesSum,
        "proteins_sum": proteinsSum,
        "fat_sum": fatSum,
        "carbohydrates_sum": carbohydratesSum,
    }

    return response;
}

export default getTodayMealsSum;
