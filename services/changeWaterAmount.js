const changeWaterAmount = async (chat_id, water_amount) => {
    const url = `http://127.0.0.1:8000/api/change-water-balance`;

    const requestOptions = {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "chat_id": chat_id,
            "total_water_amount": water_amount,
        })
    }

    let data = await fetch(url, requestOptions);
    let jsonData = await data.json();

    console.log(jsonData);
    console.log("sended");
}

export default changeWaterAmount;
