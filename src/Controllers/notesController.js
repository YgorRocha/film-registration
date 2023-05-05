const knex = require('../database/knex');

class NotesController{
    async create(req, res) {
        const {title, description,"score of the movie": score_of_the_movie, tags} = req.body;
        const {user_id} = req.params;

        const {note_id} = await knex("Movie_Notes").insert({
            title,
            description,
            user_id,
            "score of the movie": score_of_the_movie
        })
        
    //Tags
        const tagsInsert = tags.map(name => {
        return {
        note_id,
        name,
        user_id
      }

     });
 
     await knex("tags").insert(tagsInsert)

     res.json();
   } 

   async show(req, res){
    const {id} = req.params;

    const note = await knex("Movie_Notes").where({id}).first();
    const tags = await knex("tags").where({note: id}).orderBy("name");

    return res.json({ 
        ...note,
        tags});

   }

   async delete(request, response) {
    const {id} = request.params;

    await knex("Movie_Notes").where({ id }).delete();

    return response.json()
 }

 async index (request, response) {
    const { user_id, title, tags } = request.query;
     
    let notes;

    if(tags){
     const filterTags = tags.split(',').map(tag => tag.trim());

     notes = await knex("tags")
     .select([
        "note",
        "notes.title",
        "notes.user_id"
     ])
     .where("notes.user_id", user_id)
     .whereLike("notes.title", `%${title}%`)
     .whereIn("name", filterTags)
     .innerJoin("notes", "notes.id", "tags.note_id")
     .orderBy("notes.title")

    }else{
    notes = await knex("Movie_Notes").where({user_id})
     .whereLike("title", `%${title}%`)
     .orderBy("title")
    }

    const userTags = await knex("tags").where({user_id});
    const notesWithTags = notes.map(note => {
     const noteTags = userTags.filter(tag => tag.note_id === note.id);

     return {
      ...note,
      tags: noteTags
     }
    })
    return response.json(notesWithTags);
  }
}


module.exports = NotesController;