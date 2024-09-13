document.getElementById('shoppingForm').addEventListener('submit', (event) => {
    event.preventDefault();  // 阻止表单的默认提交行为

    // 获取表单数据
    const name = document.querySelector('#name').value;
    const menge = document.querySelector('#menge').value;
    const laden = document.querySelector('#laden').value;
    const gekauft = document.querySelector('#gekauft').checked;

    // 将表单数据转换为 JSON 格式
    const newItem = {
        name: name,
        menge: menge,
        laden: laden,
        gekauft: gekauft
    };

    console.log(newItem);  // 在控制台输出数据

    // 将数据发送到服务器
    console.log('Sending request to server...');
    fetch('http://localhost:8080/api/v1/items/submit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newItem)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('network not OK');
            }
            return response.json();
        })
        .then(data => {
            console.log('Service response:', data);
            // 成功后更新页面上的购物列表
            addItemToPage(data);
        })
        .catch(error => {
            console.error('There was an issue:', error);
        });

    // 清空表单数据
    document.getElementById('shoppingForm').reset();
});

// 定义一个函数将新添加的项目显示在页面上
function addItemToPage(item) {
    const listContainer = document.querySelector('ul') || document.createElement('ul');
    if (!document.body.contains(listContainer)) {
        document.body.appendChild(listContainer);
    }

    const listItem = document.createElement('li');
    listItem.classList.add('item'); // 为新元素添加 'item' 类

    // 创建并添加项目内容，使用 <p> 和 <span>
    const itemName = document.createElement('p');
    itemName.innerHTML = `<span>Artikel:</span> ${item.name}`;

    const itemMenge = document.createElement('p');
    itemMenge.innerHTML = `<span>Menge:</span> ${item.menge}`;

    const itemLaden = document.createElement('p');
    itemLaden.innerHTML = `<span>Laden:</span> ${item.laden}`;

    const itemGekauft = document.createElement('p');
    itemGekauft.innerHTML = `<span>Gekauft:</span> ${item.gekauft ? 'Ja' : 'Nein'}`;

    // 创建并添加删除按钮
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Löschen';
    deleteButton.classList.add('delete-btn'); // 使用 delete-btn 类设置样式

    // 点击删除按钮时发送 DELETE 请求
    deleteButton.addEventListener('click', () => {
        deleteItem(item.id, listItem); // 调用删除函数
    });

    // 将内容添加到 listItem 中
    listItem.appendChild(itemName);
    listItem.appendChild(itemMenge);
    listItem.appendChild(itemLaden);
    listItem.appendChild(itemGekauft);
    listItem.appendChild(deleteButton); // 添加删除按钮

    listContainer.appendChild(listItem); // 将新项目添加到 ul 中
}

// 页面加载时从服务器获取所有现有的购物项目
document.addEventListener('DOMContentLoaded', () => {
    async function getAllItems() {
        try {
            const response = await fetch('http://localhost:8080/api/v1/items');
            if (!response.ok) {
                throw new Error('Network response was not OK');
            }
            const items = await response.json();
            updateItemsList(items);
        } catch (error) {
            console.error('There has been a problem with your fetch operation:', error);
        }
    }

    // 将获取到的所有项目更新到页面上的列表中
    function updateItemsList(items) {
        const listContainer = document.createElement('ul');  // 创建一个新的 ul 容器

        items.forEach(item => {
            const listItem = document.createElement('li');
            listItem.classList.add('item'); // 为每个 li 元素添加 'item' 类

            const itemName = document.createElement('p');
            itemName.innerHTML = `<span>Artikel:</span> ${item.name}`;

            const itemMenge = document.createElement('p');
            itemMenge.innerHTML = `<span>Menge:</span> ${item.menge}`;

            const itemLaden = document.createElement('p');
            itemLaden.innerHTML = `<span>Laden:</span> ${item.laden}`;

            const itemGekauft = document.createElement('p');
            itemGekauft.innerHTML = `<span>Gekauft:</span> ${item.gekauft ? 'Ja' : 'Nein'}`;

            // 创建并添加删除按钮
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Löschen';
            deleteButton.classList.add('delete-btn'); // 使用 delete-btn 类设置样式

            // 点击删除按钮时发送 DELETE 请求
            deleteButton.addEventListener('click', () => {
                deleteItem(item.id, listItem); // 调用删除函数
            });

            listItem.appendChild(itemName);
            listItem.appendChild(itemMenge);
            listItem.appendChild(itemLaden);
            listItem.appendChild(itemGekauft);
            listItem.appendChild(deleteButton); // 添加删除按钮

            listContainer.appendChild(listItem); // 将每个项目添加到 ul 中
        });

        document.body.appendChild(listContainer); // 将 ul 添加到页面中
    }

    // 调用函数来获取并显示所有项
    getAllItems();
});

// 发送 DELETE 请求到后端并删除项目
function deleteItem(itemId, listItem) {
    fetch(`http://localhost:8080/api/v1/items/${itemId}`, {
        method: 'DELETE'
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not OK');
            }
            listItem.remove(); // 成功后从页面中移除项目
        })
        .catch(error => {
            console.error('There was a problem with the delete operation:', error);
        });
}
