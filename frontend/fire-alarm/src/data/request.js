const sendPostRequest = async (url, data) => {
    try {
        const rawResponse = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        console.log(rawResponse);
        const jsonResponse = await rawResponse.json();
        return jsonResponse;
    } catch (e) {
        console.error('Error sending pos req: ',e)
    }

}
export {sendPostRequest};