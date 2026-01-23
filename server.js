const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

// 中间件
app.use(express.json());
app.use(express.static('.'));

// 读取留言数据
function getMessages() {
    try {
        const data = fs.readFileSync('messages.json', 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

// 保存留言数据
function saveMessages(messages) {
    fs.writeFileSync('messages.json', JSON.stringify(messages, null, 2));
}

// 提交留言API
app.post('/api/message', (req, res) => {
    const { name, phone, message } = req.body;
    
    if (!name || !phone || !message) {
        return res.status(400).json({ error: '请填写所有字段' });
    }
    
    const newMessage = {
        id: Date.now(),
        name,
        phone,
        message,
        timestamp: new Date().toLocaleString('zh-CN'),
        status: '未处理'
    };
    
    const messages = getMessages();
    messages.unshift(newMessage);
    saveMessages(messages);
    
    res.json({ success: true, message: '留言提交成功' });
});

// 获取留言列表API
app.get('/api/messages', (req, res) => {
    const messages = getMessages();
    res.json(messages);
});

// 更新留言状态API
app.put('/api/message/:id', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    
    const messages = getMessages();
    const messageIndex = messages.findIndex(msg => msg.id == id);
    
    if (messageIndex === -1) {
        return res.status(404).json({ error: '留言不存在' });
    }
    
    messages[messageIndex].status = status;
    saveMessages(messages);
    
    res.json({ success: true });
});

// 管理后台页面
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

app.listen(PORT, () => {
    console.log(`服务器运行在 http://localhost:${PORT}`);
    console.log(`管理后台: http://localhost:${PORT}/admin`);
});