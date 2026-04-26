const prisma = require('../config/prisma');
const { appError } = require('../utils/appError');

const getGenresService = async () => {
    return prisma.genre.findMany({
        select: {
            id: true,
            name: true
        },
        orderBy: { name: 'asc'}
    });
};

const createGenreService = async (name) => {
    try{
        return await prisma.genre.create({
            data: {name}
        });
    } catch (error) {
        if(error.code === 'P2002'){
            throw new appError('Tên thể loại đã tồn tại!', 400);
        }
        throw error;
    }
};

const updateGenreService = async (genreId, name) => {
    try{
        return await prisma.genre.update({
            where: {id: genreId},
            data: {
                name: name,
                updated_at: new Date()
            }
        });
    } catch (error){
        if(error.code === 'P2025'){
            throw new appError('Không tìm thấy thể loại này!', 404);
        }
        if (error.code === 'P2002') {
            throw new appError('Thể loại này đã tồn tại', 400);
        }
        throw error;
    }
};

const deleteGenreService = async (genreId) => {
    try{
        await prisma.genre.delete({
            where: {id: genreId}
        });
    } catch (error) {
        if (error.code === 'P2025') {
            throw new appError('Không tìm thấy thể loại này!', 404);
        }
        throw error;
    }
};

module.exports = {
    getGenresService,
    createGenreService,
    updateGenreService,
    deleteGenreService
};