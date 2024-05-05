const changeTimezone = async (chat_id, timezone) => {
    const url = `http://127.0.0.1:8000/api/change-timezone`;
    
    const requestOptions = {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "chat_id": chat_id,
            "timezone": timezone,
        })
    }

    let data = await fetch(url, requestOptions);
    let jsonData = await data.json();

    console.log(jsonData);
}

export default changeTimezone;
