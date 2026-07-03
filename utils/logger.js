function logIncomingMessage(message) {
    console.log(`[${message.from}] ${message.body}`);
}

function logError(error) {
    console.error(error);
}

module.exports = {
    logIncomingMessage,
    logError
};