const { getGenresService, createGenreService, updateGenreService, deleteGenreService } = require('../services/genre.service');

const getGenres = async (req, res) => {
    try{
        const genres = await getGenresService();
        res.json({ success: true, data: genres});
    } catch(error){
        res.status(error.status || 500).json({ success: false, message: error.message});
    }
};

const createGenre = async (req, res) => {
    try{
        const {name} = req.body;
        const newGenre = await createGenreService(name);
        res.json({ success: true, message: 'Thêm thể loại thành công', data: newGenre});
    } catch(error){
        res.status(error.status || 500).json({ success: false, message: error.message});
    }
};

const updateGenre = async (req, res) => {
    try{
        const genreId = parseInt(req.params.id);
        const {name} = req.body;
        const updatedGenre = await updateGenreService(genreId, name);
        res.json({ success: true, message: 'Sửa thể loại thành công', data: updatedGenre});
    } catch(error){
        res.status(error.status || 500).json({ success: false, message: error.message});
    }
};

const deleteGenre = async (req, res) => {
    try{
        const genreId = parseInt(req.params.id);
        await deleteGenreService(genreId);
        res.json({ success: true, message: 'Xóa thành công!'});
    } catch(error){
        res.status(error.status || 500).json({ success: false, message: error.message});
    }
};

module.exports = {
    getGenres,
    createGenre,
    updateGenre,
    deleteGenre
};