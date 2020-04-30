var { Client } = require('pg');

function allDefined(req){
    if(typeof(req.level) === 'undefined'){
        return false;
    }
    if(typeof(req.race) === 'undefined'){
        return false;
    }
    if(typeof(req.token) === 'undefined'){
        return false;
    }
    if(typeof(req.shuffle) === 'undefined'){
        return false;
    }
    if(typeof(req.memory) === 'undefined'){
        return false;
    }
    if(typeof(req.whosnew) === 'undefined'){
        return false;
    }
    if(typeof(req.nameface) === 'undefined'){
        return false;
    }
    if(typeof(req.forcedchoice) === 'undefined'){
        return false;
    }
    if(typeof(req.samedifferent) === 'undefined'){
        return false;
    }
    return true;
}

module.exports = {
    upload: async function(req){
        if(!allDefined(req)){
            return new Promise(function(resolve, reject){
                reject("Missing parameter");
            })
        }
        const pgClient = new Client({
            connectionString: process.env.DATABASE_URL,
            ssl: true,
        });

        pgClient.connect();

        //TODO: Token is used directly as userid throughout this file, needs to change when token is properly implemented
        let day = await pgClient.query("SELECT * FROM day WHERE userid = $1 AND level = $2", [req.token, req.level]);

        let now = new Date().toUTCString();

        let values = [req.token, req.level, req.race, now, req.nameface, req.whosnew, req.memory, req.shuffle, req.forcedchoice, req.samedifferent];

        if(day.rows.length > 0){
            if (day.rows[0]['nameface'] == -1 || day.rows[0]['whosnew'] == -1 || day.rows[0]['memory'] == -1 || day.rows[0]['shuffle'] == -1 || day.rows[0]['forcedchoice'] == -1 || day.rows[0]['samedifferent'] == -1){
                pgClient.query("UPDATE day SET date = $4, nameface = $5, whosnew = $6, memory = $7, shuffle = $8, forcedchoice = $9, samedifferent = $10 WHERE userid = $1 AND level = $2 AND race = $3", values)
                .then(res => {
                    pgClient.end();
                    return new Promise(function(resolve, reject){
                        resolve("Tasks successfully updated");
                    })
                })
                .catch(err => {
                    pgClient.end();
                    return new Promise(function(resolve, reject){
                        reject(err);
                    })
                })
            }
            else{
                reject("Level already completed");
            }
        }
        else{
            pgClient.query("INSERT INTO day (userid, level, race, date, nameface, whosnew, memory, shuffle, forcedchoice, samedifferent) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)", values)
            .then(res => {
                pgClient.end();
                return new Promise(function(resolve, reject){
                    resolve("Tasks successfully uploaded");
                })
            })
            .catch(err => {
                pgClient.end();
                return new Promise(function(resolve, reject){
                    reject(err);
                })
            })
        }
    }
}