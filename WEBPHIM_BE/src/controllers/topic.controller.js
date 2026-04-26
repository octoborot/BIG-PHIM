const { getTopicService, updateTopicService, createTopicService, deleteTopicService } = require('../services/topic.service');

const getTopics = async (req, res) =>{
    try{
        const topics = await getTopicService();
        res.json({ success: true, data: topics});
    } catch(error){
        res.status(error.status || 500).json({ success: false, message: error.message});
    }
};

const createTopic = async (req, res) => {
    try{
        const {name} = req.body;
        const newTopic = await createTopicService(name);
        res.json({ success: true, message: 'Thêm chủ đề thành công', data: newTopic});
    } catch(error){
        res.status(error.status || 500).json({ success: false, message: error.message});
    }
};

const updateTopic = async (req, res) => {
    try{
        const topicId = parseInt(req.params.id);
        const {name} = req.body;
        const updatedTopic = await updateTopicService(topicId, name);
        res.json({ success: true, message: 'Sửa chủ đề thành công', data: updatedTopic});
    } catch(error){
        res.status(error.status || 500).json({ success: false, message: error.message});
    }
};

const deleteTopic = async (req, res) => {
    try{
        const topicId = parseInt(req.params.id);
        await deleteTopicService(topicId);
        res.json({ success: true, message: 'Xóa thành công!'});
    } catch(error){
        res.status(error.status || 500).json({ success: false, message: error.message});
    }
};

module.exports = {
    getTopics,
    createTopic,
    updateTopic,
    deleteTopic
};