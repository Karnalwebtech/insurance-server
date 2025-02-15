import mongoose from "mongoose";
class ApiFeatures {
    private query: any;
    private queryStr: any;
    constructor(query: any, queryStr: any) {
        this.query = query;
        this.queryStr = queryStr;
    }
    search() {
        const keyword = this.queryStr.keyword ?
            {
                $or: [{
                    email: { $regex: this.queryStr.keyword, $options: "i" }
                }]
            } : {}
        this.query = this.queryStr.find({ ...keyword })
        return this;
    }
    filter() {
        const queryCopy = { ...this.queryStr };
        const removeField = ["keyword", "page", "limit", "rowsPerPage"];
        removeField.forEach((key) => delete queryCopy[key]);
        if (queryCopy.categorie) {
            let categories = queryCopy["categorie"];

            // Ensure it's an array (handle comma-separated string)
            if (typeof categories === "string") {
                categories = categories.split(",");
            }

            // Convert each category to ObjectId
            categories = categories.map((category: any) => {
                if (mongoose.Types.ObjectId.isValid(category)) {
                    return new mongoose.Types.ObjectId(category);
                } else {
                    throw new Error(`Invalid ObjectId format: ${category}`);
                }
            });

            // Use $in to match any category from the list of ObjectIds
            this.query = this.query.find({ categorie: { $in: categories } });
            delete queryCopy["categorie"];
        }

        let queryStr = JSON.stringify(queryCopy);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);
        this.query = this.query.find(JSON.parse(queryStr));
        return this;
    }
    pagination(resultPerPage: number) {
        const currentPage = Number(this.queryStr.page) || 1;
        const skip = resultPerPage * (currentPage - 1);
        this.query = this.query.limit(resultPerPage).skip(skip).sort({ _id: -1 });
        return this;
    }
    // New method to execute the query
    async exec() {
        return await this.query;
    }

    // Public getter for the query
    public getQuery() {
        return this.query;
    }
}
export default ApiFeatures;