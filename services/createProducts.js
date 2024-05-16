const createProducts = async (meal_id, products) => {
    const url = `http://127.0.0.1:8000/api/add-products`;

    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "meal_id": meal_id,
            "products": products,
        })
    }

    let data = await fetch(url, requestOptions);
    let jsonData = await data.json();
    console.log(jsonData);
    
    return jsonData;
}

export default createProducts;