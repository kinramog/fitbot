const createUser = async (chat_id, timezone, height, weight, age, gender) => {
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
        })
    }

    let data = await fetch(url, requestOptions);
    let jsonData = await data.json();

    console.log(jsonData);
}

export default createUser;
