const TypeTreeService = require("../services/typetree.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

// Create and Save a new TypeTree
exports.create = async (req, res, next) => {
    if (!req.body?.name) {
        return next(new ApiError(400, "Name can not be empty"));
    }

    try {
        const typeTreeService = new TypeTreeService(MongoDB.client);
        const document = await typeTreeService.create(req.body);
        return res.send(document);        
    } catch (error) {
        console.log(error);
        return next(
            new ApiError(500, "An error occurred while creating the type tree")
        );
    }
};

// Retrieve  all typeTrees of a user from the database
exports.findAll = async (req, res, next) => {
    let documents = [];

    try {
        const typeTreeService = new TypeTreeService(MongoDB.client);
        const {name} = req.query;
        if (name) {
            documents = await typeTreeService.findByName(name);
        } else {
            documents = await typeTreeService.find({});
        }
    } catch (error) {
        return next(
            new ApiError(500, "An error occurred while creating the tree")
        );
    }

    return res.send(documents);
};

// Find a single typeTree with an id
exports.findOne = async (req, res, next) => {
    let documents = [];
    try {
        const typeTreeService = new TypeTreeService(MongoDB.client);
        const document = await typeTreeService.findById(req.params.id);
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

// Update a typeTree by the id in the request
exports.update = async (req, res, next) => {
    if (Object.keys(req.body).length === 0) {
        return next(new ApiError(400, "Data to update can not be empty"));
    }

    try {
        const typeTreeService = new TypeTreeService(MongoDB.client);
        const document = await typeTreeService.update(req.params.id, req.body);
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

// Delete a typeTree with the specified id in the request
exports.delete = async (req, res, next) => {
    try {
        const typeTreeService = new TypeTreeService(MongoDB.client);
        const document = await typeTreeService.delete(req.params.id);
        if (!document) {
            return next(new ApiError(404, "TypeTree not found"));
        } 
        return res.send({ message: "TypeTree was deleted successfully" });
    } catch (error) {
        return next(
            new ApiError(500,`Could not delete typeTree with id=${req.params.id}`)
        );
    }
};

// Delete all typeTrees of a user from the database
exports.deleteAll = async (_req, res, next) => {
    try {
        const typeTreeService = new TypeTreeService(MongoDB.client);
        const deletedCount = await typeTreeService.deleteAll();
        return res.send({
            message: `${deletedCount} typeTrees were deleted successfully`,
        });
    } catch (error) {
        console.log(error);
        return next(
            new ApiError(500, "An error occurred while removing all trees")
        );
    }
};
