const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const Datastore = require('nedb');
const session = require('express-session'); // Add this line
const app = express();
const port = process.env.PORT || 3000;

// Initialize NeDB for recent activity, members, and users
const recentActivityDb = new Datastore({ filename: 'recentActivity.db', autoload: true });
const membersDb = new Datastore({ filename: 'members.db', autoload: true });
const usersDb = new Datastore({ filename: 'users.db', autoload: true });

// Middleware to parse URL-encoded form data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Session middleware
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true
}));

// Serve static files (e.g., HTML files) from the "public" directory
app.use(express.static(path.join(__dirname, '')));

// Login form endpoint (renders the login HTML)
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'login.html'));
});

// Home page endpoint (renders the home HTML)
app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'home.html'));
});

// Login endpoint (handles login form submission)
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    
    usersDb.findOne({ email, password }, (err, user) => {
        if (err) return res.status(500).send('Internal Server Error');
        if (!user) return res.status(401).send('Invalid email or password');
        req.session.user = user;
        res.redirect('/');
    });
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});

app.get('/currentUser', (req, res) => {
    if (req.session.user) {
        res.json(req.session.user);
    } else {
        res.status(401).send('Not logged in');
    }
});

// Endpoint to list all users
app.get('/users', (req, res) => {
    usersDb.find({}, (err, users) => {
        if (err) return res.status(500).send('Internal Server Error');
        res.json(users);
    });
});

// Endpoint to get recent activity
app.get('/recentActivity', (req, res) => {
    recentActivityDb.find({}, (err, activities) => {
        if (err) return res.status(500).send('Internal Server Error');
        res.json(activities);
    });
});

// Endpoint to get members
app.get('/members', (req, res) => {
    membersDb.find({}, (err, members) => {
        if (err) return res.status(500).send('Internal Server Error');
        res.json(members);
    });
});

// Endpoint to get a single member
app.get('/members/:id', (req, res) => {
    membersDb.findOne({ _id: req.params.id }, (err, member) => {
        if (err) return res.status(500).send('Internal Server Error');
        if (!member) return res.status(404).send('Member not found');
        res.json(member);
    });
});

// Endpoint to add a new member
app.post('/addMember', (req, res) => {
    membersDb.insert(req.body, (err, newDoc) => {
        if (err) return res.status(500).json({ success: false, message: 'Internal Server Error' });
        res.json({ success: true, message: 'Member added successfully', member: newDoc });
    });
});

// Endpoint to update a member
app.put('/updateMember/:id', (req, res) => {
    membersDb.update({ _id: req.params.id }, { $set: req.body }, {}, (err, numReplaced) => {
        if (err) return res.status(500).json({ success: false, message: 'Internal Server Error' });
        res.json({ success: true, message: 'Member updated successfully', numReplaced });
    });
});

// Endpoint to delete a member
app.delete('/deleteMember/:id', (req, res) => {
    membersDb.remove({ _id: req.params.id }, {}, (err, numRemoved) => {
        if (err) return res.status(500).json({ success: false, message: 'Internal Server Error' });
        res.json({ success: true, message: 'Member deleted successfully', numRemoved });
    });
});

// Endpoint to compute total gold
app.get('/totalGold', (req, res) => {
    recentActivityDb.find({ category: 'Gold' }, (err, activities) => {
        if (err) return res.status(500).send('Internal Server Error');
        const totalGold = activities.reduce((sum, activity) => sum + activity.amount, 0);
        res.json({ totalGold });
    });
});

// Start the server
app.listen(port, () => console.log(`Server is running on http://localhost:${port}`));