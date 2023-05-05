const knex = require('../database/knex');

class NotesController{
    async create(req, res) {
        const {title, description,"score of the movie": score_of_the_movie, tags} = req.body;
        const {user_id} = req.params;

        const {note} = await knex("Movie_Notes").insert({
            title,
            description,
            user_id,
            "score of the movie": score_of_the_movie
        })
        
    //Tags
        const tagsInsert = tags.map(name => {
        return {
        note,
        name,
        user_id
      }

     });
 
     await knex("tags").insert(tagsInsert)

     res.json();
   } 
}


module.exports = NotesController;