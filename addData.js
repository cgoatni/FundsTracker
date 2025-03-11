const Datastore = require('nedb');
const recentActivityDb = new Datastore({ filename: 'recentActivity.db', autoload: true });
const membersDb = new Datastore({ filename: 'members.db', autoload: true });
const usersDb = new Datastore({ filename: 'users.db', autoload: true });

const recentActivity = [
  { name: 'ChokChik', activity: 'Donated', category: 'Gold', amount: 1000000, date: '03/10/2025' },
  { name: 'Radeon', activity: 'Donated', category: 'Gold', amount: 1000000, date: '03/10/2025' },
  { name: 'NaVii', activity: 'Donated', category: 'Gold', amount: 500000, date: '03/10/2025' },
  { name: 'Dior', activity: 'Donated', category: 'Gold', amount: 5000000, date: '03/10/2025' },
  { name: 'IIYII', activity: 'Donated', category: 'Gold', amount: 1000000, date: '03/10/2025' },
  { name: 'Anigreyz', activity: 'Received', category: 'Gold', amount: 2000000, date: '03/10/2025' }
];

const members = [
  { name: 'ChokChik', class: 'Shaman', type: 'Pow', level: '162' },
  { name: 'Anigreyz', class: 'Shaman', type: 'Pow', level: '162' },
  { name: 'Radeon', class: 'Swordsman', type: 'Pow', level: '162' },
  { name: 'Dior', class: 'Swordsman', type: 'Pow', level: '162' },
  { name: 'NaVii', class: 'Swordsman', type: 'Pow', level: '162' },
  { name: 'IIYII', class: 'Archer', type: 'Pow', level: '162' }
];

const users = [
  { email: 'admin@example.com', password: 'password' },
  { email: 'user@example.com', password: 'password123' }
];

recentActivityDb.insert(recentActivity, (err, newDocs) => {
  if (err) {
    console.error('Error adding recent activity:', err);
  } else {
    console.log('Recent activity added:', newDocs);
  }
});

membersDb.insert(members, (err, newDocs) => {
  if (err) {
    console.error('Error adding members:', err);
  } else {
    console.log('Members added:', newDocs);
  }
});

usersDb.insert(users, (err, newDocs) => {
  if (err) {
    console.error('Error adding users:', err);
  } else {
    console.log('Users added:', newDocs);
  }
});