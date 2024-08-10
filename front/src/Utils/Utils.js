let setState = null;

export function setShowPopup(func) {
    setState = func;
}

export function showPopup(title, message, isError) {
    setState({
        isVisible: true,
        title: title,
        message: message,
        isError: isError
    })
}