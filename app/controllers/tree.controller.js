const TreeService = require("../services/tree.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

// Create and Save a new Tree
exports.create = async (req, res, next) => {
    if (!req.body?.name) {
        return next(new ApiError(400, "Name can not be empty"));
    }

    try {
        const treeService = new TreeService(MongoDB.client);
        const document = await treeService.create(req.body);
        return res.send(document);        
    } catch (error) {
        return next(
            new ApiError(500, "An error occurred while creating the tree")
        );
    }
};

// Retrieve  all trees of a user from the database
exports.findAll = async (req, res, next) => {
    let documents = [];

    try {
        const treeService = new TreeService(MongoDB.client);
        const {name} = req.query;
        if (name) {
            documents = await treeService.findByName(name);
        } else {
            documents = await treeService.find({});
        }
    } catch (error) {
        return next(
            new ApiError(500, "An error occurred while creating the tree")
        );
    }

    return res.send(documents);
};

// Find a single tree with an id
exports.findOne = async (req, res, next) => {
    let documents = [];
    try {
        const treeService = new TreeService(MongoDB.client);
        const document = await treeService.findById(req.params.id);
        if (!document) {
            return next(new ApiError(404, "Tree not found"));
        } 
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(500,`Error retrieving tree with id=${req.params.id}`)
        );
    }
};

// Update a tree by the id in the request
exports.update = async (req, res, next) => {
    if (Object.keys(req.body).length === 0) {
        return next(new ApiError(400, "Data to update can not be empty"));
    }

    try {
        const treeService = new TreeService(MongoDB.client);
        const document = await treeService.update(req.params.id, req.body);
        if (!document) {
            return next(new ApiError(404, "Tree not found"));
        } 
        return res.send({message: "Tree was updated successfully" });
    } catch (error) {
        return next(
            new ApiError(500,`Error updating tree with id=${req.params.id}`)
        );
    }
};

// Delete a tree with the specified id in the request
exports.delete = async (req, res, next) => {
    try {
        const treeService = new TreeService(MongoDB.client);
        const document = await treeService.delete(req.params.id);
        if (!document) {
            return next(new ApiError(404, "Tree not found"));
        } 
        return res.send({ message: "Tree was deleted successfully" });
    } catch (error) {
        return next(
            new ApiError(500,`Could not delete tree with id=${req.params.id}`)
        );
    }
};

// Delete all trees of a user from the dâtbase
exports.deleteAll = async (_req, res, next) => {
    try {
        const treeService = new TreeService(MongoDB.client);
        const deletedCount = await treeService.deleteAll();
        return res.send({
            message: `${deletedCount} trees were deleted successfully`,
        });
    } catch (error) {
        console.log(error);
        return next(
            new ApiError(500, "An error occurred while removing all trees")
        );
    }
};

// Find all favorite trees of a user
exports.findAllFavorite = async (req, res, next) => {
    try {
        const treeService = new TreeService(MongoDB.client);
        const documents = await treeService.findFavorite();
        return res.send(documents);
    } catch (error) {
        return next(
            new ApiError(500,"An error occurred while retieving favorite trees")
        );
    }
};
