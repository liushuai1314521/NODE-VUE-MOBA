const mongoose = require("mongoose")

const schema = new mongoose.Schema({
    name: { type: String },
    avatar: { type: String },
    banner: { type: String },
    title: { type: String },
    categories: [{ type: mongoose.SchemaTypes.ObjectId, ref: "Category" }],
    scores: {
        difficult: { type: Number },
        skills: { type: Number },
        attack: { type: Number },
        survive: { type: Number },
    },
    skills: [{
        icon: { type: String },
        name: { type: String },
        delay: { type: String },
        cost: { type: String },
        description: { type: String },
        tips: { type: String },
    }],
    items1: [{ type: mongoose.SchemaTypes.ObjectId, ref: "Item" }],//顺丰出装
    items2: [{ type: mongoose.SchemaTypes.ObjectId, ref: "Item" }],//逆风出装
    // Inscription: {
        Insc1: { type: String },
        Insc2: { type: String },
        Insc3: { type: String },
    // },
    Insc: [{ type: mongoose.SchemaTypes.ObjectId, ref: "Item" }],
    usageTips: { type: String },
    battleTips: { type: String },
    teamTips: { type: String },
    partners: [{
        hero: { type: mongoose.SchemaTypes.ObjectId, ref: "Hero" },
        description: { type: String },
        headimg: { type: String },
    }],
})


module.exports = mongoose.model("Hero", schema, 'heroes')