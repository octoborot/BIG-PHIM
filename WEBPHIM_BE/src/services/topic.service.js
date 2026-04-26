const prisma = require('../config/prisma');
const appError = require('../utils/appError');

const getTopicService = async () => {
    return prisma.topic.findMany({
        select: {
            id: true,
            name: true
        },
        orderBy: { name: 'asc'}
    });
};

const createTopicService = async (name) => {
    try{
        return await prisma.topic.create({
            data: {name}
        });
    } catch (error) {
        if(error.code === 'P2002'){
            throw new appError('Tên chủ đề đã tồn tại!', 400);
        }
        throw error;
    }
};

const updateTopicService = async (topicId, name) => {
    try{
        return await prisma.topic.update({
            where: { id: topicId },
            data: { name }
        });
    } catch (error) {
        if(error.code === 'P2025'){
            throw new appError('Không tìm thấy chủ đề này!', 404);
        }
        if(error.code === 'P2002'){
            throw new appError('Tên chủ đề đã tồn tại!', 400);
        }
        throw error;
    }
};

const deleteTopicService = async (topicId) => {
    try{
        return await prisma.topic.delete({
            where: { id: topicId }
        });
    } catch (error) {
        if(error.code === 'P2025'){
            throw new appError('Không tìm thấy chủ đề này!', 404);
        }
        throw error;
    }
};

module.exports = {
    getTopicService,
    createTopicService,
    updateTopicService,
    deleteTopicService
};