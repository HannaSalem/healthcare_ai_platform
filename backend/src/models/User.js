const db = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
    static async findByEmail(email) {
        const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        return result.rows[0];
    }

    static async findById(id) {
        const result = await db.query('SELECT id, email, first_name, last_name, role, created_at FROM users WHERE id = $1', [id]);
        return result.rows[0];
    }

    static async create(userData) {
        const { email, password, first_name, last_name, role } = userData;
        
        // Check if user exists
        const existingUser = await this.findByEmail(email);
        if (existingUser) {
            throw new Error('User already exists');
        }

        // Hash password
        const password_hash = await bcrypt.hash(password, 10);
        
        const result = await db.query(
            'INSERT INTO users (email, password_hash, first_name, last_name, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, email, first_name, last_name, role, created_at',
            [email, password_hash, first_name, last_name, role]
        );
        return result.rows[0];
    }

    static async validatePassword(user, password) {
        return await bcrypt.compare(password, user.password_hash);
    }
}

module.exports = User;