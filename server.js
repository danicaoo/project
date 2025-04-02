const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        sameSite: 'lax',
        secure: false 
    }
}));

function requireAuth(req, res, next) {
    if (!req.session.user) {
        return res.redirect('/');
    }
    next();
}

const users = [];
const CACHE_DIR = path.join(__dirname, 'cache');
const CACHE_FILE = path.join(CACHE_DIR, 'data.json');
const CACHE_DURATION = 60 * 1000; 

if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR);
}

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    if (users.some(u => u.username === username)) {
        return res.status(400).json({ error: 'Username already exists' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    users.push({ username, password: hashedPassword });
    
    res.redirect('/');
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username);
    
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    req.session.user = username;
    res.redirect('/profile');
});

app.post('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

app.get('/profile', requireAuth, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'profile.html'));
});

app.get('/data', (req, res) => {
    if (fs.existsSync(CACHE_FILE)) {
        const stats = fs.statSync(CACHE_FILE);
        const now = new Date().getTime();
        const cacheAge = now - stats.mtime.getTime();
        
        if (cacheAge < CACHE_DURATION) {
            const cachedData = JSON.parse(fs.readFileSync(CACHE_FILE));
            return res.json({ ...cachedData, cached: true });
        }
    }
    
    const newData = {
        timestamp: new Date().toISOString(),
        data: Array.from({ length: 5 }, () => Math.floor(Math.random() * 100))
    };
    
    fs.writeFileSync(CACHE_FILE, JSON.stringify(newData));
    
    res.json({ ...newData, cached: false });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});