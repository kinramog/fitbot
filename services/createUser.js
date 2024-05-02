const createUser = async (chat_id) => {
    const url = `http://127.0.0.1:8000/api/create-user`;
    
    let water_amount = 0;
    const requestOptions = {
        method: "POST",
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
}

export default createUser;
