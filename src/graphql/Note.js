const graphql = require('graphql')
const Note = require('../models/Note')
const Category = require('../models/Category')

const {
    GraphQLObjectType,
    GraphQLNonNull,
    GraphQLString,
    GraphQLSchema,
    GraphQLList,
    GraphQLID
} = graphql

const NoteType = new GraphQLObjectType({
    name: 'Note',
    fields: () => ({
        id:         { type: GraphQLID },
        name:       { type: new GraphQLNonNull(GraphQLString) },
        color:      { type: new GraphQLNonNull(GraphQLString) },
        categoryId: { type: GraphQLID },
        category:   { 
            type: CategoryType,
            resolve({ categoryId }, args) {
                return Category.findById(categoryId)
            }
        },
    })
})

const CategoryType = new GraphQLObjectType({
    name: 'Category',
    fields: () => ({
        id:         { type: GraphQLID },
        name:      { type: new GraphQLNonNull(GraphQLString) },
        note:       {
            type: new GraphQLList(NoteType),
            resolve({id}, args) {
                return Note.find({ categoryId: id })
            }
        }
    })
})

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addCategory: {
            type: CategoryType,
            args: {
                name:      { type: new GraphQLNonNull(GraphQLString) },
            },
            resolve(parent, { name }) {
                const category = new Category({
                    name
                })
                return category.save()
            }
        },
        addNote: {
            type: NoteType,
            args: {
                name:       { type: new GraphQLNonNull(GraphQLString) },
                color:      { type: new GraphQLNonNull(GraphQLString) },
                categoryId: { type: GraphQLID },
            },
            resolve(parent, { name, color, categoryId }) {
                const note = new Note({
                    name,
                    color,
                    categoryId
                })
                return note.save()
            }
        },
        delCategory: {
            type: CategoryType,
            args: { id: { type: GraphQLID } },
            resolve(parent, { id }) {
                return Category.findOneAndRemove({
                    _id: id
                },
                    err => { if (err) console.error(err) }
                )
            }
        },
        delNote: {
            type: NoteType,
            args: { id: { type: GraphQLID } },
            resolve(parent, { id }) {
                return Note.findOneAndRemove({
                    _id: id
                },
                    err => { if (err) console.error(err) }
                )
            }
        },
        delAllNote: {
            type: NoteType,
            args: { categoryId: { type: GraphQLID } },
            resolve(parent, { categoryId }) {
                return Note.deleteMany({
                    categoryId
                },
                    err => { if (err) console.error(err) }
                )
            }
        },
        upCategory: {
            type: CategoryType,
            args: {
                id:     { type: GraphQLID },
                name:   { type: new GraphQLNonNull(GraphQLString) },
            },
            resolve(parent, { id, name }) {
                return Category.updateOne(
                    {
                        _id: id
                    }, {
                    $set: {
                        name
                    }
                },
                    err => { if (err) console.error(err) }
                )
            }
        },
        upNote: {
            type: NoteType,
            args: {
                id:         { type: GraphQLID },
                name:       { type: new GraphQLNonNull(GraphQLString) },
                color:      { type: new GraphQLNonNull(GraphQLString) },
                categoryId: { type: GraphQLID },
            },
            resolve(parent, { id, name, color, categoryId }) {
                return Note.updateOne(
                    {
                        _id: id
                    }, {
                    $set: {
                        name,
                        color,
                        categoryId
                    }
                },
                    err => { if (err) console.error(err) }
                )
            }
        }
    }
})

const Query = new GraphQLObjectType({
    name: `Query`,
    fields: {
        note: {
            type: NoteType,
            args: { id: { type: GraphQLID } },
            resolve(parent, { id }) {
                return Note.findById(id)
            }
        },
        category: {
            type: CategoryType,
            args: { id: { type: GraphQLID } },
            resolve(parent, { id }) {
                return Category.findById(id)
            }
        },
        notes: {
            type: new GraphQLList(NoteType),
            args: {
                name: { type: GraphQLString },
            },
            resolve(parent, { name }) {
                return Note.find({ name: { $regex: name, $options: "i" } })
            }
        },
        categoryes: {
            type: new GraphQLList(CategoryType),
            args: {
                name: { type: GraphQLString },
            },
            resolve(parent, { name }) {
                return Category.find({ name: { $regex: name, $options: "i" } })
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: Query,
    mutation: Mutation,
})