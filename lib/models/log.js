const pool = require('../utils/pool');

module.exports = class Log {
    id;
    dateOfEvent;
    notes;
    rating;
    recipeId;

    constructor(row) {
      this.id = String(row.id);
      this.dateOfEvent = String(row.date_of_event);
      this.notes = row.notes;
      this.rating = row.rating;
      this.recipeId = String(row.recipe_id);
    }

    static async insert({ dateOfEvent, notes, rating, recipeId }) {
      const { rows } = await pool.query(
        `INSERT into logs (date_of_event, notes, rating, recipe_id) VALUES ($1, $2, $3, $4) 
        RETURNING id, TO_CHAR(date_of_event, 'DD-MM-YYYY') as date_of_event, notes, rating, recipe_id
        `,
        [dateOfEvent, notes, rating, recipeId]
      );
    
      return new Log(rows[0]);
    }
    
    static async find() {
      const { rows } = await pool.query(
        'SELECT id, TO_CHAR(date_of_event, \'DD-MM-YYYY\') as date_of_event, notes, rating, recipe_id FROM logs',
      );
    
      return rows.map(row => new Log(row));
    }
    
    static async findById(id) {
      const { rows } = await pool.query(
        'SELECT id, TO_CHAR(date_of_event, \'DD-MM-YYYY\') as date_of_event, notes, rating, recipe_id FROM logs WHERE id=$1',
        [id]
      );
    
      if(!rows[0]) throw new Error(`Log with id ${id} not found`);
      else return new Log(rows[0]);
    }

    static async update(id, { dateOfEvent, notes, rating, recipeId }) {
      const { rows } = await pool.query(
        `UPDATE logs
           SET date_of_event=$1,
               notes=$2,
               rating=$3,
               recipe_id=$4
           WHERE id=$5
           RETURNING id, TO_CHAR(date_of_event, 'DD-MM-YYYY') as date_of_event, notes, rating, recipe_id
          `,
        [dateOfEvent, notes, rating, recipeId, id]
      );
    
      if(!rows[0]) throw new Error(`Log with id ${id} not found`);
      else return new Log(rows[0]);
    }
    
    static async delete(id) {
      const { rows } = await pool.query(
        'DELETE FROM logs WHERE id=$1 RETURNING id, TO_CHAR(date_of_event, \'DD-MM-YYYY\') as date_of_event, notes, rating, recipe_id',
        [id]
      );
    
      if(!rows[0]) throw new Error(`Log with id ${id} not found`);
      else return new Log(rows[0]);
    }
    
    
};
