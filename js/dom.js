export function createOption(content, value, select) {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = content;
    select.append(option);
}

export function createListItem(content, list) {
    const li = document.createElement('li');
    li.textContent = content;
    list.append(li);
}