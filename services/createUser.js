const createUser = async (chat_id, timezone, height, weight, age, gender, waterAmount, calories, proteins, fat, carbohydrates) => {
    const url = `http://127.0.0.1:8000/api/create-user`;

    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "chat_id": chat_id,
            "timezone": timezone,
            "height": height,
            "weight": weight,
            "age": age,
            "gender": gender,
            "total_water_amount": waterAmount,
            "total_calories": calories,
            "total_proteins": proteins,
            "total_fat": fat,
            "total_carbohydrates": carbohydrates,
        })
    }

    try {
        let data = await fetch(url, requestOptions);
        let jsonData = await data.json();
        console.log(jsonData);
    } catch (error) {
        console.error("Ошибка в createUser.js \n", error);
    }
}

export default createUser;
