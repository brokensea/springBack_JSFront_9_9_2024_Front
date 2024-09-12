document.getElementById('shoppingForm').addEventListener('submit', (event) => {
    event.preventDefault();

    const name = document.querySelector('#name').value;
    const menge = document.querySelector('#menge').value;
    const laden = document.querySelector('#laden').value;
    const gekauft = document.querySelector('#gekauft').checked;

    const newItem = { name, menge, laden, gekauft };

    fetch('http://localhost:8080/api/v1/items/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not OK');
            }
            return response.json();
        })
        .then(data => addItemToPage(data))
        .catch(error => console.error('There was an issue:', error));

    document.getElementById('shoppingForm').reset();
});

function addItemToPage(item) {
    const listContainer = document.querySelector('ul') || document.createElement('ul');
    if (!document.body.contains(listContainer)) {
        document.body.appendChild(listContainer);
    }

    const listItem = document.createElement('li');
    listItem.classList.add('item');

    // 为每个项目创建唯一的复选框和确认按钮
    listItem.innerHTML = `
        <p><span>Artikel:</span> ${item.name}</p>
        <p><span>Menge:</span> ${item.menge}</p>
        <p><span>Laden:</span> ${item.laden}</p>
        <p><span>Gekauft:</span>
            <input type="checkbox" class="gekauft-checkbox" id="gekauft-checkbox-${item.id}" ${item.gekauft ? 'checked' : ''}>
            <button class="confirm-btn" id="confirm-btn-${item.id}">Bestätigen</button>
        </p>
        <button class="delete-btn">Löschen</button>
    `;

    // 删除按钮逻辑
    listItem.querySelector('.delete-btn').addEventListener('click', () => {
        deleteItem(item.id, listItem);
    });

    // 确认按钮事件监听器
    listItem.querySelector(`#confirm-btn-${item.id}`).addEventListener('click', () => {
        const isGekauft = listItem.querySelector(`#gekauft-checkbox-${item.id}`).checked;
        updateItemGekauft(item.id, isGekauft);
    });

    listContainer.appendChild(listItem);
}


document.addEventListener('DOMContentLoaded', () => {
    async function getAllItems() {
        try {
            const response = await fetch('http://localhost:8080/api/v1/items');
            if (!response.ok) throw new Error('Network response was not OK');

            const items = await response.json();
            updateItemsList(items);
        } catch (error) {
            console.error('Error:', error);
        }
    }

    function updateItemsList(items) {
        const listContainer = document.createElement('ul');
        document.body.appendChild(listContainer);

        items.forEach(item => {
            const listItem = document.createElement('li');
            listItem.classList.add('item');

            // 为每个项目创建唯一的复选框和确认按钮
            listItem.innerHTML = `
            <p><span>Artikel:</span> ${item.name}</p>
            <p><span>Menge:</span> ${item.menge}</p>
            <p><span>Laden:</span> ${item.laden}</p>
            <p><span>Gekauft:</span>
                <input type="checkbox" class="gekauft-checkbox" id="gekauft-checkbox-${item.id}" ${item.gekauft ? 'checked' : ''}>
                <button class="confirm-btn" id="confirm-btn-${item.id}">Bestätigen</button>
            </p>
            <button class="delete-btn">Löschen</button>
        `;

            // 删除按钮逻辑
            listItem.querySelector('.delete-btn').addEventListener('click', () => {
                deleteItem(item.id, listItem);
            });

            // 确认按钮事件监听器
            listItem.querySelector(`#confirm-btn-${item.id}`).addEventListener('click', () => {
                const isGekauft = listItem.querySelector(`#gekauft-checkbox-${item.id}`).checked;
                updateItemGekauft(item.id, isGekauft);
            });

            listContainer.appendChild(listItem);
        });
    }

    getAllItems();
});

function deleteItem(itemId, listItem) {
    fetch(`http://localhost:8080/api/v1/items/${itemId}`, {
        method: 'DELETE'
    })
        .then(response => {
            if (!response.ok) throw new Error('Network response was not OK');
            listItem.remove();
        })
        .catch(error => console.error('Error:', error));
}

// 发送 PUT 请求更新数据库中的 "Gekauft" 状态
function updateItemGekauft(itemId, isGekauft) {
    fetch(`http://localhost:8080/api/v1/items/${itemId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ gekauft: isGekauft })
    })
        .then(response => {
            if (!response.ok) throw new Error('Network response was not OK');
            return response.json();
        })
        .then(data => {
            console.log(`Item ${itemId} updated successfully.`, data);
        })
        .catch(error => console.error('Error updating item:', error));
}