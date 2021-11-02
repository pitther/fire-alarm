const sendPostRequest = async (url, data) => {
  try {
    const rawResponse = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const jsonResponse = await rawResponse.json();
    if (rawResponse.status !== 200 || jsonResponse.error) {
      jsonResponse.error = true;
      jsonResponse.msg = jsonResponse.msg
        ? jsonResponse.msg
        : 'Error sending request to server.';
    } else {
      jsonResponse.error = false;
    }

    return jsonResponse;
  } catch (e) {
    console.error('Error sending pos req: ', e);
    return { error: true, msg: 'Error sending request to server.' };
  }
};
export { sendPostRequest };
