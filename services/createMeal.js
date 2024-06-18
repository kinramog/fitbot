const createMeal = async (chat_id, name, total_calories, total_proteins, total_fat, total_carbohydrates) => {
    const url = `http://127.0.0.1:8000/api/add-meal`;

    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "chat_id": chat_id,
            "name": name,
            "total_calories": total_calories,
            "total_proteins": total_proteins,
            "total_fat": total_fat,
            "total_carbohydrates": total_carbohydrates,
        })
    }

    try {
        let data = await fetch(url, requestOptions);
        let jsonData = await data.json();
        console.log(jsonData);
        return jsonData;
    } catch (error) {
        console.error("Ошибка в createMeal.js\n", error);
    }

}

export default createMeal;
