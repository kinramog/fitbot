const createWaterIntake = async (chat_id, water_amount) => {
    const url = `http://127.0.0.1:8000/api/add-water-intake`;

    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "chat_id": chat_id,
            "water_amount": water_amount,
        })
    }

    try {
        let data = await fetch(url, requestOptions);
        let jsonData = await data.json();
        console.log(jsonData);
    } catch (error) {
        console.error("Ошибка в createWaterIntake.js\n", error);
    }

}

export default createWaterIntake;
