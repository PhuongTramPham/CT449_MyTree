const { ObjectId } = require("mongodb");

class TreeService {
    constructor(client) {
        this.Tree = client.db().collection("trees");
    }
    // Định nghĩa các phương thức truy xuất CSDL sử dụng mongodb API
    extractTreeData(payload) {
        const tree = {
            name: payload.name,
            typeId: payload.typeId,
            image: payload.image,
            description: payload.description,
            favorite: payload.favorite,
        };
        // Remove undefined fields
        Object.keys(tree).forEach(
            (key) => tree[key] === undefined && delete tree[key]
        );
        return tree;
    }

    async create (payload) {
        const tree = this.extractTreeData(payload);
        const result = await this.Tree.findOneAndUpdate(
            tree,
            { $set: { favorite: tree.favorite === true } },
            { returnDocument: "after", upsert: true }
        );
        return result.value;
    }
    
    async find(filter) {
        const cursor = await this.Tree.find(filter);
        return await cursor.toArray();
    }

    async findByName(name) {
        return await this.find({
            name: { $regex: new RegExp(name), $options: "i"},
        });
    }

    async findById(id) {
        return await this.Tree.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }

    async update(id, payload) {
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        };
        const update = this.extractTreeData(payload);
        const result = await this.Tree.findOneAndUpdate(
            filter,
            { $set: update },
            { returnDocument: "after" }
        );
        return result.value;
    }
    
    async delete(id) {
        const result = await this.Tree.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
        return result.value;
    }

    async findFavorite() {
        return await this.find({ favorite: true });
    }

    async deleteAll() {
        const result = await this.Tree.deleteMany({});
        return result.deletedCount;
    }
        
        
}

module.exports = TreeService;