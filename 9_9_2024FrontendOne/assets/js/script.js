
document.getElementById('shoppingForm').addEventListener('submit', (event) => {
    alert()
    event.preventDefault();  // 阻止表单的默认提交行为

    // 获取表单数据
    const name = document.querySelector('#name').value;
    const menge = document.querySelector('#menge').value;
    const laden = document.querySelector('#laden').value;
    const gekauft = document.querySelector('#gekauft').checked;

    // 在控制台输出数据

    const itemJson = {
        name: name,
        menge: menge,
        laden: laden,
        gekauft: gekauft
    };
    console.log(itemJson);

    // 将数据发送到服务器
    console.log('Sending request to server...');
    fetch('http://localhost:8080/api/v1/items/submit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: name,
            menge: menge,
            laden: laden,
            gekauft: gekauft
        })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('network not OK');
            }
            return response.json();
        })
        .then(data => {
            console.log('service respons:', data);
        })
        .catch(error => {
            console.error('issue happened:', error);
        });
});