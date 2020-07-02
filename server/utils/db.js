
/* NGOC PART */
const mongoose = require('mongoose');
const { resolve, reject } = require('bluebird');

module.exports = {
    load: (modelname, schema) => {
        return new Promise((resolve, reject)=>{
            var model = mongoose.model(modelname, schema);
            return model.find({}).exec((err,result)=>{
                if(err){
                    reject(err);
                }
                else{
                    resolve(result);
                }
            })
            
        })
    },

    create: (modelname, schema, entity) => {
        return new Promise((resolve, reject)=>{
            var model = mongoose.model(modelname, schema);
            var new_entity = new model(entity);

            return new_entity.save((err)=>{
                if(err){
                    reject(err);
                }
                else{
                    resolve(true);
                }
            })

        })
    }
}