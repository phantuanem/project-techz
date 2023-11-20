const mysql = require('./connect')

class QueryMysql {
    async queryMany(queryString){
        return await new Promise((resolve, reject)=>{
            mysql.query(queryString,  (error, elements)=>{
                if(error){
                    return reject(error);
                }
                return resolve(elements);
            });
        })
    }

    async queryOne(queryString){
        const result = await new Promise((resolve, reject)=>{
            mysql.query(queryString,  (error, elements)=>{
                if(error){
                    return reject(error);
                }
                return resolve(elements);
            });
        })

        if(result.length == 1){
            return result[0]
        }
        return false
    }

    async insert(queryString){
        return await new Promise((resolve, reject)=>{
            mysql.query(queryString,  (error, elements)=>{
                if(error){
                    return reject(error);
                }
                return resolve(elements);
            });
        })
    }

    async update(queryString){
        return await new Promise((resolve, reject)=>{
            mysql.query(queryString,  (error, elements)=>{
                if(error){
                    return reject(error);
                }
                return resolve(elements);
            });
        })
    }

    async delete(queryString){
        return await new Promise((resolve, reject)=>{
            mysql.query(queryString,  (error, elements)=>{
                if(error){
                    return reject(error);
                }
                return resolve(elements);
            });
        })
    }
}

module.exports = new QueryMysql