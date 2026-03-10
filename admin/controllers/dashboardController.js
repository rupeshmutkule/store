const db = require('../config/db');

const showDashboard = async (req, res) => {
    try {
        // ✅ Total users from tbl_users
        const [[{ totalUsers }]] = await db.query(
            'SELECT COUNT(*) AS totalUsers FROM tbl_users'
        );

        // ✅ Active users (user_status = 0)
        const [[{ activeUsers }]] = await db.query(
            'SELECT COUNT(*) AS activeUsers FROM tbl_users WHERE user_status = 0'
        );

        // ✅ Inactive users (user_status = 1)
        const [[{ inactiveUsers }]] = await db.query(
            'SELECT COUNT(*) AS inactiveUsers FROM tbl_users WHERE user_status = 1'
        );

        // ✅ Latest 5 registered users
        const [recentUsers] = await db.query(
            'SELECT ID, display_name, user_email, user_registered, user_status FROM tbl_users ORDER BY user_registered DESC LIMIT 5'
        );

        res.render('dashboard/index', {
            title: 'Dashboard',
            admin: req.session.admin,
            stats: {
                totalUsers,
                activeUsers,
                inactiveUsers
            },
            recentUsers
        });

    } catch (error) {
        console.error('Dashboard Error:', error.message);
        res.status(500).send('Server Error');
    }
};

module.exports = { showDashboard };