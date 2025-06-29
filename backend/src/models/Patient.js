const db = require('../config/database');

class Patient {
    static async findAll() {
        const result = await db.query('SELECT * FROM patients ORDER BY created_at DESC');
        return result.rows;
    }

    static async findById(id) {
        const result = await db.query('SELECT * FROM patients WHERE id = $1', [id]);
        return result.rows[0];
    }

    static async create(patientData) {
        const { first_name, last_name, date_of_birth, gender, phone, email, address } = patientData;
        const result = await db.query(
            'INSERT INTO patients (first_name, last_name, date_of_birth, gender, phone, email, address) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [first_name, last_name, date_of_birth, gender, phone, email, address]
        );
        return result.rows[0];
    }
}

module.exports = Patient;
