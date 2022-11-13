const { ObjectId } = require("mongodb");

class TypeTreeService {
    constructor(client) {
        this.Type = client.db().collection("typestree");
    }
    // Định nghĩa các phương thức truy xuất CSDL sử dụng mongodb API
    extractTypeData(payload) {
        const type = {
            name: payload.name,
            description: payload.description,
        };
        // Remove undefined fields
        Object.keys(type).forEach(
            (key) => type[key] === undefined && delete type[key]
        );
        return type;
    }

    async create (payload) {
        const type = this.extractTypeData(payload);
        const result = await this.Type.findOneAndUpdate(
            type,
            { $set: { } },
            { returnDocument: "after", upsert: true }
        );
        return result.value;
    }
    
    async find(filter) {
        const cursor = await this.Type.find(filter);
        return await cursor.toArray();
    }

    async findByName(name) {
        return await this.find({
            name: { $regex: new RegExp(name), $options: "i"},
        });
    }

    async findById(id) {
        return await this.Type.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }

    async update(id, payload) {
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        };
        const update = this.extractTypeData(payload);
        const result = await this.Type.findOneAndUpdate(
            filter,
            { $set: update },
            { returnDocument: "after" }
        );
        return result.value;
    }
    
    async delete(id) {
        const result = await this.Type.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
        return result.value;
    }

    async deleteAll() {
        const result = await this.Type.deleteMany({});
        return result.deletedCount;
    }
        
        
}

module.exports = TypeTreeService;