const username = document.querySelector('.username');
const email = document.querySelector('.email');
const message = document.querySelector('.message');
const button = document.querySelector('.btn');

function applyFocusStyle(element) {
    element.style.boxShadow = '0 0 6px rgba(139, 0, 0, 0.5)';
    element.style.borderColor = '#8B0000';
}

function removeFocusStyle(element) {
    element.style.boxShadow = 'none';
    element.style.borderColor = '#ccc';
}

[username, email, message].forEach(input => {
    input.addEventListener('focus', () => applyFocusStyle(input));
    input.addEventListener('blur', () => removeFocusStyle(input));
});

button.addEventListener('click', (event) => {
    if (username.value.trim() === "" || email.value.trim() === "" || message.value.trim() === "") {
        alert("Form can't be empty");
        event.preventDefault();
    }
});
